"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Appelle `fn` à chaque frame de défilement (et au redimensionnement). */
function useScrollFrame(fn: () => void, deps: unknown[] = []) {
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      fn();
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function reduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ------------------------------------------------------------------ */
/* 1. Les portes : intérieur | mur | vue, qui pivotent en 3D au scroll */
/* ------------------------------------------------------------------ */

type Door = { href: string; img: string; label: string; title: string; cta: string };

export function HeroDoors({
  left,
  right,
  headline,
  sub,
  ctaPrimary,
  ctaSecondary,
  hint,
}: {
  left: Door;
  right: Door;
  headline: string;
  sub: string;
  ctaPrimary: { href: string; label: string };
  ctaSecondary: { href: string; label: string };
  hint: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const l = useRef<HTMLAnchorElement>(null);
  const r = useRef<HTMLAnchorElement>(null);
  const wall = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useScrollFrame(() => {
    const el = wrap.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = el.offsetHeight - window.innerHeight;
    const p = reduced() ? 0 : clamp(-rect.top / total);
    const e = 1 - Math.pow(1 - p, 3); // easeOutCubic
    const angle = e * 82;
    if (l.current) {
      l.current.style.transform = `rotateY(${angle}deg)`;
      l.current.style.filter = `brightness(${1 - e * 0.55})`;
      l.current.style.pointerEvents = p > 0.15 ? "none" : "auto";
    }
    if (r.current) {
      r.current.style.transform = `rotateY(${-angle}deg)`;
      r.current.style.filter = `brightness(${1 - e * 0.55})`;
      r.current.style.pointerEvents = p > 0.15 ? "none" : "auto";
    }
    if (wall.current) wall.current.style.opacity = String(1 - clamp(p * 4));
    if (hintRef.current) hintRef.current.style.opacity = String(1 - clamp(p * 6));
    if (inner.current) {
      const q = clamp((p - 0.25) / 0.6);
      inner.current.style.opacity = String(q);
      inner.current.style.transform = `translateZ(${(1 - q) * -260}px) scale(${0.92 + q * 0.08})`;
      inner.current.style.pointerEvents = q > 0.6 ? "auto" : "none";
    }
  });

  return (
    <section ref={wrap} className="relative mx-[calc(50%-50vw)] h-[260vh] bg-night">
      <div className="sticky top-0 h-[100dvh] overflow-hidden [perspective:1800px]">
        {/* Ce qu'il y a derrière les portes */}
        <div ref={inner} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-bone opacity-0 [transform-style:preserve-3d]">
          <h1 className="display max-w-5xl text-[2.9rem] leading-[0.95] sm:text-7xl lg:text-[6.5rem]">{headline}</h1>
          <p className="mt-6 max-w-xl text-base text-bone/70 sm:text-lg">{sub}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href={ctaPrimary.href} className="btn bg-bone !px-8 !py-4 text-[12px] uppercase tracking-label text-ink hover:bg-white">
              {ctaPrimary.label}
            </Link>
            <Link href={ctaSecondary.href} className="btn border border-bone/40 !px-8 !py-4 text-[12px] uppercase tracking-label text-bone hover:bg-bone/10">
              {ctaSecondary.label}
            </Link>
          </div>
        </div>

        {/* Les deux battants */}
        <div className="absolute inset-0 flex [transform-style:preserve-3d]">
          <DoorLeaf refEl={l} door={left} origin="left" />
          <div ref={wall} aria-hidden className="relative z-10 w-2.5 shrink-0 bg-gradient-to-r from-[#9C8A75] via-[#E9DFD2] to-[#9C8A75] sm:w-5" />
          <DoorLeaf refEl={r} door={right} origin="right" />
        </div>

        <p ref={hintRef} className="pointer-events-none absolute inset-x-0 bottom-6 z-20 text-center text-[10px] uppercase tracking-label text-white/70">
          {hint}
        </p>
      </div>
    </section>
  );
}

function DoorLeaf({ refEl, door, origin }: { refEl: React.RefObject<HTMLAnchorElement | null>; door: Door; origin: "left" | "right" }) {
  return (
    <Link
      ref={refEl}
      href={door.href}
      className="group relative block min-w-0 flex-1 overflow-hidden will-change-transform [backface-visibility:hidden]"
      style={{ transformOrigin: origin === "left" ? "left center" : "right center" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={door.img} alt="" className="absolute inset-0 h-full w-full scale-105 object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/25" />
      <div className={`absolute bottom-14 text-white sm:bottom-20 ${origin === "left" ? "left-5 sm:left-12" : "right-5 text-right sm:right-12"}`}>
        <p className="text-[10px] font-medium uppercase tracking-label text-white/80 sm:text-[11px]">{door.label}</p>
        <p className="display mt-2 text-5xl leading-none sm:text-7xl lg:text-8xl">{door.title}</p>
        <span className="mt-4 inline-block border-b border-white/60 pb-1 text-[10px] uppercase tracking-label transition group-hover:border-white sm:text-[11px]">
          {door.cta}
        </span>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Panneaux plein écran empilés qui basculent en 3D                 */
/* ------------------------------------------------------------------ */

export type Panel = { img: string; title: string; text: string; caption?: string; align?: "left" | "right" };

export function StackedPanels({ panels }: { panels: Panel[] }) {
  const root = useRef<HTMLDivElement>(null);

  useScrollFrame(() => {
    const el = root.current;
    if (!el) return;
    const vh = window.innerHeight;
    const top = el.getBoundingClientRect().top;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
    const enters = cards.map((_, i) => (i === 0 ? 1 : clamp(1 - (top + i * vh) / vh)));
    const off = reduced();
    cards.forEach((card, i) => {
      const enter = off ? 1 : enters[i];
      const leave = off ? 0 : enters[i + 1] ?? 0;
      const img = card.querySelector<HTMLElement>("[data-img]");
      const txt = card.querySelector<HTMLElement>("[data-txt]");
      card.style.transform = `perspective(1600px) rotateX(${(1 - enter) * 16 - leave * 4}deg) scale(${(0.9 + enter * 0.1) * (1 - leave * 0.12)}) translateY(${leave * -3}%)`;
      card.style.borderRadius = `${(1 - enter) * 40 + leave * 28}px`;
      card.style.filter = `brightness(${1 - leave * 0.6})`;
      if (img) img.style.transform = `scale(${1.25 - enter * 0.15}) translateY(${(1 - enter) * -6}%)`;
      if (txt) {
        const t = clamp((enter - 0.55) / 0.45);
        txt.style.opacity = String(t * (1 - leave * 1.4));
        txt.style.transform = `translateY(${(1 - t) * 60}px)`;
      }
    });
  });

  return (
    <div ref={root} className="relative mx-[calc(50%-50vw)] bg-night">
      {panels.map((p, i) => (
        <div key={i} className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden">
          <article data-card className="relative h-full w-full origin-bottom overflow-hidden will-change-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-img src={p.img} alt="" className="absolute inset-0 h-full w-full object-cover will-change-transform" />
            <div className={`absolute inset-0 ${p.align === "right" ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-black/70 via-black/25 to-transparent`} />
            <div
              data-txt
              className={`absolute bottom-16 max-w-xl px-6 text-white sm:bottom-24 sm:px-14 ${p.align === "right" ? "right-0 text-right" : "left-0"}`}
            >
              <p className="text-[11px] uppercase tracking-label text-white/70">
                {String(i + 1).padStart(2, "0")} / {String(panels.length).padStart(2, "0")}
              </p>
              <h2 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">{p.title}</h2>
              <p className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">{p.text}</p>
              {p.caption && <p className="mt-6 text-[11px] uppercase tracking-label text-white/60">{p.caption}</p>}
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Carrousel 3D piloté par le défilement vertical                   */
/* ------------------------------------------------------------------ */

export type Product = { img: string; name: string; price: string; shop: string; tag: string };

export function Coverflow({ title, sub, items }: { title: string; sub: string; items: Product[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useScrollFrame(() => {
    const el = wrap.current;
    const tr = track.current;
    if (!el || !tr) return;
    const rect = el.getBoundingClientRect();
    const total = el.offsetHeight - window.innerHeight;
    const p = clamp(-rect.top / total);
    const vw = window.innerWidth;
    const max = tr.scrollWidth - vw + vw * 0.1;
    tr.style.transform = `translate3d(${-p * max}px,0,0)`;
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    if (reduced()) return;
    tr.querySelectorAll<HTMLElement>("[data-item]").forEach((it) => {
      const b = it.getBoundingClientRect();
      const d = clamp(((b.left + b.width / 2) - vw / 2) / (vw / 2), -1.4, 1.4);
      it.style.transform = `perspective(1200px) rotateY(${d * -28}deg) translateZ(${-Math.abs(d) * 160}px) scale(${1 - Math.abs(d) * 0.06})`;
      it.style.opacity = String(1 - Math.max(0, Math.abs(d) - 0.9) * 0.9);
    });
  });

  return (
    <section ref={wrap} className="relative mx-[calc(50%-50vw)] h-[320vh] bg-bone">
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-12">
          <h2 className="display max-w-3xl text-5xl leading-[0.95] text-ink sm:text-7xl">{title}</h2>
          <p className="mt-4 max-w-md text-muted">{sub}</p>
        </div>
        <div ref={track} className="mt-10 flex gap-6 pl-6 will-change-transform sm:gap-10 sm:pl-[10vw]">
          {items.map((it) => (
            <figure key={it.name} data-item className="w-[68vw] shrink-0 will-change-transform sm:w-[30vw] lg:w-[24vw]">
              <div className="relative aspect-[3/4] overflow-hidden bg-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.img} alt="" className="h-full w-full object-cover" />
                <span className="absolute left-3 top-3 bg-bone/90 px-2 py-1 text-[10px] uppercase tracking-label text-ink">
                  {it.tag}
                </span>
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-3 text-ink">
                <span>
                  <span className="block text-[12px] uppercase tracking-[0.12em]">{it.name}</span>
                  <span className="text-xs text-muted">{it.shop}</span>
                </span>
                <span className="text-sm">{it.price}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mx-auto mt-12 h-px w-full max-w-[1400px] bg-line px-6 sm:px-12">
          <div ref={bar} className="h-px origin-left scale-x-0 bg-ink" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Apparition douce au défilement                                   */
/* ------------------------------------------------------------------ */

export function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      el.style.opacity = "1";
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "perspective(1200px) rotateX(0deg) translateY(0)";
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: "perspective(1200px) rotateX(12deg) translateY(60px)",
        transformOrigin: "50% 100%",
        transition: "opacity 1s ease, transform 1.2s cubic-bezier(.2,.8,.2,1)",
      }}
    >
      {children}
    </div>
  );
}
