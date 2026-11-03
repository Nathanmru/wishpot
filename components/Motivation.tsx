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
    <div className="mt-6 rounded-xl2 bg-paper p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold">{fr ? "Et si on mettait un peu plus ?" : "What if we saved a bit more?"}</p>
        <p className="text-sm text-muted">
          +{fmt(extra)} {fr ? "/ mois" : "/ month"}
        </p>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={10}
        value={extra}
        onChange={(e) => setExtra(Number(e.target.value))}
        className="mt-3 w-full accent-[#8A5A3B]"
        aria-label={fr ? "Montant en plus par mois" : "Extra per month"}
      />
      <p className="mt-2 text-sm">
        {sim ? (
          <>
            {fr ? "Prêt en" : "Ready by"} <b className="capitalize">{sim.label}</b>
            {extra > 0 && gained > 0 && (
              <span className="ml-2 rounded-full bg-moss-soft px-2 py-0.5 text-xs font-semibold text-moss">
                {gained} {fr ? (gained > 1 ? "mois plus tôt" : "mois plus tôt") : gained > 1 ? "months sooner" : "month sooner"}
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
    ? ["", "Un quart du chemin !", "La moitié, bravo !", "Plus que la dernière ligne droite.", "Objectif atteint ! 🎉"][reached]
    : ["", "A quarter of the way!", "Halfway there!", "On the home stretch.", "Goal reached! 🎉"][reached];

  return (
    <>
      <div className="mt-5 flex items-center gap-2">
        {steps.map((s) => (
          <span
            key={s}
            className={`flex h-7 min-w-[3rem] items-center justify-center rounded-full px-2 text-[11px] font-semibold transition ${
              progress >= s ? "bg-ink text-white" : "border border-line text-muted"
            }`}
          >
            {s * 100} %
          </span>
        ))}
        {reached > 0 && <span className="ml-1 text-sm text-muted">{msg}</span>}
      </div>
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
      className="btn-primary w-full"
    >
      {ok ? done : label}
    </button>
  );
}
