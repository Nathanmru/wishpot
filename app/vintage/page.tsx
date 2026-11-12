import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME, siteUrl } from "@/lib/config";
import { landing } from "@/lib/landings";
import { fetchPieces } from "@/lib/landingPieces";
import type { LandingFilter } from "@/lib/landings";
import ProductGrid from "@/components/ProductGrid";
import JsonLd from "@/components/JsonLd";

/**
 * La page « vintage » : toutes les pièces de seconde main du catalogue (Selency, notre partenaire),
 * rangées par famille, avec des liens vers les pages idées vintage. Elle vise « meuble vintage », « déco vintage », « brocante en ligne ».
 */
export const revalidate = 3600;

const TITLE = "Meubles et déco vintage : notre sélection de pièces chinées";
const DESC =
  "Meubles et objets vintage de seconde main : chaises, fauteuils, tables, buffets, lampes, miroirs et vases chinés par des brocanteurs. Des pièces uniques, mises à jour chaque jour.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${siteUrl()}/vintage` },
  openGraph: { title: `${TITLE} | ${APP_NAME}`, description: DESC, url: `${siteUrl()}/vintage`, type: "website", locale: "fr_FR", siteName: APP_NAME },
};

const SEL = "Selency";
const SECTIONS: { h: string; idea: string; filter: LandingFilter }[] = [
  { h: "Fauteuils et chaises vintage", idea: "chaise-vintage", filter: { shop: SEL, cats: ["assises"] } },
  { h: "Tables vintage", idea: "table-basse-vintage", filter: { shop: SEL, cats: ["tables"] } },
  { h: "Buffets, commodes et rangements", idea: "buffet-vintage", filter: { shop: SEL, cats: ["rangement"] } },
  { h: "Lampes et luminaires vintage", idea: "lampe-vintage", filter: { shop: SEL, cats: ["luminaires"] } },
  { h: "Miroirs anciens", idea: "miroir-vintage", filter: { shop: SEL, cats: ["miroirs"] } },
  { h: "Objets et vases chinés", idea: "vase-vintage", filter: { shop: SEL, cats: ["deco"] } },
];

const IDEAS = [
  "chaise-vintage", "fauteuil-vintage", "canape-cuir-vintage", "table-basse-vintage", "table-vintage", "buffet-vintage",
  "commode-vintage", "bureau-vintage", "lampe-vintage", "luminaire-vintage", "miroir-vintage", "vase-vintage",
  "vaisselle-vintage", "meuble-scandinave-vintage", "rotin-vintage", "meubles-chines", "deco-vintage", "salon-vintage",
];

const FAQ: [string, string][] = [
  ["Où acheter des meubles vintage en ligne ?", "Sur une brocante en ligne comme Selency, qui réunit des pièces de seconde main vendues par des brocanteurs professionnels et des particuliers. Chaque pièce de cette page renvoie vers son annonce, avec photos, dimensions et état."],
  ["Pourquoi acheter vintage plutôt que neuf ?", "Une pièce vintage est souvent mieux construite (bois massif, assemblages solides) pour un prix comparable, elle est unique, et l'achat de seconde main évite de produire un meuble de plus."],
  ["Les pièces vintage sont-elles en bon état ?", "Chaque annonce précise l'état et montre la pièce sous plusieurs angles. Des traces d'usage sont normales sur un meuble d'époque : demandez des photos supplémentaires au vendeur en cas de doute."],
  ["Comment sont choisies les pièces de cette page ?", "Nous mettons en avant des pièces de Selency, notre partenaire pour la seconde main. La sélection change chaque jour, au fil des nouvelles annonces et des pièces vendues."],
];

export default async function VintagePage() {
  const base = siteUrl();
  const sections = await Promise.all(SECTIONS.map(async (s) => ({ ...s, pieces: await fetchPieces(s.filter, 8).catch(() => []) })));
  const ideas = IDEAS.map(landing).filter((x): x is NonNullable<typeof x> => !!x);

  return (
    <article className="pt-4">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: TITLE, url: `${base}/vintage`, description: DESC }} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: APP_NAME, item: base },
            { "@type": "ListItem", position: 2, name: "Vintage", item: `${base}/vintage` },
          ],
        }}
      />

      <nav aria-label="Fil d'Ariane" className="caps flex flex-wrap gap-2 text-muted">
        <Link href="/" className="hover:text-ink">{APP_NAME}</Link>
        <span>/</span>
        <span className="text-ink">Vintage</span>
      </nav>

      <header className="mt-8 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div>
          <p className="caps text-muted">Seconde main · pièces uniques</p>
          <h1 className="display mt-3 text-5xl leading-[0.95] sm:text-7xl">Meubles et déco vintage</h1>
        </div>
        <div className="space-y-4 text-muted">
          <p className="leading-relaxed">
            Des fauteuils, des buffets, des lampes et des objets d&apos;époque, chinés par des brocanteurs et vendus sur Selency, la brocante en ligne.
            Chaque pièce existe en un seul exemplaire : quand elle est vendue, elle ne revient pas.
          </p>
          <p className="text-sm leading-relaxed">
            Atelier Nama est partenaire de Selency : si vous achetez une pièce depuis nos liens, nous touchons une petite commission, sans aucun surcoût pour vous.
          </p>
        </div>
      </header>

      <nav aria-label="Rechercher par type de pièce" className="mt-10 border-y border-line py-5">
        <ul className="flex flex-wrap gap-2">
          {ideas.map((l) => (
            <li key={l.slug}>
              <Link href={`/idees/${l.slug}`} className="block border border-line px-4 py-2 text-sm transition hover:border-ink hover:bg-ink hover:text-white">
                {l.h1.split(" : ")[0]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {sections
        .filter((s) => s.pieces.length > 0)
        .map((s) => (
          <section key={s.h} className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="display text-4xl leading-tight">{s.h}</h2>
              <Link href={`/idees/${s.idea}`} className="link-caps">Voir plus →</Link>
            </div>
            <div className="mt-6">
              <ProductGrid items={s.pieces} fr />
            </div>
          </section>
        ))}

      <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-line py-5 text-sm">
        <span className="text-muted">Plus de 1 500 pièces vintage dans le catalogue</span>
        <Link href={`/catalogue?marque=${SEL}`} className="link-caps ml-auto">Tout le vintage dans le catalogue →</Link>
      </div>

      <section className="mt-20 border-t border-line pt-14">
        <h2 className="display text-4xl leading-tight">Acheter vintage : vos questions</h2>
        <div className="mt-6 max-w-3xl divide-y divide-line border-y border-line">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group py-5" open>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 [&::-webkit-details-marker]:hidden">
                <h3 className="text-lg">{q}</h3>
                <span className="text-2xl font-light transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">
          À lire aussi : <Link href="/guides/acheter-meubles-vintage-en-ligne" className="underline hover:text-ink">acheter des meubles vintage en ligne sans se tromper</Link>,{" "}
          <Link href="/guides/reconnaitre-un-meuble-vintage" className="underline hover:text-ink">reconnaître un meuble vintage</Link> et{" "}
          <Link href="/guides/selency-avis" className="underline hover:text-ink">notre avis sur Selency</Link>.
        </p>
      </section>
    </article>
  );
}
