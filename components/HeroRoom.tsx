"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Accueil : une pièce vide qui ne bouge pas. Les meubles, eux, changent de mood :
 * ils s'en vont et d'autres arrivent, toujours assortis entre eux.
 */

type Mood = { id: string; fr: string; en: string; hint: { fr: string; en: string }; color: string; swatches: string[] };

const MOODS: Mood[] = [
  {
    id: "cognac",
    fr: "Cuir & cognac",
    en: "Leather & cognac",
    hint: { fr: "Chesterfield cognac, lampe laiton, tapis berbère", en: "Cognac chesterfield, brass lamp, Berber rug" },
    color: "brun",
    swatches: ["#8A5530", "#5C3B22", "#B8954F", "#EDE4D3"],
  },
  {
    id: "terracotta",
    fr: "Terracotta & soleil",
    en: "Terracotta & sun",
    hint: { fr: "Velours rouille, rotin, travertin", en: "Rust velvet, rattan, travertine" },
    color: "terracotta",
    swatches: ["#C2643A", "#D89A4A", "#C9A06A", "#E3D3B8"],
  },
  {
    id: "sauge",
    fr: "Sauge & lin",
    en: "Sage & linen",
    hint: { fr: "Lin sauge, chêne clair, papier et jute", en: "Sage linen, light oak, paper and jute" },
    color: "vert",
    swatches: ["#8C9A76", "#C9A57B", "#F3ECDF", "#CDB58C"],
  },
];

type Phase = "pre" | "in" | "out";

