import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME, siteUrl } from "@/lib/config";
import { PACKS } from "@/lib/packs";
import { eur, packPieces } from "@/lib/packPieces";

export const metadata: Metadata = {
  title: "Looks complets : salon, chambre, entrée… pièce par pièce",
  description: "Des looks déco complets, pièce par pièce, avec le prix total : salon japandi, salon cuir & cognac, chambre en lin, entrée, bureau… à shopper ou à mettre en cagnotte.",
  alternates: { canonical: `${siteUrl()}/looks` },
};
export const revalidate = 3600;

export default async function LooksPage() {
  const looks = await Promise.all(PACKS.map(async (p) => ({ p, pieces: await packPieces(p.ids) })));
  return (
    <div className="pt-4">
      <p className="caps text-muted">{APP_NAME} · Looks complets</p>
      <h1 className="display mt-4 max-w-4xl text-5xl leading-[0.95] sm:text-7xl">Le look complet, pièce par pièce.</h1>
      <p className="mt-6 max-w-2xl leading-relaxed text-muted">
        Chaque look réunit des pièces qui vont ensemble, avec le prix total. Prenez tout d&apos;un coup, piochez ce qui vous plaît, ou mettez le look en
        cagnotte.
      </p>
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {looks.map(({ p, pieces }) => (
          <li key={p.slug}>
            <Link href={`/looks/${p.slug}`} className="group block">
              <div className="grid grid-cols-2 gap-1 bg-white p-1">
                {pieces.slice(0, 4).map((x) => (
                  <div key={x.id} className="aspect-square bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={x.image_url} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-contain p-3 mix-blend-multiply" />
                  </div>
                ))}
              </div>
              <p className="caps mt-4 text-[10px] text-muted">{p.room}</p>
              <p className="display mt-1 text-2xl leading-tight group-hover:underline">{p.name}</p>
              <p className="mt-1 text-sm text-muted">
                {eur(pieces.reduce((a, x) => a + x.price, 0))} · {pieces.length} pièces
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
