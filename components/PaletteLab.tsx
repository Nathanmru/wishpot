"use client";

import Link from "next/link";
import { useState } from "react";

type Palette = {
  id: string;
  name: string;
  note: string;
  main: { hex: string; name: string; color: string };
  second: { hex: string; name: string; color: string };
  accent: { hex: string; name: string; color: string };
};

/** La règle du 60-30-10, à essayer : un salon schématique se recolore selon la palette choisie. */
export default function PaletteLab({ palettes, fr }: { palettes: Palette[]; fr: boolean }) {
  const [i, setI] = useState(0);
  const p = palettes[i];

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
      <div className="relative overflow-hidden bg-white">
        <svg viewBox="0 0 600 420" className="block h-auto w-full" role="img" aria-label={p.name}>
          {/* 60 % : les murs et le sol */}
          <rect width="600" height="300" fill={p.main.hex} style={{ transition: "fill .6s" }} />
          <rect y="300" width="600" height="120" fill={p.main.hex} style={{ transition: "fill .6s", filter: "brightness(.88)" }} />
          {/* Fenêtre en arche */}
          <path d="M420 250 V120 a55 55 0 0 1 110 0 V250 Z" fill="#fff" opacity=".55" />
          {/* 30 % : le canapé et le tapis */}
          <ellipse cx="250" cy="370" rx="210" ry="34" fill={p.second.hex} opacity=".55" style={{ transition: "fill .6s" }} />
          <rect x="90" y="235" width="320" height="95" rx="26" fill={p.second.hex} style={{ transition: "fill .6s" }} />
          <rect x="70" y="250" width="50" height="85" rx="22" fill={p.second.hex} style={{ transition: "fill .6s", filter: "brightness(.92)" }} />
          <rect x="380" y="250" width="50" height="85" rx="22" fill={p.second.hex} style={{ transition: "fill .6s", filter: "brightness(.92)" }} />
          <rect x="110" y="330" width="10" height="18" fill="#3b2a1e" />
          <rect x="380" y="330" width="10" height="18" fill="#3b2a1e" />
          {/* 10 % : les touches */}
          <rect x="140" y="215" width="70" height="55" rx="14" fill={p.accent.hex} style={{ transition: "fill .6s" }} />
          <rect x="300" y="220" width="60" height="50" rx="12" fill={p.accent.hex} style={{ transition: "fill .6s", filter: "brightness(1.1)" }} />
          <path d="M470 330 q-18 -40 0 -70 q18 30 0 70 Z" fill={p.accent.hex} style={{ transition: "fill .6s" }} />
          <rect x="455" y="330" width="30" height="40" rx="6" fill={p.accent.hex} style={{ transition: "fill .6s", filter: "brightness(.85)" }} />
          {/* Une lampe */}
          <line x1="530" y1="370" x2="530" y2="200" stroke="#2a2420" strokeWidth="4" />
          <path d="M505 200 h50 l-10 -40 h-30 Z" fill="#f4ecdf" />
        </svg>
        <div className="flex">
          {[
            [p.main, "60 %"],
            [p.second, "30 %"],
            [p.accent, "10 %"],
          ].map(([c, pct]) => {
            const col = c as Palette["main"];
            return (
              <div key={pct as string} className="flex-1 p-3" style={{ flexGrow: parseInt(pct as string) }}>
                <div className="h-8 w-full" style={{ background: col.hex, transition: "background .6s" }} />
                <p className="mt-2 text-xs">
                  <b className="font-medium">{pct as string}</b> · {col.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap gap-2">
          {palettes.map((x, k) => (
            <button
              key={x.id}
              onClick={() => setI(k)}
              aria-pressed={k === i}
              className={`flex items-center gap-2 border px-3 py-2 text-sm transition ${k === i ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}
            >
              <span className="flex -space-x-1">
                {[x.main, x.second, x.accent].map((c) => (
                  <span key={c.hex} className="h-3.5 w-3.5 rounded-full border border-white/70" style={{ background: c.hex }} />
                ))}
              </span>
              {x.name}
            </button>
          ))}
        </div>
        <p className="display mt-8 text-4xl leading-tight">{p.name}</p>
        <p className="mt-3 leading-relaxed text-muted">{p.note}</p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
          {[p.main, p.second, p.accent].map((c) => (
            <Link key={c.hex} href={`/catalogue?couleur=${c.color}`} className="link-caps flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: c.hex }} />
              {fr ? `Pièces ${c.name.toLowerCase()}` : `${c.name} pieces`} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
