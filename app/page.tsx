import Link from "next/link";
import { redirect } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { PHOTOS, photo } from "@/lib/covers";
import InspirationDoors from "@/components/InspirationDoors";
import Composer from "@/components/Composer";
import IntroCurtain from "@/components/IntroCurtain";
import { HeroDoors, Reveal, StackedPanels } from "@/components/Motion";
import { ScrollWords, StorySlider, type Story } from "@/components/Luxe";

const ROAD = "https://images.unsplash.com/photo-1468818438311-4bab781ab9b8?auto=format&fit=crop&w=1000&q=75";

const newHref = (kind: "home" | "travel", name: string) => `/new?${new URLSearchParams({ kind, name }).toString()}`;

const COPY = {
  fr: {
    doorL: { label: "Maison", title: "Maison", cta: "Meubler un intérieur" },
    doorR: { label: "Voyage", title: "Voyage", cta: "Préparer un départ" },
    hint: "Faites défiler",
    headline: "Le beau se prépare à plusieurs.",
    sub: "Une liste d'envies, un budget par mois, une date d'arrivée. Pour meubler votre intérieur ou partir loin, à deux ou entre amis.",
    cta1: "Essayer sans compte",
    cta2: "Créer ma cagnotte",
    manifestoKicker: "Le principe",
    manifesto:
      "Un canapé repéré un dimanche, une villa au bord de l'eau, un premier appartement. Vous choisissez ce qui vous fait envie, chacun décide ce qu'il met de côté, et la date d'arrivée se rapproche à chaque versement.",
    howKicker: "Comment ça marche",
    howTitle: "Trois gestes, pas un de plus.",
    panels: [
      {
        title: "Rêvez grand. Visez juste.",
        text: "Nommez le projet, fixez ce que chacun met de côté chaque mois. Wishpot calcule la date à laquelle vous y serez.",
        caption: "L'objectif",
      },
      {
        title: "Repérez. Collez. C'est noté.",
        text: "Collez le lien d'un fauteuil ou d'un hôtel : la photo, le nom et le prix s'ajoutent, et la liste prend des airs de moodboard.",
        caption: "La liste",
      },
      {
        title: "Arrivez-y ensemble.",
        text: "Un lien suffit pour inviter votre moitié ou vos amis. Chaque versement fait avancer la jauge, pour tout le monde.",
        caption: "Le cercle",
      },
    ],
    storiesKicker: "Pensé pour",
    storiesTitle: "Chaque projet a sa cagnotte.",
    storiesCta: "Commencer",
    stories: [
      { tag: "Maison", title: "Premier appartement", text: "Le lit, le canapé, la vaisselle : tout ce qu'il faut pour le jour J, réparti mois par mois.", img: photo(PHOTOS.loft, 1000), href: newHref("home", "Premier appartement") },
      { tag: "Voyage", title: "Voyage de noces", text: "La côte amalfitaine ou le Japon, financés à deux sans y penser chaque jour.", img: photo(PHOTOS.positano, 1000), href: newHref("travel", "Voyage de noces") },
      { tag: "Maison", title: "Liste de crémaillère", text: "Partagez la liste : vos proches choisissent ce qu'ils offrent, sans doublon.", img: photo(PHOTOS.nook, 1000), href: newHref("home", "Crémaillère") },
      { tag: "Voyage", title: "Vacances entre amis", text: "Six amis, une maison, chacun sa part. Fini les tableurs et les relances.", img: photo(PHOTOS.terrace, 1000), href: newHref("travel", "Vacances entre amis") },
      { tag: "Maison", title: "Refaire le salon", text: "Un tapis, une lampe, un fauteuil chiné : on avance pièce par pièce.", img: photo(PHOTOS.parisSalon, 1000), href: newHref("home", "Le salon") },
      { tag: "Voyage", title: "Road trip", text: "La voiture, les nuits, l'essence : un budget clair avant de prendre la route.", img: ROAD, href: newHref("travel", "Road trip") },
    ] as Story[],
    trust: [
      ["Gratuit", "Créer une cagnotte, inviter, partager : rien n'est payant."],
      ["Votre argent reste chez vous", "Rien ne transite par Wishpot. Chacun épargne où il veut, le site suit vos progrès."],
      ["Vos données restent privées", "Seul votre cercle voit votre cagnotte. Nous ne revendons rien."],
    ],
    faqTitle: "Questions fréquentes",
    faq: [
      ["L'argent passe-t-il par le site ?", "Non. Chacun garde son argent : le site sert à se fixer un objectif et à suivre ce que vous avez mis de côté."],
      ["C'est vraiment gratuit ?", "Oui. Certains liens vers les boutiques sont affiliés : un achat peut nous rémunérer, sans rien vous coûter de plus."],
      ["Combien de personnes par cagnotte ?", "Autant que vous voulez : un couple, des colocataires, des amis qui partent ensemble."],
      ["Et si le prix d'un objet n'est pas trouvé ?", "Vous le saisissez à la main. Certaines boutiques ne laissent pas lire leurs prix automatiquement."],
      ["Mes proches peuvent-ils participer ?", "Oui : activez la liste à partager et envoyez le lien. Ils réservent un objet avec « Je l'offre », sans créer de compte."],
    ],
    finalTitle: "Commencez par une seule envie.",
    finalCta: "Créer ma cagnotte",
    finalAlt: "ou essayer sans compte",
  },
  en: {
    doorL: { label: "Home", title: "Home", cta: "Furnish a home" },
    doorR: { label: "Travel", title: "Travel", cta: "Plan a trip" },
    hint: "Scroll",
    headline: "Beautiful things, saved for together.",
    sub: "A wish list, a monthly budget, an arrival date. To furnish your home or travel far, as a couple or with friends.",
    cta1: "Try without an account",
    cta2: "Create my pot",
    manifestoKicker: "The idea",
    manifesto:
      "A sofa spotted on a Sunday, a villa by the water, a first flat. You choose what you love, each of you decides what to set aside, and the arrival date gets closer with every deposit.",
    howKicker: "How it works",
    howTitle: "Three steps, no more.",
    panels: [
      { title: "Dream big. Aim true.", text: "Name the plan and set what each of you saves per month. Wishpot works out when you'll get there.", caption: "The goal" },
      { title: "Spot it. Paste it. Done.", text: "Paste the link to an armchair or a hotel: photo, name and price appear, and the list looks like a moodboard.", caption: "The list" },
      { title: "Get there together.", text: "One link invites your partner or friends. Every deposit moves the gauge, for everyone.", caption: "The circle" },
    ],
    storiesKicker: "Made for",
    storiesTitle: "Every project has its pot.",
    storiesCta: "Start",
    stories: [
      { tag: "Home", title: "First flat", text: "Bed, sofa, tableware: everything for moving day, spread month by month.", img: photo(PHOTOS.loft, 1000), href: newHref("home", "First flat") },
      { tag: "Travel", title: "Honeymoon", text: "The Amalfi coast or Japan, funded together without thinking about it.", img: photo(PHOTOS.positano, 1000), href: newHref("travel", "Honeymoon") },
      { tag: "Home", title: "Housewarming list", text: "Share the list: loved ones pick what they give, no duplicates.", img: photo(PHOTOS.nook, 1000), href: newHref("home", "Housewarming") },
      { tag: "Travel", title: "Holidays with friends", text: "Six friends, one house, everyone's share. No more spreadsheets.", img: photo(PHOTOS.terrace, 1000), href: newHref("travel", "Holidays with friends") },
      { tag: "Home", title: "Redo the living room", text: "A rug, a lamp, a vintage armchair: one piece at a time.", img: photo(PHOTOS.parisSalon, 1000), href: newHref("home", "Living room") },
      { tag: "Travel", title: "Road trip", text: "Car, nights, fuel: a clear budget before hitting the road.", img: ROAD, href: newHref("travel", "Road trip") },
    ] as Story[],
    trust: [
      ["Free", "Creating a pot, inviting, sharing: nothing to pay."],
      ["Your money stays with you", "Nothing goes through Wishpot. Save wherever you like; the site tracks your progress."],
      ["Your data stays private", "Only your circle sees your pot. We sell nothing."],
    ],
    faqTitle: "Questions",
    faq: [
      ["Does money go through the site?", "No. Everyone keeps their own money: the site is for setting a goal and tracking what you've saved."],
      ["Is it really free?", "Yes. Some shop links are affiliate links, which may pay us at no extra cost to you."],
      ["How many people per pot?", "As many as you like: a couple, flatmates, friends travelling together."],
      ["What if no price is found?", "Type it in. Some shops don't let their prices be read automatically."],
      ["Can family join in?", "Yes: turn on the shared list and send the link. They reserve an item with “I'll gift it”, no account needed."],
    ],
    finalTitle: "Start with a single wish.",
    finalCta: "Create my pot",
    finalAlt: "or try without an account",
  },
};

