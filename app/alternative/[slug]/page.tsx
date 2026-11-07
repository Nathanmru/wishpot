import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { APP_NAME, siteUrl } from "@/lib/config";
import { ICONS, icon } from "@/lib/dupes";
import { packPieces, eur } from "@/lib/packPieces";
import ProductGrid from "@/components/ProductGrid";
import JsonLd from "@/components/JsonLd";

/** « Alternative à une icône du design » : ce que les gens cherchent (« lampadaire Arco pas cher »…). */
export const revalidate = 3600;

const STORY: Record<string, { query: string; story: string; look: string }> = {
  arco: {
    query: "lampadaire arc",
    story: "Dessiné en 1962 par Achille et Pier Giacomo Castiglioni pour Flos, l'Arco a été pensé pour éclairer une table sans point lumineux au plafond : un long arc d'acier, un abat-jour en métal, et un socle en marbre de Carrare qui pèse plus de 60 kg.",
    look: "un grand arc fin, un abat-jour en dôme et un socle lourd (marbre, travertin ou métal)",
  },
  camaleonda: {
    query: "canapé modulable bouclette",
    story: "Créé par Mario Bellini en 1970, le Camaleonda est un canapé modulable fait de gros modules capitonnés, qu'on assemble comme on veut. Réédité par B&B Italia en 2020, il est devenu l'un des canapés les plus photographiés sur Instagram.",
    look: "des assises épaisses et arrondies, un capitonnage marqué, une bouclette ou un velours, et la possibilité de moduler",
  },
  "jeanneret-fauteuil": {
    query: "fauteuil cannage bois",
    story: "Pierre Jeanneret a dessiné ce fauteuil dans les années 1950 pour les bâtiments administratifs de Chandigarh, en Inde. Ses pieds en V et son cannage en ont fait une icône ; Cassina le réédite depuis 2019.",
    look: "des pieds en V inversé, un bois foncé (teck ou noyer) et une assise et un dossier cannés",
  },
  "jeanneret-chaise": {
    query: "chaise cannage bois",
    story: "La chaise de bureau de Chandigarh, dessinée par Pierre Jeanneret dans les années 1950, est l'autre pièce culte du projet indien de Le Corbusier. Les originaux s'arrachent en ventes aux enchères ; Cassina en propose une réédition.",
    look: "un piétement en V, un bois foncé et un dossier canné légèrement incliné",
  },
  tulip: {
    query: "table ronde pied central",
    story: "Eero Saarinen a dessiné la table Tulip à la fin des années 1950 pour Knoll, avec une idée simple : en finir avec « la forêt de pieds » sous les tables. Un seul pied central évasé, un plateau rond : la silhouette est devenue intemporelle.",
    look: "un pied central unique qui s'évase vers le sol et un plateau rond, blanc, en marbre ou en bois",
  },
  curvy: {
    query: "miroir ondulé",
    story: "Le miroir Curvy du designer suédois Gustaf Westman, avec son cadre épais aux ondulations colorées, est devenu viral sur les réseaux à partir de 2020, au point de lancer la mode des miroirs « vagues ».",
    look: "un cadre épais aux bords ondulés, dans une couleur franche",
  },
  s34: {
    query: "fauteuil cantilever cuir",
    story: "En 1926, Mart Stam invente le siège cantilever : sans pieds arrière, il repose sur un tube d'acier plié qui lui donne un léger rebond. Le S 34, avec ses accoudoirs et son cuir tendu, est une icône du Bauhaus toujours éditée par Thonet.",
    look: "un piétement en tube chromé sans pieds arrière, et une assise et un dossier en cuir tendu",
  },
  akari: {
    query: "suspension papier de riz",
    story: "En 1951, Isamu Noguchi s'inspire des lanternes japonaises de Gifu pour créer les Akari : du papier washi tendu sur une armature en bambou. Elles sont toujours fabriquées à la main au Japon et éditées en Europe par Vitra.",
    look: "un abat-jour en papier de riz, des formes douces et une lumière très diffuse",
  },
};

const FEM = /^(chaise|table|suspension|lampe)/i;
const lc = (n: string) => n[0].toLowerCase() + n.slice(1);
const le = (n: string) => `${FEM.test(n) ? "la" : "le"} ${lc(n)}`;
const du = (n: string) => `${FEM.test(n) ? "de la" : "du"} ${lc(n)}`;
const au = (n: string) => `${FEM.test(n) ? "à la" : "au"} ${lc(n)}`;
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export function generateStaticParams() {
  return ICONS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const i = icon((await params).slug);
  if (!i) return {};
  const url = `${siteUrl()}/alternative/${i.slug}`;
  const pieces = await packPieces(i.dupes);
  const best = pieces.length ? Math.min(...pieces.map((p) => p.price)) : null;
  const title = `${i.name} pas ${FEM.test(i.name) ? "chère" : "cher"} : l'alternative${best ? ` dès ${eur(best)}` : ""}`;
  const description = `${cap(le(i.name))} coûte ${i.from ? "à partir de " : ""}${eur(i.price)}. Nos pièces dans le même esprit${best ? `, dès ${eur(best)}` : ""} : même allure, pour une fraction du prix.`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: "article", locale: "fr_FR", siteName: APP_NAME } };
}

