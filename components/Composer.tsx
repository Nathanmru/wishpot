"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Kind } from "@/lib/config";
import { encodeExtra, startersFor, starterTotal, type Extra } from "@/lib/starters";

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
      setV(a + (target - a) * e);
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

const DEFAULT: Record<Kind, string[]> = { home: ["canape", "tapis", "lampe"], travel: ["vols", "hotel", "visites"] };

const PRESETS: Record<Kind, { fr: string; en: string }[]> = {
  home: [
    { fr: "Premier appartement", en: "First flat" },
    { fr: "Refaire le salon", en: "New living room" },
    { fr: "La chambre", en: "The bedroom" },
    { fr: "Crémaillère", en: "Housewarming" },
  ],
  travel: [
    { fr: "Voyage de noces", en: "Honeymoon" },
    { fr: "Vacances entre amis", en: "Friends' holiday" },
    { fr: "Japon", en: "Japan" },
    { fr: "Week-end en amoureux", en: "Romantic weekend" },
  ],
};

export default function Composer({ lang = "fr" }: { lang?: "fr" | "en" }) {
  const fr = lang === "fr";
  const [kind, setKindState] = useState<Kind>("home");
  const [names, setNames] = useState<Record<Kind, string>>({
    home: fr ? "Premier appartement" : "First flat",
    travel: fr ? "Voyage de noces" : "Honeymoon",
  });
  const [picked, setPicked] = useState<Record<Kind, string[]>>(DEFAULT);
  const [extras, setExtras] = useState<Record<Kind, Extra[]>>({ home: [], travel: [] });
  const [people, setPeople] = useState(2);
  const [monthly, setMonthly] = useState(100);
  const [adding, setAdding] = useState(false);
  const [xTitle, setXTitle] = useState("");
  const [xPrice, setXPrice] = useState("");

  // Le choix fait dans l'en-tête (Maison / Voyage) suit jusqu'ici
  useEffect(() => {
    const on = (e: Event) => {
      const k = (e as CustomEvent).detail;
      if (k === "home" || k === "travel") setKindState(k);
    };
    window.addEventListener("wp-kind", on);
    return () => window.removeEventListener("wp-kind", on);
  }, []);

  const setKind = (k: Kind) => {
    setKindState(k);
    setAdding(false);
  };

  const items = startersFor(kind);
  const chosen = items.filter((s) => picked[kind].includes(s.id));
  const mine = extras[kind];
  const total = chosen.reduce((a, s) => a + starterTotal(s), 0) + mine.reduce((a, x) => a + x.price, 0);
  const count = chosen.length + mine.length;
  const perMonth = people * monthly;
  const months = total > 0 && perMonth > 0 ? Math.ceil(total / perMonth) : 0;
  const now = new Date();
  const eta = new Date(now.getFullYear(), now.getMonth() + months, 1);
  const etaLabel = eta.toLocaleDateString(fr ? "fr-FR" : "en-GB", { month: "long", year: "numeric" });

  const tTotal = useTween(total);
  const tMonths = useTween(months);

  const eur = (v: number) =>
    new Intl.NumberFormat(fr ? "fr-FR" : "en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Math.round(v));

  const toggle = (id: string) =>
    setPicked((p) => ({ ...p, [kind]: p[kind].includes(id) ? p[kind].filter((x) => x !== id) : [...p[kind], id] }));

  const addExtra = () => {
    const price = Number(xPrice.replace(",", ".").replace(/[^\d.]/g, ""));
    if (!xTitle.trim() || !Number.isFinite(price) || price <= 0) return;
    setExtras((e) => ({ ...e, [kind]: [...e[kind], { title: xTitle.trim().slice(0, 80), price }] }));
    setXTitle("");
    setXPrice("");
    setAdding(false);
  };

  const q = new URLSearchParams({ kind, monthly: String(monthly), name: names[kind] || (fr ? "Notre projet" : "Our project") });
  if (picked[kind].length) q.set("starter", picked[kind].join(","));
  mine.forEach((x) => q.append("extra", encodeExtra(x)));
  const createHref = `/new?${q.toString()}`;

  const ticks = Math.min(Math.max(months, 1), 24);

  return (
    <section id="essai" className="scroll-mt-16 py-24 sm:py-36">
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end">
        <div>
          <p className="caps text-muted">{fr ? "À vous · sans compte" : "Your turn · no account"}</p>
          <h2 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">{fr ? "Faites l'essai." : "Give it a try."}</h2>
        </div>
        <p className="max-w-md text-muted md:justify-self-end">
          {fr
            ? "Trois réglages et vous voyez quand votre projet sera à portée de main. Rien n'est enregistré tant que vous ne créez pas la cagnotte."
            : "Three settings and you'll see when your project is within reach. Nothing is saved until you create the pot."}
        </p>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.45fr_1fr] lg:gap-16">
        <div className="space-y-14">
          {/* 01 — Le projet */}
          <div>
            <StepHead n="01" title={fr ? "Votre projet" : "Your project"} />
            <div className="mt-6 grid grid-cols-2 gap-px border border-line bg-line">
              {(["home", "travel"] as Kind[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  aria-pressed={kind === k}
                  className={`px-5 py-5 text-left transition ${kind === k ? "bg-night text-bone" : "bg-paper hover:bg-white"}`}
                >
                  <span className="display block text-2xl sm:text-3xl">{k === "home" ? (fr ? "Maison" : "Home") : fr ? "Voyage" : "Travel"}</span>
                  <span className={`mt-1 block text-xs ${kind === k ? "text-bone/60" : "text-muted"}`}>
                    {k === "home" ? (fr ? "Meubler, décorer, emménager" : "Furnish, decorate, move in") : fr ? "Partir à deux ou entre amis" : "Travel as a couple or with friends"}
                  </span>
                </button>
              ))}
            </div>
            <label className="mt-8 block">
              <span className="caps text-muted">{fr ? "Son nom" : "Its name"}</span>
              <input
                value={names[kind]}
                onChange={(e) => setNames((n) => ({ ...n, [kind]: e.target.value.slice(0, 80) }))}
                className="input-line display mt-2 !text-3xl sm:!text-4xl"
                placeholder={fr ? "Notre projet" : "Our project"}
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-2">
              {PRESETS[kind].map((p) => {
                const label = fr ? p.fr : p.en;
                const on = names[kind] === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setNames((n) => ({ ...n, [kind]: label }))}
                    className={`border px-3 py-1.5 text-xs transition ${on ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 02 — Les envies */}
          <div>
            <StepHead n="02" title={fr ? "Vos envies" : "Your wishes"} note={fr ? "Touchez pour ajouter ou retirer" : "Tap to add or remove"} />
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3">
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
                          } ${on ? "" : "opacity-55 grayscale-[40%]"}`}
                        />
                        <span
                          aria-hidden
                          className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border text-xs transition ${
                            on ? "border-ink bg-ink text-white" : "border-ink/25 bg-paper/90 text-ink/50"
                          }`}
                        >
                          {on ? "✓" : "+"}
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

              {mine.map((x, i) => (
                <li key={`${x.title}-${i}`}>
                  <div className="relative flex aspect-square flex-col justify-end border-2 border-ink bg-white p-4">
                    <p className="caps text-muted">{fr ? "Votre envie" : "Your wish"}</p>
                    <p className="display mt-2 line-clamp-3 text-xl leading-tight">{x.title}</p>
                    <button
                      type="button"
                      onClick={() => setExtras((e) => ({ ...e, [kind]: e[kind].filter((_, j) => j !== i) }))}
                      aria-label={fr ? "Retirer" : "Remove"}
                      className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs text-white"
                    >
                      ×
                    </button>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-3">
                    <span className="truncate text-sm">{x.title}</span>
                    <span className="shrink-0 text-sm text-muted">{eur(x.price)}</span>
                  </div>
                </li>
              ))}

              <li>
                {adding ? (
                  <div className="flex aspect-square flex-col justify-between border border-ink bg-white p-4">
                    <input
                      autoFocus
                      value={xTitle}
                      onChange={(e) => setXTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addExtra()}
                      placeholder={kind === "home" ? (fr ? "Ex. Table en chêne" : "E.g. Oak table") : fr ? "Ex. Location de voiture" : "E.g. Car rental"}
                      className="w-full border-b border-line bg-transparent pb-2 text-sm outline-none focus:border-ink"
                    />
                    <div className="flex items-end gap-2">
                      <input
                        value={xPrice}
                        onChange={(e) => setXPrice(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addExtra()}
                        inputMode="decimal"
                        placeholder={fr ? "Prix" : "Price"}
                        className="w-full border-b border-line bg-transparent pb-2 text-sm outline-none focus:border-ink"
                      />
                      <span className="pb-2 text-sm text-muted">€</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <button type="button" onClick={() => setAdding(false)} className="text-xs text-muted hover:text-ink">
                        {fr ? "Annuler" : "Cancel"}
                      </button>
                      <button type="button" onClick={addExtra} className="caps bg-ink px-3 py-2 text-white">
                        {fr ? "Ajouter" : "Add"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAdding(true)}
                    className="flex aspect-square w-full flex-col items-center justify-center border border-dashed border-ink/30 text-center transition hover:border-ink hover:bg-white"
                  >
                    <span className="display text-4xl font-light">+</span>
                    <span className="mt-2 px-3 text-sm">{fr ? "Ajouter la vôtre" : "Add your own"}</span>
                  </button>
                )}
                <p className="mt-3 text-xs text-muted">{fr ? "Plus tard : collez un lien de boutique" : "Later: paste a shop link"}</p>
              </li>
            </ul>
          </div>

          {/* 03 — Le rythme */}
          <div>
            <StepHead n="03" title={fr ? "Votre rythme" : "Your pace"} />
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="caps text-muted">{fr ? "Combien êtes-vous ?" : "How many of you?"}</p>
                <div className="mt-4 flex items-center gap-5">
                  <button
                    type="button"
                    onClick={() => setPeople((n) => Math.max(1, n - 1))}
                    className="h-11 w-11 border border-line text-lg transition hover:border-ink"
                    aria-label={fr ? "Une personne de moins" : "One less"}
                  >
                    −
                  </button>
                  <span className="display min-w-[5.5rem] text-center text-3xl">
                    {people} <span className="text-base text-muted">{fr ? (people > 1 ? "pers." : "pers.") : people > 1 ? "people" : "person"}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setPeople((n) => Math.min(12, n + 1))}
                    className="h-11 w-11 border border-line text-lg transition hover:border-ink"
                    aria-label={fr ? "Une personne de plus" : "One more"}
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="caps text-muted">{fr ? "Chacun met de côté" : "Each saves"}</p>
                  <p className="display text-3xl">
                    {eur(monthly)}
                    <span className="text-base text-muted"> {fr ? "/ mois" : "/ mo"}</span>
                  </p>
                </div>
                <input
                  type="range"
                  min={25}
                  max={500}
                  step={25}
                  value={monthly}
                  onChange={(e) => setMonthly(Number(e.target.value))}
                  aria-label={fr ? "Montant mis de côté par personne et par mois" : "Monthly amount per person"}
                  className="mt-5 w-full accent-[#15120F]"
                />
                <div className="mt-1 flex justify-between text-[11px] text-muted">
                  <span>25 €</span>
                  <span>500 €</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Le résultat : un aperçu de la future cagnotte */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="bg-night p-6 text-bone sm:p-8">
            <p className="caps text-bone/50">
              {fr ? "Aperçu" : "Preview"} · {kind === "home" ? (fr ? "Cagnotte maison" : "Home pot") : fr ? "Cagnotte voyage" : "Travel pot"}
            </p>
            <p className="display mt-3 truncate text-3xl sm:text-4xl">{names[kind] || (fr ? "Notre projet" : "Our project")}</p>

            <div className="mt-7 grid grid-cols-2 gap-px bg-bone/15">
              <div className="bg-night py-3 pr-3">
                <p className="caps text-bone/50">{fr ? "Objectif" : "Goal"}</p>
                <p className="display mt-1 text-3xl">{eur(tTotal)}</p>
                <p className="text-xs text-bone/50">
                  {count} {fr ? (count > 1 ? "envies" : "envie") : count > 1 ? "wishes" : "wish"}
                </p>
              </div>
              <div className="bg-night py-3 pl-4">
                <p className="caps text-bone/50">{fr ? "Ensemble" : "Together"}</p>
                <p className="display mt-1 text-3xl">{eur(perMonth)}</p>
                <p className="text-xs text-bone/50">{fr ? `par mois, à ${people}` : `a month, ${people} of you`}</p>
              </div>
            </div>

            <div className="mt-7 border-t border-bone/15 pt-6">
              <p className="caps text-bone/50">{fr ? "Vous y serez en" : "You'll be there by"}</p>
              {total > 0 ? (
                <>
                  <p className="display mt-2 text-4xl capitalize sm:text-5xl">{etaLabel}</p>
                  <p className="mt-1 text-sm text-bone/60">
                    {fr ? "dans" : "in"} {Math.round(tMonths)} {fr ? "mois" : Math.round(tMonths) > 1 ? "months" : "month"}
                  </p>
                  <div className="mt-5 flex items-end gap-[3px]" aria-hidden>
                    {Array.from({ length: ticks }, (_, i) => (
                      <span
                        key={`${kind}-${ticks}-${i}`}
                        className={`block w-full bg-bone transition-all duration-500 ${i === ticks - 1 ? "h-6" : "h-3 opacity-25"}`}
                        style={{ transitionDelay: `${i * 25}ms` }}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-3 text-bone/60">{fr ? "Choisissez au moins une envie." : "Pick at least one wish."}</p>
              )}
            </div>

            <Link
              href={total > 0 ? createHref : "#essai"}
              aria-disabled={total === 0}
              className={`btn mt-8 w-full bg-bone !py-4 text-[12px] uppercase tracking-label text-ink hover:bg-white ${total === 0 ? "pointer-events-none opacity-40" : ""}`}
            >
              {fr ? "Créer cette cagnotte" : "Create this pot"} →
            </Link>
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            {fr ? "Gratuit · connexion Google en un clic · tout reste modifiable" : "Free · one-click Google sign-in · everything stays editable"}
          </p>
        </aside>
      </div>
    </section>
  );
}

function StepHead({ n, title, note }: { n: string; title: string; note?: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-line pb-3">
      <span className="caps text-brass">{n}</span>
      <span className="text-lg">{title}</span>
      {note && <span className="ml-auto hidden text-xs text-muted sm:inline">{note}</span>}
    </div>
  );
}
