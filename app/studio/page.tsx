import type { Metadata } from "next";
import Link from "next/link";
import { GROUPS, LANDINGS, landing, type Landing } from "@/lib/landings";
import { fetchPieces } from "@/lib/landingPieces";
import VideoStudio from "@/components/VideoStudio";

/** Page de travail (non référencée) : fabrique les vidéos TikTok / Reels « Le look complet pour X € ». */
export const metadata: Metadata = { title: "Studio vidéo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const ORDER: Landing["group"][] = ["styles", "pieces", "couleurs", "objets", "projets"];

export default async function StudioPage({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  const { p } = await searchParams;
  const l = landing(p || "") ?? landing("canape-cuir-vintage")!;
  const pieces = (await fetchPieces(l.filter)).filter((x) => x.price > 0 && x.image_url);
  const title = l.h1.split(" : ")[0];

  return (
    <div className="pt-4">
      <p className="caps text-muted">Atelier Nama · Studio vidéo</p>
      <h1 className="display mt-4 text-5xl leading-[0.95] sm:text-6xl">Tes vidéos, prêtes à publier</h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted">
        Choisis une page, coche les pièces (4 à 6, c&apos;est l&apos;idéal), clique sur « Créer la vidéo » : elle se joue une fois en direct pendant
        l&apos;enregistrement, puis tu la télécharges. Ajoute ensuite une musique tendance directement dans TikTok ou Instagram.
      </p>

      <details className="mt-8 border-y border-line py-4">
        <summary className="caps cursor-pointer text-[11px]">Page choisie : {title} — changer</summary>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ORDER.map((g) => (
            <div key={g}>
              <p className="caps text-[10px] text-muted">{GROUPS[g]}</p>
              <ul className="mt-2 space-y-1 text-sm">
                {LANDINGS.filter((x) => x.group === g).map((x) => (
                  <li key={x.slug}>
                    <Link href={`/studio?p=${x.slug}`} className={x.slug === l.slug ? "font-medium underline" : "hover:underline"}>
                      {x.h1.split(" : ")[0]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>

      <VideoStudio key={l.slug} slug={l.slug} title={title} pieces={pieces.slice(0, 18)} />
    </div>
  );
}
