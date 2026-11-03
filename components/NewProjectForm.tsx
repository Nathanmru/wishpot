"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createProject } from "@/app/actions";

type T = Record<
  "step1" | "step2" | "step3" | "travel" | "home" | "travelDesc" | "homeDesc" | "namePhTravel" | "namePhHome" | "monthlyHint" | "create" | "perMonth",
  string
>;

const PRESETS = [50, 100, 200, 300];

export default function NewProjectForm({ initialKind, t }: { initialKind: "travel" | "home" | null; t: T }) {
  const [kind, setKind] = useState<"travel" | "home" | null>(initialKind);
  const [monthly, setMonthly] = useState("100");

  return (
    <form action={createProject} className="mt-8 space-y-8">
      <fieldset>
        <legend className="label">1 · {t.step1}</legend>
        <input type="hidden" name="kind" value={kind ?? ""} />
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["travel", "✈️", t.travel, t.travelDesc, "border-sea bg-sea-soft"],
              ["home", "🛋️", t.home, t.homeDesc, "border-terra bg-terra-soft"],
            ] as const
          ).map(([k, emoji, title, desc, active]) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={`rounded-xl2 border-2 p-4 text-left transition ${kind === k ? active : "border-line bg-white hover:border-muted"}`}
            >
              <span className="text-2xl">{emoji}</span>
              <p className="mt-2 font-semibold">{title}</p>
              <p className="text-sm text-muted">{desc}</p>
            </button>
          ))}
        </div>
      </fieldset>

      <div className={kind ? "" : "pointer-events-none opacity-40"}>
        <label htmlFor="name" className="label">2 · {t.step2}</label>
        <input
          id="name"
          name="name"
          required
          maxLength={80}
          className="input"
          placeholder={kind === "travel" ? t.namePhTravel : t.namePhHome}
        />
      </div>

      <div className={kind ? "" : "pointer-events-none opacity-40"}>
        <label htmlFor="monthly" className="label">3 · {t.step3}</label>
        <div className="flex items-center gap-2">
          <input
            id="monthly"
            name="monthly"
            inputMode="decimal"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            className="input max-w-[10rem] text-lg font-semibold"
          />
          <span className="text-muted">€ {t.perMonth}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setMonthly(String(p))}
              className={`rounded-full border px-3 py-1 text-sm ${monthly === String(p) ? "border-ink bg-ink text-cream" : "border-line bg-white"}`}
            >
              {p} €
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">{t.monthlyHint}</p>
      </div>

      <Submit disabled={!kind} label={t.create} />
    </form>
  );
}

function Submit({ disabled, label }: { disabled: boolean; label: string }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={disabled || pending} className="btn-accent w-full !py-3 text-base">
      {pending ? "…" : label}
    </button>
  );
}
