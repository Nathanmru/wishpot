import Link from "next/link";
import { redirect } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { photo } from "@/lib/covers";
import { CATALOG_ROOMS, STYLES } from "@/lib/catalog";
import { EXAMPLE_POTS, exampleIds } from "@/lib/examples";
import ProductStrip from "@/components/ProductStrip";
import HeroRoom from "@/components/HeroRoom";
import { APP_NAME, siteUrl } from "@/lib/config";
import JsonLd from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/" } };
import HowItWorks from "@/components/HowItWorks";
import RoomPlanner from "@/components/RoomPlanner";
import ExamplePots, { type Board } from "@/components/ExamplePots";
import { Reveal } from "@/components/Motion";
import IntroSplash from "@/components/IntroSplash";

/** Photos d'ambiance : intérieurs vintage, cuir, bois patiné (Unsplash, licence gratuite). */
const MOOD = {
  armchair: "1601617956235-c97e358d054f", // fauteuil club au soleil
  cognacSofa: "1628512743826-2c28a508ad5e", // canapé cognac, vase laiton
  chesterfield: "1606425288528-4cebbfc69de7", // chesterfield, cadres
  tufted: "1780396378800-75baa6c0602a", // fauteuil capitonné, plante
  teak: "1616593871468-2a9452218369", // salon années 60, teck
  brocante: "1640276751820-7a295bee77aa", // étagères de brocante
  cozy: "1510568192-5cd6e7a47edd", // salon vintage, tapis
};

/** Ce qui distingue chaque maison du catalogue. */
const SHOP_NOTES: Record<string, { fr: string; en: string }> = {
  Selency: { fr: "Brocante en ligne, pièces uniques", en: "Online flea market, one-offs" },
  "Kave Home": { fr: "Méditerranéen, bois et fibres", en: "Mediterranean wood & fibres" },
  "Ferm Living": { fr: "Design danois, tons sourds", en: "Danish design, muted tones" },
  "Broste Copenhagen": { fr: "Grès, verre soufflé, lin", en: "Stoneware, glass, linen" },
  Serax: { fr: "Céramiques d'auteur, Belgique", en: "Designer ceramics, Belgium" },
  Caravane: { fr: "Artisanat, coton et laine", en: "Craft, cotton & wool" },
  Fleux: { fr: "Objets drôles et colorés", en: "Playful, colourful objects" },
  "House Doctor": { fr: "Patines, esprit atelier", en: "Patinas, workshop spirit" },
  "Maisons du Monde": { fr: "Tous les styles, petits prix", en: "Every style, small prices" },
  "Audo Copenhagen": { fr: "Pièces de designers", en: "Designer pieces" },
  IKEA: { fr: "Les bases, bien pensées", en: "Well-made basics" },
  "Hartô": { fr: "Éditeur français, luminaires", en: "French editor, lighting" },
  "NV Gallery": { fr: "Design parisien, pièces signature", en: "Parisian design, signature pieces" },
  Westwing: { fr: "Westwing Collection, chic et feutré", en: "Westwing Collection, quiet luxury" },
};

