"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Piece } from "@/lib/landingPieces";

/**
 * Fabrique une vidéo verticale 1080×1920 « Le look complet pour X € » à partir de vraies pièces du catalogue :
 * accroche → chaque pièce avec son prix et le total qui monte → récap + « lien en bio ».
 * Tout se passe dans le navigateur (canvas + MediaRecorder), puis la vidéo se télécharge.
 */

const W = 1080;
const H = 1920;
const INTRO = 2.6;
const EACH = 1.9;
const OUTRO = 3.6;
const PAPER = "#EFEAE2";
const INK = "#1A1714";
const MUTED = "#8A7F72";
const WALNUT = "#6E4A30";
const BRASS = "#B08D5E";

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const cl = (t: number) => Math.max(0, Math.min(1, t));
const eur = (v: number) => `${Math.round(v).toLocaleString("fr-FR")} €`;

function fontFamily(cls: string) {
  const el = document.createElement("span");
  el.className = cls;
  el.style.cssText = "position:absolute;visibility:hidden";
  document.body.appendChild(el);
  const f = getComputedStyle(el).fontFamily;
  el.remove();
  return f || "Georgia, serif";
}

function wrap(cx: CanvasRenderingContext2D, text: string, max: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (cx.measureText(test).width > max && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function contain(cx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const r = Math.min(w / img.naturalWidth, h / img.naturalHeight);
  const iw = img.naturalWidth * r;
  const ih = img.naturalHeight * r;
  cx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
}

export default function VideoStudio({ slug, title, pieces }: { slug: string; title: string; pieces: Piece[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const imgs = useRef(new Map<number, HTMLImageElement>());
  const [ready, setReady] = useState<Record<number, "ok" | "ko">>({});
  const [picked, setPicked] = useState<number[]>(() => {
    // 5 pièces de catégories différentes pour commencer
    const seen = new Set<string>();
    const out: number[] = [];
    for (const p of pieces) if (!seen.has(p.category) && out.length < 5) (seen.add(p.category), out.push(p.id));
    for (const p of pieces) if (out.length < 5 && !out.includes(p.id)) out.push(p.id);
    return out;
  });
  const [busy, setBusy] = useState(false);
  const [video, setVideo] = useState<{ url: string; ext: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const chosen = useMemo(() => picked.map((id) => pieces.find((p) => p.id === id)).filter((p): p is Piece => !!p && ready[p.id] !== "ko"), [picked, pieces, ready]);
  const total = chosen.reduce((a, p) => a + p.price, 0);
  const allLoaded = chosen.length > 0 && chosen.every((p) => ready[p.id] === "ok");
  const duration = INTRO + chosen.length * EACH + OUTRO;

  // Photos servies par notre domaine (sinon le navigateur refuse de les mettre dans une vidéo)
  useEffect(() => {
    for (const p of pieces) {
      if (imgs.current.has(p.id)) continue;
      const im = new Image();
      im.onload = () => setReady((r) => ({ ...r, [p.id]: "ok" }));
      im.onerror = () => setReady((r) => ({ ...r, [p.id]: "ko" }));
      im.src = `/api/img?id=${p.id}`;
      imgs.current.set(p.id, im);
    }
  }, [pieces]);

  const caption = useMemo(() => {
    const lines = chosen.map((p) => `• ${p.title.slice(0, 60)} — ${p.shop}, ${eur(p.price)}`);
    const tags = ["#deco", "#decointerieur", "#decoration", "#interiordesign", "#homedecor", "#vintage", "#chinage", `#${slug.replace(/-/g, "")}`, "#ateliernama"];
    return `${title} : le look complet pour ${eur(total)} 🤎\n\n${lines.join("\n")}\n\nTout est à shopper sur Atelier Nama (lien en bio). Et pour te l'offrir sans te ruiner, crée ta cagnotte déco 👀\n\n${tags.join(" ")}`;
  }, [chosen, slug, title, total]);

  /** Dessine l'image de la vidéo à l'instant t (secondes). */
  function frame(cx: CanvasRenderingContext2D, t: number, F: { d: string; s: string }) {
    cx.fillStyle = PAPER;
    cx.fillRect(0, 0, W, H);
    cx.textBaseline = "alphabetic";

    // En-tête de marque
    cx.fillStyle = INK;
    cx.textAlign = "center";
    cx.font = `500 44px ${F.d}`;
    (cx as any).letterSpacing = "10px";
    cx.fillText("ATELIER NAMA", W / 2, 150);
    (cx as any).letterSpacing = "0px";

    const n = chosen.length;
    if (t < INTRO) {
      const k = ease(cl(t / 0.9));
      cx.globalAlpha = k;
      cx.fillStyle = MUTED;
      cx.font = `400 38px ${F.s}`;
      (cx as any).letterSpacing = "8px";
      cx.fillText("IDÉE DÉCO", W / 2, 560 + (1 - k) * 40);
      (cx as any).letterSpacing = "0px";
      cx.fillStyle = INK;
      cx.font = `500 128px ${F.d}`;
      const lines = wrap(cx, title, 920);
      lines.forEach((ln, i) => cx.fillText(ln, W / 2, 720 + i * 135 + (1 - k) * 60));
      const k2 = ease(cl((t - 0.5) / 0.9));
      cx.globalAlpha = k2;
      cx.fillStyle = WALNUT;
      cx.font = `italic 400 84px ${F.d}`;
      cx.fillText(`le look complet pour ${eur(total)} ?`, W / 2, 740 + lines.length * 135 + 40, 1000);
      // trois vignettes qui montent
      chosen.slice(0, 3).forEach((p, i) => {
        const k3 = ease(cl((t - 0.8 - i * 0.15) / 0.8));
        cx.globalAlpha = k3;
        const x = 90 + i * 310;
        const y = 1300 + (1 - k3) * 120;
        cx.fillStyle = "#FFFFFF";
        cx.fillRect(x, y, 280, 340);
        const im = imgs.current.get(p.id);
        if (im?.complete && im.naturalWidth) contain(cx, im, x + 20, y + 20, 240, 300);
      });
      cx.globalAlpha = 1;
      return;
    }

    const tp = t - INTRO;
    if (tp < n * EACH) {
      const i = Math.floor(tp / EACH);
      const k = (tp - i * EACH) / EACH;
      const p = chosen[i];
      const before = chosen.slice(0, i).reduce((a, x) => a + x.price, 0);
      const shown = before + p.price * ease(cl((k - 0.15) / 0.45));

      // compteur
      cx.textAlign = "left";
      cx.fillStyle = MUTED;
      cx.font = `400 40px ${F.s}`;
      cx.fillText(`${i + 1} / ${n}`, 90, 290);
      cx.textAlign = "right";
      cx.fillStyle = INK;
      cx.font = `400 40px ${F.s}`;
      cx.fillText("Total", W - 90, 250);
      cx.font = `500 76px ${F.d}`;
      cx.fillText(eur(shown), W - 90, 330);

      // carte produit qui glisse depuis la droite
      const kin = ease(cl(k / 0.28));
      const kout = k > 0.86 ? ease(cl((k - 0.86) / 0.14)) : 0;
      const dx = (1 - kin) * W - kout * W;
      cx.save();
      cx.translate(dx, 0);
      cx.fillStyle = "#FFFFFF";
      cx.fillRect(90, 400, 900, 1050);
      const im = imgs.current.get(p.id);
      if (im?.complete && im.naturalWidth) contain(cx, im, 150, 460, 780, 930);
      cx.textAlign = "left";
      cx.fillStyle = MUTED;
      cx.font = `500 34px ${F.s}`;
      (cx as any).letterSpacing = "6px";
      cx.fillText(p.shop.toUpperCase(), 90, 1530);
      (cx as any).letterSpacing = "0px";
      cx.fillStyle = INK;
      cx.font = `400 46px ${F.s}`;
      wrap(cx, p.title, 900)
        .slice(0, 2)
        .forEach((ln, j) => cx.fillText(ln, 90, 1600 + j * 58));
      cx.font = `500 110px ${F.d}`;
      cx.fillStyle = WALNUT;
      cx.fillText(eur(p.price), 90, 1800);
      cx.restore();
      return;
    }

    // Récap final
    const to = t - INTRO - n * EACH;
    const k = ease(cl(to / 0.7));
    cx.globalAlpha = k;
    const cols = 3;
    const cell = 290;
    const gx = (W - cols * cell - (cols - 1) * 20) / 2;
    chosen.slice(0, 6).forEach((p, i) => {
      const x = gx + (i % cols) * (cell + 20);
      const y = 260 + Math.floor(i / cols) * (cell + 20) + (1 - k) * 40;
      cx.fillStyle = "#FFFFFF";
      cx.fillRect(x, y, cell, cell);
      const im = imgs.current.get(p.id);
      if (im?.complete && im.naturalWidth) contain(cx, im, x + 18, y + 18, cell - 36, cell - 36);
    });
    const top = 260 + Math.ceil(Math.min(n, 6) / cols) * (cell + 20) + 120;
    cx.textAlign = "center";
    cx.fillStyle = MUTED;
    cx.font = `400 40px ${F.s}`;
    (cx as any).letterSpacing = "8px";
    cx.fillText("LE LOOK COMPLET", W / 2, top);
    (cx as any).letterSpacing = "0px";
    cx.fillStyle = INK;
    cx.font = `500 170px ${F.d}`;
    cx.fillText(eur(total), W / 2, top + 190);
    const k2 = ease(cl((to - 0.6) / 0.7));
    cx.globalAlpha = k2;
    cx.fillStyle = WALNUT;
    cx.font = `italic 400 64px ${F.d}`;
    cx.fillText("Tout est sur Atelier Nama", W / 2, top + 330);
    cx.fillStyle = INK;
    cx.fillRect(W / 2 - 230, top + 400, 460, 110);
    cx.fillStyle = PAPER;
    cx.font = `500 40px ${F.s}`;
    (cx as any).letterSpacing = "6px";
    cx.fillText("LIEN EN BIO ↗", W / 2, top + 470);
    (cx as any).letterSpacing = "0px";
    cx.fillStyle = BRASS;
    cx.font = `400 34px ${F.s}`;
    cx.fillText("+ crée ta cagnotte pour te l'offrir", W / 2, top + 590);
    cx.globalAlpha = 1;
  }

  // Aperçu fixe (première image de chaque étape) quand on ne filme pas
  useEffect(() => {
    if (busy) return;
    const cx = canvas.current?.getContext("2d");
    if (!cx) return;
    const F = { d: fontFamily("font-display"), s: fontFamily("font-sans") };
    document.fonts.ready.then(() => frame(cx, INTRO * 0.95, F));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosen, ready, busy]);

  async function record() {
    const cv = canvas.current;
    const cx = cv?.getContext("2d");
    if (!cv || !cx || !allLoaded) return;
    setBusy(true);
    setVideo(null);
    const F = { d: fontFamily("font-display"), s: fontFamily("font-sans") };
    try {
      await Promise.all([document.fonts.load(`500 100px ${F.d}`), document.fonts.load(`italic 400 80px ${F.d}`), document.fonts.load(`400 40px ${F.s}`)]);
    } catch {}
    const types = ["video/mp4;codecs=avc1.42E01E", "video/mp4;codecs=avc1", "video/mp4", "video/webm;codecs=vp9", "video/webm"];
    const mime = types.find((m) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)) || "";
    const stream = cv.captureStream(30);
    const rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 8_000_000 } : undefined);
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const stopped = new Promise<void>((r) => (rec.onstop = () => r()));
    frame(cx, 0, F);
    rec.start(250);
    const t0 = performance.now();
    await new Promise<void>((resolve) => {
      const tick = (now: number) => {
        const t = (now - t0) / 1000;
        frame(cx, Math.min(t, duration), F);
        if (t < duration + 0.2) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
    rec.stop();
    await stopped;
    const type = rec.mimeType || mime || "video/webm";
    const blob = new Blob(chunks, { type });
    setVideo({ url: URL.createObjectURL(blob), ext: type.includes("mp4") ? "mp4" : "webm" });
    setBusy(false);
  }

  const toggle = (id: number) => setPicked((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 8 ? s : [...s, id]));

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div>
        <p className="caps text-[11px] text-muted">
          Pièces de la vidéo · {chosen.length} choisies · total {eur(total)} · {Math.round(duration)} s
        </p>
        <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {pieces.map((p) => {
            const on = picked.includes(p.id);
            const ko = ready[p.id] === "ko";
            return (
              <li key={p.id}>
                <button
                  type="button"
                  disabled={ko || busy}
                  onClick={() => toggle(p.id)}
                  className={`relative block w-full border bg-white p-2 text-left transition ${on ? "border-ink" : "border-line opacity-60 hover:opacity-100"} ${ko ? "cursor-not-allowed opacity-30" : ""}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/api/img?id=${p.id}`} alt="" className="aspect-square w-full object-contain" />
                  <span className="mt-1 block truncate text-[11px]">{p.shop}</span>
                  <span className="block text-[11px] text-muted">{eur(p.price)}</span>
                  {on && <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-white">{picked.indexOf(p.id) + 1}</span>}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-10">
          <p className="caps text-[11px] text-muted">Légende à copier</p>
          <textarea readOnly value={caption} rows={12} className="input mt-3 font-sans text-sm" />
          <button
            type="button"
            className="btn-ghost mt-3"
            onClick={() => {
              navigator.clipboard.writeText(caption).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              });
            }}
          >
            {copied ? "Copié ✓" : "Copier la légende"}
          </button>
        </div>
      </div>

      <div className="lg:sticky lg:top-28 lg:h-fit">
        <canvas ref={canvas} width={W} height={H} className="mx-auto block aspect-[9/16] w-full max-w-[360px] border border-line bg-paper" />
        <button type="button" onClick={record} disabled={!allLoaded || busy || chosen.length < 2} className="btn-primary mt-4 w-full uppercase tracking-label">
          {busy ? "Enregistrement en cours…" : !allLoaded ? "Chargement des photos…" : "Créer la vidéo"}
        </button>
        {busy && <p className="mt-2 text-center text-xs text-muted">Laisse cet onglet ouvert et au premier plan pendant {Math.round(duration)} s.</p>}
        {video && (
          <div className="mt-4 text-center">
            <a href={video.url} download={`atelier-nama-${slug}.${video.ext}`} className="btn-ghost w-full">
              Télécharger la vidéo (.{video.ext})
            </a>
            <video src={video.url} controls playsInline className="mx-auto mt-4 aspect-[9/16] w-full max-w-[360px] bg-black" />
          </div>
        )}
      </div>
    </div>
  );
}
