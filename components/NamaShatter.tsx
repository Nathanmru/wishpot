"use client";

import { useEffect, useRef } from "react";

/**
 * Un intérieur d'appartement dessiné en particules (canapé, lampe, fenêtre en arche, plante, tapis)
 * dont toutes les particules s'envolent et se rassemblent pour écrire NAMA.
 *  - mode "loop"  : intérieur → NAMA → intérieur… (page À propos)
 *  - mode "intro" : arrivée des particules → intérieur → NAMA → onDone
 */
type Props = { mode?: "loop" | "intro"; onDone?: () => void; className?: string };

type RGB = [number, number, number];
type P = { sx: number; sy: number; sc: RGB; tx: number; ty: number; tc: RGB; rx: number; ry: number; dz: number; del: number; sz: number };

const SW = 900;
const SH = 520;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const cl = (t: number) => Math.max(0, Math.min(1, t));

function drawScene(o: CanvasRenderingContext2D) {
  o.lineCap = "round";
  // sol
  o.fillStyle = "#C99A6B";
  o.fillRect(0, 420, SW, 100);
  // tapis
  o.fillStyle = "#E6DACA";
  o.beginPath();
  o.moveTo(170, 440);
  o.lineTo(730, 440);
  o.lineTo(790, 500);
  o.lineTo(110, 500);
  o.fill();
  o.strokeStyle = "#4A3828";
  o.lineWidth = 4;
  o.beginPath();
  o.moveTo(190, 452);
  o.lineTo(710, 452);
  o.lineTo(756, 490);
  o.lineTo(144, 490);
  o.closePath();
  o.stroke();
  // fenêtre en arche
  const arch = () => {
    o.beginPath();
    o.moveTo(650, 400);
    o.lineTo(650, 170);
    o.arc(735, 170, 85, Math.PI, 0);
    o.lineTo(820, 400);
  };
  o.fillStyle = "#D5DCDB";
  arch();
  o.fill();
  o.strokeStyle = "#B08D5E";
  o.lineWidth = 10;
  arch();
  o.stroke();
  o.lineWidth = 5;
  o.beginPath();
  o.moveTo(735, 90);
  o.lineTo(735, 400);
  o.moveTo(650, 260);
  o.lineTo(820, 260);
  o.stroke();
  // tableau
  o.fillStyle = "#6E4A30";
  o.fillRect(70, 110, 150, 180);
  o.fillStyle = "#EADFCF";
  o.fillRect(82, 122, 126, 156);
  o.fillStyle = "#B8623E";
  o.beginPath();
  o.arc(145, 190, 38, 0, Math.PI * 2);
  o.fill();
  o.fillStyle = "#7D8B66";
  o.fillRect(82, 230, 126, 48);
  // lampe arc
  o.strokeStyle = "#B08D5E";
  o.lineWidth = 6;
  o.beginPath();
  o.moveTo(250, 420);
  o.lineTo(250, 250);
  o.quadraticCurveTo(255, 160, 360, 175);
  o.stroke();
  o.fillStyle = "#4A3828";
  o.beginPath();
  o.ellipse(250, 420, 28, 7, 0, 0, Math.PI * 2);
  o.fill();
  o.fillStyle = "#F1D9A6";
  o.beginPath();
  o.arc(372, 200, 32, 0, Math.PI * 2);
  o.fill();
  // canapé
  o.fillStyle = "#8A5530";
  o.beginPath();
  o.roundRect(300, 300, 300, 70, 22);
  o.fill();
  o.beginPath();
  o.roundRect(280, 340, 340, 70, 18);
  o.fill();
  o.fillStyle = "#6E4024";
  o.beginPath();
  o.roundRect(270, 330, 40, 85, 14);
  o.fill();
  o.beginPath();
  o.roundRect(590, 330, 40, 85, 14);
  o.fill();
  o.fillStyle = "#4A3828";
  o.fillRect(300, 410, 8, 14);
  o.fillRect(592, 410, 8, 14);
  o.fillStyle = "#EFE6D8";
  o.beginPath();
  o.roundRect(330, 310, 70, 52, 12);
  o.fill();
  o.fillStyle = "#B8623E";
  o.beginPath();
  o.roundRect(500, 310, 70, 52, 12);
  o.fill();
  // table basse
  o.fillStyle = "#5A3A26";
  o.beginPath();
  o.ellipse(450, 448, 90, 16, 0, 0, Math.PI * 2);
  o.fill();
  o.fillStyle = "#B08D5E";
  o.beginPath();
  o.ellipse(480, 436, 18, 6, 0, 0, Math.PI * 2);
  o.fill();
  // plante
  o.fillStyle = "#B8623E";
  o.beginPath();
  o.moveTo(70, 420);
  o.lineTo(116, 420);
  o.lineTo(108, 378);
  o.lineTo(78, 378);
  o.fill();
  o.strokeStyle = "#6F7E59";
  o.lineWidth = 5;
  for (const [a, l] of [
    [-1.9, 70],
    [-1.5, 100],
    [-1.15, 80],
    [-2.3, 62],
    [-0.8, 56],
  ]) {
    const x = 93 + Math.cos(a) * l;
    const y = 378 + Math.sin(a) * l;
    o.beginPath();
    o.moveTo(93, 378);
    o.lineTo(x, y);
    o.stroke();
    o.fillStyle = "#7D8B66";
    o.beginPath();
    o.ellipse(x, y, 15, 7, a, 0, Math.PI * 2);
    o.fill();
  }
}