export default function HeroRoom({ name, fr }: { name: string; fr: boolean }) {
  const [mood, setMood] = useState(0);
  const [phase, setPhase] = useState<Phase>("pre");
  const [auto, setAuto] = useState(true);
  const busy = useRef(false);
  const wrap = useRef<HTMLElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLHeadingElement>(null);
  const room = useRef<HTMLDivElement>(null);
  const ui = useRef<HTMLDivElement>(null);

  // Les meubles entrent une fois la pièce affichée
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setPhase("in")));
    return () => cancelAnimationFrame(id);
  }, [mood]);

  const go = (next: number) => {
    if (busy.current || next === mood) return;
    busy.current = true;
    setPhase("out");
    setTimeout(() => {
      setMood(next);
      setPhase("pre");
      busy.current = false;
    }, 1150);
  };

  // Change tout seul tant qu'on reste sur la page
  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => go((mood + 1) % MOODS.length), 6200);
    return () => clearTimeout(t);
  }, [mood, auto]); // eslint-disable-line react-hooks/exhaustive-deps

  // En descendant : le nom s'élargit et s'efface, la pièce avance vers nous
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const el = wrap.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const p = reduced ? 0 : Math.min(1, Math.max(0, -el.getBoundingClientRect().top / Math.max(total, 1)));
      if (title.current) {
        title.current.style.transform = `translateY(${-p * 140}px) scale(${1 + p * 0.18})`;
        title.current.style.opacity = String(Math.max(0, 1 - p * 1.7));
      }
      if (word.current) word.current.style.letterSpacing = `${0.02 + p * 0.3}em`;
      if (room.current) room.current.style.transform = `scale(${1 + p * 0.14})`;
      if (ui.current) {
        ui.current.style.opacity = String(Math.max(0, 1 - p * 2.4));
        ui.current.style.transform = `translateY(${p * 40}px)`;
      }
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  const m = MOODS[mood];
  const letters = name.split("");

  // Chaque objet part puis revient, l'un après l'autre
  const obj = (i: number): React.CSSProperties => ({
    transition: phase === "pre" ? "none" : `transform 0.95s cubic-bezier(.2,.8,.2,1) ${i * 85}ms, opacity 0.75s ease ${i * 85}ms`,
    opacity: phase === "in" ? 1 : 0,
    transform: phase === "in" ? "translateY(0) scale(1)" : phase === "out" ? "translateY(42px) scale(.96)" : "translateY(-34px) scale(1.02)",
    transformBox: "fill-box",
    transformOrigin: "50% 100%",
  });

  return (
    <section ref={wrap} className="relative mx-[calc(50%-50vw)] h-[200vh] bg-[#ECE3D4]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {/* La pièce */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[150px] bg-[#A9794D] sm:hidden" />
        <div ref={room} className="absolute inset-x-0 bottom-[150px] h-[55%] origin-[50%_85%] will-change-transform sm:bottom-0 sm:h-full">
          <div aria-hidden className="absolute inset-x-0 top-0 z-[1] h-20 bg-gradient-to-b from-[#ECE3D4] to-transparent sm:hidden" />
          <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <linearGradient id="wall" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#E9DFCF" />
                <stop offset="0.7" stopColor="#F1E9DC" />
                <stop offset="1" stopColor="#F6EFE4" />
              </linearGradient>
              <linearGradient id="glass" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#FFFBF2" />
                <stop offset="1" stopColor="#F3E6CF" />
              </linearGradient>
              <linearGradient id="spill" x1="1" x2="0" y1="0" y2="0">
                <stop offset="0" stopColor="#FFF6E6" stopOpacity="0.75" />
                <stop offset="1" stopColor="#FFF6E6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="shade" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#000" stopOpacity="0" />
                <stop offset="1" stopColor="#000" stopOpacity="0.18" />
              </linearGradient>
              <pattern id="herring" width="64" height="32" patternUnits="userSpaceOnUse">
                <rect width="64" height="32" fill="#B9895B" />
                <path d="M0 32 L32 0 M32 32 L64 0" stroke="#A8784C" strokeWidth="2" />
                <path d="M0 0 L32 32 M32 0 L64 32" stroke="#C69A6C" strokeWidth="1.2" opacity=".7" />
              </pattern>
            </defs>

            {/* Murs, moulures */}
            <rect width="1600" height="780" fill="url(#wall)" />
            <rect y="58" width="1600" height="6" fill="#E3D7C4" className="hidden sm:block" />
            <rect y="104" width="1600" height="3" fill="#E3D7C4" className="hidden sm:block" />
            <g fill="none" stroke="#E0D2BD" strokeWidth="3">
              <rect x="70" y="250" width="400" height="470" />
              <rect x="86" y="266" width="368" height="438" opacity=".6" />
              <rect x="520" y="170" width="560" height="330" opacity=".75" />
            </g>

            {/* La fenêtre en arche, et sa lumière */}
            <path d="M1160 760 V300 A150 150 0 0 1 1460 300 V760 Z" fill="#D9CBB5" />
            <path d="M1175 752 V300 A135 135 0 0 1 1445 300 V752 Z" fill="url(#glass)" />
            <g stroke="#D9CBB5" strokeWidth="8">
              <line x1="1310" y1="168" x2="1310" y2="752" />
              <line x1="1175" y1="440" x2="1445" y2="440" />
              <line x1="1175" y1="600" x2="1445" y2="600" />
            </g>
            <rect x="1150" y="752" width="320" height="14" fill="#E3D7C4" />

            {/* Plinthe et parquet en chevrons */}
            <rect y="760" width="1600" height="22" fill="#E6DBC9" />
            <rect y="782" width="1600" height="218" fill="url(#herring)" />
            <rect y="782" width="1600" height="218" fill="url(#shade)" />
            <polygon points="1160,782 1460,782 1150,1000 520,1000" fill="url(#spill)" />

            {/* ---------- Les meubles du mood ---------- */}
            <g key={m.id}>
              {m.id === "cognac" && <Cognac obj={obj} />}
              {m.id === "terracotta" && <Terracotta obj={obj} />}
              {m.id === "sauge" && <Sauge obj={obj} />}
            </g>
          </svg>
        </div>

        {/* Le nom, au milieu */}
        <div ref={title} className="pointer-events-none absolute inset-x-0 top-[17vh] z-10 flex flex-col items-center px-4 text-center will-change-transform sm:top-[19vh]">
          <p className="caps wp-rise text-[#7A6650]" style={{ animationDelay: "0.1s" }}>
            {fr ? "La cagnotte déco, pièce à pièce" : "The decor savings pot, piece by piece"}
          </p>
          <div className="mt-4">
            <h1 ref={word} style={{ letterSpacing: "0.02em" }} className="display whitespace-nowrap text-[13vw] leading-none text-[#2B211A] sm:text-[8.4vw] lg:text-[7.2rem]" aria-label={name}>
              {letters.map((c, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom">
                  <span className="wp-line inline-block" style={{ animationDelay: `${0.15 + i * 0.045}s` }}>
                    {c === " " ? " " : c}
                  </span>
                </span>
              ))}
            </h1>
          </div>
        </div>

        {/* Le mood en cours et les actions */}
        <div ref={ui} className="absolute inset-x-0 bottom-0 z-10 px-4 pb-6 sm:px-8 sm:pb-8">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="bg-[#FBF7F0]/90 px-4 py-3 backdrop-blur sm:p-5">
              <div className="hidden items-center gap-3 sm:flex">
                <span className="caps text-muted">
                  Mood {String(mood + 1).padStart(2, "0")} / {String(MOODS.length).padStart(2, "0")}
                </span>
                <span className="flex -space-x-1">
                  {m.swatches.map((s) => (
                    <span key={s} className="h-3.5 w-3.5 rounded-full border border-white" style={{ background: s }} />
                  ))}
                </span>
              </div>
              <p className="display text-xl leading-tight sm:mt-1 sm:text-3xl">{fr ? m.fr : m.en}</p>
              <p className="hidden text-sm text-muted sm:block">{fr ? m.hint.fr : m.hint.en}</p>
              <div className="mt-2 flex gap-2 sm:mt-3">
                {MOODS.map((x, i) => (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => {
                      setAuto(false);
                      go(i);
                    }}
                    aria-label={fr ? x.fr : x.en}
                    className="group relative h-1.5 w-12 overflow-hidden rounded-full bg-black/10"
                  >
                    <span
                      key={`${mood}-${auto}`}
                      className="absolute inset-y-0 left-0 rounded-full bg-[#2B211A]"
                      style={
                        i === mood
                          ? auto
                            ? { width: "100%", animation: "wp-fill 6.2s linear forwards" }
                            : { width: "100%" }
                          : { width: i < mood ? "100%" : "0%", opacity: 0.35 }
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
              <Link href={`/catalogue?couleur=${m.color}`} className="btn-primary justify-center !px-4 !py-3 text-[11px] uppercase tracking-label sm:!px-7 sm:!py-4 sm:text-[12px]">
                {fr ? "Shopper ce mood" : "Shop this mood"}
              </Link>
              <Link href="#exemples" className="btn justify-center border border-ink/30 bg-[#FBF7F0]/80 !px-4 !py-3 text-[11px] uppercase tracking-label backdrop-blur hover:border-ink sm:!px-7 sm:!py-4 sm:text-[12px]">
                {fr ? "Voir les cagnottes" : "See the pots"}
              </Link>
            </div>
          </div>
          <div className="mt-4 hidden justify-center sm:flex">
            <span className="caps flex flex-col items-center gap-2 text-[10px] text-[#7A6650]">
              {fr ? "Défiler" : "Scroll"}
              <span className="wp-scroll-line block h-8 w-px bg-[#7A6650]" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

type Obj = (i: number) => React.CSSProperties;

/* ---------- Mood 1 : cuir & cognac ---------- */
function Cognac({ obj }: { obj: Obj }) {
  return (
    <>
      {/* Tapis berbère */}
      <g style={obj(0)}>
        <polygon points="300,985 1300,985 1200,840 400,840" fill="#EDE4D3" />
        <polygon points="330,972 1270,972 1180,852 420,852" fill="none" stroke="#6B4A2E" strokeWidth="3" />
        <path d="M500 912 l40 -40 l40 40 l-40 40 Z M700 912 l40 -40 l40 40 l-40 40 Z M900 912 l40 -40 l40 40 l-40 40 Z M1060 912 l30 -30 l30 30 l-30 30 Z M400 912 l26 -26 l26 26 l-26 26 Z" fill="none" stroke="#6B4A2E" strokeWidth="3" opacity=".8" />
      </g>
      {/* Cadre abstrait */}
      <g style={obj(1)}>
        <g transform="translate(-30 110)">
        <rect x="170" y="250" width="240" height="300" fill="#4A3020" />
        <rect x="186" y="266" width="208" height="268" fill="#EFE6D6" />
        <circle cx="290" cy="380" r="62" fill="#B8623E" />
        <path d="M200 470 Q290 400 380 470 V520 H200 Z" fill="#8A5530" />
        </g>
      </g>
      {/* Lampe arc en laiton */}
      <g style={obj(2)}>
        <g transform="translate(36 0)">
        <ellipse cx="420" cy="784" rx="56" ry="12" fill="#3E2C1E" />
        <path d="M420 784 V420 Q420 370 510 384 Q590 398 632 448" fill="none" stroke="#B8954F" strokeWidth="9" strokeLinecap="round" />
        <circle cx="640" cy="478" r="36" fill="#FBF3E2" stroke="#B8954F" strokeWidth="5" />
        <circle cx="640" cy="478" r="70" fill="#FFE9BF" opacity=".25" />
        </g>
      </g>
      {/* Chesterfield cognac */}
      <g style={obj(3)}>
        <rect x="560" y="582" width="480" height="128" rx="16" fill="#7A4627" />
        {Array.from({ length: 7 }).map((_, c) =>
          Array.from({ length: 2 }).map((__, r) => <circle key={`${c}-${r}`} cx={600 + c * 66} cy={612 + r * 40} r="4" fill="#4E2C17" />),
        )}
        <rect x="560" y="690" width="480" height="62" rx="12" fill="#8A5530" />
        <line x1="720" y1="694" x2="720" y2="748" stroke="#6E4024" strokeWidth="3" />
        <line x1="880" y1="694" x2="880" y2="748" stroke="#6E4024" strokeWidth="3" />
        <rect x="500" y="606" width="86" height="160" rx="40" fill="#8A5530" />
        <rect x="1014" y="606" width="86" height="160" rx="40" fill="#8A5530" />
        <rect x="560" y="752" width="480" height="20" fill="#6E4024" />
        <rect x="530" y="770" width="14" height="20" fill="#2E1E12" />
        <rect x="1056" y="770" width="14" height="20" fill="#2E1E12" />
        <rect x="610" y="640" width="90" height="70" rx="14" fill="#EDE4D3" transform="rotate(-8 655 675)" />
        <rect x="900" y="640" width="90" height="70" rx="14" fill="#B8623E" transform="rotate(7 945 675)" />
      </g>
      {/* Table basse en noyer */}
      <g style={obj(4)}>
        <rect x="770" y="830" width="16" height="52" fill="#3E2716" />
        <rect x="826" y="830" width="16" height="52" fill="#3E2716" />
        <ellipse cx="806" cy="828" rx="160" ry="28" fill="#5C3B22" />
        <ellipse cx="806" cy="822" rx="160" ry="28" fill="#6E4A2E" />
        <rect x="730" y="796" width="70" height="14" fill="#EDE4D3" />
        <rect x="736" y="784" width="62" height="12" fill="#B8623E" />
        <ellipse cx="880" cy="806" rx="34" ry="10" fill="#B8954F" />
      </g>
      {/* Guéridon laiton et vase terracotta */}
      <g style={obj(5)}>
        <ellipse cx="1110" cy="700" rx="46" ry="9" fill="#B8954F" />
        <line x1="1110" y1="700" x2="1110" y2="784" stroke="#B8954F" strokeWidth="6" />
        <ellipse cx="1110" cy="786" rx="30" ry="6" fill="#9C7B40" />
        <path d="M1088 698 Q1080 640 1110 630 Q1140 640 1132 698 Z" fill="#B8623E" />
        <path d="M1110 632 Q1100 560 1070 540 M1110 632 Q1125 570 1150 556" stroke="#6B5A3A" strokeWidth="3" fill="none" />
      </g>
    </>
  );
}

/* ---------- Mood 2 : terracotta & soleil ---------- */
function Terracotta({ obj }: { obj: Obj }) {
  return (
    <>
      {/* Tapis rouille */}
      <g style={obj(0)}>
        <polygon points="300,985 1300,985 1200,840 400,840" fill="#B65A35" />
        <polygon points="340,970 1260,970 1172,854 428,854" fill="none" stroke="#D89A4A" strokeWidth="10" />
        <path d="M480 912 H1120" stroke="#D89A4A" strokeWidth="4" strokeDasharray="18 14" />
      </g>
      {/* Affiche soleil */}
      <g style={obj(1)}>
        <g transform="translate(-40 110)">
        <rect x="180" y="250" width="220" height="290" fill="#F4E9D8" stroke="#C9A06A" strokeWidth="10" />
        <path d="M200 520 A90 90 0 0 1 380 520 Z" fill="#C2643A" />
        <path d="M230 520 A60 60 0 0 1 350 520 Z" fill="#D89A4A" />
        <circle cx="290" cy="340" r="34" fill="#D89A4A" opacity=".85" />
        </g>
      </g>
      {/* Lampadaire en rotin */}
      <g style={obj(2)}>
        <g transform="translate(36 0)">
        <ellipse cx="420" cy="784" rx="44" ry="10" fill="#6B4A2E" />
        <line x1="420" y1="784" x2="420" y2="470" stroke="#6B4A2E" strokeWidth="7" />
        <path d="M352 480 H488 L462 372 H378 Z" fill="#C9A06A" />
        <path d="M370 456 H470 M376 432 H464 M382 408 H458 M386 386 H454" stroke="#A9814D" strokeWidth="3" />
        <ellipse cx="420" cy="500" rx="90" ry="40" fill="#FFE2B0" opacity=".3" />
        </g>
      </g>
      {/* Canapé courbe en velours */}
      <g style={obj(3)}>
        <rect x="520" y="584" width="560" height="150" rx="75" fill="#AE5530" />
        <rect x="500" y="680" width="600" height="96" rx="48" fill="#C2643A" />
        <path d="M540 700 Q800 668 1060 700" stroke="#D77A4C" strokeWidth="6" fill="none" opacity=".7" />
        <rect x="560" y="772" width="16" height="16" rx="4" fill="#3A2416" />
        <rect x="1024" y="772" width="16" height="16" rx="4" fill="#3A2416" />
        <ellipse cx="640" cy="664" rx="58" ry="40" fill="#D89A4A" />
        <ellipse cx="960" cy="664" rx="58" ry="40" fill="#F1E3CC" />
        <ellipse cx="800" cy="672" rx="46" ry="32" fill="#8E4426" />
      </g>
      {/* Table basse en travertin */}
      <g style={obj(4)}>
        <rect x="690" y="826" width="60" height="50" rx="10" fill="#D6C3A3" />
        <rect x="860" y="826" width="60" height="50" rx="10" fill="#D6C3A3" />
        <rect x="640" y="806" width="330" height="30" rx="15" fill="#E3D3B8" />
        <path d="M670 816 H940" stroke="#CDB894" strokeWidth="2" strokeDasharray="30 10 4 10" />
        <path d="M760 806 Q800 770 840 806 Z" fill="#7A4627" />
        <circle cx="786" cy="792" r="11" fill="#E07A35" />
        <circle cx="808" cy="788" r="11" fill="#E89A3C" />
      </g>
      {/* Grande plante en pot terracotta */}
      <g style={obj(5)}>
        <path d="M1078 784 L1068 712 H1152 L1142 784 Z" fill="#B8623E" />
        <rect x="1062" y="704" width="96" height="14" rx="4" fill="#C9744A" />
        <path d="M1110 706 C1100 640 1050 620 1030 560 C1080 570 1110 620 1112 700" fill="#5F6B4A" />
        <path d="M1112 706 C1120 620 1170 590 1196 540 C1160 600 1130 640 1114 700" fill="#6F7B55" />
        <path d="M1110 706 C1108 600 1100 540 1120 470 C1140 540 1128 620 1114 706" fill="#56623F" />
      </g>
    </>
  );
}

/* ---------- Mood 3 : sauge & lin ---------- */
function Sauge({ obj }: { obj: Obj }) {
  return (
    <>
      {/* Tapis rond en jute */}
      <g style={obj(0)}>
        <ellipse cx="800" cy="910" rx="470" ry="74" fill="#CDB58C" />
        <ellipse cx="800" cy="910" rx="400" ry="60" fill="none" stroke="#B89E72" strokeWidth="4" />
        <ellipse cx="800" cy="910" rx="320" ry="46" fill="none" stroke="#B89E72" strokeWidth="4" />
        <ellipse cx="800" cy="910" rx="230" ry="32" fill="none" stroke="#B89E72" strokeWidth="4" />
      </g>
      {/* Deux planches botaniques */}
      <g style={obj(1)}>
        <g transform="translate(-50 120) scale(.92)">
        <rect x="170" y="230" width="150" height="200" fill="#F7F1E6" stroke="#C9A57B" strokeWidth="6" />
        <path d="M245 410 V290 M245 340 Q205 320 200 290 Q235 300 245 330 M245 370 Q285 350 292 318 Q258 330 245 360" stroke="#6F7B55" strokeWidth="5" fill="none" />
        <rect x="290" y="390" width="140" height="180" fill="#F7F1E6" stroke="#C9A57B" strokeWidth="6" />
        <ellipse cx="360" cy="470" rx="34" ry="52" fill="#8C9A76" />
        <path d="M360 418 V530" stroke="#F7F1E6" strokeWidth="3" />
        </g>
      </g>
      {/* Lampe en papier */}
      <g style={obj(2)}>
        <g transform="translate(36 0)">
        <ellipse cx="420" cy="784" rx="36" ry="9" fill="#C9A57B" />
        <line x1="420" y1="784" x2="420" y2="640" stroke="#C9A57B" strokeWidth="5" />
        <ellipse cx="420" cy="560" rx="62" ry="92" fill="#FBF6EC" />
        <path d="M362 520 Q420 532 478 520 M358 560 Q420 574 482 560 M362 600 Q420 612 478 600" stroke="#E6DCCB" strokeWidth="3" fill="none" />
        <ellipse cx="420" cy="560" rx="110" ry="130" fill="#FFF3D6" opacity=".22" />
        </g>
      </g>
      {/* Canapé bas en lin sauge */}
      <g style={obj(3)}>
        <rect x="520" y="626" width="560" height="84" rx="10" fill="#7E8C69" />
        <rect x="506" y="696" width="588" height="74" rx="10" fill="#8C9A76" />
        <line x1="702" y1="700" x2="702" y2="766" stroke="#7A8865" strokeWidth="3" />
        <line x1="898" y1="700" x2="898" y2="766" stroke="#7A8865" strokeWidth="3" />
        <rect x="496" y="650" width="44" height="120" rx="8" fill="#8C9A76" />
        <rect x="1060" y="650" width="44" height="120" rx="8" fill="#8C9A76" />
        <rect x="500" y="770" width="600" height="14" fill="#C9A57B" />
        <rect x="590" y="652" width="96" height="62" rx="10" fill="#F3ECDF" />
        <rect x="910" y="652" width="96" height="62" rx="10" fill="#C9A57B" />
        <path d="M720 700 Q760 660 820 690 L840 740 Q780 720 730 740 Z" fill="#E6DCCB" opacity=".9" />
      </g>
      {/* Table basse en chêne clair */}
      <g style={obj(4)}>
        <rect x="660" y="828" width="14" height="46" fill="#B08A5E" />
        <rect x="936" y="828" width="14" height="46" fill="#B08A5E" />
        <rect x="640" y="814" width="330" height="18" rx="4" fill="#C9A57B" />
        <path d="M770 814 Q760 770 790 760 Q820 770 810 814 Z" fill="#F3ECDF" />
        <path d="M790 762 Q780 700 750 680 M790 762 Q800 710 830 690" stroke="#6F7B55" strokeWidth="3" fill="none" />
        <rect x="860" y="800" width="60" height="14" fill="#8C9A76" />
      </g>
      {/* Olivier dans un panier */}
      <g style={obj(5)}>
        <path d="M1074 784 L1066 714 H1154 L1146 784 Z" fill="#CDB58C" />
        <path d="M1068 734 H1152 M1070 756 H1150" stroke="#B89E72" strokeWidth="3" />
        <path d="M1110 716 V560" stroke="#7A6448" strokeWidth="6" />
        {[
          [1080, 580],
          [1140, 570],
          [1110, 530],
          [1070, 630],
          [1150, 620],
          [1100, 600],
        ].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="34" ry="22" fill={i % 2 ? "#8C9A76" : "#7E8C69"} opacity=".95" />
        ))}
      </g>
    </>
  );
}
