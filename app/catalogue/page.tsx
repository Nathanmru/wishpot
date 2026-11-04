import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { CATALOG_ROOMS, CATEGORIES, ESSENTIALS, PRICE_STEPS, normalize, type Product } from "@/lib/catalog";
import CatalogGrid from "@/components/CatalogGrid";

export const metadata = {
  title: "Le catalogue déco",
  description: "Des centaines de pièces pour toute la maison, rangées pièce par pièce, à ajouter à votre cagnotte.",
};

type Search = { piece?: string; cat?: string; q?: string; max?: string; tri?: string; pot?: string; n?: string };

const PAGE = 47;

export default async function CataloguePage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const { lang } = await getDict();
  const fr = lang === "fr";
  const { supabase, user } = await getUser();

  const room = CATALOG_ROOMS.find((r) => r.id === sp.piece) ?? null;
  const cat = sp.cat && CATEGORIES[sp.cat] ? sp.cat : null;
  const q = normalize(sp.q || "");
  const max = PRICE_STEPS.includes(Number(sp.max)) ? Number(sp.max) : 0;
  const tri = sp.tri === "prix" || sp.tri === "prix-desc" ? sp.tri : "selection";
  const limit = Math.min(Math.max(Number(sp.n) || PAGE, PAGE), 600);

  // Compteurs (le catalogue reste léger : on lit pièce + famille de tout)
  const { data: facets } = await supabase.from("products").select("room, category").eq("active", true);
  const all = facets ?? [];
  const byRoom = new Map<string, number>();
  const byCat = new Map<string, number>();
  for (const f of all) {
    byRoom.set(f.room, (byRoom.get(f.room) ?? 0) + 1);
    if (!room || f.room === room.id) byCat.set(f.category, (byCat.get(f.category) ?? 0) + 1);
  }

  let query = supabase.from("products").select("id, shop, title, price, image_url, url, room, category", { count: "exact" }).eq("active", true);
  if (room) query = query.eq("room", room.id);
  if (cat) query = query.eq("category", cat);
  for (const w of q.split(" ").filter((x) => x.length > 1).slice(0, 5)) query = query.ilike("search", `%${w}%`);
  if (max) query = query.lte("price", max);
  query = tri === "prix" ? query.order("price", { ascending: true }) : tri === "prix-desc" ? query.order("price", { ascending: false }) : query.order("category").order("id");
  const { data, count } = await query.range(0, limit - 1);
  const products = (data ?? []) as Product[];
  const total = count ?? products.length;

  // Les cagnottes de l'utilisateur (maison uniquement)
  let pots: { id: string; name: string }[] = [];
  if (user) {
    const { data: ps } = await supabase.from("projects").select("id, name, kind").order("created_at", { ascending: false });
    pots = (ps ?? []).filter((p) => p.kind !== "travel").map((p) => ({ id: p.id as string, name: p.name as string }));
  }
  const potId = sp.pot && pots.some((p) => p.id === sp.pot) ? sp.pot : null;
  const pot = pots.find((p) => p.id === potId) ?? null;

  // Ce que la cagnotte contient déjà dans cette pièce
  let owned = new Set<string>();
  let ownedCount = 0;
  if (pot && room) {
    const { data: its } = await supabase.from("items").select("room, product_id").eq("project_id", pot.id).eq("room", room.id);
    ownedCount = its?.length ?? 0;
    const ids = (its ?? []).map((i) => i.product_id).filter(Boolean);
    if (ids.length) {
      const { data: ps } = await supabase.from("products").select("category").in("id", ids);
      owned = new Set((ps ?? []).map((p) => p.category));
    }
  }

  const href = (patch: Partial<Record<keyof Search, string | null>>) => {
    const u = new URLSearchParams();
    const next = { piece: room?.id ?? null, cat, q: sp.q || null, max: max ? String(max) : null, tri: tri !== "selection" ? tri : null, pot: potId, ...patch };
    for (const [k, v] of Object.entries(next)) if (v) u.set(k, v);
    const s = u.toString();
    return `/catalogue${s ? `?${s}` : ""}`;
  };

  const loginHref = `/login?next=${encodeURIComponent(href({}))}`;
  const essentials = room ? ESSENTIALS[room.id] ?? [] : [];
  const catList = room ? [...essentials, ...[...byCat.keys()].filter((c) => !essentials.includes(c))] : Object.keys(CATEGORIES).filter((c) => byCat.has(c));
  const doneCount = essentials.filter((c) => owned.has(c)).length;

  return (
    <div>
      {/* ---------- En-tête ---------- */}
      <header className="grid gap-8 pt-6 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div>
          <p className="caps text-muted">{fr ? `Le catalogue · ${all.length} pièces` : `The catalogue · ${all.length} pieces`}</p>
          <h1 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">
            {room ? (fr ? room.fr : room.en) : fr ? "Toute la maison, pièce par pièce." : "The whole home, room by room."}
          </h1>
        </div>
        <form action="/catalogue" className="flex items-end gap-3 md:justify-self-end md:w-full md:max-w-sm">
          {room && <input type="hidden" name="piece" value={room.id} />}
          {potId && <input type="hidden" name="pot" value={potId} />}
          <input
            name="q"
            defaultValue={sp.q || ""}
            placeholder={fr ? "Chercher : canapé, lin, rotin…" : "Search: sofa, linen, rattan…"}
            className="input-line flex-1 !text-lg"
          />
          <button className="caps border-b border-ink pb-2">{fr ? "Chercher" : "Search"}</button>
        </form>
      </header>

      {/* ---------- Les pièces ---------- */}
      <nav className="-mx-4 mt-10 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
        <RoomTile href={href({ piece: null, cat: null, n: null })} active={!room} label={fr ? "Toute la maison" : "Whole home"} count={all.length} />
        {CATALOG_ROOMS.map((r) => (
          <RoomTile key={r.id} href={href({ piece: r.id, cat: null, n: null })} active={room?.id === r.id} label={fr ? r.fr : r.en} count={byRoom.get(r.id) ?? 0} img={r.img} />
        ))}
      </nav>

      {/* ---------- Cagnotte cible ---------- */}
      {pots.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-line py-4 text-sm">
          <span className="caps text-muted">{fr ? "J'ajoute à" : "Adding to"}</span>
          {pots.map((p) => (
            <Link key={p.id} href={href({ pot: p.id })} className={`transition ${potId === p.id ? "border-b border-ink" : "text-muted hover:text-ink"}`}>
              {p.name}
            </Link>
          ))}
          {potId && (
            <Link href={`/p/${potId}`} className="caps ml-auto text-muted hover:text-ink">
              {fr ? "Ouvrir la cagnotte" : "Open the pot"} →
            </Link>
          )}
        </div>
      )}

      {/* ---------- Les essentiels de la pièce ---------- */}
      {room && (
        <section className="mt-10 grid gap-6 bg-white p-6 sm:p-8 md:grid-cols-[1fr_2fr] md:items-center">
          <div>
            <p className="caps text-muted">{fr ? "Les essentiels" : "The essentials"}</p>
            {pot ? (
              <p className="display mt-2 text-3xl leading-tight">
                {doneCount}/{essentials.length} {fr ? "dans votre" : "in your"} {(fr ? room.fr : room.en).toLowerCase()}
              </p>
            ) : (
              <p className="display mt-2 text-3xl leading-tight">{fr ? `Pour un ${room.fr.toLowerCase()} complet` : `For a complete ${room.en.toLowerCase()}`}</p>
            )}
            <p className="mt-2 text-sm text-muted">
              {pot
                ? ownedCount > 0
                  ? fr
                    ? `${ownedCount} objet${ownedCount > 1 ? "s" : ""} déjà prévus ici. Touchez ce qui manque.`
                    : `${ownedCount} item(s) already planned here. Tap what's missing.`
                  : fr
                    ? "Rien de prévu ici pour l'instant. Commencez par l'essentiel."
                    : "Nothing planned here yet. Start with the basics."
                : fr
                  ? "Touchez une famille pour voir les pièces."
                  : "Tap a family to browse."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {essentials.map((c) => {
              const has = owned.has(c);
              return (
                <Link
                  key={c}
                  href={href({ cat: cat === c ? null : c, n: null })}
                  className={`flex items-center gap-2 border px-3 py-2 text-sm transition ${
                    cat === c ? "border-ink bg-ink text-white" : has ? "border-moss/40 text-moss" : "border-line hover:border-ink"
                  }`}
                >
                  <span aria-hidden className={`flex h-4 w-4 items-center justify-center rounded-full border text-[9px] ${has ? "border-moss bg-moss text-white" : "border-current"}`}>
                    {has ? "✓" : ""}
                  </span>
                  {CATEGORIES[c][lang]}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ---------- Filtres ---------- */}
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="-mx-1 flex max-w-full gap-2 overflow-x-auto px-1 pb-1">
          <Chip href={href({ cat: null, n: null })} active={!cat} label={fr ? "Tout" : "All"} />
          {catList.map((c) => (
            <Chip key={c} href={href({ cat: c, n: null })} active={cat === c} label={`${CATEGORIES[c]?.[lang] ?? c}`} meta={byCat.get(c)} />
          ))}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="caps text-muted">{fr ? "Budget" : "Budget"}</span>
          {[0, ...PRICE_STEPS].map((m) => (
            <Link key={m} href={href({ max: m ? String(m) : null, n: null })} className={max === m ? "border-b border-ink" : "text-muted hover:text-ink"}>
              {m ? `< ${m} €` : fr ? "Tous" : "Any"}
            </Link>
          ))}
          <span className="mx-1 h-4 w-px bg-line" />
          {(
            [
              ["selection", fr ? "Sélection" : "Curated"],
              ["prix", fr ? "Prix ↑" : "Price ↑"],
              ["prix-desc", fr ? "Prix ↓" : "Price ↓"],
            ] as const
          ).map(([k, l]) => (
            <Link key={k} href={href({ tri: k === "selection" ? null : k })} className={tri === k ? "border-b border-ink" : "text-muted hover:text-ink"}>
              {l}
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted">
        {total} {fr ? (total > 1 ? "pièces" : "pièce") : total > 1 ? "pieces" : "piece"}
        {sp.q ? (fr ? ` pour « ${sp.q} »` : ` for “${sp.q}”`) : ""}
      </p>

      {/* ---------- La grille ---------- */}
      <div className="mt-6">
        <CatalogGrid products={products} pots={pots} potId={potId} signedIn={!!user} loginHref={loginHref} room={room?.id ?? null} fr={fr} />
      </div>

      {products.length < total && (
        <div className="mt-14 text-center">
          <Link href={href({ n: String(limit + PAGE + 1) })} scroll={false} className="btn border border-ink !px-10 !py-4 text-[12px] uppercase tracking-label hover:bg-ink hover:text-white">
            {fr ? `Voir plus · ${total - products.length} autres` : `Show more · ${total - products.length} more`}
          </Link>
        </div>
      )}

      <p className="mt-16 max-w-2xl text-xs leading-relaxed text-muted">
        {fr
          ? "Prix relevés en novembre 2026 sur les sites des enseignes, donnés à titre indicatif : ils peuvent changer. Certains liens peuvent être affiliés, sans surcoût pour vous."
          : "Prices collected in November 2026 from retailers' sites, for guidance only. Some links may be affiliate links, at no extra cost to you."}
      </p>
    </div>
  );
}

function RoomTile({ href, active, label, count, img }: { href: string; active: boolean; label: string; count: number; img?: string }) {
  return (
    <Link href={href} scroll={false} className={`group relative block h-36 w-36 shrink-0 overflow-hidden sm:h-44 sm:w-44 ${img ? "bg-night" : "bg-ink"}`}>
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt="" className={`absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 ${active ? "opacity-90" : "opacity-60"}`} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
        <p className="display text-xl leading-tight">{label}</p>
        <p className="text-[11px] text-white/70">{count}</p>
      </div>
      <span className={`pointer-events-none absolute inset-0 border-[3px] transition ${active ? "border-bone" : "border-transparent"}`} />
    </Link>
  );
}

function Chip({ href, active, label, meta }: { href: string; active: boolean; label: string; meta?: number }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={`shrink-0 border px-3 py-1.5 text-sm transition ${active ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}
    >
      {label}
      {meta != null && <span className={`ml-1.5 text-xs ${active ? "text-white/60" : "text-muted"}`}>{meta}</span>}
    </Link>
  );
}
