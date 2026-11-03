import Link from "next/link";
import { redirect } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";

export default async function Home() {
  const { t } = await getDict();
  const { user } = await getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="space-y-16">
      {/* ---------- Scène d'accueil : intérieur | mur | vue ---------- */}
      <section className="relative left-1/2 -mt-6 w-screen -translate-x-1/2">
        <div className="relative flex h-[calc(100dvh-3.5rem)] min-h-[520px] overflow-hidden bg-[#E7CDB0]">
          <SceneHalf href="/new?kind=home" img={HOME_IMG} emoji="🛋️" title={t.home} desc={t.homeDesc} />
          <div
            aria-hidden
            className="relative z-10 w-4 shrink-0 bg-gradient-to-r from-[#B8977A] via-[#F3E2CC] to-[#B8977A] shadow-[0_0_40px_rgba(0,0,0,0.35)] sm:w-7"
          />
          <SceneHalf href="/new?kind=travel" img={TRAVEL_IMG} emoji="✈️" title={t.travel} desc={t.travelDesc} />

          {/* Titre au centre */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center bg-gradient-to-b from-black/45 via-black/15 to-transparent px-4 pb-24 pt-8 text-center text-white sm:pt-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85 sm:text-xs">{t.tagline}</p>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-[1.05] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-6xl">
              {t.heroTitle}
            </h1>
          </div>
          <p className="absolute bottom-2 right-3 z-20 text-[10px] text-white/70">Photos : Unsplash</p>
        </div>
      </section>

      <section>
        <p className="max-w-2xl text-lg leading-relaxed text-muted">{t.heroText}</p>
        <h2 className="mt-12 font-display text-2xl font-semibold">{t.howTitle}</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            [t.how1, t.how1t],
            [t.how2, t.how2t],
            [t.how3, t.how3t],
          ].map(([title, text], i) => (
            <li key={i} className="card">
              <span className="font-display text-3xl text-terra">{i + 1}</span>
              <h3 className="mt-2 font-semibold">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="card flex flex-col items-start gap-4 bg-ink text-cream sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-2xl">{t.heroTitle}</p>
        <Link href="/new" className="btn bg-cream text-ink hover:bg-white">
          {t.start}
        </Link>
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
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent transition group-hover:from-black/30" />
      <div className="absolute inset-x-0 bottom-8 z-20 flex justify-center px-3 sm:bottom-14">
        <span className="flex max-w-full items-center gap-2 rounded-full bg-white/95 px-4 py-3 text-ink shadow-[0_10px_40px_rgba(0,0,0,0.3)] backdrop-blur transition group-hover:-translate-y-1 group-hover:bg-white sm:gap-3 sm:px-7 sm:py-4">
          <span className="text-xl sm:text-2xl">{emoji}</span>
          <span className="min-w-0 text-left">
            <span className="block whitespace-nowrap text-sm font-semibold sm:text-lg">
              {title} <span className="inline-block transition group-hover:translate-x-1">→</span>
            </span>
            <span className="hidden text-sm text-muted sm:block">{desc}</span>
          </span>
        </span>
      </div>
    </Link>
  );
}

// Photos Unsplash (licence gratuite) — remplace ces adresses pour changer les images
const HOME_IMG = "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1600&q=80";
const TRAVEL_IMG = "https://images.unsplash.com/photo-1562865582-d6317ab58923?auto=format&fit=crop&w=1600&q=80";
