import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME, CANONICAL_URL, CONTACT_EMAIL, siteUrl } from "@/lib/config";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: `${siteUrl()}/mentions-legales` },
};

export default function LegalPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-8 pt-4 leading-relaxed">
      <div>
        <p className="caps text-muted">{APP_NAME}</p>
        <h1 className="display mt-4 text-5xl">Mentions légales</h1>
        <p className="mt-3 text-sm text-muted">Dernière mise à jour : novembre 2026</p>
      </div>

      <section>
        <h2 className="text-xl font-semibold">Éditeur du site</h2>
        <p className="mt-2 text-muted">
          Le site {CANONICAL_URL.replace("https://", "")} ({APP_NAME}) est édité par Nathan Moreau, particulier.
          <br />
          Contact : <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <br />
          Directeur de la publication : Nathan Moreau.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Hébergement</h2>
        <p className="mt-2 text-muted">
          Site hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com).
          <br />
          Données stockées chez Supabase Inc. (supabase.com).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Liens affiliés</h2>
        <p className="mt-2 text-muted">
          {APP_NAME} ne vend aucun produit. Les pièces présentées sont vendues par des boutiques tierces, qui restent seules
          responsables de leurs offres, prix, livraisons et services après-vente. Certains liens sont affiliés : un achat effectué
          après un clic peut rapporter une commission à {APP_NAME}, sans surcoût pour l&apos;acheteur. Les prix affichés sont relevés
          sur les sites des boutiques et donnés à titre indicatif.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Propriété intellectuelle</h2>
        <p className="mt-2 text-muted">
          Les textes et la mise en page du site appartiennent à {APP_NAME}. Les photos de produits appartiennent aux boutiques et
          marques concernées et sont présentées pour renvoyer vers leurs offres. Les photos d&apos;ambiance proviennent d&apos;Unsplash.
          Pour toute demande de retrait, écrivez à <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Données personnelles</h2>
        <p className="mt-2 text-muted">
          Voir notre <Link href="/confidentialite" className="underline">politique de confidentialité</Link>.
        </p>
      </section>
    </article>
  );
}
