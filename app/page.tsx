import Link from "next/link";
import { redirect } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { PHOTOS, photo } from "@/lib/covers";
import Jar from "@/components/Jar";
import InspirationDoors from "@/components/InspirationDoors";
import { Coverflow, HeroDoors, Reveal, StackedPanels } from "@/components/Motion";

const COPY = {
  fr: {
    doorL: { label: "Collection maison", title: "Maison", cta: "Meubler notre intérieur" },
    doorR: { label: "Collection voyage", title: "Voyage", cta: "Préparer un départ" },
    hint: "Faites défiler pour ouvrir",
    headline: "Ce que vous rêvez d'avoir, mis de côté ensemble.",
    sub: "Une cagnotte à plusieurs pour meubler un appartement ou partir loin, avec un budget mensuel et une date d'arrivée.",
    cta1: "Créer une cagnotte",
    cta2: "Se connecter",
    panels: [
      {
        title: "Fixez le cap.",
        text: "Un voyage au Japon, un premier appartement. Donnez un nom au projet et décidez de ce que chacun met de côté chaque mois.",
        caption: "Budget mensuel par personne",
      },
      {
        title: "Collez un lien.",
        text: "Le canapé repéré chez Maisons du Monde, l'hôtel trouvé sur Booking. La photo, le nom et le prix s'ajoutent tout seuls.",
        caption: "Ajout automatique depuis n'importe quelle boutique",
      },
      {
        title: "Avancez à deux.",
        text: "Chaque versement remplit la cagnotte. Vous voyez ce qu'il reste et le mois où tout sera prêt.",
        caption: "Invitation par simple lien",
      },
    ],
    listTitle: "Une liste, deux envies.",
    listSub: "Exemple de cagnotte partagée : ce qui est repéré, où, et pour combien.",
    tagHome: "Maison",
    tagTravel: "Voyage",
    products: [
      ["Canapé trois places, cuir cognac", "1 290 €", "Maisons du Monde", "cognac", "home"],
      ["Lampe à poser en laiton", "189 €", "La Redoute Intérieurs", "lamp", "home"],
      ["Chambre face à la mer, 3 nuits", "540 €", "Booking.com", "seaWindow", "travel"],
      ["Banquette sous fenêtre", "420 €", "Westwing", "nook", "home"],
      ["Riad à Marrakech, 4 nuits", "520 €", "Airbnb", "palms", "travel"],
      ["Fauteuil club, cuir bleu nuit", "890 €", "Made in Design", "blueSofa", "home"],
      ["Coucher de soleil en voilier", "2 × 85 €", "GetYourGuide", "seaSunset", "travel"],
    ],
    jarTitle: "La fenêtre se remplit.",
    jarText: "Chaque cagnotte a sa jauge : une fenêtre qui se remplit à chaque versement. À côté, ce qu'il reste à épargner et la date estimée.",
    jarStats: [
      ["2 480 €", "épargnés"],
      ["1 520 €", "restants"],
      ["Juillet 2027", "arrivée estimée"],
    ],
    faqTitle: "Questions",
    faq: [
      ["L'argent passe-t-il par le site ?", "Non. Chacun garde son argent : le site sert à se fixer un objectif et à suivre ce que vous avez mis de côté."],
      ["C'est gratuit ?", "Oui. Certains liens vers les boutiques sont affiliés, ce qui nous rémunère sans rien vous coûter de plus."],
      ["Combien de personnes par cagnotte ?", "Autant que vous voulez : un couple, des colocataires, des amis qui partent ensemble."],
      ["Et si le prix n'est pas trouvé ?", "Vous le saisissez à la main. Certains sites bloquent la lecture automatique."],
    ],
    finalTitle: "Commencez par un seul objet.",
    finalCta: "Créer une cagnotte",
  },
  en: {
    doorL: { label: "Home collection", title: "Home", cta: "Furnish our place" },
    doorR: { label: "Travel collection", title: "Travel", cta: "Plan a trip" },
    hint: "Scroll to open",
    headline: "What you dream of having, saved up together.",
    sub: "A shared pot to furnish a flat or travel far, with a monthly budget and an arrival date.",
    cta1: "Create a pot",
    cta2: "Log in",
    panels: [
      {
        title: "Set the course.",
        text: "A trip to Japan, a first flat. Name the plan and decide what each of you puts aside every month.",
        caption: "Monthly budget per person",
      },
      {
        title: "Paste a link.",
        text: "The sofa you spotted, the hotel you found. Photo, name and price fill in by themselves.",
        caption: "Works with almost any shop",
      },
      {
        title: "Move forward together.",
        text: "Every deposit fills the pot. You see what's left and the month everything will be ready.",
        caption: "Invite with a single link",
      },
    ],
    listTitle: "One list, two wishes.",
    listSub: "An example shared pot: what was spotted, where, and for how much.",
    tagHome: "Home",
    tagTravel: "Travel",
    products: [
      ["Three-seat sofa, cognac leather", "€1,290", "Maisons du Monde", "cognac", "home"],
      ["Brass table lamp", "€189", "La Redoute Intérieurs", "lamp", "home"],
      ["Sea-view room, 3 nights", "€540", "Booking.com", "seaWindow", "travel"],
      ["Window bench", "€420", "Westwing", "nook", "home"],
      ["Riad in Marrakech, 4 nights", "€520", "Airbnb", "palms", "travel"],
      ["Club armchair, midnight leather", "€890", "Made in Design", "blueSofa", "home"],
      ["Sunset sailing trip", "2 × €85", "GetYourGuide", "seaSunset", "travel"],
    ],
    jarTitle: "The window fills up.",
    jarText: "Every pot has its gauge: a window that fills with each deposit. Beside it, what's left to save and the estimated date.",
    jarStats: [
      ["€2,480", "saved"],
      ["€1,520", "left"],
      ["July 2027", "estimated"],
    ],
    faqTitle: "Questions",
    faq: [
      ["Does money go through the site?", "No. Everyone keeps their own money: the site is for setting a goal and tracking what you've saved."],
      ["Is it free?", "Yes. Some shop links are affiliate links, which pays us at no extra cost to you."],
      ["How many people per pot?", "As many as you like: a couple, flatmates, friends travelling together."],
      ["What if no price is found?", "Type it in. Some sites block automatic reading."],
    ],
    finalTitle: "Start with a single item.",
    finalCta: "Create a pot",
  },
};

