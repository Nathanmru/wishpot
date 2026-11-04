"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createProject } from "@/app/actions";
import { startersFor, starterTotal } from "@/lib/starters";

type Kind = "travel" | "home";
type T = Record<
  "step1" | "step2" | "step3" | "travel" | "home" | "travelDesc" | "homeDesc" | "namePhTravel" | "namePhHome" | "monthlyHint" | "create" | "perMonth",
  string
>;

const PRESETS = [50, 100, 150, 200, 300];
const COVERS: Record<Kind, string> = {
  home: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=900&q=80",
  travel: "https://images.unsplash.com/photo-1562865582-d6317ab58923?auto=format&fit=crop&w=900&q=80",
};

const eur = (v: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);

export default function NewProjectForm({
  initialKind,
  initialName = "",
  initialMonthly,
  initialStarters = [],
  t,
}: {
  initialKind: Kind | null;
  initialName?: string;
  initialMonthly?: number;
  initialStarters?: string[];
  t: T;
}) {
  const [kind, setKind] = useState<Kind | null>(initialKind);
  const [name, setName] = useState(initialName);
  const [monthly, setMonthly] = useState(String(initialMonthly ?? 100));
  const [picked, setPicked] = useState<string[]>(initialStarters);
  const ready = !!kind;
  const starters = kind ? startersFor(kind) : [];
  const chosen = starters.filter((s) => picked.includes(s.id));

  return (
    <form action={createProject} className="mt-14 space-y-16">
      {/* 1 — Le type */}
      <fieldset>
        <Step n="01" title={t.step1} />
        <input type="hidden" name="kind" value={kind ?? ""} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["home", t.home, t.homeDesc],
              ["travel", t.travel, t.travelDesc],
            ] as const
          ).map(([k, title, desc]) => {
            const active = kind === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setKind(k);
                  if (k !== kind) setPicked([]);
                }}
                aria-pressed={active}
                className="group relative block h-56 overflow-hidden bg-night text-left sm:h-64"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={COVERS[k]}
                  alt=""
                  className={`absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-105 ${active || !kind ? "opacity-90" : "opacity-45"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-5 left-6 right-6 text-white">
                  <p className="display text-4xl">{title}</p>
                  <p className="mt-1 text-sm text-white/80">{desc}</p>
                </div>
                <span className={`pointer-events-none absolute inset-0 border-[3px] transition ${active ? "border-bone" : "border-transparent"}`} />
                {active && <span className="caps absolute right-4 top-4 bg-bone px-2.5 py-1.5 text-ink">Choisi</span>}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* 2 — Le nom */}
      <div className={`transition duration-500 ${ready ? "" : "pointer-events-none opacity-30"}`}>
        <Step n="02" title={t.step2} />
        <input
          name="name"
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-line display mt-6 !text-4xl sm:!text-5xl"
          placeholder={kind === "travel" ? t.namePhTravel : t.namePhHome}
        />
      </div>

      {/* 3 — Le budget */}
      <div className={`transition duration-500 ${ready ? "" : "pointer-events-none opacity-30"}`}>
        <Step n="03" title={t.step3} />
        <div className="mt-6 flex items-end gap-4">
          <input
            name="monthly"
            inputMode="decimal"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            className="input-line display max-w-[10rem] !text-5xl"
          />
          <span className="display pb-2 text-2xl text-muted">€ {t.perMonth}</span>
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
        <p className="mt-4 text-sm text-muted">{t.monthlyHint}</p>
      </div>

      {/* 4 — Premières envies (facultatif) */}
      {kind && (
        <div>
          <Step n="04" title="Vos premières envies" note="Facultatif · vous pourrez coller vos propres liens ensuite" />
          <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {starters.map((s) => {
              const on = picked.includes(s.id);
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setPicked((p) => (on ? p.filter((x) => x !== s.id) : [...p, s.id]))}
                    className="group block w-full text-left"
                  >
                    <div className={`relative aspect-square overflow-hidden ${s.packshot ? "bg-white" : "bg-night"}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.img}
                        alt=""
                        referrerPolicy="no-referrer"
                        className={`h-full w-full transition duration-500 ${s.packshot ? "object-contain p-3 mix-blend-multiply" : "object-cover"} ${on ? "" : "opacity-55"}`}
                      />
                      <span className={`pointer-events-none absolute inset-0 border-2 transition ${on ? "border-ink" : "border-transparent"}`} />
                    </div>
                    <p className="mt-2 truncate text-xs">{s.short}</p>
                    <p className="text-xs text-muted">{eur(starterTotal(s))}</p>
                  </button>
                  {on && <input type="hidden" name="starter" value={s.id} />}
                </li>
              );
            })}
          </ul>
          {chosen.length > 0 && (
            <p className="mt-4 text-sm text-muted">
              {chosen.length} envie{chosen.length > 1 ? "s" : ""} · {eur(chosen.reduce((a, s) => a + starterTotal(s), 0))}
            </p>
          )}
        </div>
      )}

      <Submit disabled={!ready} label={t.create} />
    </form>
  );
}

function Step({ n, title, note }: { n: string; title: string; note?: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-line pb-3">
      <span className="caps text-brass">{n}</span>
      <span className="text-lg">{title}</span>
      {note && <span className="ml-auto hidden text-xs text-muted sm:inline">{note}</span>}
    </div>
  );
}

function Submit({ disabled, label }: { disabled: boolean; label: string }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={disabled || pending} className="btn-primary w-full !py-5 text-[12px] uppercase tracking-label">
      {pending ? "Création…" : label}
    </button>
  );
}
