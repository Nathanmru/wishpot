"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Kind } from "@/lib/config";
import { startersFor, starterTotal } from "@/lib/starters";

/** Chiffre qui glisse en douceur vers sa nouvelle valeur. */
function useTween(target: number, ms = 600) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      const cur = a + (target - a) * e;
      setV(cur);
      if (k < 1) raf = requestAnimationFrame(step);
      else from.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      from.current = target;
    };
  }, [target, ms]);
  return v;
}

const DEFAULT: Record<Kind, string[]> = { home: ["canape", "tapis", "lampe"], travel: ["vols", "ryokan", "hotel"] };

export default function Composer({ lang = "fr" }: { lang?: "fr" | "en" }) {
  const fr = lang === "fr";
  const [kind, setKind] = useState<Kind>("home");
  const [picked, setPicked] = useState<Record<Kind, string[]>>(DEFAULT);
  const [people, setPeople] = useState(2);
  const [monthly, setMonthly] = useState(100);

  const items = startersFor(kind);
  const chosen = items.filter((s) => picked[kind].includes(s.id));
  const total = chosen.reduce((a, s) => a + starterTotal(s), 0);
  const perMonth = people * monthly;
  const months = total > 0 && perMonth > 0 ? Math.ceil(total / perMonth) : 0;
  const eta = new Date(new Date().getFullYear(), new Date().getMonth() + months, 1);
  const etaLabel = eta.toLocaleDateString(fr ? "fr-FR" : "en-GB", { month: "long", year: "numeric" });

  const tTotal = useTween(total);
  const tMonths = useTween(months);

  const eur = (v: number) =>
    new Intl.NumberFormat(fr ? "fr-FR" : "en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Math.round(v));

  const toggle = (id: string) =>
    setPicked((p) => ({ ...p, [kind]: p[kind].includes(id) ? p[kind].filter((x) => x !== id) : [...p[kind], id] }));

  const q = new URLSearchParams({
    kind,
    monthly: String(monthly),
    name: kind === "home" ? (fr ? "Notre intérieur" : "Our home") : fr ? "Japon" : "Japan",
    starter: picked[kind].join(","),
  });
  const createHref = `/new?${q.toString()}`;

  const ticks = Math.min(Math.max(months, 1), 24);

  return (
    <section id="essai" className="scroll-mt-20 py-24 sm:py-36">
      <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
        <div>
          <p className="caps text-muted">{fr ? "Essayer sans compte · 30 secondes" : "Try it without an account · 30 seconds"}</p>
          <h2 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">{fr ? "Composez votre projet." : "Compose your project."}</h2>
        </div>
        <p className="max-w-md text-muted md:justify-self-end">
          {fr
            ? "Choisissez quelques envies, dites combien chacun met de côté : la date d'arrivée se calcule sous vos yeux."
            : "Pick a few wishes, say how much each of you saves: the arrival date updates as you go."}
        </p>
      </div>

      <div className="mt-12 flex gap-8 border-b border-line">
        {(["home", "travel"] as Kind[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            aria-pressed={kind === k}
            className={`caps -mb-px border-b-2 pb-4 transition ${kind === k ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"}`}
          >
            {k === "home" ? (fr ? "Meubler un intérieur" : "Furnish a home") : fr ? "Préparer un voyage" : "Plan a trip"}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        {/* Les envies */}
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
          {items.map((s) => {
            const on = picked[kind].includes(s.id);
            return (
              <li key={s.id}>
                <button type="button" onClick={() => toggle(s.id)} aria-pressed={on} className="group block w-full text-left">
                  <div className={`relative aspect-square overflow-hidden ${s.packshot ? "bg-white" : "bg-night"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.img}
                      alt=""
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className={`h-full w-full transition duration-700 ease-out group-hover:scale-[1.05] ${
                        s.packshot ? "object-contain p-5 mix-blend-multiply" : "object-cover"
                      } ${on ? "" : "opacity-60 grayscale-[35%]"}`}
                    />
                    <span
                      className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border text-sm transition ${
                        on ? "border-ink bg-ink text-white" : "border-ink/30 bg-paper/90 text-transparent"
                      }`}
                      aria-hidden
                    >
                      ✓
                    </span>
                    <span className={`pointer-events-none absolute inset-0 border-2 transition ${on ? "border-ink" : "border-transparent"}`} />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-3">
                    <span className="text-sm">{s.short}</span>
                    <span className="shrink-0 text-sm text-muted">{eur(starterTotal(s))}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Le résultat */}
        <aside className="h-fit border border-line bg-white p-6 sm:p-8 lg:sticky lg:top-28">
          <p className="caps text-muted">{fr ? "Votre projet" : "Your project"}</p>
          <p className="display mt-3 text-5xl sm:text-6xl">{eur(tTotal)}</p>
          <p className="mt-1 text-sm text-muted">
            {chosen.length} {fr ? (chosen.length > 1 ? "envies" : "envie") : chosen.length > 1 ? "wishes" : "wish"}
          </p>

          <div className="mt-8 grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-6 border-t border-line pt-6">
            <span className="caps text-muted">{fr ? "Vous êtes" : "You are"}</span>
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => setPeople((n) => Math.max(1, n - 1))}
                className="h-9 w-9 border border-line text-lg transition hover:border-ink"
                aria-label={fr ? "Une personne de moins" : "One less"}
              >
                −
              </button>
              <span className="display w-24 text-center text-2xl">
                {people} {fr ? (people > 1 ? "pers." : "pers.") : people > 1 ? "people" : "person"}
              </span>
              <button
                type="button"
                onClick={() => setPeople((n) => Math.min(8, n + 1))}
                className="h-9 w-9 border border-line text-lg transition hover:border-ink"
                aria-label={fr ? "Une personne de plus" : "One more"}
              >
                +
              </button>
            </div>

            <span className="caps text-muted">{fr ? "Chacun met" : "Each saves"}</span>
            <span className="display text-right text-2xl">
              {eur(monthly)} <span className="text-base text-muted">{fr ? "/ mois" : "/ month"}</span>
            </span>
            <input
              type="range"
              min={25}
              max={500}
              step={25}
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              aria-label={fr ? "Montant mis de côté par personne et par mois" : "Monthly amount per person"}
              className="col-span-2 w-full accent-[#15120F]"
            />
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <p className="caps text-muted">{fr ? "Vous y serez en" : "You'll be there by"}</p>
            {total > 0 ? (
              <>
                <p className="display mt-3 text-4xl capitalize sm:text-5xl">{etaLabel}</p>
                <p className="mt-1 text-sm text-muted">
                  {fr ? "dans" : "in"} {Math.round(tMonths)} {fr ? "mois" : Math.round(tMonths) > 1 ? "months" : "month"} · {eur(perMonth)}{" "}
                  {fr ? "par mois à" : "a month for"} {people}
                </p>
                <div className="mt-5 flex items-end gap-[3px]" aria-hidden>
                  {Array.from({ length: ticks }, (_, i) => (
                    <span
                      key={`${kind}-${i}`}
                      className={`block w-full origin-bottom bg-ink transition-all duration-500 ${i === ticks - 1 ? "h-6" : "h-3 opacity-30"}`}
                      style={{ transitionDelay: `${i * 25}ms` }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-3 text-muted">{fr ? "Choisissez au moins une envie." : "Pick at least one wish."}</p>
            )}
          </div>

          <Link
            href={total > 0 ? createHref : "#essai"}
            aria-disabled={total === 0}
            className={`btn-primary mt-8 w-full !py-4 text-[12px] uppercase tracking-label ${total === 0 ? "pointer-events-none opacity-40" : ""}`}
          >
            {fr ? "Créer cette cagnotte" : "Create this pot"}
          </Link>
          <p className="mt-3 text-center text-xs text-muted">
            {fr ? "Gratuit · sans carte bancaire · tout reste modifiable" : "Free · no card · everything stays editable"}
          </p>
        </aside>
      </div>
    </section>
  );
}
