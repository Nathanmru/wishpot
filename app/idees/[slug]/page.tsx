import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { APP_NAME, siteUrl } from "@/lib/config";
import { GROUPS, LANDINGS, landing } from "@/lib/landings";
import { fetchPieces, pinUrl } from "@/lib/landingPieces";
import ProductGrid from "@/components/ProductGrid";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  return LANDINGS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = landing(slug);
  if (!l) return {};
  const url = `${siteUrl()}/idees/${l.slug}`;
  return {
    title: l.title,
    description: l.description,
    alternates: { canonical: url },
    openGraph: { title: `${l.title} | ${APP_NAME}`, description: l.description, url, type: "article", locale: "fr_FR", siteName: APP_NAME },
  };
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = landing(slug);
  if (!l) notFound();
  const pieces = await fetchPieces(l.filter);
  const related = l.related.map(landing).filter((x): x is NonNullable<typeof x> => !!x);
  const base = siteUrl();
  const prices = pieces.map((p) => p.price);

  return (
    <article className="pt-4">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: APP_NAME, item: base },
              { "@type": "ListItem", position: 2, name: "Idées déco", item: `${base}/idees` },
              { "@type": "ListItem", position: 3, name: l.h1, item: `${base}/idees/${l.slug}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: l.h1,
            description: l.description,
            url: `${base}/idees/${l.slug}`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: pieces.length,
              itemListElement: pieces.slice(0, 20).map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Product",
                  name: p.title,
                  image: p.image_url,
                  brand: { "@type": "Brand", name: p.shop },
                  offers: { "@type": "Offer", price: p.price, priceCurrency: "EUR", url: p.url, availability: "https://schema.org/InStock" },
                },
              })),
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: l.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
          },
        ]}
      />

      <nav aria-label="Fil d'Ariane" className="caps flex flex-wrap gap-2 text-muted">
        <Link href="/" className="hover:text-ink">{APP_NAME}</Link>
        <span>/</span>
        <Link href="/idees" className="hover:text-ink">Idées déco</Link>
        <span>/</span>
        <span className="text-ink">{GROUPS[l.group]}</span>
      </nav>

      <header className="mt-8 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
        <h1 className="display text-5xl leading-[0.95] sm:text-7xl">{l.h1}</h1>
        <div className="space-y-4 text-muted">
          {l.intro.map((p) => (
            <p key={p.slice(0, 20)} className="leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </header>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-line py-5 text-sm">
        <span className="text-muted">
          {pieces.length} pièces sélectionnées
          {prices.length > 0 && ` · de ${Math.round(Math.min(...prices))} € à ${Math.round(Math.max(...prices)).toLocaleString("fr-FR")} €`}
        </span>
        <a href={pinUrl(l)} target="_blank" rel="noopener nofollow" className="link-caps ml-auto">
          Épingler sur Pinterest
        </a>
        <Link href={l.catalogue} className="link-caps">
          {l.group === "projets" ? "Commencer" : "Tout voir dans le catalogue"} →
        </Link>
      </div>

      {pieces.length > 0 && (
        <section className="mt-10">
          <h2 className="sr-only">La sélection</h2>
          <ProductGrid items={pieces} fr />
        </section>
      )}

      <section className="mt-20 grid gap-10 border-t border-line pt-14 md:grid-cols-2">
        <div>
          <h2 className="display text-4xl leading-tight">Nos conseils</h2>
          <ul className="mt-6 space-y-4">
            {l.tips.map((t) => (
              <li key={t} className="flex gap-3 border-l-2 border-walnut pl-4 text-muted">
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted">
            Pas prêt à acheter ? Gardez les pièces avec le cœur, comparez-les côte à côte, ou{" "}
            <Link href="/#cagnotte" className="underline hover:text-ink">créez une cagnotte</Link> pour épargner tranquillement.
          </p>
        </div>
        <div>
          <h2 className="display text-4xl leading-tight">Questions fréquentes</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {l.faq.map(([q, a]) => (
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
      </section>

      {related.length > 0 && (
        <section className="mt-20 border-t border-line pt-14">
          <h2 className="caps text-muted">À voir aussi</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/idees/${r.slug}`} className="group flex h-full items-center justify-between gap-4 bg-white p-5 transition hover:bg-ink hover:text-white">
                  <span className="display text-xl leading-tight">{r.h1.split(" : ")[0]}</span>
                  <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
