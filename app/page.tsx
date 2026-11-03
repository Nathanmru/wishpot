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
      <section className="pt-6 sm:pt-12">
        <p className="eyebrow">{t.tagline}</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          {t.heroTitle}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{t.heroText}</p>

        <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
          <KindCard href="/new?kind=travel" emoji="✈️" title={t.travel} desc={t.travelDesc} tone="sea" />
          <KindCard href="/new?kind=home" emoji="🛋️" title={t.home} desc={t.homeDesc} tone="terra" />
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold">{t.howTitle}</h2>
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

function KindCard({
  href,
  emoji,
  title,
  desc,
  tone,
}: {
  href: string;
  emoji: string;
  title: string;
  desc: string;
  tone: "sea" | "terra";
}) {
  const bg = tone === "sea" ? "bg-sea-soft hover:border-sea" : "bg-terra-soft hover:border-terra";
  return (
    <Link href={href} className={`group rounded-xl2 border border-transparent p-5 transition ${bg}`}>
      <span className="text-3xl">{emoji}</span>
      <p className="mt-3 text-lg font-semibold">
        {title} <span className="inline-block transition group-hover:translate-x-1">→</span>
      </p>
      <p className="text-sm text-muted">{desc}</p>
    </Link>
  );
}
