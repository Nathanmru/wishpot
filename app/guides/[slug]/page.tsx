import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { APP_NAME, siteUrl } from "@/lib/config";
import { GUIDES, guide } from "@/lib/guides";
import { fetchPieces } from "@/lib/landingPieces";
import ProductGrid from "@/components/ProductGrid";
import JsonLd from "@/components/JsonLd";

/** Un guide : article de fond qui répond à une question précise, illustré par des pièces du catalogue. */
export const revalidate = 3600;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = guide((await params).slug);
  if (!g) return {};
  const url = `${siteUrl()}/guides/${g.slug}`;
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: url },
    openGraph: { title: `${g.title} | ${APP_NAME}`, description: g.description, url, type: "article", locale: "fr_FR", siteName: APP_NAME },
  };
}

const anchor = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const g = guide((await params).slug);
  if (!g) notFound();
  const pieces = (await fetchPieces(g.filter).catch(() => [])).slice(0, 12);
  const base = siteUrl();
  const url = `${base}/guides/${g.slug}`;
  const others = GUIDES.filter((x) => x.slug !== g.slug).slice(0, 3);

  return (
    <article className="pt-4">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: APP_NAME, item: base },
              { "@type": "ListItem", position: 2, name: "Guides", item: `${base}/guides` },
              { "@type": "ListItem", position: 3, name: g.h1, item: url },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: g.title,
            description: g.description,
            url,
            mainEntityOfPage: url,
            inLanguage: "fr-FR",
            datePublished: "2026-11-08",
            dateModified: "2026-11-08",
            author: { "@type": "Organization", name: APP_NAME, url: base },
            publisher: { "@type": "Organization", name: APP_NAME, url: base },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: g.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
          },
        ]}
      />

      <nav aria-label="Fil d'Ariane" className="caps flex flex-wrap gap-2 text-muted">
        <Link href="/" className="hover:text-ink">{APP_NAME}</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-ink">Guides</Link>
        <span>/</span>
        <span className="text-ink">{g.kicker}</span>
      </nav>

      <header className="mt-8 max-w-4xl">
        <p className="caps text-muted">
          {g.kicker} · {g.minutes} min de lecture
        </p>
        <h1 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">{g.h1}</h1>
        <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted">
          {g.intro.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </header>

      <div className="mt-14 grid gap-12 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="caps text-muted">Sommaire</p>
            <ol className="mt-4 space-y-3 text-sm">
              {g.sections.map((s) => (
                <li key={s.h}>
                  <a href={`#${anchor(s.h)}`} className="text-muted hover:text-ink">
                    {s.h.replace(/^\d+\.\s*/, "")}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <div className="max-w-3xl space-y-12">
          {g.sections.map((s) => (
            <section key={s.h} id={anchor(s.h)} className="scroll-mt-24">
              <h2 className="display text-3xl leading-tight sm:text-4xl">{s.h}</h2>
              {s.p.map((p) => (
                <p key={p.slice(0, 24)} className="mt-4 leading-relaxed text-muted">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="mt-5 space-y-3">
                  {s.list.map((t) => (
                    <li key={t.slice(0, 24)} className="border-l-2 border-walnut pl-4 leading-relaxed text-muted">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <aside className="bg-white p-6 sm:p-8">
            <p className="caps text-muted">Pas prêt à acheter ?</p>
            <p className="mt-3 leading-relaxed">
              Gardez les pièces qui vous plaisent, comparez-les côte à côte, ou{" "}
              <Link href="/#cagnotte" className="underline hover:text-walnut">créez une cagnotte</Link> pour les financer à votre rythme.
            </p>
          </aside>
        </div>
      </div>

      {pieces.length > 0 && (
        <section className="mt-20 border-t border-line pt-14">
          <h2 className="display text-4xl leading-tight">{g.piecesTitle}</h2>
          <div className="mt-8">
            <ProductGrid items={pieces} fr />
          </div>
        </section>
      )}

      <section className="mt-20 grid gap-10 border-t border-line pt-14 md:grid-cols-2">
        <div>
          <h2 className="display text-4xl leading-tight">Questions fréquentes</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {g.faq.map(([q, a]) => (
              <details key={q} className="group py-5" open>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-lg">{q}</h3>
                  <span className="text-2xl font-light transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
        <div>
          <h2 className="display text-4xl leading-tight">Pour aller plus loin</h2>
          <ul className="mt-6 grid gap-3">
            {g.related.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="flex items-center justify-between gap-4 bg-white p-5 transition hover:bg-ink hover:text-white">
                  <span className="display text-xl leading-tight">{r.label}</span>
                  <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-20 border-t border-line pt-14">
        <h2 className="caps text-muted">Les autres guides</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/guides/${o.slug}`} className="flex h-full flex-col justify-between gap-4 bg-white p-6 transition hover:bg-ink hover:text-white">
                <span className="caps text-[10px] opacity-60">{o.kicker}</span>
                <span className="display text-2xl leading-tight">{o.h1}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
