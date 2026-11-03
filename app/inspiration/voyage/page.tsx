import Link from "next/link";
import { CLASSICS, NICHE, TRAVEL_HERO, activitiesUrl, bookingUrl, type Destination } from "@/lib/inspiration";
import { BudgetDots, MONTHS, addUrl, goUrl } from "@/components/InspirationBits";
import { Reveal } from "@/components/Motion";

export const metadata = {
  title: "Où partir en 2026",
  description: "Des destinations peu fréquentées et les incontournables, avec la meilleure saison, le temps de vol depuis Paris et les liens pour réserver.",
};

export default function VoyageInspiration() {
  const all = [...NICHE, ...CLASSICS];

  return (
    <div className="-mt-24 sm:-mt-28">
      {/* ---------- Ouverture ---------- */}
      <section className="relative mx-[calc(50%-50vw)] flex h-[92vh] min-h-[560px] items-end overflow-hidden bg-night">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={TRAVEL_HERO} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-16 text-white sm:px-12 sm:pb-24">
          <p className="text-[11px] uppercase tracking-label text-white/75">Inspiration voyage · 2026</p>
          <h1 className="display mt-5 max-w-4xl text-5xl leading-[0.98] sm:text-7xl lg:text-8xl">Où partir quand tout le monde va ailleurs.</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Huit destinations encore préservées et six incontournables, avec la bonne saison, le temps de trajet depuis Paris et un ordre d&apos;idée du budget.
          </p>
          <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[11px] uppercase tracking-label">
            <a href="#secrets" className="border-b border-white/50 pb-1 hover:border-white">Hors des sentiers battus</a>
            <a href="#incontournables" className="border-b border-white/50 pb-1 hover:border-white">Les incontournables</a>
            <a href="#calendrier" className="border-b border-white/50 pb-1 hover:border-white">Quand partir</a>
          </nav>
        </div>
      </section>

      {/* ---------- Hors des sentiers battus ---------- */}
      <section id="secrets" className="scroll-mt-24 py-24 sm:py-32">
        <Reveal className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-[1fr_1fr] md:items-end">
          <h2 className="display text-5xl leading-[0.95] sm:text-7xl">Hors des sentiers battus</h2>
          <p className="max-w-md text-muted">
            Des endroits que les guides commencent à peine à citer. Moins de monde, souvent moins cher, et des souvenirs que personne d&apos;autre n&apos;a.
          </p>
        </Reveal>

        <div className="mx-auto mt-20 max-w-[1200px] space-y-24 sm:space-y-32">
          {NICHE.map((d, i) => (
            <Feature key={d.id} d={d} flip={i % 2 === 1} index={i + 1} />
          ))}
        </div>
      </section>

      {/* ---------- Incontournables ---------- */}
      <section id="incontournables" className="mx-[calc(50%-50vw)] scroll-mt-20 bg-night px-6 py-24 text-bone sm:px-12 sm:py-32">
        <div className="mx-auto max-w-[1400px]">
          <Reveal className="grid gap-6 md:grid-cols-2 md:items-end">
            <h2 className="display text-5xl leading-[0.95] sm:text-7xl">Les incontournables</h2>
            <p className="max-w-md text-bone/65">Les classiques qu&apos;on ne regrette jamais, avec la bonne période pour éviter la foule.</p>
          </Reveal>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CLASSICS.map((d) => (
              <Reveal key={d.id}>
                <ClassicCard d={d} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Calendrier ---------- */}
      <section id="calendrier" className="scroll-mt-24 py-24 sm:py-32">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <h2 className="display text-5xl leading-[0.95] sm:text-7xl">Quand partir, mois par mois</h2>
            <p className="mt-4 max-w-md text-muted">Les meilleures périodes de chaque destination de cette page.</p>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
            {MONTHS.map((m, i) => {
              const here = all.filter((d) => d.months.includes(i + 1));
              return (
                <div key={m} className="bg-paper p-5">
                  <p className="text-[11px] uppercase tracking-label text-muted">{m}</p>
                  <ul className="mt-3 space-y-1.5">
                    {here.map((d) => (
                      <li key={d.id}>
                        <a href={`#${d.id}`} className="font-display text-lg leading-tight hover:text-walnut">
                          {d.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-[calc(50%-50vw)] -mb-20 bg-dusk px-6 py-24 text-center text-bone sm:py-32">
        <Reveal>
          <h2 className="display mx-auto max-w-3xl text-5xl leading-[0.95] sm:text-7xl">Choisissez la destination, on s&apos;occupe du compte à rebours.</h2>
          <Link href="/new?kind=travel" className="btn mt-10 bg-bone !px-9 !py-4 text-[12px] uppercase tracking-label text-ink hover:bg-white">
            Créer ma cagnotte voyage
          </Link>
          <p className="mx-auto mt-8 max-w-lg text-xs text-bone/50">
            Temps de vol et budgets donnés à titre indicatif depuis Paris. Certains liens sont affiliés, sans surcoût pour vous. Photos Unsplash.
          </p>
        </Reveal>
      </section>
    </div>
  );
}

function Facts({ d, dark = false }: { d: Destination; dark?: boolean }) {
  const label = `text-[10px] uppercase tracking-label ${dark ? "text-bone/50" : "text-muted"}`;
  return (
    <dl className={`grid grid-cols-3 gap-4 border-t pt-5 text-sm ${dark ? "border-bone/15" : "border-line"}`}>
      <div>
        <dt className={label}>Quand</dt>
        <dd className="mt-1">{[...d.months].sort((a, b) => a - b).map((m) => MONTHS[m - 1]).join(", ")}</dd>
      </div>
      <div>
        <dt className={label}>Trajet</dt>
        <dd className="mt-1">{d.flight}</dd>
      </div>
      <div>
        <dt className={label}>Budget</dt>
        <dd className="mt-1">
          <BudgetDots level={d.budget} />
        </dd>
      </div>
    </dl>
  );
}

function Links({ d, dark = false }: { d: Destination; dark?: boolean }) {
  const line = dark ? "border-bone" : "border-ink";
  return (
    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-[11px] uppercase tracking-label">
      <a href={goUrl(bookingUrl(d.search))} target="_blank" rel="noopener sponsored" className={`border-b ${line} pb-0.5 hover:opacity-60`}>
        Hébergements ↗
      </a>
      <a href={goUrl(activitiesUrl(d.search))} target="_blank" rel="noopener sponsored" className={`border-b ${line} pb-0.5 hover:opacity-60`}>
        Activités ↗
      </a>
      <a href={addUrl({ name: `Voyage : ${d.name}` }, "travel")} className="border-b border-transparent pb-0.5 opacity-60 hover:opacity-100">
        + Ma cagnotte
      </a>
    </div>
  );
}

function Feature({ d, flip, index }: { d: Destination; flip: boolean; index: number }) {
  return (
    <article id={d.id} className="grid scroll-mt-28 items-center gap-10 md:grid-cols-2 md:gap-16">
      <Reveal className={flip ? "md:order-2" : ""}>
        <div className="group relative aspect-[4/5] overflow-hidden bg-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={d.img} alt={`${d.name}, ${d.country}`} loading="lazy" className="h-full w-full object-cover transition duration-[1400ms] group-hover:scale-105" />
          {d.insteadOf && (
            <span className="absolute bottom-4 left-4 bg-paper/90 px-3 py-1.5 text-[10px] uppercase tracking-label text-ink">
              Plutôt que {d.insteadOf}
            </span>
          )}
        </div>
      </Reveal>
      <Reveal>
        <p className="text-[11px] uppercase tracking-label text-muted">
          {String(index).padStart(2, "0")} · {d.country}
        </p>
        <h3 className="display mt-3 text-5xl leading-none sm:text-6xl">{d.name}</h3>
        <p className="mt-6 max-w-md text-lg leading-relaxed">{d.pitch}</p>
        <div className="mt-8 max-w-md">
          <Facts d={d} />
          <Links d={d} />
        </div>
      </Reveal>
    </article>
  );
}

function ClassicCard({ d }: { d: Destination }) {
  return (
    <article id={d.id} className="group relative min-h-[520px] scroll-mt-28 overflow-hidden bg-black lg:aspect-[3/4] lg:min-h-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={d.img}
        alt={`${d.name}, ${d.country}`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-[1400ms] group-hover:scale-105 group-hover:opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <p className="text-[10px] uppercase tracking-label text-bone/70">{d.country}</p>
        <h3 className="display mt-2 text-4xl leading-none sm:text-5xl">{d.name}</h3>
        <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] lg:group-focus-within:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="mt-4 text-sm leading-relaxed text-bone/80">{d.pitch}</p>
            <div className="mt-5">
              <Facts d={d} dark />
              <Links d={d} dark />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
