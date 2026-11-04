"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Texte qui s'écrit à l'encre au fil du défilement                    */
/* ------------------------------------------------------------------ */
export function ScrollWords({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>("span[data-w]"));
    if (reduced()) {
      spans.forEach((s) => (s.style.opacity = "1"));
      return;
    }
    let raf = 0;
    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.25));
      const n = spans.length;
      spans.forEach((s, i) => {
        s.style.opacity = String(0.14 + 0.86 * clamp(p * n * 1.15 - i));
      });
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} data-w className="transition-opacity duration-200" style={{ opacity: 0.14 }}>
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Carrousel horizontal en 3D : les cartes pivotent selon leur place   */
/* ------------------------------------------------------------------ */
export type Story = { tag: string; title: string; text: string; img: string; href: string };

export function StorySlider({ stories, cta }: { stories: Story[]; cta: string }) {
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const box = el.getBoundingClientRect();
      const center = box.left + box.width / 2;
      el.querySelectorAll<HTMLElement>("[data-card]").forEach((c) => {
        const r = c.getBoundingClientRect();
        const off = clamp((r.left + r.width / 2 - center) / box.width, -1, 1);
        if (reduced()) return;
        c.style.transform = `perspective(1400px) rotateY(${off * -14}deg) scale(${1 - Math.abs(off) * 0.06})`;
        c.style.filter = `brightness(${1 - Math.abs(off) * 0.25})`;
      });
      const max = el.scrollWidth - el.clientWidth;
      const p = max > 0 ? el.scrollLeft / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${0.12 + p * 0.88})`;
      setAtStart(el.scrollLeft < 8);
      setAtEnd(el.scrollLeft > max - 8);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    on();
    el.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);

    // Glisser à la souris (sur mobile, le doigt suffit)
    let down = false;
    let sx = 0;
    let sl = 0;
    let moved = false;
    const pd = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      moved = false;
      sx = e.clientX;
      sl = el.scrollLeft;
      el.style.scrollSnapType = "none";
    };
    const pm = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = sl - dx;
    };
    const pu = () => {
      if (!down) return;
      down = false;
      el.style.scrollSnapType = "";
    };
    const click = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    el.addEventListener("pointerdown", pd);
    window.addEventListener("pointermove", pm);
    window.addEventListener("pointerup", pu);
    el.addEventListener("click", click, true);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      el.removeEventListener("pointerdown", pd);
      window.removeEventListener("pointermove", pm);
      window.removeEventListener("pointerup", pu);
      el.removeEventListener("click", click, true);
    };
  }, []);

  const go = (dir: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(460, el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={track}
        className="-mx-4 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] active:cursor-grabbing sm:-mx-6 sm:gap-7 sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {stories.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            draggable={false}
            data-card
            className="group relative block aspect-[3/4] w-[78vw] shrink-0 snap-center overflow-hidden bg-night text-white transition-[filter] will-change-transform sm:w-[380px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.img} alt="" draggable={false} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-[1600ms] ease-out group-hover:scale-[1.06]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
              <p className="caps text-white/70">{s.tag}</p>
              <p className="display mt-3 text-3xl leading-tight sm:text-4xl">{s.title}</p>
              <p className="mt-3 max-h-0 overflow-hidden text-sm leading-relaxed text-white/80 opacity-0 transition-all duration-500 group-hover:max-h-32 group-hover:opacity-100 [@media(hover:none)]:max-h-32 [@media(hover:none)]:opacity-100">
                {s.text}
              </p>
              <span className="caps mt-5 inline-flex items-center gap-2 border-b border-white/60 pb-0.5">
                {cta} <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-6">
        <div className="relative h-px flex-1 bg-line">
          <span ref={bar} className="absolute inset-0 origin-left bg-ink transition-transform duration-300" style={{ transform: "scaleX(0.12)" }} />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => go(-1)} disabled={atStart} aria-label="Précédent" className="h-11 w-11 border border-line text-lg transition hover:border-ink disabled:opacity-30">
            ←
          </button>
          <button type="button" onClick={() => go(1)} disabled={atEnd} aria-label="Suivant" className="h-11 w-11 border border-line text-lg transition hover:border-ink disabled:opacity-30">
            →
          </button>
        </div>
      </div>
    </div>
  );
}
