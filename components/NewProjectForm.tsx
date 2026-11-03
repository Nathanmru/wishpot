"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createProject } from "@/app/actions";

type T = Record<
  "step1" | "step2" | "step3" | "travel" | "home" | "travelDesc" | "homeDesc" | "namePhTravel" | "namePhHome" | "monthlyHint" | "create" | "perMonth",
  string
>;

const PRESETS = [50, 100, 200, 300, 500];
const COVERS = {
  home: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=800&q=80",
  travel: "https://images.unsplash.com/photo-1562865582-d6317ab58923?auto=format&fit=crop&w=800&q=80",
};

export default function NewProjectForm({ initialKind, t }: { initialKind: "travel" | "home" | null; t: T }) {
  const [kind, setKind] = useState<"travel" | "home" | null>(initialKind);
  const [monthly, setMonthly] = useState("100");
  const ready = !!kind;

  return (
    <form action={createProject} className="mt-10 space-y-12">
      <fieldset>
        <legend className="mb-4 text-lg font-semibold">
          <span className="display mr-2 text-2xl text-walnut">1</span>
          {t.step1}
        </legend>
        <input type="hidden" name="kind" value={kind ?? ""} />
        <div className="grid gap-4 sm:grid-cols-2">
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
                onClick={() => setKind(k)}
                aria-pressed={active}
                className={`group relative h-48 overflow-hidden rounded-xl3 text-left transition duration-300 ${
                  active ? "ring-4 ring-ink ring-offset-4 ring-offset-paper" : "opacity-90 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={COVERS[k]} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <p className="display text-3xl">{title}</p>
                  <p className="text-sm text-white/80">{desc}</p>
                </div>
                {active && (
                  <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className={`transition ${ready ? "" : "pointer-events-none opacity-40"}`}>
        <label htmlFor="name" className="mb-4 block text-lg font-semibold">
          <span className="display mr-2 text-2xl text-walnut">2</span>
          {t.step2}
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={80}
          className="input !py-4 font-display !text-3xl"
          placeholder={kind === "travel" ? t.namePhTravel : t.namePhHome}
        />
      </div>

      <div className={`transition ${ready ? "" : "pointer-events-none opacity-40"}`}>
        <label htmlFor="monthly" className="mb-4 block text-lg font-semibold">
          <span className="display mr-2 text-2xl text-walnut">3</span>
          {t.step3}
        </label>
        <div className="flex items-baseline gap-3">
          <input
            id="monthly"
            name="monthly"
            inputMode="decimal"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            className="input max-w-[11rem] !py-4 font-display !text-4xl"
          />
          <span className="text-lg text-muted">€ {t.perMonth}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setMonthly(String(p))}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                monthly === String(p) ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40"
              }`}
            >
              {p} €
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">{t.monthlyHint}</p>
      </div>

      <Submit disabled={!ready} label={t.create} />
    </form>
  );
}

function Submit({ disabled, label }: { disabled: boolean; label: string }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={disabled || pending} className="btn-primary w-full !py-4 text-base">
      {pending ? "…" : label}
    </button>
  );
}
