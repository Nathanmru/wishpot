import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { CATALOG_ROOMS, CATEGORIES, COLORS, ESSENTIALS, PRICE_STEPS, STYLES, searchTerms, type Product } from "@/lib/catalog";
import CatalogGrid from "@/components/CatalogGrid";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/config";

const ROOM_FOR: Record<string, string> = {
  salon: "pour le salon",
  chambre: "pour la chambre",
  "salle-a-manger": "pour la salle à manger",
  cuisine: "pour la cuisine",
  "salle-de-bain": "pour la salle de bain",
  bureau: "pour le bureau",
  entree: "pour l'entrée",
  exterieur: "pour le balcon et le jardin",
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<Search> }): Promise<Metadata> {
  const sp = await searchParams;
  const room = CATALOG_ROOMS.find((r) => r.id === sp.piece);
  const cat = sp.cat && CATEGORIES[sp.cat] ? CATEGORIES[sp.cat].fr : null;
  const style = STYLES.find((x) => x.id === sp.style);
  const color = COLORS.find((x) => x.id === sp.couleur);
  const shop = sp.marque || null;
  const parts = [cat ?? (style || color ? "Déco" : "Déco et mobilier"), style ? style.fr.toLowerCase() : null, color ? `couleur ${color.fr.toLowerCase()}` : null, room ? ROOM_FOR[room.id] : null, shop ? `de ${shop}` : null].filter(Boolean);
  let title = parts.join(" ");
  title = title ? title[0].toUpperCase() + title.slice(1) : "Le catalogue déco";
  if (!sp.piece && !sp.cat && !sp.style && !sp.couleur && !shop) title = "Catalogue déco : meubles chinés, design et pièces uniques";
  const description = `${title} : une sélection de pièces chinées et de design de petites maisons, à comparer, garder pour plus tard ou mettre en cagnotte.`;
  // Une seule page indexable par combinaison simple ; les recherches libres et les tris ne le sont pas
  const keep = new URLSearchParams();
  for (const k of ["piece", "cat", "style", "couleur", "marque"] as const) if (sp[k]) keep.set(k, sp[k]!);
  const noindex = !!(sp.q || sp.tri || sp.n || sp.pot || sp.max || sp.pepites) || keep.toString().split("&").length > 2;
  const qs = keep.toString();
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl()}/catalogue${qs ? `?${qs}` : ""}` },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

type Search = { piece?: string; cat?: string; q?: string; max?: string; tri?: string; pot?: string; n?: string; style?: string; couleur?: string; marque?: string; pepites?: string };

type Facets = { total: number; rooms: Record<string, number>; cats: Record<string, number>; styles: Record<string, number>; colors: Record<string, number>; shops: Record<string, number>; niche: number };

const PAGE = 47;

export default async function CataloguePage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const { lang } = await getDict();
  const fr = lang === "fr";
  const { supabase, user } = await getUser();

  const room = CATALOG_ROOMS.find((r) => r.id === sp.piece) ?? null;
  const cat = sp.cat && CATEGORIES[sp.cat] ? sp.cat : null;
  const terms = searchTerms(sp.q || "");
  const style = STYLES.some((x) => x.id === sp.style) ? sp.style! : null;
  const color = COLORS.some((x) => x.id === sp.couleur) ? sp.couleur! : null;
  const pepites = sp.pepites === "1";
  const max = PRICE_STEPS.includes(Number(sp.max)) ? Number(sp.max) : 0;
  const tri = sp.tri === "prix" || sp.tri === "prix-desc" ? sp.tri : "selection";
  const limit = Math.min(Math.max(Number(sp.n) || PAGE, PAGE), 600);

  // Compteurs calculés côté base (le catalogue dépasse les 1 000 lignes d'une requête)
  const { data: fx } = await supabase.rpc("catalog_facets", { p_room: room?.id ?? null });
  const facets = (fx ?? { total: 0, rooms: {}, cats: {}, styles: {}, colors: {}, shops: {}, niche: 0 }) as Facets;
  const byRoom = new Map(Object.entries(facets.rooms));
  const byCat = new Map(Object.entries(facets.cats));
  const shops = Object.entries(facets.shops).sort((a, b) => b[1] - a[1]);
  const shop = sp.marque && facets.shops[sp.marque] != null ? sp.marque : null;

  let query = supabase.from("products").select("id, shop, title, price, image_url, url, room, category, style, color, niche", { count: "exact" }).eq("active", true);
  if (room) query = query.eq("room", room.id);
  if (cat) query = query.eq("category", cat);
  if (style) query = query.eq("style", style);
  if (color) query = query.eq("color", color);
  if (shop) query = query.eq("shop", shop);
  if (pepites) query = query.eq("niche", true);
  // Chaque mot cherché accepte ses synonymes (canapé = sofa, rotin = rattan…)
  for (const g of terms) query = query.or(g.map((w) => `search.ilike."*${w.replace(/"/g, "")}*"`).join(","));
  if (max) query = query.lte("price", max);
  query = tri === "prix" ? query.order("price", { ascending: true }) : tri === "prix-desc" ? query.order("price", { ascending: false }) : query.order("id", { ascending: false });
  const { data, count } = await query.range(0, tri === "selection" ? 799 : limit - 1);
  // « Sélection » : on alterne les familles et les enseignes pour une vitrine variée
  const products = (tri === "selection" ? mix((data ?? []) as Product[]) : ((data ?? []) as Product[])).slice(0, limit);
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
    const next = {
      piece: room?.id ?? null,
      cat,
      q: sp.q || null,
      style,
      couleur: color,
      marque: shop,
      pepites: pepites ? "1" : null,
      max: max ? String(max) : null,
      tri: tri !== "selection" ? tri : null,
      pot: potId,
      ...patch,
    };
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
          <p className="caps text-muted">{fr ? `Le catalogue · ${facets.total.toLocaleString("fr-FR")} pièces · ${Object.keys(facets.shops).length} maisons` : `The catalogue · ${facets.total} pieces`}</p>
          <h1 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">
            {room ? (fr ? room.fr : room.en) : fr ? "Toute la maison, pièce par pièce." : "The whole home, room by room."}
          </h1>
        </div>
        <form action="/catalogue" className="flex items-end gap-3 md:justify-self-end md:w-full md:max-w-sm">
          {room && <input type="hidden" name="piece" value={room.id} />}
          {potId && <input type="hidden" name="pot" value={potId} />}
          {style && <input type="hidden" name="style" value={style} />}
          {color && <input type="hidden" name="couleur" value={color} />}
          <input
            name="q"
            defaultValue={sp.q || ""}
            placeholder={fr ? "Canapé cuir, lampe laiton, tapis berbère…" : "Leather sofa, brass lamp, rug…"}
            className="input-line flex-1 !text-lg"
          />
          <button className="caps border-b border-ink pb-2">{fr ? "Chercher" : "Search"}</button>
        </form>
      </header>

      {/* ---------- Les pièces ---------- */}
      <nav className="-mx-4 mt-10 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
        <RoomTile href={href({ piece: null, cat: null, n: null })} active={!room} label={fr ? "Toute la maison" : "Whole home"} count={facets.total} />
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

      {/* ---------- Affiner : style, couleur, marque ---------- */}
      <section className="mt-10 border-y border-line py-6">
        <div className="flex items-baseline justify-between gap-4">
          <p className="caps text-muted">{fr ? "Par style" : "By style"}</p>
          <Link href={href({ pepites: pepites ? null : "1", n: null })} scroll={false} className={`flex items-center gap-2 text-sm transition ${pepites ? "text-ink" : "text-muted hover:text-ink"}`}>
            <span className={`relative inline-block h-4 w-7 rounded-full transition ${pepites ? "bg-ink" : "bg-line"}`}>
              <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${pepites ? "left-3.5" : "left-0.5"}`} />
            </span>
            {fr ? `Pépites seulement · ${facets.niche}` : `Hidden gems only · ${facets.niche}`}
          </Link>
        </div>
        <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STYLES.filter((x) => facets.styles[x.id]).map((x) => {
            const on = style === x.id;
            return (
              <Link key={x.id} href={href({ style: on ? null : x.id, n: null })} scroll={false} className={`group relative h-24 w-32 shrink-0 overflow-hidden bg-night sm:h-28 sm:w-40 ${on ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={x.img.replace("w=900", "w=400")} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 ${on ? "opacity-90" : "opacity-70"}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-2.5 text-left text-white">
                  <p className="text-sm font-medium leading-tight">{fr ? x.fr : x.en}</p>
                  <p className="text-[10px] text-white/70">{facets.styles[x.id]}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="caps mr-2 text-muted">{fr ? "Couleur" : "Colour"}</span>
            {COLORS.filter((x) => facets.colors[x.id]).map((x) => {
              const on = color === x.id;
              return (
                <Link
                  key={x.id}
                  href={href({ couleur: on ? null : x.id, n: null })}
                  scroll={false}
                  title={`${fr ? x.fr : x.en} · ${facets.colors[x.id]}`}
                  aria-label={fr ? x.fr : x.en}
                  className={`h-8 w-8 rounded-full border transition hover:scale-110 ${on ? "border-ink ring-2 ring-ink ring-offset-2 ring-offset-paper" : "border-black/10"}`}
                  style={{ background: x.hex }}
                />
              );
            })}
            {color && (
              <span className="ml-2 text-sm">
                {(fr ? COLORS.find((x) => x.id === color)?.fr : COLORS.find((x) => x.id === color)?.en) ?? ""}
              </span>
            )}
          </div>
          <details className="group relative">
            <summary className="caps flex cursor-pointer list-none items-center gap-2 border-b border-ink pb-1 [&::-webkit-details-marker]:hidden">
              {shop ?? (fr ? "Toutes les maisons" : "All brands")} <span className="transition group-open:rotate-180">▾</span>
            </summary>
            <div className="absolute right-0 z-30 mt-3 max-h-80 w-64 overflow-y-auto border border-line bg-white p-2 shadow-xl">
              <Link href={href({ marque: null, n: null })} className={`flex justify-between px-3 py-2 text-sm hover:bg-paper ${!shop ? "font-medium" : ""}`}>
                {fr ? "Toutes les maisons" : "All brands"}
              </Link>
              {shops.map(([name, n]) => (
                <Link key={name} href={href({ marque: name, n: null })} className={`flex justify-between px-3 py-2 text-sm hover:bg-paper ${shop === name ? "font-medium" : ""}`}>
                  {name} <span className="text-muted">{n}</span>
                </Link>
              ))}
            </div>
          </details>
        </div>

        {(style || color || shop || pepites || sp.q) && (
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            {style && <Pill href={href({ style: null, n: null })} label={(fr ? STYLES.find((x) => x.id === style)?.fr : STYLES.find((x) => x.id === style)?.en) ?? style} />}
            {color && <Pill href={href({ couleur: null, n: null })} label={(fr ? COLORS.find((x) => x.id === color)?.fr : COLORS.find((x) => x.id === color)?.en) ?? color} />}
            {shop && <Pill href={href({ marque: null, n: null })} label={shop} />}
            {pepites && <Pill href={href({ pepites: null, n: null })} label={fr ? "Pépites" : "Gems"} />}
            {sp.q && <Pill href={href({ q: null, n: null })} label={`« ${sp.q} »`} />}
            <Link href={href({ style: null, couleur: null, marque: null, pepites: null, q: null, n: null })} className="caps ml-2 text-muted hover:text-ink">
              {fr ? "Tout effacer" : "Clear all"}
            </Link>
          </div>
        )}
      </section>

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

      {products.length === 0 && (
        <div className="mt-10 bg-white p-10 text-center">
          <p className="display text-3xl">{fr ? "Rien de tel pour l'instant." : "Nothing like that yet."}</p>
          <p className="mt-3 text-muted">
            {fr ? "Retirez un filtre, ou créez votre propre objet : une pièce chinée, un artisan, tout y va." : "Remove a filter, or create your own item."}
          </p>
        </div>
      )}

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

function Pill({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} scroll={false} className="flex items-center gap-2 border border-ink px-3 py-1 hover:bg-ink hover:text-white">
      {label} <span aria-hidden>×</span>
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

/** Alterne les familles (les essentiels d'abord) pour que la vitrine ne commence pas par 40 cadres. */
function mix(list: Product[]) {
  const groups = new Map<string, Product[]>();
  for (const p of list) {
    const g = groups.get(p.category) ?? [];
    g.push(p);
    groups.set(p.category, g);
  }
  // Dans chaque famille, on alterne aussi les enseignes
  for (const [k, g] of groups) {
    const byShop = new Map<string, Product[]>();
    for (const p of g) byShop.set(p.shop, [...(byShop.get(p.shop) ?? []), p]);
    const lanes = [...byShop.values()];
    const out: Product[] = [];
    for (let i = 0; out.length < g.length; i++) for (const l of lanes) if (l[i]) out.push(l[i]);
    groups.set(k, out);
  }
  const order = ["assises", "luminaires", "tables", "tapis", "lits", "rangement", "deco", "textiles", "miroirs", "vaisselle", "plantes", "art"];
  const keys = [...groups.keys()].sort((a, b) => (order.indexOf(a) + 99) % 99 - (order.indexOf(b) + 99) % 99);
  const res: Product[] = [];
  for (let i = 0; res.length < list.length; i++) for (const k of keys) {
    const p = groups.get(k)![i];
    if (p) res.push(p);
  }
  return res;
}
