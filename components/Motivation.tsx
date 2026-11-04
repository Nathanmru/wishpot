"use client";

import { useEffect, useState } from "react";

/** « Et si on mettait un peu plus ? » : glisser pour voir la date d'arrivée bouger. */
export function Simulator({
  remaining,
  monthly,
  currency,
  lang,
}: {
  remaining: number;
  monthly: number;
  currency: string;
  lang: "fr" | "en";
}) {
  const fr = lang === "fr";
  const [extra, setExtra] = useState(0);
  if (remaining <= 0) return null;

  const fmt = (v: number) => new Intl.NumberFormat(fr ? "fr-FR" : "en-GB", { style: "currency", currency, maximumFractionDigits: 0 }).format(v);
  const when = (perMonth: number) => {
    if (perMonth <= 0) return null;
    const m = Math.ceil(remaining / perMonth);
    const d = new Date(new Date().getFullYear(), new Date().getMonth() + m, 1);
    return { m, label: d.toLocaleDateString(fr ? "fr-FR" : "en-GB", { month: "long", year: "numeric" }) };
  };
  const base = when(monthly);
  const sim = when(monthly + extra);
  const gained = base && sim ? base.m - sim.m : 0;
  const max = Math.max(50, Math.ceil(Math.max(monthly, 100) / 50) * 50);

  return (
    <div className="border border-line bg-white p-6 sm:p-8">
      <p className="caps text-muted">{fr ? "Et si on mettait un peu plus ?" : "What if we saved a bit more?"}</p>
      <p className="display mt-4 text-4xl">
        +{fmt(extra)} <span className="text-lg text-muted">{fr ? "/ mois" : "/ month"}</span>
      </p>
      <input
        type="range"
        min={0}
        max={max}
        step={10}
        value={extra}
        onChange={(e) => setExtra(Number(e.target.value))}
        className="mt-5 w-full accent-[#15120F]"
        aria-label={fr ? "Montant en plus par mois" : "Extra per month"}
      />
      <p className="mt-4 leading-relaxed">
        {sim ? (
          <>
            {fr ? "Vous y seriez en" : "You'd get there by"} <span className="font-medium capitalize">{sim.label}</span>
            {extra > 0 && gained > 0 && (
              <span className="text-muted">
                {" "}
                — {gained} {fr ? "mois plus tôt" : gained > 1 ? "months sooner" : "month sooner"}
              </span>
            )}
          </>
        ) : (
          <span className="text-muted">{fr ? "Glisse pour voir quand vous y serez." : "Slide to see when you'll get there."}</span>
        )}
      </p>
    </div>
  );
}

/** Paliers 25 / 50 / 75 / 100 % + confettis la première fois qu'un palier est franchi. */
export function Milestones({ progress, projectId, lang }: { progress: number; projectId: string; lang: "fr" | "en" }) {
  const fr = lang === "fr";
  const steps = [0.25, 0.5, 0.75, 1];
  const reached = steps.filter((s) => progress >= s).length;
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    if (!reached) return;
    const key = `wp-milestone-${projectId}`;
    let seen = 0;
    try {
      seen = Number(localStorage.getItem(key) || 0);
    } catch {}
    if (reached > seen) {
      setBurst(true);
      try {
        localStorage.setItem(key, String(reached));
      } catch {}
      const t = setTimeout(() => setBurst(false), 3800);
      return () => clearTimeout(t);
    }
  }, [reached, projectId]);

  const msg = fr
    ? ["", "Un quart du chemin !", "La moitié, bravo !", "Plus que la dernière ligne droite.", "Objectif atteint !"][reached]
    : ["", "A quarter of the way!", "Halfway there!", "On the home stretch.", "Goal reached!"][reached];

  return (
    <>
      <div className="relative mt-12">
        <div className="h-px w-full bg-line" />
        <div
          className="absolute left-0 top-[-1px] h-[3px] bg-ink transition-[width] duration-[1600ms] ease-out"
          style={{ width: `${Math.max(progress, 0.004) * 100}%` }}
        />
        {steps.map((s) => (
          <div key={s} className="absolute top-0 -translate-x-1/2" style={{ left: `${s * 100}%` }}>
            <span className={`block h-3 w-px -translate-y-1/2 ${progress >= s ? "bg-ink" : "bg-line"}`} />
            <span className={`caps mt-2 block whitespace-nowrap ${s === 1 ? "-translate-x-1/2" : ""} ${progress >= s ? "text-ink" : "text-muted/70"}`}>
              {s * 100} %
            </span>
          </div>
        ))}
      </div>
      {reached > 0 && <p className="mt-10 text-sm text-muted">{msg}</p>}
      {burst && <Confetti />}
    </>
  );
}

function Confetti() {
  const colors = ["#8A5A3B", "#E9A97A", "#6E7F5E", "#3D4B6B", "#EFEAE2", "#C9A19A"];
  const pieces = Array.from({ length: 90 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    dur: 2.2 + Math.random() * 1.4,
    size: 6 + Math.random() * 6,
    color: colors[i % colors.length],
    rot: Math.random() * 360,
  }));
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <style>{`@keyframes wp-fall{0%{transform:translateY(-10vh) rotate(0)}100%{transform:translateY(110vh) rotate(720deg)}}`}</style>
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.45,
            background: p.color,
            transform: `rotate(${p.rot}deg)`,
            animation: `wp-fall ${p.dur}s ${p.delay}s cubic-bezier(.2,.6,.4,1) forwards`,
          }}
        />
      ))}
    </div>
  );
}

/** Copier le lien public de la liste. */
export function CopyLink({ url, label, done }: { url: string; label: string; done: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          if (navigator.share) await navigator.share({ url });
          else await navigator.clipboard.writeText(url);
          setOk(true);
          setTimeout(() => setOk(false), 2000);
        } catch {}
      }}
      className="btn-primary w-full !py-3 text-[12px] uppercase tracking-label"
    >
      {ok ? done : label}
    </button>
  );
}
