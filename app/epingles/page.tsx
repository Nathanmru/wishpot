import type { Metadata } from "next";
import { GROUPS, LANDINGS, type Landing } from "@/lib/landings";
import { pinUrl } from "@/lib/landingPieces";

/** Page de travail (non référencée) : toutes les épingles Pinterest prêtes, groupées par tableau. */
export const metadata: Metadata = { title: "Épingles Pinterest", robots: { index: false, follow: false } };

const ORDER: Landing["group"][] = ["styles", "pieces", "couleurs", "objets", "projets"];

export default function PinsPage() {
  return (
    <div className="pt-4">
      <p className="caps text-muted">Atelier Nama · Pinterest</p>
      <h1 className="display mt-4 text-5xl leading-[0.95] sm:text-6xl">Tes épingles, prêtes à publier</h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted">
        Une image par page « Idées ». Clique sur « Épingler » : Pinterest s&apos;ouvre avec l&apos;image, le lien et la description déjà remplis. Tu
        n&apos;as plus qu&apos;à choisir le tableau. Conseil : un tableau par rubrique ci-dessous, et 3 à 5 épingles par jour plutôt que tout d&apos;un coup.
      </p>

      {ORDER.map((g) => (
        <section key={g} className="mt-14 border-t border-line pt-8">
          <h2 className="display text-3xl">Tableau « {GROUPS[g]} »</h2>
          <ul className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {LANDINGS.filter((l) => l.group === g).map((l) => (
              <li key={l.slug} className="flex flex-col">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/idees/${l.slug}/pin`} alt={l.h1} loading="lazy" className="aspect-[2/3] w-full bg-white object-cover" />
                <p className="mt-2 text-sm leading-snug">{l.h1.split(" : ")[0]}</p>
                <div className="mt-2 flex gap-4">
                  <a href={pinUrl(l)} target="_blank" rel="noopener" className="caps border-b border-ink pb-0.5 text-[10px]">
                    Épingler ↗
                  </a>
                  <a href={`/idees/${l.slug}/pin`} download={`atelier-nama-${l.slug}.png`} className="caps text-[10px] text-muted">
                    Télécharger
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
