import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { APP_NAME, siteUrl } from "@/lib/config";
import { BRANDS, brand } from "@/lib/brands";
import { fetchPieces } from "@/lib/landingPieces";
import ProductGrid from "@/components/ProductGrid";
import JsonLd from "@/components/JsonLd";

/** Page d'une maison du catalogue : qui elle est, et notre sélection de ses pièces. */
export const revalidate = 3600;

export function generateStaticParams() {
  return BRANDS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const b = brand((await params).slug);
  if (!b) return {};
  const url = `${siteUrl()}/marques/${b.slug}`;
  const description = `${b.shop} : notre sélection de pièces (${b.style}). ${b.intro.split(". ")[0]}.`;
  return {
    title: `${b.shop} : notre sélection déco et mobilier`,
    description: description.slice(0, 300),
    alternates: { canonical: url },
    openGraph: { title: `${b.shop} : notre sélection | ${APP_NAME}`, description, url, type: "website", locale: "fr_FR", siteName: APP_NAME },
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const b = brand((await params).slug);
  if (!b) notFound();
  const pieces = await fetchPieces({ shop: b.shop });
  const prices = pieces.map((p) => p.price);
  const base = siteUrl();
  const others = BRANDS.filter((x) => x.slug !== b.slug);

  return (
    <article className="pt-4">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${b.shop} : notre sélection`,
          url: `${base}/marques/${b.slug}`,
          about: { "@type": "Brand", name: b.shop },
        }}
      />
      <nav aria-label="Fil d'Ariane" className="caps flex flex-wrap gap-2 text-muted">
        <Link href="/" className="hover:text-ink">{APP_NAME}</Link>
        <span>/</span>
        <Link href="/marques" className="hover:text-ink">Les maisons</Link>
        <span>/</span>
        <span className="text-ink">{b.shop}</span>
      </nav>

      <header className="mt-8 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div>
          <p className="caps text-muted">{b.origin} · {b.style}</p>
          <h1 className="display mt-3 text-5xl leading-[0.95] sm:text-7xl">{b.shop}</h1>
        </div>
        <div className="space-y-4 text-muted">
          <p className="leading-relaxed">{b.intro}</p>
          <p className="leading-relaxed">
            Voici notre sélection de pièces {b.shop}, à acheter directement chez eux, à garder pour plus tard ou à mettre dans une cagnotte.
          </p>
        </div>
      </header>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-line py-5 text-sm">
        <span className="text-muted">
          {pieces.length} pièces sélectionnées
          {prices.length > 0 && ` · de ${Math.round(Math.min(...prices))} € à ${Math.round(Math.max(...prices)).toLocaleString("fr-FR")} €`}
        </span>
        <Link href={`/catalogue?marque=${encodeURIComponent(b.shop)}`} className="link-caps ml-auto">
          Tout {b.shop} dans le catalogue →
        </Link>
      </div>

      {pieces.length > 0 && (
        <section className="mt-10">
          <h2 className="sr-only">La sélection {b.shop}</h2>
          <ProductGrid items={pieces} fr />
        </section>
      )}

      <section className="mt-20 border-t border-line pt-14">
        <h2 className="caps text-muted">Les autres maisons</h2>
        <ul className="mt-6 flex flex-wrap gap-2">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/marques/${o.slug}`} className="block border border-line px-4 py-2 text-sm transition hover:border-ink">
                {o.shop}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