function sample(draw: (o: CanvasRenderingContext2D) => void, step: number) {
  const c = document.createElement("canvas");
  c.width = SW;
  c.height = SH;
  const o = c.getContext("2d")!;
  draw(o);
  const d = o.getImageData(0, 0, SW, SH).data;
  const out: [number, number, RGB][] = [];
  for (let y = 0; y < SH; y += step)
    for (let x = 0; x < SW; x += step) {
      const i = (y * SW + x) * 4;
      if (d[i + 3] > 128) out.push([x + (Math.random() - 0.5) * step * 0.6 - SW / 2, y + (Math.random() - 0.5) * step * 0.6 - SH / 2, [d[i], d[i + 1], d[i + 2]]]);
    }
  for (let i = out.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function NamaShatter({ mode = "loop", onDone, className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const cv = ref.current;
    const cx = cv?.getContext("2d");
    if (!cv || !cx) return;
    let raf = 0;
    let alive = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const D = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    const size = () => {
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * D;
      cv.height = H * D;
      cx.setTransform(D, 0, 0, D, 0, 0);
    };
    size();
    window.addEventListener("resize", size);

    // La police Bodoni du site (nom généré par next/font)
    const probe = document.createElement("span");
    probe.className = "font-display";
    probe.style.cssText = "position:absolute;visibility:hidden";
    document.body.appendChild(probe);
    const family = getComputedStyle(probe).fontFamily || "Didot, Georgia, serif";
    probe.remove();

    const start = async () => {
      try {
        await document.fonts.load(`500 250px ${family}`);
      } catch {}
      if (!alive) return;

      const S = sample(drawScene, W < 640 ? 6 : 5);
      const T = sample((o) => {
        o.fillStyle = "#000";
        o.textAlign = "center";
        o.textBaseline = "middle";
        o.font = `500 250px ${family}`;
        o.fillText("NAMA", SW / 2, SH / 2 + 12);
      }, 4);
      const N = Math.max(S.length, T.length);
      const P: P[] = [];
      for (let i = 0; i < N; i++) {
        const s = S[i % S.length];
        const t = T[i % T.length];
        P.push({
          sx: s[0],
          sy: s[1],
          sc: s[2],
          tx: t[0],
          ty: t[1],
          tc: Math.random() < 0.18 ? [176, 141, 94] : [34, 28, 23],
          rx: (Math.random() - 0.5) * 1400,
          ry: (Math.random() - 0.5) * 900,
          dz: (Math.random() - 0.5) * 600,
          del: Math.random() * 0.35,
          sz: 2.4 + Math.random() * 1.4,
        });
      }

      const mix = (a: RGB, b: RGB, k: number) => `rgb(${(a[0] + (b[0] - a[0]) * k) | 0},${(a[1] + (b[1] - a[1]) * k) | 0},${(a[2] + (b[2] - a[2]) * k) | 0})`;
      const t0 = performance.now();

      const draw = (now: number) => {
        let t = (now - t0) / 1000;
        if (mode === "intro") {
          if (reduce) t = 6;
          if (t > 5.6) {
            done.current?.();
            return;
          }
        } else t = reduce ? 2 : t % 9.6;

        cx.clearRect(0, 0, W, H);
        const sc = Math.min(W / 960, H / 580);
        for (const p of P) {
          let x: number;
          let y: number;
          let z = 0;
          let c: string;
          if (t < 1.2) {
            // les particules arrivent et dessinent l'intérieur
            const k = ease(cl((t - p.del * 0.8) / 0.9));
            x = p.rx + (p.sx - p.rx) * k;
            y = p.ry + (p.sy - p.ry) * k;
            z = p.dz * (1 - k);
            c = mix(p.sc, p.sc, 0);
          } else if (t < 2.8) {
            x = p.sx;
            y = p.sy + Math.sin(now / 700 + p.sx * 0.02) * 1.2;
            c = mix(p.sc, p.sc, 0);
          } else if (t < 4.6) {
            // elles s'envolent et écrivent NAMA
            const k = ease(cl((t - 2.8 - p.del) / 1.45));
            x = p.sx + (p.tx - p.sx) * k;
            y = p.sy + (p.ty - p.sy) * k;
            z = Math.sin(Math.PI * k) * p.dz;
            c = mix(p.sc, p.tc, k);
          } else if (t < 8) {
            x = p.tx;
            y = p.ty + Math.sin(now / 900 + p.tx * 0.01) * 0.8;
            c = mix(p.tc, p.tc, 0);
          } else {
            // (boucle) retour à l'intérieur
            const k = ease(cl((t - 8 - p.del * 0.5) / 1.3));
            x = p.tx + (p.sx - p.tx) * k;
            y = p.ty + (p.sy - p.ty) * k;
            z = Math.sin(Math.PI * k) * p.dz;
            c = mix(p.tc, p.sc, k);
          }
          const f = 800 / (800 + z);
          const s = p.sz * f * sc * 1.15;
          cx.fillStyle = c;
          cx.fillRect(W / 2 + x * f * sc - s / 2, H / 2 + y * f * sc - s / 2, s, s);
        }
        if (!(reduce && mode === "loop")) raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
    };
    start();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, [mode]);

  return <canvas ref={ref} aria-hidden className={`block h-full w-full ${className}`} />;
}
