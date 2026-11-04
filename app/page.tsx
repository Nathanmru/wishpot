import Link from "next/link";
import { redirect } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { PHOTOS, photo } from "@/lib/covers";
import { CATALOG_ROOMS } from "@/lib/catalog";
import HeroArch from "@/components/HeroArch";
import HowItWorks from "@/components/HowItWorks";
import RoomPlanner from "@/components/RoomPlanner";
import { Reveal } from "@/components/Motion";
import { StorySlider, type Story } from "@/components/Luxe";
import { TRENDS } from "@/lib/inspiration";

const room = (id: string) => CATALOG_ROOMS.find((r) => r.id === id)!;
const newHref = (name: string) => `/new?${new URLSearchParams({ name }).toString()}`;

const COPY = {
  fr: {
    kicker: "La cagnotte déco · Appartement & maison",
    lines: ["Le beau se prépare", "à plusieurs."],
    sub: "Choisissez vos meubles et votre déco pièce par pièce, décidez ce que chacun met de côté chaque mois : Wishpot vous dit quand vous pourrez tout vous offrir.",
    cta1: "Composer une pièce",
    cta2: "Créer ma cagnotte",
    scenes: [
      { id: "salon", word: "Salon", caption: "Le salon" },
      { id: "chambre", word: "Chambre", caption: "La chambre" },
    ],
    openTitle: "Toute la maison, pièce par pièce.",
    openText: "Plus de 500 pièces de vraies enseignes, rangées par pièce, à ajouter à votre cagnotte en un geste.",
    openLink: "Parcourir le catalogue",
    howKicker: "Comment ça marche",
    howTitle: "Trois étapes, c'est tout.",
    steps: [
      { title: "Créez la cagnotte", text: "Donnez-lui un nom et dites combien chacun met de côté chaque mois. La date d'arrivée se calcule toute seule." },
      { title: "Ajoutez vos envies", text: "Piochez dans le catalogue, collez le lien d'une boutique, ou créez votre propre objet : une pièce chinée, un artisan, un cadeau." },
      { title: "Épargnez ensemble", text: "Invitez avec un lien. Chacun indique ce qu'il a mis de côté et la jauge avance pour tout le monde. L'argent reste sur vos comptes." },
    ],
    roomsKicker: "Le catalogue",
    roomsTitle: "Tout ce qu'on trouve dans une maison.",
    roomsSub: "Canapés, luminaires, tapis, linge, vaisselle : chaque pièce a ses essentiels, et Wishpot vous dit ce qui manque.",
    roomsCta: "Voir tout le catalogue",
    storiesKicker: "Pensé pour",
    storiesTitle: "Chaque projet a sa cagnotte.",
    storiesCta: "Commencer",
    stories: [
      { tag: "Emménager", title: "Premier appartement", text: "Le lit, le canapé, la vaisselle : tout ce qu'il faut pour le jour J, réparti mois par mois.", img: photo(PHOTOS.loft, 1000), href: newHref("Premier appartement") },
      { tag: "Salon", title: "Refaire le salon", text: "Un tapis, une lampe, un fauteuil chiné : on avance pièce par pièce, sans se ruiner d'un coup.", img: photo(PHOTOS.parisSalon, 1000), href: newHref("Notre salon") },
      { tag: "Offrir", title: "Liste de crémaillère", text: "Partagez la liste : vos proches choisissent ce qu'ils offrent, sans doublon.", img: photo(PHOTOS.nook, 1000), href: newHref("Crémaillère") },
      { tag: "Chambre", title: "Une chambre qui apaise", text: "Tête de lit, linge lavé, lampe de chevet : le refuge se construit à deux.", img: room("chambre").img, href: newHref("Notre chambre") },
      { tag: "Télétravail", title: "Un vrai bureau", text: "Un bureau, une bonne chaise, de la lumière : l'investissement qui change les journées.", img: room("bureau").img, href: newHref("Le bureau") },
      { tag: "Dehors", title: "Balcon & terrasse", text: "Deux chaises, une table, une guirlande : les beaux jours se préparent dès l'hiver.", img: room("exterieur").img, href: newHref("Notre balcon") },
    ] as Story[],
    trendTitle: "Les tendances déco 2026",
    trendText: "Formes arrondies, cannage, lumière en couches : ce qui se porte cette année, avec de vraies pièces à ajouter.",
    trendCta: "Voir les tendances",
    trust: [
      ["Gratuit", "Créer une cagnotte, inviter, partager : rien n'est payant."],
      ["Votre argent reste chez vous", "Rien ne transite par Wishpot. Chacun épargne où il veut, le site suit vos progrès."],
      ["Vos données restent privées", "Seul votre cercle voit votre cagnotte. Nous ne revendons rien."],
    ],
    faqTitle: "Questions fréquentes",
    faq: [
      ["L'argent passe-t-il par le site ?", "Non. Chacun garde son argent : le site sert à se fixer un objectif et à suivre ce que vous avez mis de côté."],
      ["D'où viennent les produits du catalogue ?", "De vraies enseignes (IKEA, Maisons du Monde…). Les prix sont relevés à date et peuvent évoluer ; le lien mène toujours à la fiche du magasin."],
      ["Je peux ajouter un objet qui n'est pas dans le catalogue ?", "Oui : collez le lien de n'importe quelle boutique, ou créez votre propre objet avec un nom et un prix. Une pièce chinée, un artisan, tout y va."],
      ["C'est vraiment gratuit ?", "Oui. Certains liens vers les boutiques sont affiliés : un achat peut nous rémunérer, sans rien vous coûter de plus."],
      ["Mes proches peuvent-ils participer ?", "Oui : activez la liste à partager et envoyez le lien. Ils réservent un objet avec « Je l'offre », sans créer de compte."],
    ],
    finalTitle: "Commencez par une seule pièce.",
    finalCta: "Créer ma cagnotte",
    finalAlt: "ou composer une pièce sans compte",
  },
  en: {
    kicker: "The home-decor pot · Flat & house",
    lines: ["Beautiful homes,", "saved for together."],
    sub: "Pick furniture and decor room by room, decide what each of you sets aside every month: Wishpot tells you when you can treat yourselves.",
    cta1: "Plan a room",
    cta2: "Create my pot",
    scenes: [
      { id: "salon", word: "Living", caption: "The living room" },
      { id: "chambre", word: "Bedroom", caption: "The bedroom" },
    ],
    openTitle: "The whole home, room by room.",
    openText: "500+ pieces from real shops, sorted by room, added to your pot in one tap.",
    openLink: "Browse the catalogue",
    howKicker: "How it works",
    howTitle: "Three steps, that's all.",
    steps: [
      { title: "Create the pot", text: "Name it and say how much each of you saves per month. The arrival date is worked out for you." },
      { title: "Add your wishes", text: "Pick from the catalogue, paste a shop link, or create your own item: a vintage find, a maker, a gift." },
      { title: "Save together", text: "Invite with a link. Everyone logs what they set aside and the gauge moves for all. The money stays in your accounts." },
    ],
    roomsKicker: "The catalogue",
    roomsTitle: "Everything a home needs.",
    roomsSub: "Sofas, lighting, rugs, linen, tableware: every room has its essentials, and Wishpot tells you what's missing.",
    roomsCta: "See the full catalogue",
    storiesKicker: "Made for",
    storiesTitle: "Every project has its pot.",
    storiesCta: "Start",
    stories: [
      { tag: "Moving in", title: "First flat", text: "Bed, sofa, tableware: everything for moving day, spread month by month.", img: photo(PHOTOS.loft, 1000), href: newHref("First flat") },
      { tag: "Living room", title: "Redo the living room", text: "A rug, a lamp, a vintage armchair: one piece at a time.", img: photo(PHOTOS.parisSalon, 1000), href: newHref("Our living room") },
      { tag: "Gifts", title: "Housewarming list", text: "Share the list: loved ones pick what they give, no duplicates.", img: photo(PHOTOS.nook, 1000), href: newHref("Housewarming") },
      { tag: "Bedroom", title: "A calm bedroom", text: "Headboard, washed linen, bedside lamp: a retreat built together.", img: room("chambre").img, href: newHref("Our bedroom") },
      { tag: "Remote work", title: "A real study", text: "A desk, a good chair, good light: the upgrade that changes your days.", img: room("bureau").img, href: newHref("The study") },
      { tag: "Outside", title: "Balcony & terrace", text: "Two chairs, a table, string lights: summer starts in winter.", img: room("exterieur").img, href: newHref("Our balcony") },
    ] as Story[],
    trendTitle: "Decor trends 2026",
    trendText: "Rounded shapes, cane, layered light: what's in this year, with real pieces to add.",
    trendCta: "See the trends",
    trust: [
      ["Free", "Creating a pot, inviting, sharing: nothing to pay."],
      ["Your money stays with you", "Nothing goes through Wishpot. Save wherever you like; the site tracks your progress."],
      ["Your data stays private", "Only your circle sees your pot. We sell nothing."],
    ],
    faqTitle: "Questions",
    faq: [
      ["Does money go through the site?", "No. Everyone keeps their own money: the site is for setting a goal and tracking what you've saved."],
      ["Where do catalogue products come from?", "Real retailers (IKEA, Maisons du Monde…). Prices are collected at a date and may change; the link always goes to the shop's page."],
      ["Can I add something that isn't in the catalogue?", "Yes: paste a link from any shop, or create your own item with a name and price."],
      ["Is it really free?", "Yes. Some shop links are affiliate links, which may pay us at no extra cost to you."],
      ["Can family join in?", "Yes: turn on the shared list and send the link. They reserve an item with “I'll gift it”, no account needed."],
    ],
    finalTitle: "Start with a single room.",
    finalCta: "Create my pot",
    finalAlt: "or plan a room without an account",
  },
};

