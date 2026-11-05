import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME, CONTACT_EMAIL, siteUrl } from "@/lib/config";
import NamaShatter from "@/components/NamaShatter";

export const metadata: Metadata = {
  title: "À propos",
  description: `${APP_NAME} sélectionne des pièces déco de caractère : vintage, seconde main et petites maisons de design. Qui nous sommes, comment nous choisissons et comment le site est financé.`,
  alternates: { canonical: `${siteUrl()}/a-propos` },
};

export default function AboutPage() {
  return (
    <>
    <div className="relative -mx-4 h-[46vh] min-h-[280px] overflow-hidden bg-night sm:mx-0">
      <NamaShatter />
      <p className="caps absolute left-0 right-0 top-[18%] text-center text-[11px] tracking-[0.5em] text-bone/50">Atelier</p>
    </div>
    <article className="mx-auto max-w-3xl pt-12">
      <p className="caps text-muted">{APP_NAME} · À propos</p>
      <h1 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">Des pièces qui ont du caractère, et le temps de les choisir.</h1>

      <div className="mt-10 space-y-6 leading-relaxed text-muted">
        <p>
          {APP_NAME} est un site indépendant, créé et tenu par <span className="text-ink">Nathan Moreau</span>. L&apos;idée est simple :
          aider à meubler et décorer son intérieur avec des pièces qu&apos;on aime vraiment, plutôt qu&apos;avec ce que tout le monde a déjà.
        </p>
        <p>
          Nous ne vendons rien nous-mêmes. Nous repérons des pièces chez des boutiques que nous trouvons justes : du mobilier
          vintage et de seconde main, des petites maisons de design, des marques de niche. Puis nous les rangeons par style, par
          couleur et par pièce pour qu&apos;on s&apos;y retrouve.
        </p>
      </div>

      <section className="mt-16 grid gap-10 border-t border-line pt-12 sm:grid-cols-2">
        <div>
          <h2 className="display text-3xl">Ce que vous pouvez faire</h2>
          <ul className="mt-5 space-y-3 text-muted">
            <li className="border-l-2 border-walnut pl-4">
              <Link href="/catalogue" className="underline hover:text-ink">Dénicher</Link> des pièces et les comparer côte à côte : prix,
              dimensions, matières.
            </li>
            <li className="border-l-2 border-walnut pl-4">Les garder dans votre sélection, synchronisée avec votre compte Google.</li>
            <li className="border-l-2 border-walnut pl-4">
              Créer une <Link href="/idees/cagnotte-deco" className="underline hover:text-ink">cagnotte</Link> pour épargner chaque mois,
              seul ou à plusieurs, en vue d&apos;un projet.
            </li>
            <li className="border-l-2 border-walnut pl-4">
              Piocher dans nos <Link href="/idees" className="underline hover:text-ink">idées déco</Link> et notre{" "}
              <Link href="/aide-deco" className="underline hover:text-ink">aide déco</Link>.
            </li>
          </ul>
        </div>
        <div>
          <h2 className="display text-3xl">Comment nous choisissons</h2>
          <ul className="mt-5 space-y-3 text-muted">
            <li className="border-l-2 border-walnut pl-4">Des pièces de caractère : chinées, signées ou faites par de petites maisons.</li>
            <li className="border-l-2 border-walnut pl-4">Une place importante à la seconde main, plus durable et souvent plus belle.</li>
            <li className="border-l-2 border-walnut pl-4">Des prix relevés sur les sites des boutiques, donnés à titre indicatif.</li>
          </ul>
        </div>
      </section>

      <section className="mt-16 border-t border-line pt-12">
        <h2 className="display text-3xl">Comment le site est financé</h2>
        <p className="mt-5 leading-relaxed text-muted">
          {APP_NAME} est gratuit. Certains liens vers les boutiques sont des liens affiliés : si vous achetez après avoir cliqué,
          la boutique peut nous verser une petite commission. Cela ne change rien au prix que vous payez, et cela ne décide pas de
          ce que nous mettons en avant.
        </p>
      </section>

      <section className="mt-16 border-t border-line pt-12">
        <h2 className="display text-3xl">Nous écrire</h2>
        <p className="mt-5 leading-relaxed text-muted">
          Une question, une boutique à nous faire découvrir, une marque qui souhaite travailler avec nous :{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-ink underline">{CONTACT_EMAIL}</a>
        </p>
        <p className="mt-6 text-sm text-muted">
          <Link href="/mentions-legales" className="underline hover:text-ink">Mentions légales</Link> ·{" "}
          <Link href="/confidentialite" className="underline hover:text-ink">Confidentialité</Link>
        </p>
      </section>
    </article>
    </>
  );
}
