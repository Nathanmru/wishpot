import type { Product } from "@/lib/inspiration";

export function euro(v: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: v % 1 ? 2 : 0 }).format(v);
}

export function goUrl(url: string) {
  return `/go?u=${encodeURIComponent(url)}`;
}

export function addUrl(p: { name: string; url?: string; price?: number; img?: string }, kind: "home" | "travel") {
  const q = new URLSearchParams({ kind, title: p.name });
  if (p.url) q.set("url", p.url);
  if (p.price) q.set("price", String(p.price));
  if (p.img) q.set("img", p.img);
  return `/add?${q.toString()}`;
}

export function ProductCard({ p, big = false }: { p: Product; big?: boolean }) {
  return (
    <figure className="group flex flex-col">
      <a href={goUrl(p.url)} target="_blank" rel="noopener sponsored" className="relative block overflow-hidden bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.img}
          alt={p.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className={`w-full object-contain p-6 mix-blend-multiply transition duration-700 group-hover:scale-[1.04] ${big ? "aspect-[4/5]" : "aspect-square"}`}
        />
        <span className="absolute left-3 top-3 bg-paper/90 px-2 py-1 text-[10px] uppercase tracking-label text-ink">{p.shop}</span>
      </a>
      <figcaption className="mt-4 flex flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[12px] uppercase leading-snug tracking-[0.1em]">{p.name}</p>
          <p className="shrink-0 text-sm">{euro(p.price)}</p>
        </div>
        <div className="mt-4 flex gap-4 text-[11px] uppercase tracking-label">
          <a href={goUrl(p.url)} target="_blank" rel="noopener sponsored" className="border-b border-ink pb-0.5 hover:opacity-60">
            Voir sur le site ↗
          </a>
          <a href={addUrl(p, "home")} className="border-b border-transparent pb-0.5 text-muted hover:border-muted">
            + Ma cagnotte
          </a>
        </div>
      </figcaption>
    </figure>
  );
}

export function BudgetDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span aria-label={`Budget ${level} sur 3`} className="tracking-[0.2em]">
      <span>{"€".repeat(level)}</span>
      <span className="opacity-25">{"€".repeat(3 - level)}</span>
    </span>
  );
}

export const MONTHS = ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];