export default async function Home() {
  const { lang } = await getDict();
  const { supabase, user } = await getUser();
  if (user) redirect("/dashboard");
  const c = COPY[lang];
  const fr = lang === "fr";

  const { data: facets } = await supabase.from("products").select("room").eq("active", true);
  const counts = new Map<string, number>();
  for (const f of facets ?? []) counts.set(f.room, (counts.get(f.room) ?? 0) + 1);
  const totalProducts = facets?.length ?? 0;

  const [s0, s1] = c.scenes;

  return (
    <div className="-mt-24 sm:-mt-28">
      <HeroArch
        kicker={c.kicker}
        lines={c.lines}
        sub={c.sub}
        cta1={c.cta1}
        cta2={c.cta2}
        scenes={[
          { ...s0, img: photo(PHOTOS.parisSalon, 2000), href: "/catalogue?piece=salon" },
          { ...s1, img: room("chambre").img.replace("w=1200", "w=2000"), href: "/catalogue?piece=chambre" },
        ]}
        openTitle={c.openTitle}
        openText={c.openText}
        openLink={c.openLink}
      />

      <HowItWorks kicker={c.howKicker} title={c.howTitle} steps={c.steps} fr={fr} sofaImg={TRENDS[0].products[0].img} />

      <div className="border-t border-line">
        <RoomPlanner lang={lang} />
      </div>

      {/* ---------- Le catalogue, pièce par pièce ---------- */}
      <section className="border-t border-line py-24 sm:py-36">
        <Reveal className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="caps text-muted">
              {c.roomsKicker} · {totalProducts} {fr ? "pièces" : "pieces"}
            </p>
            <h2 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">{c.roomsTitle}</h2>
          </div>
          <p className="max-w-md text-muted md:justify-self-end">{c.roomsSub}</p>
        </Reveal>
        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {CATALOG_ROOMS.map((r) => (
            <li key={r.id}>
              <Link href={`/catalogue?piece=${r.id}`} className="group relative block aspect-[4/5] overflow-hidden bg-night">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-[1400ms] ease-out group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
                  <p className="display text-2xl leading-none sm:text-4xl">{fr ? r.fr : r.en}</p>
                  <p className="caps mt-2 text-white/70">
                    {counts.get(r.id) ?? 0} {fr ? "pièces" : "pieces"} →
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Link href="/catalogue" className="link-caps">
            {c.roomsCta} →
          </Link>
        </div>
      </section>

      {/* ---------- Pensé pour ---------- */}
      <section className="border-t border-line py-24 sm:py-36">
        <Reveal>
          <p className="caps text-muted">{c.storiesKicker}</p>
          <h2 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">{c.storiesTitle}</h2>
        </Reveal>
        <div className="mt-14">
          <StorySlider stories={c.stories} cta={c.storiesCta} />
        </div>
      </section>

      {/* ---------- Tendances ---------- */}
      <section className="relative mx-[calc(50%-50vw)] flex min-h-[70vh] items-end overflow-hidden bg-night">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo(PHOTOS.cognac, 2000)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
        <Reveal className="relative mx-auto w-full max-w-6xl px-6 py-20 text-white sm:px-12">
          <p className="caps text-white/70">Inspiration</p>
          <h2 className="display mt-4 max-w-xl text-5xl leading-[0.95] sm:text-7xl">{c.trendTitle}</h2>
          <p className="mt-5 max-w-md text-white/80">{c.trendText}</p>
          <Link href="/inspiration/maison" className="caps mt-8 inline-flex border-b border-white/60 pb-1 hover:border-white">
            {c.trendCta} →
          </Link>
        </Reveal>
      </section>

      {/* ---------- Confiance ---------- */}
      <section className="mx-[calc(50%-50vw)] border-b border-line bg-white">
        <div className="mx-auto grid max-w-6xl divide-y divide-line px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
          {c.trust.map(([title, text], i) => (
            <div key={title} className="py-10 sm:px-8 sm:py-14 first:sm:pl-0 last:sm:pr-0">
              <p className="caps text-muted">{String(i + 1).padStart(2, "0")}</p>
              <p className="display mt-4 text-3xl leading-tight">{title}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="grid gap-12 py-24 sm:py-36 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <h2 className="display text-5xl leading-[0.95] sm:text-6xl">{c.faqTitle}</h2>
        </Reveal>
        <div className="divide-y divide-line border-y border-line">
          {c.faq.map(([q, a]) => (
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
        <img src={photo(PHOTOS.lamp, 2000)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
        <Reveal className="relative w-full px-6 pb-20 text-center text-white sm:pb-28">
          <h2 className="display mx-auto max-w-4xl text-5xl leading-[0.95] sm:text-8xl">{c.finalTitle}</h2>
          <div className="mt-10 flex flex-col items-center gap-5">
            <Link href="/new" className="btn bg-bone !px-10 !py-4 text-[12px] uppercase tracking-label text-ink hover:bg-white">
              {c.finalCta}
            </Link>
            <a href="#essai" className="caps border-b border-white/50 pb-0.5 text-white/80 hover:text-white">
              {c.finalAlt}
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
