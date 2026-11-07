import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME, siteUrl } from "@/lib/config";
import { GROUPS, LANDINGS, type Landing } from "@/lib/landings";
import { STYLES } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Idées déco : styles, couleurs et pièces iconiques",
  description:
    "Toutes nos idées déco : salon vintage, chambre bohème, déco terracotta, canapé cuir, tapis berbère, lampe laiton… avec de vraies pièces à acheter ou à mettre en cagnotte.",
  alternates: { canonical: `${siteUrl()}/idees` },
};

const ORDER: Landing["group"][] = ["styles", "pieces", "couleurs", "objets", "projets"];

export default function IdeesPage() {
  return (
    <div className="pt-4">
      <p className="caps text-muted">{APP_NAME} · Idées déco</p>
      <h1 className="display mt-4 max-w-4xl text-5xl leading-[0.95] sm:text-7xl">Toutes nos idées pour un intérieur qui vous ressemble.</h1>
      <p className="mt-6 max-w-2xl leading-relaxed text-muted">
        Des styles, des couleurs, des pièces iconiques : chaque page réunit nos conseils et une sélection de vraies pièces, chinées ou signées par de
        petites maisons, à acheter tout de suite ou à mettre dans une cagnotte.
      </p>

      {ORDER.map((g) => {
        const list = LANDINGS.filter((l) => l.group === g);
        return (
          <section key={g} className="mt-16 border-t border-line pt-10">
            <h2 className="display text-4xl">{GROUPS[g]}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((l) => {
                const img = l.filter.style ? STYLES.find((s) => s.id === l.filter.style)?.img : undefined;
                return (
                  <li key={l.slug}>
                    <Link href={`/idees/${l.slug}`} className="group relative flex h-full min-h-[120px] flex-col justify-end overflow-hidden bg-white p-5 transition hover:bg-ink hover:text-white">
                      {img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img.replace("w=900", "w=500")} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-40" />
                      )}
                      <span className="relative display text-2xl leading-tight">{l.h1.split(" : ")[0]}</span>
                      <span className="relative mt-1 text-sm text-muted group-hover:text-white/80">{l.description.slice(0, 90)}…</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <section className="mt-16 grid gap-3 border-t border-line pt-10 sm:grid-cols-3">
        {[
          ["/looks", "Looks complets", "Des pièces qui vont ensemble, avec le prix total."],
          ["/alternative", "Icônes du design, version abordable", "Arco, Camaleonda, Tulip : nos alternatives à prix doux."],
          ["/marques", "Les maisons", "Selency, Westwing, Caravane, Ferm Living et les autres."],
        ].map(([href, t, d]) => (
          <Link key={href} href={href} className="group flex flex-col justify-end bg-white p-5 transition hover:bg-ink hover:text-white">
            <span className="display text-2xl leading-tight">{t}</span>
            <span className="mt-1 text-sm text-muted group-hover:text-white/80">{d}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
