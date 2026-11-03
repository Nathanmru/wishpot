import Link from "next/link";
import { redirect } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { cover } from "@/lib/covers";
import { SHOPS } from "@/lib/suggestions";
import Jar from "@/components/Jar";

const COPY = {
  fr: {
    title: "Mettez de côté à deux, pour le canapé ou pour Kyoto.",
    sub: "Listez ce que vous voulez acheter, fixez combien chacun épargne par mois, et regardez la cagnotte se remplir.",
    homeCta: "Meubler notre chez-nous",
    homeSub: "Meubles, déco, électroménager",
    travelCta: "Préparer un voyage",
    travelSub: "Vols, hébergement, activités",
    howTitle: "Trois étapes, et la cagnotte avance toute seule",
    steps: [
      ["Créez la cagnotte", "Choisissez maison ou voyage, donnez-lui un nom, indiquez ce que vous pouvez mettre de côté chaque mois."],
      ["Collez vos liens", "Un canapé, un vol, un hôtel : le nom, la photo et le prix se remplissent automatiquement."],
      ["Invitez l'autre", "Un lien suffit. Chacun ajoute ses envies et ses versements, vous voyez la même chose en temps réel."],
    ],
    previewTitle: "Vous savez toujours où vous en êtes",
    previewText:
      "La fenêtre se remplit à chaque versement. En dessous, ce qu'il reste à mettre de côté et le mois où vous pourrez tout acheter.",
    previewPoints: ["Budget mensuel de chacun", "Date estimée d'arrivée", "Ce qui est déjà acheté"],
    demo: {
      name: "Japon, printemps 2027",
      saved: "2 480 €",
      goal: "4 000 €",
      eta: "Prêt en juillet 2027",
      items: [
        ["Vols Paris – Tokyo", "2 × 780 €"],
        ["Ryokan à Kyoto, 3 nuits", "640 €"],
        ["JR Pass 7 jours", "2 × 290 €"],
        ["Cours de cuisine à Osaka", "180 €"],
      ],
    },
    worldsTitle: "Deux projets, un même réflexe",
    homeWorld: "Pour l'appartement",
    homeWorldText: "Des idées pièce par pièce et les boutiques où chercher.",
    travelWorld: "Pour le voyage",
    travelWorldText: "Vols, logements et activités, avec un budget réaliste.",
    faqTitle: "Questions fréquentes",
    faq: [
      ["L'argent passe-t-il par le site ?", "Non. Chacun garde son argent de son côté : le site sert à se fixer un objectif et à suivre ce que vous avez mis de côté."],
      ["C'est gratuit ?", "Oui. Certains liens vers les boutiques sont affiliés, ce qui nous rémunère sans rien vous coûter de plus."],
      ["Combien de personnes par cagnotte ?", "Autant que vous voulez : un couple, des colocataires, une bande d'amis qui part ensemble."],
      ["Et si le prix n'est pas trouvé ?", "Vous le tapez à la main. Certains sites bloquent la lecture automatique, le reste fonctionne pareil."],
    ],
    finalTitle: "Votre prochain canapé, ou votre prochain billet, commence ici.",
    finalCta: "Créer une cagnotte",
  },
  en: {
    title: "Save up together, for the sofa or for Kyoto.",
    sub: "List what you want to buy, set how much each of you saves per month, and watch the pot fill up.",
    homeCta: "Furnish our place",
    homeSub: "Furniture, decor, appliances",
    travelCta: "Plan a trip",
    travelSub: "Flights, stays, activities",
    howTitle: "Three steps, then the pot keeps moving",
    steps: [
      ["Create the pot", "Pick home or trip, name it, and say how much you can put aside each month."],
      ["Paste your links", "A sofa, a flight, a hotel: name, photo and price fill in automatically."],
      ["Invite the other", "One link is enough. Everyone adds wishes and deposits, you both see the same thing live."],
    ],
    previewTitle: "You always know where you stand",
    previewText: "The window fills with every deposit. Below it: what's left to save and the month you can buy it all.",
    previewPoints: ["Everyone's monthly budget", "Estimated finish date", "What's already bought"],
    demo: {
      name: "Japan, spring 2027",
      saved: "€2,480",
      goal: "€4,000",
      eta: "Ready by July 2027",
      items: [
        ["Flights Paris – Tokyo", "2 × €780"],
        ["Ryokan in Kyoto, 3 nights", "€640"],
        ["7-day JR Pass", "2 × €290"],
        ["Cooking class in Osaka", "€180"],
      ],
    },
    worldsTitle: "Two kinds of plans, one habit",
    homeWorld: "For the flat",
    homeWorldText: "Room-by-room ideas and the shops worth browsing.",
    travelWorld: "For the trip",
    travelWorldText: "Flights, stays and activities, with a realistic budget.",
    faqTitle: "Questions",
    faq: [
      ["Does money go through the site?", "No. Everyone keeps their own money: the site is for setting a goal and tracking what you've saved."],
      ["Is it free?", "Yes. Some shop links are affiliate links, which pays us at no extra cost to you."],
      ["How many people per pot?", "As many as you like: a couple, flatmates, a group of friends travelling together."],
      ["What if no price is found?", "Type it in. Some sites block automatic reading; everything else works the same."],
    ],
    finalTitle: "Your next sofa, or your next ticket, starts here.",
    finalCta: "Create a pot",
  },
};

