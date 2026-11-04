"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Kind = "home" | "travel";
type Scene = { img: string; word: string; caption: string; href: string };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Choix Maison / Voyage partagé avec la démo plus bas. */
export function announceKind(kind: Kind) {
  window.dispatchEvent(new CustomEvent("wp-kind", { detail: kind }));
}

export function goToDemo(kind?: Kind) {
  if (kind) announceKind(kind);
  document.getElementById("essai")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Accueil : une fenêtre en arche qui montre tour à tour un intérieur et un voyage.
 * En faisant défiler, l'arche s'ouvre jusqu'à remplir tout l'écran.
 */
export default function HeroArch({
  kicker,
  lines,
  sub,
  cta1,
  cta2,
  scenes,
  openTitle,
  openText,
  openLink,
}: {
  kicker: string;
  lines: string[];
  sub: string;
  cta1: string;
  cta2: string;
  scenes: Record<Kind, Scene>;
  openTitle: string;
  openText: string;
  openLink: string;
}) {
  const [kind, setKind] = useState<Kind>("home");
  const [auto, setAuto] = useState(true);
  const wrap = useRef<HTMLElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const after = useRef<HTMLDivElement>(null);

  // Alterne seul tant qu'on n'a rien touché
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setKind((k) => (k === "home" ? "travel" : "home")), 4200);
    return () => clearInterval(t);
  }, [auto]);

  const pick = (k: Kind) => {
    setAuto(false);
    setKind(k);
    announceKind(k);
  };

  // L'arche s'ouvre au défilement
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const el = wrap.current;
      const s = slot.current;
      const L = layer.current;
      if (!el || !s || !L) return;
      const W = L.clientWidth;
      const H = L.clientHeight;
      const total = el.offsetHeight - window.innerHeight;
      const p = reduced ? 0 : clamp(-el.getBoundingClientRect().top / Math.max(total, 1));
      const e = ease(clamp(p / 0.75));

      const sr = s.getBoundingClientRect();
      const lr = L.getBoundingClientRect();
      const top = sr.top - lr.top;
      const left = sr.left - lr.left;
      const right = W - (left + sr.width);
      const bottom = H - (top + sr.height);
      const r = sr.width / 2;
      L.style.clipPath = `inset(${lerp(top, 0, e)}px ${lerp(right, 0, e)}px ${lerp(bottom, 0, e)}px ${lerp(left, 0, e)}px round ${lerp(r, 0, e)}px ${lerp(r, 0, e)}px 0 0)`;
      L.style.setProperty("--zoom", String(1.12 - e * 0.12));
      L.style.setProperty("--ty", `${lerp(top + sr.height / 2 - H / 2, 0, e)}px`);

      if (copy.current) {
        const f = clamp(1 - p * 3.2);
        copy.current.style.opacity = String(f);
        copy.current.style.transform = `translateY(${-p * 120}px)`;
        copy.current.style.pointerEvents = f > 0.4 ? "auto" : "none";
      }
      if (after.current) {
        const q = clamp((p - 0.6) / 0.3);
        after.current.style.opacity = String(q);
        after.current.style.transform = `translateY(${(1 - q) * 30}px)`;
        after.current.style.pointerEvents = q > 0.5 ? "auto" : "none";
      }
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    const ro = new ResizeObserver(on);
    if (slot.current) ro.observe(slot.current);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      ro.disconnect();
    };
  }, []);

  const scene = scenes[kind];

  return (
    <section ref={wrap} className="relative mx-[calc(50%-50vw)] h-[210vh] bg-paper">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {/* Le texte d'accueil, lisible et cliquable tout de suite */}
        <div ref={copy} className="relative z-20 flex h-full flex-col items-center px-5 pt-24 text-center will-change-transform sm:pt-32">
          <p className="caps wp-rise text-muted" style={{ animationDelay: "0.05s" }}>
            {kicker}
          </p>
          <h1 className="display mt-5 text-[2.6rem] leading-[0.98] sm:text-7xl lg:text-[5.6rem]">
            {lines.map((l, i) => (
              <span key={i} className="block overflow-hidden pb-[0.06em]">
                <span className="wp-line block" style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
                  {l}
                </span>
              </span>
            ))}
          </h1>
          <p className="wp-rise mt-5 max-w-md text-[15px] leading-relaxed text-muted sm:max-w-xl sm:text-lg" style={{ animationDelay: "0.5s" }}>
            {sub}
          </p>
          <div className="wp-rise mt-7 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row" style={{ animationDelay: "0.62s" }}>
            <button type="button" onClick={() => goToDemo(kind)} className="btn-primary !px-8 !py-4 text-[12px] uppercase tracking-label">
              {cta1}
            </button>
            <Link href={`/new?kind=${kind}`} className="btn border border-ink/25 !px-8 !py-4 text-[12px] uppercase tracking-label hover:border-ink">
              {cta2}
            </Link>
          </div>

          {/* L'arche, encadrée par les deux mots */}
          <div className="mt-8 flex w-full max-w-5xl flex-1 items-stretch justify-center gap-4 pb-6 sm:mt-10 sm:gap-10 sm:pb-8">
            <SceneWord active={kind === "home"} onClick={() => pick("home")} label={scenes.home.word} align="right" />
            <div ref={slot} className="relative w-[46vw] min-h-[150px] max-w-[340px] sm:w-[30vw]" />
            <SceneWord active={kind === "travel"} onClick={() => pick("travel")} label={scenes.travel.word} align="left" />
          </div>
        </div>

        {/* L'image, découpée en arche puis plein écran */}
        <div ref={layer} className="wp-layer-in absolute inset-0 z-10 bg-night">
          {(Object.keys(scenes) as Kind[]).map((k) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={k}
              src={scenes[k].img}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out"
              style={{ opacity: kind === k ? 1 : 0, transform: "translateY(var(--ty, 0px)) scale(var(--zoom, 1.12))" }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

          {/* Une fois l'arche ouverte */}
          <div ref={after} className="absolute inset-x-0 bottom-0 px-6 pb-14 text-white opacity-0 sm:px-14 sm:pb-20">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <p className="caps text-white/70">{scene.caption}</p>
                <p className="display mt-3 text-4xl leading-[1] sm:text-6xl">{openTitle}</p>
                <p className="mt-4 text-white/80">{openText}</p>
              </div>
              <Link href={scene.href} className="caps shrink-0 self-start border-b border-white/60 pb-1 hover:border-white sm:self-end">
                {openLink} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SceneWord({ active, onClick, label, align }: { active: boolean; onClick: () => void; label: string; align: "left" | "right" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex flex-1 flex-col justify-end pb-2 ${align === "right" ? "items-end text-right" : "items-start text-left"}`}
    >
      <span className={`display text-2xl italic transition duration-500 sm:text-5xl ${active ? "text-ink" : "text-ink/25 group-hover:text-ink/60"}`}>{label}</span>
      <span className={`mt-2 block h-px bg-ink transition-all duration-700 ${active ? "w-full max-w-[120px]" : "w-0"}`} />
    </button>
  );
}
