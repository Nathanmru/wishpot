import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { APP_NAME, siteUrl } from "@/lib/config";
import { CATALOG_ROOMS, CATEGORIES } from "@/lib/catalog";
import { companions, getPiece, pieceId, piecePath } from "@/lib/piece";
import { out } from "@/lib/out";
import ProductGrid from "@/components/ProductGrid";
import JsonLd from "@/components/JsonLd";
import { SaveButton } from "@/components/ShopState";

/** Page publique d'une pièce du catalogue (arrivée depuis Pinterest ou Google). */
export const revalidate = 3600;

const eur = (v: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: v % 1 ? 2 : 0 }).format(v);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const id = pieceId((await params).id);
  const p = id ? await getPiece(id) : null;
  if (!p) return {};
  const url = `${siteUrl()}${piecePath(p)}`;
  const description = `${p.title} chez ${p.shop}, ${eur(p.price)}. Sélectionné par ${APP_NAME} : à shopper, à garder ou à mettre dans une cagnotte déco.`;
  return {
    title: `${p.title} · ${p.shop}`,
    description,
    alternates: { canonical: url },
    robots: p.active ? undefined : { index: false, follow: true },
    openGraph: { title: `${p.title} | ${APP_NAME}`, description, url, type: "website", locale: "fr_FR", siteName: APP_NAME, images: [`${siteUrl()}/piece/${p.id}/pin`] },
  };
}

export default async function PiecePage({ params }: { params: Promise<{ id: string }> }) {
  const raw = (await params).id;
  const id = pieceId(raw);
  const p = id ? await getPiece(id) : null;
  if (!p) notFound();
  if (decodeURIComponent(raw) !== piecePath(p).slice(7)) permanentRedirect(piecePath(p));

  const more = await companions(p);
  const room = CATALOG_ROOMS.find((r) => r.id === p.room);
  const cat = p.category ? CATEGORIES[p.category]?.fr : null;
  const mini = { id: p.id, title: p.title, image_url: p.image_url, price: p.price, shop: p.shop, url: p.url, category: p.category ?? undefined };
  const base = siteUrl();

  return (
    <article className="pt-4">
      {p.active && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.title,
            image: p.image_url,
            brand: { "@type": "Brand", name: p.shop },
            url: `${base}${piecePath(p)}`,
            offers: { "@type": "Offer", price: p.price, priceCurrency: "EUR", availability: "https://schema.org/InStock", url: `${base}${piecePath(p)}` },
          }}
        />
      )}

      <nav aria-label="Fil d'Ariane" className="caps flex flex-wrap gap-2 text-muted">
        <Link href="/" className="hover:text-ink">{APP_NAME}</Link>
        <span>/</span>
        <Link href={room ? `/catalogue?piece=${room.id}` : "/catalogue"} className="hover:text-ink">{room ? room.fr : "Catalogue"}</Link>
        {cat && (
          <>
            <span>/</span>
            <span className="text-ink">{cat}</span>
          </>
        )}
      </nav>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-center">
        <div className="relative aspect-square bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image_url} alt={p.title} referrerPolicy="no-referrer" className={`h-full w-full object-contain p-8 mix-blend-multiply sm:p-12 ${p.active ? "" : "opacity-50"}`} />
          <SaveButton p={mini} fr className="absolute right-4 top-4" />
        </div>

        <div>
          <p className="caps flex items-center gap-2 text-muted">
            {p.shop}
            {p.shop === "Selency" ? (
              <span className="bg-walnut-soft px-1.5 py-0.5 text-[10px] text-walnut">Seconde main</span>
            ) : p.niche ? (
              <span className="border border-brass/50 px-1.5 py-0.5 text-[10px] text-brass">Pépite</span>
            ) : null}
          </p>
          <h1 className="display mt-3 text-4xl leading-[1.02] sm:text-5xl">{p.title}</h1>
          <p className="display mt-6 text-3xl">{eur(p.price)}</p>

          {p.active ? (
            <>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={out(p.id)} target="_blank" rel="noopener nofollow sponsored" className="btn btn-primary !px-7 !py-4 text-[12px] uppercase tracking-label">
                  Voir chez {p.shop} ↗
                </a>
                <Link href={`/new?product=${p.id}`} className="btn border border-ink !px-7 !py-4 text-[12px] uppercase tracking-label hover:bg-ink hover:text-white">
                  Mettre en cagnotte
                </Link>
              </div>
              <p className="mt-5 max-w-md text-xs leading-relaxed text-muted">
                Vous achetez directement chez {p.shop}. Lien partenaire : {APP_NAME} peut toucher une petite commission, sans aucun surcoût pour vous.
              </p>
            </>
          ) : (
            <p className="mt-8 max-w-md leading-relaxed text-muted">
              Cette pièce a déjà trouvé preneur. Voici d&apos;autres trouvailles dans le même esprit.
            </p>
          )}
        </div>
      </div>

      {more.length > 0 && (
        <section className="mt-20 border-t border-line pt-14">
          <h2 className="display text-4xl leading-tight">{p.active ? "Ça irait bien avec" : "Dans le même esprit"}</h2>
          <div className="mt-8">
            <ProductGrid items={more.map((r) => ({ ...r, category: r.category ?? undefined }))} fr />
          </div>
          <Link href={room ? `/catalogue?piece=${room.id}` : "/catalogue"} className="link-caps mt-10 inline-block">
            Voir tout le catalogue {room ? `« ${room.fr} »` : ""} →
          </Link>
        </section>
      )}
    </article>
  );
}
