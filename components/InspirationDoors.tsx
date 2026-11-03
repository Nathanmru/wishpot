import Link from "next/link";
import { HOME_HERO, NICHE, TRAVEL_HERO, TRENDS } from "@/lib/inspiration";

type Lang = "fr" | "en";

const COPY = {
  fr: {
    kicker: "Le carnet d'inspiration",
    title: "Pas encore d'idée ? Commencez par rêver.",
    sub: "Deux pages mises à jour avec la saison : les tendances déco et de vrais meubles à acheter, des voyages encore préservés et les grands classiques.",
    home: { label: "Maison & déco", title: "Les tendances 2026", cta: "Voir les tendances" },
    travel: { label: "Voyage", title: "Où partir en 2026", cta: "Voir les destinations" },
  },
  en: {
    kicker: "The inspiration book",
    title: "No idea yet? Start by dreaming.",
    sub: "Two seasonal pages: decor trends with real pieces to buy, off-the-beaten-track trips and the great classics.",
    home: { label: "Home & decor", title: "2026 trends", cta: "See the trends" },
    travel: { label: "Travel", title: "Where to go in 2026", cta: "See destinations" },
  },
};

/** Deux grandes portes vers les pages Inspiration (accueil + tableau de bord). */
export default function InspirationDoors({ lang = "fr", compact = false }: { lang?: Lang; compact?: boolean }) {
  const c = COPY[lang];
  const doors = [
    {
      href: "/inspiration/maison",
      img: HOME_HERO,
      ...c.home,
      tags: TRENDS.map((t) => t.title),
    },
    {
      href: "/inspiration/voyage",
      img: TRAVEL_HERO,
      ...c.travel,
      tags: NICHE.slice(0, 4).map((d) => d.name),
    },
  ];

  return (
    <section className={compact ? "mt-20" : "mx-auto max-w-[1300px] py-28 sm:py-36"}>
      <div className={`grid gap-6 md:grid-cols-2 md:items-end ${compact ? "" : "px-1"}`}>
        <div>
          <p className="text-[11px] uppercase tracking-label text-muted">{c.kicker}</p>
          <h2 className={`display mt-4 leading-[0.95] ${compact ? "text-4xl sm:text-5xl" : "text-5xl sm:text-7xl"}`}>{c.title}</h2>
        </div>
        <p className="max-w-md text-muted md:justify-self-end">{c.sub}</p>
      </div>

      <div className={`grid gap-4 md:grid-cols-2 [perspective:1600px] ${compact ? "mt-10" : "mt-14"}`}>
        {doors.map((d, i) => (
          <Link
            key={d.href}
            href={d.href}
            className={`group relative block overflow-hidden bg-night text-white transition duration-700 ease-out [transform-style:preserve-3d] ${
              compact ? "h-[340px]" : "h-[460px] sm:h-[600px]"
            } ${i === 0 ? "md:hover:[transform:rotateY(4deg)]" : "md:hover:[transform:rotateY(-4deg)]"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={d.img}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-[1400ms] ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <p className="text-[11px] uppercase tracking-label text-white/75">{d.label}</p>
              <h3 className={`display mt-3 leading-none ${compact ? "text-4xl" : "text-5xl sm:text-6xl"}`}>{d.title}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {d.tags.map((t) => (
                  <li key={t} className="border border-white/35 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-white/85 backdrop-blur-sm">
                    {t}
                  </li>
                ))}
              </ul>
              <span className="mt-7 inline-flex items-center gap-3 border-b border-white/60 pb-1 text-[11px] uppercase tracking-label transition group-hover:gap-5 group-hover:border-white">
                {d.cta} <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
