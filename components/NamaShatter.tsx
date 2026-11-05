"use client";

import { useEffect, useRef } from "react";

/**
 * Le mot NAMA en relief laiton, qui pivote en 3D, se brise en éclats puis se reforme.
 *  - mode "loop"  : en boucle (page À propos)
 *  - mode "intro" : les éclats se rassemblent, le mot tient, puis se brise en s'effaçant → onDone
 */
type Props = { mode?: "loop" | "intro"; onDone?: () => void; className?: string };

type P = { x: number; y: number; z: number; face: boolean; dx: number; dy: number; dz: number; r: number; s: number };

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function NamaShatter({ mode = "loop", onDone, className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const cx = cv.getContext("2d");
    if (!cx) return;
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
        await document.fonts.load(`500 230px ${family}`);
      } catch {}
      if (!alive) return;

      // Échantillonne le mot en points 3D (l'épaisseur donne le relief)
      const FW = 900;
      const FH = 300;
      const off = document.createElement("canvas");
      off.width = FW;
      off.height = FH;
      const o = off.getContext("2d")!;
      o.fillStyle = "#fff";
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.font = `500 230px ${family}`;
      o.fillText("NAMA", FW / 2, FH / 2 + 10);
      const img = o.getImageData(0, 0, FW, FH).data;
      const step = W < 640 ? 6 : 5;
      const pts: P[] = [];
      for (let y = 0; y < FH; y += step)
        for (let x = 0; x < FW; x += step) {
          if (img[(y * FW + x) * 4 + 3] <= 128) continue;
          for (let z = -2; z <= 2; z++) {
            if (Math.abs(z) === 2 && Math.random() < 0.4) continue;
            let dx = Math.random() - 0.5;
            let dy = Math.random() - 0.5;
            let dz = Math.random() - 0.5;
            const l = Math.hypot(dx, dy, dz) || 1;
            dx /= l;
            dy /= l;
            dz /= l;
            pts.push({ x: x - FW / 2, y: y - FH / 2, z: z * 9, face: z === -2, dx, dy, dz, r: 0.8 + Math.random() * 1.6, s: 0.6 + Math.random() * 1.2 });
          }
        }

      const t0 = performance.now();
      const CYCLE = 6.5;

      const draw = (now: number) => {
        const t = (now - t0) / 1000;
        let k = 0; // 0 = mot formé, 1 = éclaté
        let alpha = 1;
        if (reduce) {
          k = 0;
        } else if (mode === "intro") {
          if (t < 1.5) k = 1 - ease(t / 1.5);
          else if (t < 2.4) k = 0;
          else if (t < 3.4) {
            k = ease((t - 2.4) / 1);
            alpha = 1 - ease((t - 2.4) / 1);
          } else {
            done.current?.();
            return;
          }
        } else {
          const c = t % CYCLE;
          if (c < 2.2) k = 0;
          else if (c < 3.4) k = ease((c - 2.2) / 1.2);
          else if (c < 4.2) k = 1;
          else if (c < 5.8) k = 1 - ease((c - 4.2) / 1.6);
        }

        const rotY = (reduce ? 0 : Math.sin(now / 2600) * 0.45) + k * 0.6;
        const rotX = reduce ? 0 : Math.sin(now / 3700) * 0.12;
        const sc = Math.min(W / 1000, H / 420) * 0.95;
        const cyR = Math.cos(rotY);
        const syR = Math.sin(rotY);
        const cxR = Math.cos(rotX);
        const sxR = Math.sin(rotX);

        cx.clearRect(0, 0, W, H);
        const g = cx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.6);
        g.addColorStop(0, `rgba(176,141,94,${0.1 * alpha})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        cx.fillStyle = g;
        cx.fillRect(0, 0, W, H);

        const out: [number, number, number, number, P][] = [];
        for (const p of pts) {
          const spread = k * 420 * p.s;
          let x = p.x + p.dx * spread;
          let y = p.y + p.dy * spread;
          const z = p.z + p.dz * spread;
          const a = k * p.s * 0.6;
          const xx = x * Math.cos(a) - y * Math.sin(a);
          y = x * Math.sin(a) + y * Math.cos(a);
          x = xx;
          const X = x * cyR + z * syR;
          let Z = -x * syR + z * cyR;
          const Y = y * cxR - Z * sxR;
          Z = y * sxR + Z * cxR;
          const f = 900 / (900 + Z);
          out.push([W / 2 + X * f * sc, H / 2 + Y * f * sc, Z, f, p]);
        }
        out.sort((a, b) => b[2] - a[2]);
        for (const [X, Y, Z, f, p] of out) {
          const light = Math.max(0, Math.min(1, 0.55 - Z / 500 + (p.face ? 0.25 : 0)));
          const r = Math.round(120 + light * 100);
          const gg = Math.round(92 + light * 80);
          const b = Math.round(55 + light * 55);
          cx.fillStyle = `rgba(${r},${gg},${b},${(0.55 + 0.45 * light) * alpha})`;
          const s = p.r * (1 + k * 0.8) * f * sc * 2.2;
          cx.fillRect(X - s / 2, Y - s / 2, s, s);
        }
        if (!reduce || mode === "intro") raf = requestAnimationFrame(draw);
      };
      if (reduce && mode === "intro") {
        draw(t0);
        setTimeout(() => done.current?.(), 900);
      } else raf = requestAnimationFrame(draw);
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