export default async function Home() {
  const { lang } = await getDict();
  const { user } = await getUser();
  if (user) redirect("/dashboard");
  const c = COPY[lang];

  return (
    <div>
      {/* ---------- Scène : intérieur | mur | vue ---------- */}
      <section className="relative left-1/2 -mt-8 w-screen -translate-x-1/2">
        <div className="relative flex h-[calc(100dvh-4rem)] min-h-[560px] overflow-hidden bg-walnut-soft">
          <SceneHalf href="/new?kind=home" img={cover("home", 1400)} emoji="🛋️" title={c.homeCta} desc={c.homeSub} />
          <div
            aria-hidden
            className="relative z-10 w-3 shrink-0 bg-gradient-to-r from-[#CDBBA6] via-[#F5ECE0] to-[#CDBBA6] shadow-[0_0_50px_rgba(0,0,0,0.45)] sm:w-6"
          />
          <SceneHalf href="/new?kind=travel" img={cover("travel", 1400)} emoji="✈️" title={c.travelCta} desc={c.travelSub} />

          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/55 via-black/20 to-transparent px-5 pb-32 pt-10 text-center text-white sm:pt-16">
            <h1 className="display mx-auto max-w-4xl text-[2.6rem] leading-[0.98] drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)] sm:text-7xl lg:text-[5.5rem]">
              {c.title}
            </h1>
            <p className="mx-auto mt-5 hidden max-w-xl text-base text-white/85 sm:block sm:text-lg">{c.sub}</p>
          </div>
          <p className="absolute bottom-2 right-3 z-20 text-[10px] text-white/60">Photos Unsplash</p>
        </div>
      </section>

      {/* ---------- Étapes ---------- */}
      <section className="mx-auto max-w-5xl pt-24">
        <h2 className="display max-w-2xl text-4xl leading-tight sm:text-5xl">{c.howTitle}</h2>
        <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {c.steps.map(([title, text], i) => (
            <li key={i} className="border-t border-ink/15 pt-5">
              <span className="display text-5xl text-walnut">{i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Aperçu produit ---------- */}
      <section className="mx-auto mt-28 grid max-w-5xl items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="display text-4xl leading-tight sm:text-5xl">{c.previewTitle}</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{c.previewText}</p>
          <ul className="mt-8 space-y-3">
            {c.previewPoints.map((pt) => (
              <li key={pt} className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-apricot" />
                <span className="font-medium">{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-dusk-soft via-apricot-soft to-walnut-soft" />
          <div className="overflow-hidden rounded-xl3 border border-line bg-white shadow-lift">
            <div className="relative h-28">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover("travel", 900)} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="display absolute bottom-3 left-5 text-2xl text-white">{c.demo.name}</p>
            </div>
            <div className="grid grid-cols-[96px_1fr] gap-5 p-5">
              <Jar progress={0.62} kind="travel" className="h-40 w-24" />
              <div>
                <p className="display text-4xl">{c.demo.saved}</p>
                <p className="text-sm text-muted">/ {c.demo.goal}</p>
                <p className="mt-3 inline-flex rounded-full bg-moss-soft px-3 py-1 text-xs font-semibold text-moss">{c.demo.eta}</p>
                <div className="mt-4 flex -space-x-2">
                  {["L", "N"].map((x, i) => (
                    <span
                      key={x}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold ${
                        i ? "bg-apricot-soft text-walnut" : "bg-dusk-soft text-dusk"
                      }`}
                    >
                      {x}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <ul className="divide-y divide-line border-t border-line px-5 text-sm">
              {c.demo.items.map(([name, price], i) => (
                <li key={name} className={`flex justify-between py-3 ${i === 0 ? "text-muted line-through" : ""}`}>
                  <span>{name}</span>
                  <span className="font-semibold">{price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Deux mondes ---------- */}
      <section className="mx-auto mt-32 max-w-5xl">
        <h2 className="display text-4xl leading-tight sm:text-5xl">{c.worldsTitle}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <World href="/new?kind=home" img={cover("home", 1000)} title={c.homeWorld} text={c.homeWorldText} shops={SHOPS.home.slice(0, 5).map((s) => s.name)} />
          <World href="/new?kind=travel" img={cover("travel", 1000)} title={c.travelWorld} text={c.travelWorldText} shops={SHOPS.travel.slice(0, 5).map((s) => s.name)} />
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="mx-auto mt-32 grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.4fr]">
        <h2 className="display text-4xl leading-tight sm:text-5xl">{c.faqTitle}</h2>
        <div className="divide-y divide-line border-y border-line">
          {c.faq.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                {q}
                <span className="text-2xl font-light text-muted transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-xl leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- Appel final ---------- */}
      <section className="mx-auto mt-32 max-w-5xl overflow-hidden rounded-xl3 bg-dusk text-white">
        <div className="grid items-center gap-8 p-8 sm:p-14 md:grid-cols-[1fr_auto]">
          <p className="display text-4xl leading-tight sm:text-5xl">{c.finalTitle}</p>
          <Link href="/new" className="btn bg-apricot !px-7 !py-3.5 text-base text-ink hover:bg-white">
            {c.finalCta}
          </Link>
        </div>
      </section>
    </div>
  );
}

function SceneHalf({ href, img, emoji, title, desc }: { href: string; img: string; emoji: string; title: string; desc: string }) {
  return (
    <Link href={href} className="group relative block min-w-0 flex-1 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent transition duration-500 group-hover:from-black/35" />
      <div className="absolute inset-x-0 bottom-8 z-20 flex justify-center px-3 sm:bottom-14">
        <span className="flex max-w-full items-center gap-3 rounded-full bg-white/95 py-2.5 pl-2.5 pr-5 text-ink shadow-lift backdrop-blur transition duration-300 group-hover:-translate-y-1 group-hover:bg-white sm:py-3 sm:pl-3 sm:pr-7">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper text-lg sm:h-11 sm:w-11 sm:text-xl">{emoji}</span>
          <span className="min-w-0 text-left">
            <span className="block truncate text-sm font-bold sm:text-base">{title}</span>
            <span className="hidden text-sm text-muted sm:block">{desc}</span>
          </span>
        </span>
      </div>
    </Link>
  );
}

function World({ href, img, title, text, shops }: { href: string; img: string; title: string; text: string; shops: string[] }) {
  return (
    <Link href={href} className="group overflow-hidden rounded-xl3 border border-line bg-white shadow-soft transition hover:shadow-lift">
      <div className="h-56 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="p-6">
        <h3 className="display text-3xl">{title}</h3>
        <p className="mt-2 text-muted">{text}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {shops.map((s) => (
            <span key={s} className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted">
              {s}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