export default async function Home() {
  const { lang } = await getDict();
  const { user } = await getUser();
  if (user) redirect("/dashboard");
  const c = COPY[lang];

  const panelImgs = [PHOTOS.positano, PHOTOS.parisSalon, PHOTOS.terrace];

  return (
    <div className="-mt-24 sm:-mt-28">
      <IntroCurtain />

      <HeroDoors
        left={{ href: "/inspiration/maison", img: photo(PHOTOS.leather, 1400), ...c.doorL }}
        right={{ href: "/inspiration/voyage", img: photo(PHOTOS.palmWindow, 1400), ...c.doorR }}
        headline={c.headline}
        sub={c.sub}
        ctaPrimary={{ href: "#essai", label: c.cta1 }}
        ctaSecondary={{ href: "/new", label: c.cta2 }}
        hint={c.hint}
      />

      {/* ---------- Le principe ---------- */}
      <section className="mx-auto max-w-5xl py-28 sm:py-44">
        <p className="caps text-muted">{c.manifestoKicker}</p>
        <ScrollWords text={c.manifesto} className="display mt-8 text-[2rem] leading-[1.15] sm:text-5xl sm:leading-[1.12] lg:text-6xl" />
      </section>

      {/* ---------- Essai interactif ---------- */}
      <div className="border-t border-line">
        <Composer lang={lang} />
      </div>

      {/* ---------- Comment ça marche ---------- */}
      <section className="mx-[calc(50%-50vw)] bg-night px-6 pb-4 pt-24 text-bone sm:px-12 sm:pt-32">
        <Reveal className="mx-auto max-w-6xl">
          <p className="caps text-bone/60">{c.howKicker}</p>
          <h2 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">{c.howTitle}</h2>
        </Reveal>
      </section>
      <StackedPanels
        panels={c.panels.map((p, i) => ({ ...p, img: photo(panelImgs[i], 2000), align: i === 1 ? "right" : "left" }))}
      />

      {/* ---------- Pensé pour ---------- */}
      <section className="py-24 sm:py-36">
        <Reveal className="grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p className="caps text-muted">{c.storiesKicker}</p>
            <h2 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">{c.storiesTitle}</h2>
          </div>
        </Reveal>
        <div className="mt-14">
          <StorySlider stories={c.stories} cta={c.storiesCta} />
        </div>
      </section>

      {/* ---------- Inspiration ---------- */}
      <div className="border-t border-line">
        <InspirationDoors lang={lang} />
      </div>

      {/* ---------- Confiance ---------- */}
      <section className="mx-[calc(50%-50vw)] border-y border-line bg-white">
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
        <img src={photo(PHOTOS.curtain, 2000)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
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
