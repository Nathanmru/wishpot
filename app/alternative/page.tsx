import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME, siteUrl } from "@/lib/config";
import { ICONS } from "@/lib/dupes";
import { packPieces, eur } from "@/lib/packPieces";

export const metadata: Metadata = {
  title: "Icônes du design pas chères : Arco, Camaleonda, Tulip, Jeanneret",
  description: "Les grandes icônes du design et leurs alternatives abordables : lampadaire Arco, canapé Camaleonda, table Tulip, chaise Pierre Jeanneret, miroir Curvy, Akari…",
  alternates: { canonical: `${siteUrl()}/alternative` },
};
export const revalidate = 3600;

export default async function AlternativesPage() {
  const all = await packPieces(ICONS.flatMap((i) => i.dupes));
  return (
    <div className="pt-4">
      <p className="caps text-muted">{APP_NAME} · Luxe vs bonne affaire</p>
      <h1 className="display mt-4 max-w-4xl text-5xl leading-[0.95] sm:text-7xl">Les icônes du design, version abordable.</h1>
      <p className="mt-6 max-w-2xl leading-relaxed text-muted">
        Le lampadaire Arco, le canapé Camaleonda, la table Tulip : des pièces magnifiques, mais à plusieurs milliers d&apos;euros. Nous avons trouvé des
        modèles dans le même esprit, pour une fraction du prix. Pas des copies : d&apos;autres dessins, la même allure.
      </p>
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ICONS.map((i) => {
          const pieces = all.filter((p) => i.dupes.includes(p.id));
          const p = pieces[0];
          const best = pieces.length ? Math.min(...pieces.map((x) => x.price)) : null;
          return (
            <li key={i.slug}>
              <Link href={`/alternative/${i.slug}`} className="group block">
                <div className="aspect-square bg-white">
                  {p && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_url} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-contain p-6 mix-blend-multiply" />
                  )}
                </div>
                <p className="caps mt-4 text-[10px] text-muted">{i.credit.split(" · ")[0]}</p>
                <p className="display mt-1 text-2xl leading-tight group-hover:underline">{i.name}</p>
                <p className="mt-1 text-sm">
                  <span className="text-muted line-through">{eur(i.price)}</span>
                  {best && <span className="ml-2 text-walnut">dès {eur(best)}</span>}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
