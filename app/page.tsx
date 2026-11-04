import Link from "next/link";
import { redirect } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { PHOTOS, photo } from "@/lib/covers";
import InspirationDoors from "@/components/InspirationDoors";
import Composer from "@/components/Composer";
import HeroArch from "@/components/HeroArch";
import HowItWorks from "@/components/HowItWorks";
import { Reveal } from "@/components/Motion";
import { StorySlider, type Story } from "@/components/Luxe";
import { TRENDS } from "@/lib/inspiration";

const ROAD = "https://images.unsplash.com/photo-1468818438311-4bab781ab9b8?auto=format&fit=crop&w=1000&q=75";

const newHref = (kind: "home" | "travel", name: string) => `/new?${new URLSearchParams({ kind, name }).toString()}`;

const COPY = {
  fr: {
    kicker: "Cagnottes partagées · Maison & voyage",
    lines: ["Le beau se prépare", "à plusieurs."],
    sub: "Listez vos envies, décidez ce que chacun met de côté chaque mois : Wishpot vous dit quand vous pourrez vous les offrir.",
    cta1: "Faire l'essai sans compte",
    cta2: "Créer ma cagnotte",
    sceneHome: { word: "Maison", caption: "Maison & déco" },
    sceneTravel: { word: "Voyage", caption: "Voyages" },
    openTitle: "Un intérieur ou un ailleurs.",
    openText: "Une cagnotte pour l'un ou pour l'autre, à deux, en famille ou entre amis.",
    openLink: "Voir les inspirations",
    howKicker: "Comment ça marche",
    howTitle: "Trois étapes, c'est tout.",
    steps: [
      { title: "Créez la cagnotte", text: "Donnez-lui un nom et dites combien chacun met de côté chaque mois. La date d'arrivée se calcule toute seule." },
      { title: "Ajoutez vos envies", text: "Collez le lien d'un canapé ou d'un hôtel : la photo, le nom et le prix s'ajoutent. Ou piochez dans nos idées." },
      { title: "Épargnez ensemble", text: "Invitez avec un lien. Chacun indique ce qu'il a mis de côté et la jauge avance pour tout le monde. L'argent reste sur vos comptes." },
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
    finalAlt: "ou faire l'essai sans compte",
  },
  en: {
    kicker: "Shared pots · Home & travel",
    lines: ["Beautiful things,", "saved for together."],
    sub: "List what you love, decide what each of you sets aside every month: Wishpot tells you when you can treat yourselves.",
    cta1: "Try it without an account",
    cta2: "Create my pot",
    sceneHome: { word: "Home", caption: "Home & decor" },
    sceneTravel: { word: "Travel", caption: "Travel" },
    openTitle: "A home, or somewhere else.",
    openText: "One pot for either, as a couple, a family or friends.",
    openLink: "See the inspiration",
    howKicker: "How it works",
    howTitle: "Three steps, that's all.",
    steps: [
      { title: "Create the pot", text: "Name it and say how much each of you saves per month. The arrival date is worked out for you." },
      { title: "Add your wishes", text: "Paste the link to a sofa or a hotel: photo, name and price appear. Or pick from our ideas." },
      { title: "Save together", text: "Invite with a link. Everyone logs what they set aside and the gauge moves for all. The money stays in your accounts." },
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

  return (
    <div className="-mt-24 sm:-mt-28">
      <HeroArch
        kicker={c.kicker}
        lines={c.lines}
        sub={c.sub}
        cta1={c.cta1}
        cta2={c.cta2}
        scenes={{
          home: { img: photo(PHOTOS.parisSalon, 2000), href: "/inspiration/maison", ...c.sceneHome },
          travel: { img: photo(PHOTOS.positano, 2000), href: "/inspiration/voyage", ...c.sceneTravel },
        }}
        openTitle={c.openTitle}
        openText={c.openText}
        openLink={c.openLink}
      />

      <HowItWorks kicker={c.howKicker} title={c.howTitle} steps={c.steps} fr={lang === "fr"} sofaImg={TRENDS[0].products[0].img} />

      <div className="border-t border-line">
        <Composer lang={lang} />
      </div>

      {/* ---------- Pensé pour ---------- */}
      <section className="border-t border-line py-24 sm:py-36">
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
