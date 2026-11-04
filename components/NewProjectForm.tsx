"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createProject } from "@/app/actions";
import { parseExtra } from "@/lib/starters";

export type Picked = { id: number; title: string; shop: string; price: number; image_url: string; qty: number };

const PRESETS = [50, 100, 150, 200, 300];
const NAMES = {
  fr: ["Premier appartement", "Notre salon", "Notre chambre", "La maison", "Crémaillère"],
  en: ["First flat", "Our living room", "Our bedroom", "The house", "Housewarming"],
};

export default function NewProjectForm({
  initialName = "",
  initialMonthly,
  initialProducts = [],
  initialExtras = [],
  lang = "fr",
}: {
  initialName?: string;
  initialMonthly?: number;
  initialProducts?: Picked[];
  initialExtras?: string[];
  lang?: "fr" | "en";
}) {
  const fr = lang === "fr";
  const [name, setName] = useState(initialName);
  const [monthly, setMonthly] = useState(String(initialMonthly ?? 100));
  const [products, setProducts] = useState<Picked[]>(initialProducts);
  const [extras, setExtras] = useState<string[]>(initialExtras);
  const eur = (v: number) =>
    new Intl.NumberFormat(fr ? "fr-FR" : "en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);
  const total = products.reduce((a, p) => a + p.price * p.qty, 0) + extras.reduce((a, v) => a + (parseExtra(v)?.price ?? 0), 0);
  const count = products.length + extras.length;

  return (
    <form action={createProject} className="mt-14 space-y-16">
      <input type="hidden" name="kind" value="home" />

      {/* 1 — Le nom */}
      <div>
        <Step n="01" title={fr ? "Donnez-lui un nom" : "Give it a name"} />
        <input
          name="name"
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-line display mt-6 !text-4xl sm:!text-5xl"
          placeholder={fr ? "Notre appart" : "Our flat"}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {NAMES[lang].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setName(n)}
              className={`border px-3 py-1.5 text-xs transition ${name === n ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* 2 — Le budget */}
      <div>
        <Step n="02" title={fr ? "Combien mettez-vous de côté par mois ?" : "How much do you set aside each month?"} />
        <div className="mt-6 flex items-end gap-4">
          <input name="monthly" inputMode="decimal" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="input-line display max-w-[10rem] !text-5xl" />
          <span className="display pb-2 text-2xl text-muted">€ {fr ? "/ mois" : "/ month"}</span>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setMonthly(String(p))}
              className={`border px-4 py-2 text-sm transition ${monthly === String(p) ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}
            >
              {p} €
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          {fr ? "Vous pourrez le modifier plus tard. Chaque membre indique son propre montant." : "You can change it later. Each member sets their own amount."}
        </p>
      </div>

      {/* 3 — La sélection venue du planificateur */}
      {count > 0 && (
        <div>
          <Step n="03" title={fr ? "Votre sélection" : "Your selection"} note={`${count} · ${eur(total)}`} />
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
            {products.map((p) => (
              <li key={p.id}>
                <div className="relative aspect-square bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image_url} alt="" referrerPolicy="no-referrer" className="h-full w-full object-contain p-3 mix-blend-multiply" />
                  <button
                    type="button"
                    onClick={() => setProducts((x) => x.filter((y) => y.id !== p.id))}
                    aria-label={fr ? "Retirer" : "Remove"}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-paper/95 text-sm hover:bg-ink hover:text-white"
                  >
                    ×
                  </button>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-snug">{p.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {p.shop} · {eur(p.price * p.qty)}
                  {p.qty > 1 ? ` (×${p.qty})` : ""}
                </p>
                <input type="hidden" name="product" value={`${p.id}:${p.qty}`} />
              </li>
            ))}
          </ul>
          {extras.length > 0 && (
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {extras.map((v, i) => {
                const x = parseExtra(v);
                if (!x) return null;
                return (
                  <li key={v + i} className="flex items-center gap-4 py-3 text-sm">
                    <span className="caps text-muted">{fr ? "Votre objet" : "Your item"}</span>
                    <span className="flex-1 truncate">{x.title}</span>
                    <span className="text-muted">{eur(x.price)}</span>
                    <button type="button" onClick={() => setExtras((e) => e.filter((_, j) => j !== i))} className="text-muted hover:text-ink" aria-label="×">
                      ×
                    </button>
                    <input type="hidden" name="extra" value={v} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      <Submit label={fr ? "Créer la cagnotte" : "Create the pot"} pendingLabel={fr ? "Création…" : "Creating…"} />
    </form>
  );
}

function Step({ n, title, note }: { n: string; title: string; note?: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-line pb-3">
      <span className="caps text-brass">{n}</span>
      <span className="text-lg">{title}</span>
      {note && <span className="ml-auto text-xs text-muted">{note}</span>}
    </div>
  );
}

function Submit({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="btn-primary w-full !py-5 text-[12px] uppercase tracking-label">
      {pending ? pendingLabel : label}
    </button>
  );
}
