"use client";

import { out } from "@/lib/out";
import { CompareToggle, SaveButton, type Mini } from "./ShopState";

const eur = (v: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: v % 1 ? 2 : 0 }).format(v);

/** Grille de pièces pour les pages « idées » : voir, garder, comparer, acheter. */
export default function ProductGrid({ items, fr }: { items: (Mini & { niche?: boolean | null })[]; fr: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
      {items.map((p) => (
        <li key={p.id} className="group">
          <div className="relative aspect-square overflow-hidden bg-white">
            <a href={out(p.id)} target="_blank" rel="noopener nofollow sponsored" className="block h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image_url} alt={p.title} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-contain p-5 mix-blend-multiply transition duration-700 group-hover:scale-105 sm:p-7" />
            </a>
            <SaveButton p={p} fr={fr} className="absolute right-3 top-3" />
          </div>
          <p className="caps mt-3 flex items-center gap-2 text-[10px] text-muted">
            {p.shop}
            {p.shop === "Selency" ? (
              <span className="bg-walnut-soft px-1.5 py-0.5 text-[9px] text-walnut">{fr ? "Seconde main" : "Pre-loved"}</span>
            ) : p.niche ? (
              <span className="border border-brass/50 px-1.5 py-0.5 text-[9px] text-brass">{fr ? "Pépite" : "Gem"}</span>
            ) : null}
          </p>
          <a href={out(p.id)} target="_blank" rel="noopener nofollow sponsored" className="mt-1 line-clamp-2 text-sm leading-snug hover:underline">
            {p.title}
          </a>
          <p className="display mt-1 text-xl">{eur(Number(p.price))}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <CompareToggle p={p} fr={fr} />
            <a href={out(p.id)} target="_blank" rel="noopener nofollow sponsored" className="caps border-b border-ink pb-0.5 text-[10px]">
              {fr ? "Voir" : "View"} ↗
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
