import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME, siteUrl } from "@/lib/config";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides déco : bien choisir, bien acheter, bien aménager",
  description:
    "Meubler un studio, choisir la taille de son tapis ou son canapé, reconnaître un meuble vintage, bien éclairer son salon : les guides pratiques d'Atelier Nama.",
  alternates: { canonical: `${siteUrl()}/guides` },
};

export default function GuidesPage() {
  return (
    <div className="pt-4">
      <p className="caps text-muted">{APP_NAME} · Guides</p>
      <h1 className="display mt-4 max-w-4xl text-5xl leading-[0.95] sm:text-7xl">Les guides pour bien s'installer.</h1>
      <p className="mt-6 max-w-2xl leading-relaxed text-muted">
        Les bonnes dimensions, les bons matériaux, les bons réflexes avant d'acheter : tout ce qu'on aimerait savoir avant de meubler son intérieur.
      </p>
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link href={`/guides/${g.slug}`} className="group flex h-full flex-col justify-between gap-6 bg-white p-6 transition hover:bg-ink hover:text-white">
              <span className="caps text-[10px] text-muted group-hover:text-white/70">
                {g.kicker} · {g.minutes} min
              </span>
              <span className="display text-3xl leading-tight">{g.h1}</span>
              <span className="text-sm text-muted group-hover:text-white/80">{g.description}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-16 text-sm text-muted">
        Envie d'idées plutôt que de conseils ? Parcourez nos <Link href="/idees" className="underline hover:text-ink">idées déco</Link>, nos{" "}
        <Link href="/looks" className="underline hover:text-ink">looks complets</Link> ou nos{" "}
        <Link href="/alternative" className="underline hover:text-ink">alternatives aux icônes du design</Link>.
      </p>
    </div>
  );
}
