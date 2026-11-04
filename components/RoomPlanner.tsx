"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CATALOG_ROOMS, CATEGORIES } from "@/lib/catalog";
import { ROOM_BUDGET, buildKit, kitTotal, type KitProduct, type KitSlot } from "@/lib/roomkit";

/** Chiffre qui glisse vers sa nouvelle valeur. */
function useTween(target: number, ms = 600) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      setV(a + (target - a) * (1 - Math.pow(1 - k, 3)));
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

const NAMES: Record<string, string> = {
  salon: "Notre salon",
  chambre: "Notre chambre",
  "salle-a-manger": "Notre salle à manger",
  cuisine: "Notre cuisine",
  "salle-de-bain": "Notre salle de bain",
  bureau: "Notre bureau",
  entree: "Notre entrée",
  exterieur: "Notre balcon",
};

export default function RoomPlanner({ lang = "fr" }: { lang?: "fr" | "en" }) {
  const fr = lang === "fr";
  const [room, setRoom] = useState("salon");
  const [cache, setCache] = useState<Record<string, KitProduct[]>>({});
  const [budget, setBudget] = useState<Record<string, number>>({});
  const [picks, setPicks] = useState<Record<string, Record<string, number>>>({});
  const [off, setOff] = useState<Record<string, string[]>>({});
  const [people, setPeople] = useState(2);
  const [monthly, setMonthly] = useState(100);
  const [flip, setFlip] = useState<Record<string, number>>({});

  const range = ROOM_BUDGET[room];
  const b = budget[room] ?? range.def;
  const products = cache[room];

  // Le choix fait dans l'en-tête suit jusqu'ici
  useEffect(() => {
    const on = (e: Event) => {
      const r = (e as CustomEvent).detail;
      if (typeof r === "string" && ROOM_BUDGET[r]) setRoom(r);
    };
    window.addEventListener("wp-room", on);
    return () => window.removeEventListener("wp-room", on);
  }, []);

  useEffect(() => {
    if (cache[room]) return;
    let live = true;
    fetch(`/api/kit?room=${room}`)
      .then((r) => r.json())
      .then((d) => live && setCache((c) => ({ ...c, [room]: d.products ?? [] })))
      .catch(() => live && setCache((c) => ({ ...c, [room]: [] })));
    return () => {
      live = false;
    };
  }, [room, cache]);

  // Le budget recompose la pièce ; les choix manuels sont oubliés quand il change.
  const base = useMemo(() => (products ? buildKit(room, products, b) : []), [room, products, b]);
  const slots: KitSlot[] = base.map((s) => ({ ...s, pick: Math.min(picks[room]?.[s.cat] ?? 0, s.options.length - 1) }));
  const offSet = new Set(off[room] ?? []);
  const total = kitTotal(slots, offSet);
  const count = slots.filter((s) => !offSet.has(s.cat)).length;
  const perMonth = people * monthly;
  const months = total > 0 ? Math.ceil(total / perMonth) : 0;
  const now = new Date();
  const eta = new Date(now.getFullYear(), now.getMonth() + months, 1).toLocaleDateString(fr ? "fr-FR" : "en-GB", { month: "long", year: "numeric" });
  const tTotal = useTween(total);
  const tMonths = useTween(months);

  const eur = (v: number) =>
    new Intl.NumberFormat(fr ? "fr-FR" : "en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Math.round(v));

  const roomInfo = CATALOG_ROOMS.find((r) => r.id === room)!;
  const roomLabel = fr ? roomInfo.fr : roomInfo.en;

  const swap = (cat: string, dir: number, n: number) => {
    const cur = picks[room]?.[cat] ?? 0;
    setPicks((p) => ({ ...p, [room]: { ...(p[room] ?? {}), [cat]: (cur + dir + n) % n } }));
    setFlip((f) => ({ ...f, [cat]: (f[cat] ?? 0) + dir }));
  };
  const toggle = (cat: string) =>
    setOff((o) => {
      const cur = new Set(o[room] ?? []);
      if (cur.has(cat)) cur.delete(cat);
      else cur.add(cat);
      return { ...o, [room]: [...cur] };
    });
  const setB = (v: number) => {
    setBudget((x) => ({ ...x, [room]: v }));
    setPicks((p) => ({ ...p, [room]: {} }));
  };

  const chosen = slots.filter((s) => !offSet.has(s.cat));
  const q = new URLSearchParams({ monthly: String(monthly), name: fr ? NAMES[room] : `Our ${roomInfo.en.toLowerCase()}` });
  if (chosen.length) q.set("product", chosen.map((s) => `${s.options[s.pick].id}${s.qty > 1 ? `:${s.qty}` : ""}`).join(","));
  const createHref = `/new?${q.toString()}`;

  return (
    <section id="essai" className="scroll-mt-16 py-24 sm:py-36">
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end">
        <div>
          <p className="caps text-muted">{fr ? "Essayer sans compte" : "Try it, no account"}</p>
          <h2 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">{fr ? "Une pièce, un budget." : "One room, one budget."}</h2>
        </div>
        <p className="max-w-md text-muted md:justify-self-end">
          {fr
            ? "Choisissez la pièce et ce que vous voulez y mettre : nous composons une sélection complète, de vraies pièces de vraies enseignes. Changez ce qui ne vous plaît pas d'un geste."
            : "Pick a room and what you want to spend: we put together a complete selection of real pieces from real shops. Swap anything with a tap."}
        </p>
      </div>

      {/* Les pièces */}
      <div className="-mx-4 mt-12 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
        {CATALOG_ROOMS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRoom(r.id)}
            aria-pressed={room === r.id}
            className={`group relative h-24 w-32 shrink-0 overflow-hidden text-left sm:h-28 sm:w-40 ${room === r.id ? "" : "opacity-70 hover:opacity-100"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.img.replace("w=1200", "w=400")} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <span className="display absolute bottom-2 left-3 text-lg text-white">{fr ? r.fr : r.en}</span>
            <span className={`pointer-events-none absolute inset-0 border-[3px] transition ${room === r.id ? "border-ink" : "border-transparent"}`} />
          </button>
        ))}
      </div>

      {/* Le budget de la pièce */}
      <div className="mt-10 grid gap-4 border-y border-line py-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10">
        <p className="display text-3xl sm:text-4xl">
          {eur(b)} <span className="text-base text-muted">{fr ? "de budget" : "budget"} · {roomLabel}</span>
        </p>
        <div>
          <input
            type="range"
            min={range.min}
            max={range.max}
            step={50}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            aria-label={fr ? "Budget de la pièce" : "Room budget"}
            className="w-full accent-[#15120F]"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted">
            <span>{eur(range.min)}</span>
            <span>{fr ? "Faites glisser : la sélection se recompose" : "Slide: the selection rebuilds"}</span>
            <span>{eur(range.max)}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
        {/* La sélection */}
        <div>
          {!products ? (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <li key={i} className="aspect-[3/4] animate-pulse bg-white" />
              ))}
            </ul>
          ) : (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
              {slots.map((s) => {
                const p = s.options[s.pick];
                const isOff = offSet.has(s.cat);
                const n = s.options.length;
                return (
                  <li key={s.cat} className={`transition duration-500 ${isOff ? "opacity-35" : ""}`}>
                    <div className="flex items-center justify-between">
                      <span className="caps text-muted">
                        {CATEGORIES[s.cat]?.[lang] ?? s.cat}
                        {s.qty > 1 ? ` × ${s.qty}` : ""}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggle(s.cat)}
                        className="text-xs text-muted underline-offset-2 hover:text-ink hover:underline"
                      >
                        {isOff ? (fr ? "Remettre" : "Add back") : fr ? "Retirer" : "Remove"}
                      </button>
                    </div>
                    <div className="mt-2 [perspective:1200px]">
                      <div
                        key={`${p.id}-${flip[s.cat] ?? 0}`}
                        className="wp-card-in relative aspect-square overflow-hidden bg-white"
                        style={{ ["--from" as string]: (flip[s.cat] ?? 0) % 2 ? "-1" : "1" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image_url} alt="" referrerPolicy="no-referrer" loading="lazy" className="h-full w-full object-contain p-4 mix-blend-multiply" />
                        {n > 1 && !isOff && (
                          <div className="absolute inset-x-2 bottom-2 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => swap(s.cat, -1, n)}
                              aria-label={fr ? "Proposition précédente" : "Previous"}
                              className="flex h-8 w-8 items-center justify-center bg-paper/95 text-sm shadow-sm transition hover:bg-ink hover:text-white"
                            >
                              ←
                            </button>
                            <span className="bg-paper/90 px-2 py-1 text-[10px] tabular-nums text-muted">
                              {s.pick + 1}/{n}
                            </span>
                            <button
                              type="button"
                              onClick={() => swap(s.cat, 1, n)}
                              aria-label={fr ? "Proposition suivante" : "Next"}
                              className="flex h-8 w-8 items-center justify-center bg-paper/95 text-sm shadow-sm transition hover:bg-ink hover:text-white"
                            >
                              →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-snug">{p.title}</p>
                    <p className="mt-1 flex items-baseline justify-between gap-2 text-sm">
                      <span className="caps text-muted">{p.shop}</span>
                      <span>{eur(p.price * s.qty)}</span>
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
          <Link href={`/catalogue?piece=${room}`} className="link-caps mt-10">
            {fr ? `Tout le catalogue ${roomLabel.toLowerCase()}` : `The full ${roomLabel.toLowerCase()} catalogue`} →
          </Link>
        </div>

        {/* Le résultat */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="bg-night p-6 text-bone sm:p-8">
            <p className="caps text-bone/50">{fr ? "Votre cagnotte" : "Your pot"}</p>
            <p className="display mt-3 text-3xl sm:text-4xl">{fr ? NAMES[room] : `Our ${roomInfo.en.toLowerCase()}`}</p>

            <div className="mt-7 grid grid-cols-2 gap-px bg-bone/15">
              <div className="bg-night py-3 pr-3">
                <p className="caps text-bone/50">{fr ? "Total" : "Total"}</p>
                <p className="display mt-1 text-3xl">{eur(tTotal)}</p>
                <p className="text-xs text-bone/50">
                  {count} {fr ? (count > 1 ? "pièces" : "pièce") : count > 1 ? "pieces" : "piece"}
                </p>
              </div>
              <div className="bg-night py-3 pl-4">
                <p className="caps text-bone/50">{fr ? "Ensemble" : "Together"}</p>
                <p className="display mt-1 text-3xl">{eur(perMonth)}</p>
                <p className="text-xs text-bone/50">{fr ? "par mois" : "a month"}</p>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-5 border-t border-bone/15 pt-6">
              <span className="caps text-bone/50">{fr ? "Vous êtes" : "You are"}</span>
              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => setPeople((n) => Math.max(1, n - 1))} className="h-9 w-9 border border-bone/25 hover:border-bone" aria-label="−">
                  −
                </button>
                <span className="display w-16 text-center text-2xl">{people}</span>
                <button type="button" onClick={() => setPeople((n) => Math.min(12, n + 1))} className="h-9 w-9 border border-bone/25 hover:border-bone" aria-label="+">
                  +
                </button>
              </div>
              <span className="caps text-bone/50">{fr ? "Chacun met" : "Each saves"}</span>
              <span className="display text-right text-2xl">
                {eur(monthly)} <span className="text-sm text-bone/50">{fr ? "/ mois" : "/ mo"}</span>
              </span>
              <input
                type="range"
                min={25}
                max={500}
                step={25}
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
                aria-label={fr ? "Montant par personne et par mois" : "Monthly amount per person"}
                className="col-span-2 w-full accent-[#EFEAE2]"
              />
            </div>

            <div className="mt-7 border-t border-bone/15 pt-6">
              <p className="caps text-bone/50">{fr ? "Prêt en" : "Ready by"}</p>
              <p className="display mt-2 text-4xl capitalize sm:text-5xl">{total > 0 ? eta : "—"}</p>
              {total > 0 && (
                <p className="mt-1 text-sm text-bone/60">
                  {fr ? "dans" : "in"} {Math.round(tMonths)} {fr ? "mois" : "months"}
                </p>
              )}
            </div>

            <Link
              href={total > 0 ? createHref : "#essai"}
              className={`btn mt-8 w-full bg-bone !py-4 text-[12px] uppercase tracking-label text-ink hover:bg-white ${total === 0 ? "pointer-events-none opacity-40" : ""}`}
            >
              {fr ? "Créer cette cagnotte" : "Create this pot"} →
            </Link>
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            {fr ? "Gratuit · tout reste modifiable · ajoutez vos propres trouvailles" : "Free · everything stays editable · add your own finds"}
          </p>
        </aside>
      </div>

      {/* Mobile : le total reste sous les yeux */}
      <div className="sticky bottom-3 z-10 mt-8 flex items-center gap-4 bg-night px-5 py-4 text-bone shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="display text-xl">{eur(tTotal)}</p>
          <p className="truncate text-xs capitalize text-bone/60">{total > 0 ? eta : ""}</p>
        </div>
        <Link href={total > 0 ? createHref : "#essai"} className="caps shrink-0 bg-bone px-4 py-3 text-ink">
          {fr ? "Créer" : "Create"} →
        </Link>
      </div>
    </section>
  );
}
