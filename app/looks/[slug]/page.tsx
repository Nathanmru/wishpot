import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { APP_NAME, siteUrl } from "@/lib/config";
import { PACKS, pack } from "@/lib/packs";
import { eur, packPieces } from "@/lib/packPieces";
import ProductGrid from "@/components/ProductGrid";
import JsonLd from "@/components/JsonLd";

/** Page publique d'un look : des pièces choisies pour aller ensemble, avec le prix total. */
export const revalidate = 3600;

export function generateStaticParams() {
  return PACKS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = pack(slug);
  if (!p) return {};
  const url = `${siteUrl()}/looks/${p.slug}`;
  const description = `${p.mood}. Toutes les pièces du look « ${p.name} », chinées ou design, à shopper d'un coup ou à mettre en cagnotte.`;
  return {
    title: `Le look complet : ${p.name}`,
    description,
    alternates: { canonical: url },
    openGraph: { title: `Le look complet : ${p.name} | ${APP_NAME}`, description, url, type: "article", locale: "fr_FR", siteName: APP_NAME, images: [`${url}/pin`] },
  };
}

export default async function LookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = pack(slug);
  if (!p) notFound();
  const pieces = await packPieces(p.ids);
  const total = pieces.reduce((a, x) => a + x.price, 0);
  const base = siteUrl();
  const others = PACKS.filter((x) => x.slug !== p.slug);
  const pin = `https://www.pinterest.fr/pin/create/button/?url=${encodeURIComponent(`${base}/looks/${p.slug}`)}&media=${encodeURIComponent(`${base}/looks/${p.slug}/pin`)}&description=${encodeURIComponent(`Le look complet : ${p.name} — ${p.mood}`)}`;

  return (
    <article className="pt-4">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Le look complet : ${p.name}`,
          url: `${base}/looks/${p.slug}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: pieces.length,
            itemListElement: pieces.map((x, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Product",
                name: x.title,
                image: x.image_url,
                brand: { "@type": "Brand", name: x.shop },
                offers: { "@type": "Offer", price: x.price, priceCurrency: "EUR", url: x.url, availability: "https://schema.org/InStock" },
              },
            })),
          },
        }}
      />

      <nav aria-label="Fil d'Ariane" className="caps flex flex-wrap gap-2 text-muted">
        <Link href="/" className="hover:text-ink">{APP_NAME}</Link>
        <span>/</span>
        <Link href="/looks" className="hover:text-ink">Looks complets</Link>
        <span>/</span>
        <span className="text-ink">{p.room}</span>
      </nav>

      <header className="mt-8 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div>
          <p className="caps text-muted">Le look complet</p>
          <h1 className="display mt-3 text-5xl leading-[0.95] sm:text-7xl">{p.name}</h1>
        </div>
        <div className="space-y-4 text-muted">
          <p className="leading-relaxed">{p.mood}.</p>
          <p className="leading-relaxed">
            Des pièces choisies pour aller ensemble : même palette, même esprit. Prenez tout, ou seulement celles qui vous manquent.
          </p>
        </div>
      </header>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-line py-5 text-sm">
        <span>
          <span className="display text-2xl">{eur(total)}</span>
          <span className="ml-2 text-muted">pour {pieces.length} pièces</span>
        </span>
        <a href={pin} target="_blank" rel="noopener nofollow" className="link-caps ml-auto">
          Épingler sur Pinterest
        </a>
        <Link href="/#cagnotte" className="link-caps">
          Mettre ce look en cagnotte →
        </Link>
      </div>

      {pieces.length > 0 && (
        <section className="mt-10">
          <h2 className="sr-only">Les pièces du look</h2>
          <ProductGrid items={pieces} fr />
        </section>
      )}

      <p className="mt-12 max-w-2xl text-sm text-muted">
        Pas le budget tout de suite ? Créez une cagnotte gratuite avec ce total, épargnez chaque mois, seul ou à plusieurs, et suivez la date à laquelle
        le look sera chez vous.
      </p>

      <section className="mt-20 border-t border-line pt-14">
        <h2 className="caps text-muted">Les autres looks</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/looks/${o.slug}`} className="group flex h-full flex-col justify-end bg-white p-5 transition hover:bg-ink hover:text-white">
                <span className="caps text-[10px] text-muted group-hover:text-white/70">{o.room}</span>
                <span className="display mt-1 text-xl leading-tight">{o.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
