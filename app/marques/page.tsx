import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME, siteUrl } from "@/lib/config";
import { BRANDS } from "@/lib/brands";

export const metadata: Metadata = {
  title: "Les maisons : Selency, Westwing, Caravane, Ferm Living…",
  description: "Les maisons de déco et de mobilier sélectionnées par Atelier Nama : Selency, Westwing, Caravane, NV Gallery, Fleux, Serax, Ferm Living, House Doctor, Hartô…",
  alternates: { canonical: `${siteUrl()}/marques` },
};

export default function BrandsPage() {
  return (
    <div className="pt-4">
      <p className="caps text-muted">{APP_NAME} · Les maisons</p>
      <h1 className="display mt-4 max-w-4xl text-5xl leading-[0.95] sm:text-7xl">Les maisons que nous aimons.</h1>
      <p className="mt-6 max-w-2xl leading-relaxed text-muted">
        Brocante en ligne, éditeurs danois, petites marques françaises : voici les maisons dont nous sélectionnons les pièces, et ce que chacune fait de
        mieux.
      </p>
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BRANDS.map((b) => (
          <li key={b.slug}>
            <Link href={`/marques/${b.slug}`} className="group flex h-full flex-col justify-end bg-white p-6 transition hover:bg-ink hover:text-white">
              <span className="caps text-[10px] text-muted group-hover:text-white/70">{b.origin}</span>
              <span className="display mt-1 text-3xl leading-tight">{b.shop}</span>
              <span className="mt-2 text-sm text-muted group-hover:text-white/80">{b.style}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
