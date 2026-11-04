import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { CATALOG_ROOMS, CATEGORIES, COLORS, STYLES } from "@/lib/catalog";
import { isSecondHand, parseDims, parseEra, parseMaterials, parseSeats } from "@/lib/specs";
import { SaveButton } from "@/components/ShopState";
import { CompareRemove, CompareSync } from "@/components/CompareTools";

export const metadata = { title: "Comparer des pièces" };

type Row = {
  id: number;
  title: string;
  shop: string;
  price: number;
  image_url: string;
  url: string;
  room: string;
  category: string;
  style: string | null;
  color: string | null;
  niche: boolean | null;
};

const eur = (v: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: v % 1 ? 2 : 0 }).format(v);

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const sp = await searchParams;
  const { lang } = await getDict();
  const fr = lang === "fr";
  const { supabase } = await getUser();

  const ids = (sp.ids || "")
    .split(",")
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0)
    .slice(0, 4);
  const { data } = ids.length
    ? await supabase.from("products").select("id, title, shop, price, image_url, url, room, category, style, color, niche").in("id", ids)
    : { data: [] };
  const items = ids.map((id) => (data as Row[] | null)?.find((p) => p.id === id)).filter((p): p is Row => !!p);

  if (items.length < 2)
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <p className="caps text-muted">{fr ? "Comparer" : "Compare"}</p>
        <h1 className="display mt-4 text-5xl leading-[0.95]">{fr ? "Choisissez au moins deux pièces." : "Pick at least two pieces."}</h1>
        <p className="mt-5 text-muted">
          {fr
            ? "Dans le catalogue, cochez « Comparer » sous les pièces qui vous intéressent : elles s'affichent ici côte à côte, avec leurs prix, dimensions et matières."
            : "In the catalogue, tick “Compare” under the pieces you like."}
        </p>
        <Link href="/catalogue" className="btn-primary mt-10 inline-flex !px-8 !py-4 text-[12px] uppercase tracking-label">
          {fr ? "Aller au catalogue" : "Go to the catalogue"}
        </Link>
      </div>
    );

  const specs = items.map((p) => ({
    p,
    dims: parseDims(p.title),
    mats: parseMaterials(p.title),
    seats: parseSeats(p.title),
    era: parseEra(p.title),
    used: isSecondHand(p.shop),
  }));

  const prices = items.map((p) => Number(p.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const areas = specs.map((s) => (s.dims?.diam ? Math.PI * (s.dims.diam / 2) ** 2 : (s.dims?.w ?? 0) * (s.dims?.d ?? s.dims?.h ?? 0)));
  const biggest = Math.max(...areas);
  const sameCat = new Set(items.map((p) => p.category)).size === 1;
  const commonMats = specs.map((s) => s.mats).reduce((a, b) => a.filter((x) => b.includes(x)));

  const label = {
    cat: (c: string) => CATEGORIES[c]?.[lang] ?? c,
    room: (r: string) => (fr ? CATALOG_ROOMS.find((x) => x.id === r)?.fr : CATALOG_ROOMS.find((x) => x.id === r)?.en) ?? r,
    style: (s: string | null) => (s ? ((fr ? STYLES.find((x) => x.id === s)?.fr : STYLES.find((x) => x.id === s)?.en) ?? s) : "—"),
    color: (c: string | null) => (c ? COLORS.find((x) => x.id === c) : null),
  };

  const rows: { k: string; cells: React.ReactNode[] }[] = [
    {
      k: fr ? "Prix" : "Price",
      cells: specs.map(({ p }) => (
        <div key={p.id}>
          <p className="display text-3xl">{eur(Number(p.price))}</p>
          {Number(p.price) === min && max > min && <p className="caps mt-1 text-moss">{fr ? `Le moins cher · −${eur(max - min)}` : "Cheapest"}</p>}
          {Number(p.price) > min && <p className="mt-1 text-xs text-muted">+{eur(Number(p.price) - min)}</p>}
        </div>
      )),
    },
    {
      k: fr ? "Dimensions" : "Size",
      cells: specs.map(({ p, dims }, i) => (
        <div key={p.id}>
          {dims ? dims.text : <span className="text-muted">{fr ? "Voir la fiche" : "See listing"}</span>}
          {dims && areas[i] === biggest && biggest > 0 && items.length > 1 && <p className="caps mt-1 text-[10px] text-muted">{fr ? "La plus grande" : "Largest"}</p>}
        </div>
      )),
    },
    {
      k: fr ? "Matières" : "Materials",
      cells: specs.map(({ p, mats }) => (
        <div key={p.id} className="flex flex-wrap gap-1.5">
          {mats.length ? mats.map((m) => <span key={m} className={`border px-2 py-0.5 text-xs ${commonMats.includes(m) ? "border-line text-muted" : "border-ink"}`}>{m}</span>) : <span className="text-muted">—</span>}
        </div>
      )),
    },
    {
      k: fr ? "Couleur" : "Colour",
      cells: specs.map(({ p }) => {
        const c = label.color(p.color);
        return (
          <div key={p.id} className="flex items-center gap-2">
            {c ? (
              <>
                <span className="h-4 w-4 rounded-full border border-black/10" style={{ background: c.hex }} />
                {fr ? c.fr : c.en}
              </>
            ) : (
              <span className="text-muted">—</span>
            )}
          </div>
        );
      }),
    },
    { k: "Style", cells: specs.map(({ p }) => <span key={p.id}>{label.style(p.style)}</span>) },
    ...(specs.some((s) => s.seats)
      ? [{ k: fr ? "Places" : "Seats", cells: specs.map(({ p, seats }) => <span key={p.id}>{seats ?? "—"}</span>) }]
      : []),
    {
      k: fr ? "État" : "Condition",
      cells: specs.map(({ p, used, era }) => (
        <div key={p.id}>
          {used ? (fr ? "Seconde main, pièce unique" : "Pre-loved, one-off") : fr ? "Neuf" : "New"}
          {era && <p className="text-xs text-muted">{era}</p>}
        </div>
      )),
    },
    { k: fr ? "Boutique" : "Shop", cells: specs.map(({ p }) => <span key={p.id}>{p.shop}{p.niche && !isSecondHand(p.shop) ? <span className="ml-2 text-xs text-brass">{fr ? "Pépite" : "Gem"}</span> : null}</span>) },
    { k: fr ? "Famille" : "Type", cells: specs.map(({ p }) => <span key={p.id}>{label.cat(p.category)} · {label.room(p.room)}</span>) },
  ];

  const cols = `minmax(120px,0.7fr) repeat(${items.length}, minmax(200px,1fr))`;

  return (
    <div className="pt-4">
      <CompareSync items={items.map((p) => ({ id: p.id, title: p.title, image_url: p.image_url, price: Number(p.price), shop: p.shop, url: p.url, category: p.category }))} />
      <Link href="/catalogue" className="caps text-muted hover:text-ink">
        ← {fr ? "Le catalogue" : "Catalogue"}
      </Link>
      <div className="mt-8 grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <p className="caps text-muted">{fr ? `Comparaison · ${items.length} pièces` : `Comparing ${items.length} pieces`}</p>
          <h1 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">{fr ? "Côte à côte." : "Side by side."}</h1>
        </div>
        <p className="text-muted">
          {fr
            ? `De ${eur(min)} à ${eur(max)}${sameCat ? "" : ", sur des familles différentes"}. ${commonMats.length ? `Point commun : ${commonMats.join(", ").toLowerCase()}.` : "Les matières en noir sont celles qui les distinguent."}`
            : `From ${eur(min)} to ${eur(max)}.`}
        </p>
      </div>

      <div className="-mx-4 mt-12 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
        <div className="min-w-fit">
          {/* Les pièces */}
          <div className="grid gap-4" style={{ gridTemplateColumns: cols }}>
            <div />
            {items.map((p) => (
              <div key={p.id} className="flex flex-col">
                <div className="relative aspect-square bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image_url} alt={p.title} referrerPolicy="no-referrer" className="h-full w-full object-contain p-5 mix-blend-multiply" />
                  <SaveButton p={{ id: p.id, title: p.title, image_url: p.image_url, price: Number(p.price), shop: p.shop, url: p.url }} fr={fr} className="absolute right-3 top-3" />
                  <CompareRemove id={p.id} ids={items.map((x) => x.id)} fr={fr} />
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-snug">{p.title}</p>
              </div>
            ))}
          </div>

          {/* La fiche */}
          <dl className="mt-8 border-t border-ink">
            {rows.map((r) => (
              <div key={r.k} className="grid gap-4 border-b border-line py-4 text-sm" style={{ gridTemplateColumns: cols }}>
                <dt className="caps pt-1 text-muted">{r.k}</dt>
                {r.cells.map((c, i) => (
                  <dd key={i}>{c}</dd>
                ))}
              </div>
            ))}
            <div className="grid gap-4 py-6" style={{ gridTemplateColumns: cols }}>
              <div />
              {items.map((p) => (
                <a key={p.id} href={p.url} target="_blank" rel="noopener nofollow sponsored" className="btn-primary justify-center !py-3 text-[11px] uppercase tracking-label">
                  {fr ? `Voir chez ${p.shop}` : `View at ${p.shop}`} ↗
                </a>
              ))}
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="display text-2xl">{fr ? "Pas prêt à acheter ?" : "Not ready to buy?"}</p>
          <p className="mt-1 text-sm text-muted">
            {fr ? "Gardez-les avec le cœur, ou mettez-les dans une cagnotte pour épargner tranquillement." : "Save them with the heart, or put them in a pot."}
          </p>
        </div>
        <Link href={`/new?product=${items.map((p) => p.id).join(",")}`} className="btn border border-ink !px-6 !py-3 text-[11px] uppercase tracking-label hover:bg-ink hover:text-white">
          {fr ? "Créer une cagnotte avec ces pièces" : "Start a pot with these"}
        </Link>
      </div>
      <p className="mt-8 text-xs text-muted">
        {fr
          ? "Dimensions et matières sont lues dans la description des boutiques ; vérifiez toujours la fiche avant d'acheter."
          : "Sizes and materials are read from the shops' listings; always check before buying."}
      </p>
    </div>
  );
}