export default async function Home() {
  const { lang } = await getDict();
  const { supabase, user } = await getUser();
  if (user) redirect("/dashboard");
  const fr = lang === "fr";
  const L = fr ? "fr" : "en";

  const [{ data: fx }, { data: picks }, { data: gemsRaw }] = await Promise.all([
    supabase.rpc("catalog_facets", { p_room: null }),
    supabase.from("products").select("id, title, shop, price, image_url, url").in("id", exampleIds()),
    supabase
      .from("products")
      .select("id, title, shop, price, image_url, url, category, niche")
      .eq("active", true)
      .eq("niche", true)
      .in("category", ["assises", "luminaires", "deco", "tables", "miroirs", "tapis"])
      .order("id", { ascending: false })
      .limit(600),
  ]);

  // Les pépites du jour : une pièce par maison et par famille, qui change chaque jour
  const day = Math.floor(Date.now() / 86_400_000);
  const pool = (gemsRaw ?? []).map((p) => ({ ...p, price: Number(p.price) })) as { id: number; title: string; shop: string; price: number; image_url: string; url: string; category: string; niche: boolean }[];
  const rot = pool.length ? (day * 37) % pool.length : 0;
  const gems: typeof pool = [];
  const seen = new Set<string>();
  for (const p of [...pool.slice(rot), ...pool.slice(0, rot)]) {
    const k = `${p.shop}|${p.category}`;
    if (seen.has(k) || gems.filter((g) => g.shop === p.shop).length >= 2) continue;
    seen.add(k);
    gems.push(p);
    if (gems.length >= 12) break;
  }
  const facets = (fx ?? { total: 0, rooms: {}, shops: {}, styles: {} }) as { total: number; rooms: Record<string, number>; shops: Record<string, number>; styles: Record<string, number> };
  const shops = Object.entries(facets.shops).sort((a, b) => b[1] - a[1]);

  // Les cagnottes d'exemple, avec les prix et photos du catalogue
  const boards: Board[] = EXAMPLE_POTS.map((pot) => ({
    slug: pot.slug,
    title: pot.title[L],
    mood: pot.mood[L],
    why: pot.why[L],
    palette: pot.palette.map((c) => ({ hex: c.hex, name: c[L] })),
    months: pot.months,
    people: pot.people,
    items: pot.items.flatMap((it) => {
      const p = picks?.find((x) => x.id === it.id);
      return p ? [{ id: it.id, qty: it.qty ?? 1, role: it.role[L], title: p.title as string, shop: p.shop as string, price: Number(p.price), image_url: p.image_url as string, url: p.url as string }] : [];
    }),
  })).filter((b) => b.items.length >= 3);

  const eur = (n: number) => new Intl.NumberFormat(fr ? "fr-FR" : "en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  const first = boards[0];
  const firstTotal = first ? first.items.reduce((a, x) => a + x.price * x.qty, 0) : 0;
  const sample = first
    ? { title: first.title, items: first.items, total: eur(firstTotal), monthly: eur(Math.ceil(firstTotal / first.months / 5) * 5), months: first.months }
    : null;

  const steps = fr
    ? [
        { title: "Trouvez vos pièces", text: "Cherchez par pièce, par style ou par couleur parmi des milliers de meubles et d'objets, neufs ou chinés. Pas dans le catalogue ? Collez un lien ou créez votre objet." },
        { title: "Mettez-les dans un budget", text: "Chaque pièce rejoint votre cagnotte. Le total se calcule, vous voyez ce qui manque à la pièce et ce que ça représente par mois." },
        { title: "Épargnez jusqu'au but", text: "Seul ou à plusieurs, chacun note ce qu'il met de côté. La jauge avance, la date d'arrivée se rapproche. L'argent reste sur vos comptes." },
      ]
    : [
        { title: "Find your pieces", text: "Search by room, style or colour among thousands of new and vintage pieces. Not in the catalogue? Paste a link or create your own item." },
        { title: "Put them in a budget", text: "Every piece joins your pot. The total adds up, you see what the room still needs and what it means per month." },
        { title: "Save until you're there", text: "Alone or together, everyone logs what they set aside. The gauge moves, the date gets closer. The money stays in your accounts." },
      ];

  const faq = fr
    ? [
        ["À quoi sert Atelier Nama ?", "À transformer une envie de déco en projet concret : vous choisissez les pièces, Atelier Nama calcule le budget et ce qu'il faut épargner chaque mois pour y arriver, seul ou à plusieurs."],
        ["L'argent passe-t-il par le site ?", "Non. Chacun garde son argent : le site sert à se fixer un objectif et à suivre ce que vous avez mis de côté."],
        ["D'où viennent les produits ?", `De ${shops.length} maisons : grandes enseignes, éditeurs de design, petites marques et brocanteurs en ligne. Les prix sont relevés à date ; le lien mène toujours à la fiche de la boutique.`],
        ["Je peux ajouter un objet qui n'est pas dans le catalogue ?", "Oui : collez le lien de n'importe quelle boutique, ou créez votre propre objet avec un nom et un prix. Une pièce chinée, un artisan, tout y va."],
        ["C'est vraiment gratuit ?", "Oui. Certains liens vers les boutiques sont affiliés : un achat peut nous rémunérer, sans rien vous coûter de plus."],
      ]
    : [
        ["What is Atelier Nama for?", "Turning a decor wish into a real plan: you pick the pieces, Atelier Nama works out the budget and what to save each month, alone or together."],
        ["Does money go through the site?", "No. Everyone keeps their own money: the site sets the goal and tracks what you've saved."],
        ["Where do products come from?", `From ${shops.length} brands: big retailers, design editors, small makers and online vintage dealers. Prices are collected at a date; links go to the shop's page.`],
        ["Can I add something that isn't in the catalogue?", "Yes: paste a link from any shop, or create your own item with a name and price."],
        ["Is it really free?", "Yes. Some shop links are affiliate links, which may pay us at no extra cost to you."],
      ];

  return (
    <div className="-mt-24 sm:-mt-28">
      <IntroSplash />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: APP_NAME,
            url: siteUrl(),
            logo: `${siteUrl()}/icon-512.png`,
            description: "Déco vintage, pièces chinées et design de petites maisons, et une cagnotte pour épargner pour son intérieur.",
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: APP_NAME,
            url: siteUrl(),
            inLanguage: "fr-FR",
            potentialAction: { "@type": "SearchAction", target: `${siteUrl()}/catalogue?q={search_term_string}`, "query-input": "required name=search_term_string" },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
          },
        ]}
      />
      <HeroRoom name={APP_NAME} fr={fr} />

      {/* ---------- Deux façons de s'en servir ---------- */}
      <section id="cagnotte" className="scroll-mt-20 py-20 sm:py-28">
        <Reveal className="text-center">
          <p className="caps text-muted">{fr ? "Deux façons de faire" : "Two ways to use it"}</p>
          <h2 className="display mx-auto mt-4 max-w-3xl text-5xl leading-[0.95] sm:text-7xl">
            {fr ? "Dénicher une pièce, ou préparer tout un projet." : "Find one piece, or plan a whole project."}
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-4 lg:grid-cols-2 lg:gap-6">
          {/* 1 · Dénicher */}
          <div className="flex flex-col bg-white p-7 sm:p-10">
            <p className="caps text-muted">01 · {fr ? "Je cherche une pièce" : "I'm looking for a piece"}</p>
            <p className="display mt-4 text-4xl leading-[1] sm:text-5xl">{fr ? "Dénicher." : "Find."}</p>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              {fr
                ? `${facets.total.toLocaleString("fr-FR")} pièces de ${shops.length} maisons réunies au même endroit, neuves ou chinées. Triez par style, couleur ou budget, comparez, puis achetez directement chez la boutique.`
                : `${facets.total} pieces from ${shops.length} brands in one place. Filter by style, colour or budget, compare, then buy from the shop.`}
            </p>
            <form action="/catalogue" className="mt-7 flex items-center gap-2 border border-ink bg-paper p-1.5 pl-4">
              <span aria-hidden className="text-muted">⌕</span>
              <input name="q" placeholder={fr ? "Un fauteuil en cuir, une lampe laiton…" : "A leather armchair, a brass lamp…"} className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] outline-none placeholder:text-muted" />
              <button className="btn-primary !px-5 !py-2.5 text-[11px] uppercase tracking-label">{fr ? "Chercher" : "Search"}</button>
            </form>
            <ul className="mt-6 grid grid-cols-3 gap-3 text-sm">
              {[
                [fr ? "Comparer" : "Compare", fr ? "Jusqu'à 4 pièces côte à côte" : "Up to 4 side by side"],
                [fr ? "Garder ♡" : "Save ♡", fr ? "Sur votre compte Google" : "On your Google account"],
                [fr ? "Acheter" : "Buy", fr ? "Directement en boutique" : "Straight from the shop"],
              ].map(([t, d]) => (
                <li key={t} className="border-t border-line pt-3">
                  <p className="font-medium">{t}</p>
                  <p className="text-xs text-muted">{d}</p>
                </li>
              ))}
            </ul>
            <Link href="/catalogue" className="link-caps mt-auto self-start pt-8">
              {fr ? "Ouvrir le catalogue" : "Open the catalogue"} →
            </Link>
          </div>

          {/* 2 · Cagnotte */}
          <div className="flex flex-col bg-night p-7 text-bone sm:p-10">
            <p className="caps text-bone/60">02 · {fr ? "Je prépare un projet" : "I'm planning a project"}</p>
            <p className="display mt-4 text-4xl leading-[1] sm:text-5xl">{fr ? "Créer une cagnotte." : "Start a pot."}</p>
            <p className="mt-4 max-w-md leading-relaxed text-bone/70">
              {fr
                ? "Réunissez toutes les pièces d'un projet, un salon, une chambre, un premier appart. On calcule ce qu'il faut mettre de côté chaque mois, seul ou à plusieurs, et la date où vous pourrez tout vous offrir."
                : "Gather every piece of a project. We work out what to set aside each month, alone or together, and when you'll get there."}
            </p>
            {sample && (
              <div className="mt-7 bg-bone/[0.06] p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="display text-2xl leading-tight">{sample.title}</p>
                  <div className="flex -space-x-3">
                    {sample.items.slice(0, 4).map((x, k) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={k} src={x.image_url} alt="" referrerPolicy="no-referrer" className="h-11 w-11 rounded-full border-2 border-night bg-white object-contain" />
                    ))}
                  </div>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-bone/10">
                  <div className="h-full w-[38%] rounded-full bg-brass" />
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <span>
                    <b className="font-medium">{sample.monthly}</b>
                    <span className="text-bone/60"> / {fr ? "mois à deux" : "mo for two"}</span>
                  </span>
                  <span className="text-bone/60">
                    {sample.total} · {sample.months} {fr ? "mois" : "mo"}
                  </span>
                </div>
              </div>
            )}
            <div className="mt-auto flex flex-wrap items-center gap-5 pt-8">
              <Link href="/new" className="btn bg-bone !px-7 !py-4 text-[11px] uppercase tracking-label text-ink hover:bg-white">
                {fr ? "Créer ma cagnotte" : "Create my pot"}
              </Link>
              <Link href="#exemples" className="caps border-b border-bone/40 pb-0.5 text-bone/80 hover:text-bone">
                {fr ? "Voir des exemples" : "See examples"}
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          {fr
            ? "Vous pouvez passer de l'un à l'autre à tout moment : une pièce gardée ou comparée s'ajoute à une cagnotte en un geste."
            : "Switch any time: a saved or compared piece goes into a pot in one tap."}
        </p>
      </section>

      {/* ---------- Les pépites du jour ---------- */}
      {gems.length > 0 && (
        <section className="border-t border-line py-20 sm:py-28">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="caps text-muted">{fr ? "Les pépites du jour" : "Today's gems"}</p>
              <h2 className="display mt-4 text-5xl leading-[0.95] sm:text-6xl">{fr ? "Ce que personne d'autre n'aura." : "What nobody else will have."}</h2>
            </div>
            <Link href="/catalogue?pepites=1" className="link-caps">
              {fr ? "Toutes les pépites" : "All gems"} →
            </Link>
          </Reveal>
          <div className="mt-12">
            <ProductStrip items={gems} fr={fr} />
          </div>
        </section>
      )}

      {/* ---------- Comment ça marche ---------- */}
      <HowItWorks
        kicker={fr ? "Le principe" : "How it works"}
        title={fr ? "Une envie, un budget, une date." : "A wish, a budget, a date."}
        steps={steps}
        fr={fr}
        sofaImg={first?.items[0]?.image_url ?? photo(MOOD.cognacSofa, 600)}
      />

      {/* ---------- Cagnottes d'exemple ---------- */}
      {boards.length > 0 && (
        <section id="exemples" className="scroll-mt-24 border-t border-line py-24 sm:py-32">
          <Reveal className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end">
            <div>
              <p className="caps text-muted">{fr ? "Cagnottes d'exemple" : "Example pots"}</p>
              <h2 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">{fr ? "Des pièces qui vont ensemble." : "Pieces that belong together."}</h2>
            </div>
            <p className="max-w-md text-muted md:justify-self-end">
              {fr
                ? "Trois pièces montées avec de vrais produits du catalogue, autour d'une palette. Reprenez-les telles quelles ou servez-vous-en comme point de départ."
                : "Three rooms built from real catalogue products around one palette. Use them as they are or as a starting point."}
            </p>
          </Reveal>
          <div className="mt-12">
            <ExamplePots boards={boards} fr={fr} />
          </div>
        </section>
      )}

      {/* ---------- Par style ---------- */}
      <section className="border-t border-line py-24 sm:py-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="caps text-muted">{fr ? "Chercher par style" : "Shop by style"}</p>
            <h2 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">{fr ? "Quelle est votre ambiance ?" : "What's your mood?"}</h2>
          </div>
          <Link href="/aide-deco#styles" className="link-caps">
            {fr ? "Trouver mon style" : "Find my style"} →
          </Link>
        </Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {STYLES.map((st) => (
            <li key={st.id}>
              <Link href={`/catalogue?style=${st.id}`} className="group relative block aspect-[4/5] overflow-hidden bg-night">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={st.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-[1400ms] ease-out group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
                  <p className="display text-2xl leading-none sm:text-3xl">{fr ? st.fr : st.en}</p>
                  <p className="mt-2 text-xs text-white/75">
                    {st.hint} · {facets.styles[st.id] ?? 0}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Les maisons ---------- */}
      <section className="mx-[calc(50%-50vw)] bg-night py-24 text-bone sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end">
            <div>
              <p className="caps text-bone/60">{fr ? `${shops.length} maisons` : `${shops.length} brands`}</p>
              <h2 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">{fr ? "Des grandes enseignes aux pépites." : "From big names to hidden gems."}</h2>
            </div>
            <p className="max-w-md text-bone/70 md:justify-self-end">
              {fr
                ? "Du danois sourd au brocanteur, de la céramique d'auteur aux basiques bien faits : de quoi trouver la pièce que personne d'autre n'a."
                : "From muted Danish design to vintage dealers, designer ceramics to well-made basics."}
            </p>
          </Reveal>
          <ul className="mt-12 grid grid-cols-2 border-l border-t border-bone/15 sm:grid-cols-3 lg:grid-cols-4">
            {shops.map(([name, n]) => (
              <li key={name} className="border-b border-r border-bone/15">
                <Link href={`/catalogue?marque=${encodeURIComponent(name)}`} className="group flex h-full flex-col justify-between gap-6 p-5 transition hover:bg-bone/5 sm:p-7">
                  <span className="display text-2xl leading-tight sm:text-3xl">{name}</span>
                  <span className="text-xs text-bone/60">
                    {SHOP_NOTES[name]?.[L] ?? ""}
                    <span className="mt-1 block text-bone/40 transition group-hover:text-bone">
                      {n} {fr ? "pièces" : "pieces"} →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Par pièce ---------- */}
      <section className="py-24 sm:py-32">
        <Reveal>
          <p className="caps text-muted">{fr ? "Chercher par pièce" : "Shop by room"}</p>
          <h2 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">{fr ? "Toute la maison." : "The whole home."}</h2>
        </Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {CATALOG_ROOMS.map((r) => (
            <li key={r.id}>
              <Link href={`/catalogue?piece=${r.id}`} className="group relative block aspect-[4/5] overflow-hidden bg-night">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-[1400ms] ease-out group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
                  <p className="display text-2xl leading-none sm:text-4xl">{fr ? r.fr : r.en}</p>
                  <p className="caps mt-2 text-white/70">
                    {facets.rooms[r.id] ?? 0} {fr ? "pièces" : "pieces"} →
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Composer une pièce ---------- */}
      <div className="border-t border-line">
        <RoomPlanner lang={lang} />
      </div>

      {/* ---------- Aide déco ---------- */}
      <section className="relative mx-[calc(50%-50vw)] flex min-h-[78vh] items-end overflow-hidden bg-night">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo(MOOD.cozy, 2000)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
        <Reveal className="relative mx-auto w-full max-w-[1400px] px-5 py-20 text-white sm:px-8">
          <p className="caps text-white/70">{fr ? "Aide déco" : "Decor guide"}</p>
          <h2 className="display mt-4 max-w-2xl text-5xl leading-[0.95] sm:text-7xl">{fr ? "Avoir l'œil, ça s'apprend." : "A good eye can be learned."}</h2>
          <p className="mt-5 max-w-md text-white/80">
            {fr
              ? "Associer les couleurs, mélanger l'ancien et le neuf, dénicher la pièce unique, bien éclairer : nos conseils, avec des pièces pour passer à l'action."
              : "Pairing colours, mixing old and new, finding the one-off, lighting well: our advice, with pieces to act on it."}
          </p>
          <Link href="/aide-deco" className="caps mt-8 inline-flex border-b border-white/60 pb-1 hover:border-white">
            {fr ? "Lire l'aide déco" : "Read the guide"} →
          </Link>
        </Reveal>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="grid gap-12 py-24 sm:py-32 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <h2 className="display text-5xl leading-[0.95] sm:text-6xl">{fr ? "Questions fréquentes" : "Questions"}</h2>
          <ul className="mt-10 space-y-6 text-sm">
            {(fr
              ? [
                  ["Gratuit", "Créer, inviter, partager : rien n'est payant."],
                  ["Votre argent reste chez vous", "Rien ne transite par Atelier Nama."],
                  ["Privé", "Seul votre cercle voit votre cagnotte."],
                ]
              : [
                  ["Free", "Creating, inviting, sharing: nothing to pay."],
                  ["Your money stays with you", "Nothing goes through Atelier Nama."],
                  ["Private", "Only your circle sees your pot."],
                ]
            ).map(([t, d]) => (
              <li key={t} className="border-l-2 border-walnut pl-4">
                <p className="font-medium">{t}</p>
                <p className="text-muted">{d}</p>
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="divide-y divide-line border-y border-line">
          {faq.map(([q, a]) => (
            <details key={q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg [&::-webkit-details-marker]:hidden">
                {q}
                <span className="text-2xl font-light transition duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-xl leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- Final ---------- */}
      <section className="relative mx-[calc(50%-50vw)] -mb-20 flex h-[86vh] min-h-[520px] items-end overflow-hidden bg-night">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo(MOOD.chesterfield, 2000)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
        <Reveal className="relative w-full px-6 pb-20 text-center text-white sm:pb-28">
          <h2 className="display mx-auto max-w-4xl text-5xl leading-[0.95] sm:text-8xl">{fr ? "Commencez par une seule pièce." : "Start with a single piece."}</h2>
          <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
            <Link href="/catalogue" className="btn bg-bone !px-10 !py-4 text-[12px] uppercase tracking-label text-ink hover:bg-white">
              {fr ? "Parcourir le catalogue" : "Browse the catalogue"}
            </Link>
            <Link href="/new" className="caps border-b border-white/50 pb-0.5 text-white/80 hover:text-white">
              {fr ? "ou créer ma cagnotte" : "or create my pot"}
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