export default async function AlternativePage({ params }: { params: Promise<{ slug: string }> }) {
  const i = icon((await params).slug);
  if (!i) notFound();
  const s = STORY[i.slug];
  const pieces = await packPieces(i.dupes);
  const best = pieces.length ? Math.min(...pieces.map((p) => p.price)) : 0;
  const pct = best ? Math.round((1 - best / i.price) * 100) : 0;
  const others = ICONS.filter((x) => x.slug !== i.slug);
  const base = siteUrl();
  const faq: [string, string][] = [
    [`Pourquoi ${le(i.name)} ${FEM.test(i.name) ? "est-elle" : "est-il"} si ${FEM.test(i.name) ? "chère" : "cher"} ?`, `C'est une pièce éditée sous licence par ${i.credit.split(" · ")[0]}, fabriquée selon le dessin d'origine, avec des matériaux et des finitions haut de gamme. On paie aussi l'histoire du design.`],
    ["Les pièces proposées sont-elles des copies ?", "Non. Ce sont d'autres modèles, d'autres marques, qui partagent la même allure et la même ambiance, sans reproduire le dessin original."],
    [`Comment reconnaître une bonne alternative ${au(i.name)} ?`, `Cherchez ${s?.look ?? "les mêmes matières et les mêmes proportions"}.`],
  ];

  return (
    <article className="pt-4">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Alternatives ${au(i.name)}`,
            url: `${base}/alternative/${i.slug}`,
            itemListElement: pieces.map((p, n) => ({
              "@type": "ListItem",
              position: n + 1,
              item: { "@type": "Product", name: p.title, image: p.image_url, brand: { "@type": "Brand", name: p.shop }, offers: { "@type": "Offer", price: p.price, priceCurrency: "EUR", url: p.url, availability: "https://schema.org/InStock" } },
            })),
          },
        ]}
      />
      <nav aria-label="Fil d'Ariane" className="caps flex flex-wrap gap-2 text-muted">
        <Link href="/" className="hover:text-ink">{APP_NAME}</Link>
        <span>/</span>
        <Link href="/alternative" className="hover:text-ink">Luxe vs bonne affaire</Link>
        <span>/</span>
        <span className="text-ink">{i.name}</span>
      </nav>

      <header className="mt-8 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div>
          <p className="caps text-muted">L&apos;alternative abordable</p>
          <h1 className="display mt-3 text-5xl leading-[0.95] sm:text-7xl">
            {i.name} pas {FEM.test(i.name) ? "chère" : "cher"}
          </h1>
        </div>
        <div className="space-y-4 text-muted">
          <p className="leading-relaxed">{s?.story}</p>
          <p className="leading-relaxed">
            L&apos;original coûte {i.from ? "à partir de " : ""}
            {eur(i.price)}
            {best ? (
              <>
                {" "}
                (prix constaté chez {i.source}). Nous avons trouvé des pièces dans le même esprit dès <strong className="text-ink">{eur(best)}</strong>, soit
                jusqu&apos;à {pct} % de moins.
              </>
            ) : (
              "."
            )}
          </p>
        </div>
      </header>

      <div className="mt-10 grid gap-px border-y border-line bg-line sm:grid-cols-2">
        <div className="bg-ink p-6 text-paper">
          <p className="caps text-[10px] text-white/60">L&apos;icône</p>
          <p className="display mt-2 text-3xl">{i.name}</p>
          <p className="mt-1 text-sm text-white/70">{i.credit}</p>
          <p className="display mt-4 text-4xl">
            {i.from && <span className="mr-2 font-sans text-base text-white/60">dès</span>}
            {eur(i.price)}
          </p>
        </div>
        <div className="bg-paper p-6">
          <p className="caps text-[10px] text-walnut">La bonne affaire · même esprit</p>
          <p className="display mt-2 text-3xl">{pieces.length > 1 ? `${pieces.length} modèles` : "Un modèle"} sélectionné{pieces.length > 1 ? "s" : ""}</p>
          <p className="mt-1 text-sm text-muted">Pas des copies : d&apos;autres dessins, la même allure.</p>
          {best > 0 && (
            <p className="display mt-4 text-4xl text-walnut">
              <span className="mr-2 font-sans text-base text-muted">dès</span>
              {eur(best)}
            </p>
          )}
        </div>
      </div>

      {pieces.length > 0 && (
        <section className="mt-10">
          <h2 className="sr-only">Les alternatives</h2>
          <ProductGrid items={pieces} fr />
        </section>
      )}

      <section className="mt-20 grid gap-10 border-t border-line pt-14 md:grid-cols-2">
        <div>
          <h2 className="display text-4xl leading-tight">Ce qu&apos;il faut chercher</h2>
          <p className="mt-6 leading-relaxed text-muted">
            Pour retrouver l&apos;esprit {du(i.name)}, cherchez {s?.look}. Le reste (la marque, la signature) se paie très cher, mais ne se voit pas dans votre
            salon.
          </p>
          <Link href={`/catalogue?q=${encodeURIComponent(s?.query ?? i.name)}`} className="link-caps mt-6 inline-block">
            Voir plus de {s?.query ?? "pièces"} dans le catalogue →
          </Link>
        </div>
        <div>
          <h2 className="display text-4xl leading-tight">Questions fréquentes</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {faq.map(([q, a]) => (
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

      <section className="mt-20 border-t border-line pt-14">
        <h2 className="caps text-muted">Les autres icônes à prix doux</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/alternative/${o.slug}`} className="group flex h-full flex-col justify-end bg-white p-5 transition hover:bg-ink hover:text-white">
                <span className="caps text-[10px] text-muted group-hover:text-white/70">{o.credit.split(" · ")[0]}</span>
                <span className="display mt-1 text-xl leading-tight">
                  {o.name} pas {FEM.test(o.name) ? "chère" : "cher"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
