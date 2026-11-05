"use client";

import { out } from "@/lib/out";
import { CompareToggle, SaveButton, type Mini } from "./ShopState";

const eur = (v: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: v % 1 ? 2 : 0 }).format(v);

/** Une rangée de pièces à faire défiler : on regarde, on garde, on compare, on achète. */
export default function ProductStrip({ items, fr }: { items: (Mini & { niche?: boolean | null })[]; fr: boolean }) {
  return (
    <ul className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:gap-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
      {items.map((p) => (
        <li key={p.id} className="group w-[62vw] shrink-0 snap-start sm:w-[260px]">
          <div className="relative aspect-[4/5] overflow-hidden bg-white">
            <a href={out(p.id)} target="_blank" rel="noopener nofollow sponsored" className="block h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image_url} alt={p.title} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-contain p-6 mix-blend-multiply transition duration-700 group-hover:scale-105" />
            </a>
            <SaveButton p={p} fr={fr} className="absolute right-3 top-3" />
            <span className="caps absolute left-3 top-3 bg-paper/90 px-2 py-1 text-[9px] text-muted">
              {p.shop === "Selency" ? (fr ? "Seconde main" : "Pre-loved") : p.shop}
            </span>
          </div>
          <a href={out(p.id)} target="_blank" rel="noopener nofollow sponsored" className="mt-3 line-clamp-2 text-sm leading-snug hover:underline">
            {p.title}
          </a>
          <div className="mt-1 flex items-center justify-between">
            <p className="display text-xl">{eur(Number(p.price))}</p>
            <CompareToggle p={p} fr={fr} />
          </div>
        </li>
      ))}
    </ul>
  );
}
