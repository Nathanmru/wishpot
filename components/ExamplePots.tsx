"use client";

import Link from "next/link";
import { useState } from "react";

export type BoardItem = { id: number; qty: number; role: string; title: string; shop: string; price: number; image_url: string; url: string };
export type Board = {
  slug: string;
  title: string;
  mood: string;
  why: string;
  palette: { hex: string; name: string }[];
  months: number;
  people: number;
  items: BoardItem[];
};

const eur = (n: number, fr: boolean) =>
  new Intl.NumberFormat(fr ? "fr-FR" : "en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

/** Trois cagnottes prêtes à l'emploi : une palette, de vraies pièces, un plan d'épargne. */
export default function ExamplePots({ boards, fr }: { boards: Board[]; fr: boolean }) {
  const [i, setI] = useState(0);
  const b = boards[i];
  if (!b) return null;
  const total = b.items.reduce((a, x) => a + x.price * x.qty, 0);
  const monthly = Math.ceil(total / b.months / b.people / 5) * 5;
  const href = `/new?${new URLSearchParams({
    name: b.title.replace(/^(Le|La|The) /, ""),
    monthly: String(monthly),
    product: b.items.map((x) => (x.qty > 1 ? `${x.id}:${x.qty}` : String(x.id))).join(","),
  }).toString()}`;
  const [hero, ...rest] = b.items;

  return (
    <div>
      {/* Les onglets, chacun avec sa palette */}
      <div role="tablist" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {boards.map((x, k) => (
          <button
            key={x.slug}
            role="tab"
            aria-selected={k === i}
            onClick={() => setI(k)}
            className={`flex shrink-0 items-center gap-3 border px-4 py-3 text-left transition ${k === i ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}
          >
            <span className="flex -space-x-1.5">
              {x.palette.slice(0, 4).map((c) => (
                <span key={c.hex + c.name} className="h-4 w-4 rounded-full border border-white/70" style={{ background: c.hex }} />
              ))}
            </span>
            <span className="text-sm">{x.title}</span>
          </button>
        ))}
      </div>

      <div key={b.slug} className="wp-rise mt-8 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
        {/* La planche */}
        <div className="grid grid-cols-6 gap-2 sm:gap-3">
          {hero && (
            <Tile item={hero} fr={fr} className="col-span-6 aspect-[16/10] sm:col-span-4 sm:row-span-2 sm:aspect-auto" big />
          )}
          {rest.map((x, k) => (
            <Tile key={x.id} item={x} fr={fr} className={`col-span-3 ${k >= 2 && rest.length === 4 ? "aspect-square sm:col-span-3 sm:aspect-[3/2]" : "aspect-square sm:col-span-2"}`} />
          ))}
        </div>

        {/* Le plan */}
        <div className="flex flex-col">
          <p className="caps text-muted">{b.mood}</p>
          <h3 className="display mt-3 text-4xl leading-[0.95] sm:text-5xl">{b.title}</h3>
          <p className="mt-4 leading-relaxed text-muted">{b.why}</p>

          <div className="mt-6 flex overflow-hidden">
            {b.palette.map((c) => (
              <div key={c.hex + c.name} className="flex-1">
                <div className="h-14" style={{ background: c.hex }} />
                <p className="mt-1.5 text-[11px] text-muted">{c.name}</p>
              </div>
            ))}
          </div>

          <ul className="mt-6 divide-y divide-line border-y border-line text-sm">
            {b.items.map((x) => (
              <li key={x.id} className="flex items-baseline justify-between gap-4 py-2.5">
                <span className="min-w-0 truncate">
                  <span className="text-muted">{x.role}</span> · {x.title}
                </span>
                <span className="shrink-0 tabular-nums">
                  {x.qty > 1 && <span className="text-muted">{x.qty} × </span>}
                  {eur(x.price, fr)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 grid grid-cols-3 gap-3 bg-white p-5">
            <div>
              <p className="caps text-muted">{fr ? "Budget" : "Budget"}</p>
              <p className="display mt-1 text-2xl">{eur(total, fr)}</p>
            </div>
            <div>
              <p className="caps text-muted">{fr ? `À ${b.people}` : `${b.people} people`}</p>
              <p className="display mt-1 text-2xl">
                {eur(monthly, fr)}
                <span className="text-sm text-muted">/{fr ? "mois" : "mo"}</span>
              </p>
            </div>
            <div>
              <p className="caps text-muted">{fr ? "Prêt dans" : "Ready in"}</p>
              <p className="display mt-1 text-2xl">
                {b.months} {fr ? "mois" : "mo"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Link href={href} className="btn-primary !px-7 !py-4 text-[12px] uppercase tracking-label">
              {fr ? "Créer cette cagnotte" : "Start this pot"}
            </Link>
            <Link href={`/catalogue?couleur=${encodeURIComponent(paletteToColor(b.slug))}`} className="link-caps">
              {fr ? "Voir des pièces assorties" : "More matching pieces"} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function paletteToColor(slug: string) {
  if (slug.includes("cognac")) return "brun";
  if (slug.includes("terracotta")) return "terracotta";
  return "vert";
}

function Tile({ item, fr, className = "", big = false }: { item: BoardItem; fr: boolean; className?: string; big?: boolean }) {
  return (
    <a href={item.url} target="_blank" rel="noopener nofollow sponsored" className={`group relative block overflow-hidden bg-white ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.image_url}
        alt={item.title}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={`absolute inset-0 h-full w-full transition duration-700 group-hover:scale-105 ${big ? "object-contain p-6 mix-blend-multiply" : "object-contain p-3 mix-blend-multiply"}`}
      />
      <span className="absolute bottom-2 left-2 bg-paper/90 px-2 py-1 text-[10px] uppercase tracking-label text-ink">
        {item.shop} · {eur(item.price, fr)}
      </span>
    </a>
  );
}
