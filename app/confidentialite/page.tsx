import { APP_NAME } from "@/lib/config";

export const metadata = { title: "Confidentialité" };

const CONTACT = "nath.prank@gmail.com";

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-6 leading-relaxed">
      <h1 className="font-display text-4xl font-semibold">Politique de confidentialité</h1>
      <p className="text-sm text-muted">Dernière mise à jour : novembre 2026</p>

      <section>
        <h2 className="text-xl font-semibold">Qui sommes-nous</h2>
        <p>
          {APP_NAME} est un site qui permet de créer des cagnottes à plusieurs pour meubler et décorer un
          logement. Pour toute question : <a className="underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Données collectées</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Lors de la connexion avec Google : votre nom, votre adresse email et votre photo de profil.</li>
          <li>Ce que vous ajoutez au site : vos cagnottes, objets, prix, montants mensuels et versements.</li>
          <li>Les clics vers les boutiques partenaires (sans donnée de paiement).</li>
        </ul>
        <p className="mt-2">Nous ne collectons aucune donnée bancaire : aucun argent ne transite par {APP_NAME}.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Utilisation</h2>
        <p>
          Ces données servent uniquement à faire fonctionner le site : vous connecter, afficher vos cagnottes et les
          partager avec les personnes que vous invitez. Elles ne sont ni vendues ni cédées à des tiers.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Liens affiliés</h2>
        <p>
          Certains liens vers des boutiques sont affiliés : si vous achetez en passant par eux, nous pouvons toucher une
          commission, sans surcoût pour vous. La boutique peut alors savoir que vous venez de {APP_NAME}.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Hébergement</h2>
        <p>
          Le site est hébergé par Vercel et les données sont stockées chez Supabase (serveurs situés dans l&apos;Union
          européenne quand c&apos;est possible).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Vos droits</h2>
        <p>
          Vous pouvez demander à consulter, corriger ou supprimer vos données à tout moment en écrivant à{" "}
          <a className="underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>. Vous pouvez aussi supprimer vos cagnottes
          directement depuis le site.
        </p>
      </section>
    </article>
  );
}