export default async function Home() {
  const { lang } = await getDict();
  const { user } = await getUser();
  if (user) redirect("/dashboard");
  const c = COPY[lang];

  const panelImgs = [PHOTOS.seaWindow, PHOTOS.loft, PHOTOS.seaSunset];

  return (
    <div className="-mt-24 sm:-mt-28">
      <HeroDoors
        left={{ href: "/new?kind=home", img: photo(PHOTOS.leather, 1400), ...c.doorL }}
        right={{ href: "/new?kind=travel", img: photo(PHOTOS.palmWindow, 1400), ...c.doorR }}
        headline={c.headline}
        sub={c.sub}
        ctaPrimary={{ href: "/new", label: c.cta1 }}
        ctaSecondary={{ href: "/login", label: c.cta2 }}
        hint={c.hint}
      />

      <StackedPanels
        panels={c.panels.map((p, i) => ({ ...p, img: photo(panelImgs[i], 2000), align: i === 1 ? "right" : "left" }))}
      />

      <Coverflow
        title={c.listTitle}
        sub={c.listSub}
        items={c.products.map(([name, price, shop, key, kind]) => ({
          name,
          price,
          shop,
          img: photo(PHOTOS[key as keyof typeof PHOTOS], 900),
          tag: kind === "home" ? c.tagHome : c.tagTravel,
        }))}
      />

      <InspirationDoors lang={lang} />

      {/* ---------- La jauge ---------- */}
      <section className="mx-[calc(50%-50vw)] bg-night px-6 py-28 text-bone sm:px-12 sm:py-40">
        <div className="mx-auto grid max-w-[1200px] items-center gap-16 md:grid-cols-[1fr_1.1fr]">
          <Reveal className="flex justify-center">
            <div className="relative">
              <div aria-hidden className="absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(217,144,94,0.35),transparent_65%)] blur-2xl" />
              <Jar progress={0.62} kind="travel" className="relative h-[380px] w-[228px] sm:h-[460px] sm:w-[276px]" />
            </div>
          </Reveal>
          <Reveal>
            <h2 className="display text-5xl leading-[0.95] sm:text-7xl">{c.jarTitle}</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-bone/70">{c.jarText}</p>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-bone/15 pt-8">
              {c.jarStats.map(([v, l]) => (
                <div key={l}>
                  <dt className="display text-2xl sm:text-4xl">{v}</dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-label text-bone/50">{l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="mx-auto grid max-w-[1200px] gap-12 px-1 py-28 sm:py-36 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <h2 className="display text-5xl sm:text-7xl">{c.faqTitle}</h2>
        </Reveal>
        <Reveal className="divide-y divide-line border-y border-line">
          {c.faq.map(([q, a]) => (
            <details key={q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[13px] uppercase tracking-[0.12em]">
                {q}
                <span className="text-xl font-light transition duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-xl leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </Reveal>
      </section>

      {/* ---------- Final ---------- */}
      <section className="relative mx-[calc(50%-50vw)] -mb-20 flex h-[90vh] items-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo(PHOTOS.curtain, 2000)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <Reveal className="relative w-full px-6 pb-20 text-center text-white sm:pb-28">
          <h2 className="display mx-auto max-w-4xl text-5xl leading-[0.95] sm:text-8xl">{c.finalTitle}</h2>
          <Link href="/new" className="btn mt-10 bg-bone !px-9 !py-4 text-[12px] uppercase tracking-label text-ink hover:bg-white">
            {c.finalCta}
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
