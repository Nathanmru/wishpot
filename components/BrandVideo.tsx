"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Piece } from "@/lib/landingPieces";

/**
 * Vidéos de présentation d'Atelier Nama (1080×1920, Reels / TikTok / Pinterest) :
 * des scènes animées (logo, phrases, défilé de vraies pièces, cagnotte qui se remplit, fin « lien en bio »).
 */

const W = 1080;
const H = 1920;
const PAPER = "#EFEAE2";
const INK = "#1A1714";
const MUTED = "#8A7F72";
const WALNUT = "#6E4A30";
const BRASS = "#B08D5E";

type Scene =
  | { k: "logo"; d: number }
  | { k: "text"; d: number; kicker?: string; lines: string[]; accent?: number }
  | { k: "montage"; d: number; caption: string }
  | { k: "pot"; d: number }
  | { k: "words"; d: number; words: string[] }
  | { k: "end"; d: number };

const SCRIPTS: { id: string; name: string; scenes: Scene[]; caption: string }[] = [
  {
    id: "presentation",
    name: "Présentation",
    scenes: [
      { k: "logo", d: 2.4 },
      { k: "text", d: 2.8, kicker: "VOTRE INTÉRIEUR", lines: ["Il vous manque", "LA pièce", "qui change tout ?"], accent: 1 },
      { k: "montage", d: 4.2, caption: "Des pièces vintage & design, dénichées pour vous" },
      { k: "text", d: 2.6, kicker: "SIMPLE", lines: ["Triez par style,", "couleur", "ou budget."], accent: 1 },
      { k: "pot", d: 4 },
      { k: "words", d: 3, words: ["Dénichez.", "Épargnez.", "Offrez-vous-la."] },
      { k: "end", d: 3.2 },
    ],
    caption:
      "Atelier Nama, c'est la déco qui a du caractère 🤎\n\nDes pièces vintage et design dénichées pour vous, triées par style, couleur et budget. Et si la pièce de vos rêves coûte un peu cher, créez une cagnotte (seul ou à plusieurs) pour vous l'offrir.\n\nLien en bio ✨\n\n#deco #decointerieur #vintage #chinage #homedecor #interiordesign #decorationinterieure #ateliernama",
  },
  {
    id: "cagnotte",
    name: "Le concept cagnotte",
    scenes: [
      { k: "text", d: 2.8, kicker: "LE PROBLÈME", lines: ["Le canapé", "de vos rêves", "coûte 1 200 € ?"], accent: 1 },
      { k: "text", d: 2.8, kicker: "LA SOLUTION", lines: ["Mettez 100 €", "de côté par mois,", "à deux."], accent: 0 },
      { k: "pot", d: 4.2 },
      { k: "montage", d: 3.8, caption: "Choisissez vos pièces, on calcule la date" },
      { k: "words", d: 3, words: ["Une envie.", "Un budget.", "Une date."] },
      { k: "end", d: 3.2 },
    ],
    caption:
      "Meubler son appart sans se ruiner ? On a la solution 👀\n\nChoisissez vos pièces sur Atelier Nama, fixez ce que chacun met de côté chaque mois, et le site vous dit quand vous pourrez vous les offrir. À deux, en famille ou entre amis.\n\nLien en bio 🤎\n\n#premierappart #emmenagement #deco #cagnotte #budget #decointerieur #ateliernama",
  },
  {
    id: "pepites",
    name: "Pépites & chine",
    scenes: [
      { k: "logo", d: 2.2 },
      { k: "text", d: 3, kicker: "CHINER AUTREMENT", lines: ["Chiner sans passer", "vos week-ends", "en brocante ?"], accent: 1 },
      { k: "montage", d: 4.4, caption: "Vintage et petites maisons de design, au même endroit" },
      { k: "text", d: 2.8, kicker: "NOTRE PROMESSE", lines: ["Une sélection", "faite à la main,", "par style."], accent: 1 },
      { k: "words", d: 3, words: ["Japandi.", "Bohème.", "Vintage."] },
      { k: "end", d: 3.2 },
    ],
    caption:
      "Le vintage et le design qu'on aime, réunis au même endroit 🤎\n\nAtelier Nama sélectionne des pièces de caractère (chinées ou de petites maisons de design) et les range par style : japandi, bohème, vintage, art déco…\n\nLien en bio ✨\n\n#chinage #vintage #brocante #decovintage #pepitevintage #decointerieur #ateliernama",
  },
];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const cl = (t: number) => Math.max(0, Math.min(1, t));

function fontFamily(cls: string) {
  const el = document.createElement("span");
  el.className = cls;
  el.style.cssText = "position:absolute;visibility:hidden";
  document.body.appendChild(el);
  const f = getComputedStyle(el).fontFamily;
  el.remove();
  return f || "Georgia, serif";
}

function cover(cx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, pad = 0.08) {
  const r = Math.min((w * (1 - pad * 2)) / img.naturalWidth, (h * (1 - pad * 2)) / img.naturalHeight);
  const iw = img.naturalWidth * r;
  const ih = img.naturalHeight * r;
  cx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
}

export default function BrandVideo({ pieces }: { pieces: Piece[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(0);
  const [script, setScript] = useState(SCRIPTS[0].id);
  const [busy, setBusy] = useState(false);
  const [video, setVideo] = useState<{ url: string; ext: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const S = SCRIPTS.find((s) => s.id === script)!;
  const duration = useMemo(() => S.scenes.reduce((a, s) => a + s.d, 0), [S]);

  useEffect(() => {
    imgs.current = pieces.slice(0, 18).map((p) => {
      const im = new Image();
      im.onload = () => setLoaded((n) => n + 1);
      im.onerror = () => setLoaded((n) => n + 1);
      im.src = `/api/img?id=${p.id}`;
      return im;
    });
  }, [pieces]);
  const ready = loaded >= Math.min(pieces.length, 18);
  const good = () => imgs.current.filter((im) => im.complete && im.naturalWidth);

  function brand(cx: CanvasRenderingContext2D, F: Record<string, string>, y: number, scale = 1) {
    cx.textAlign = "center";
    cx.fillStyle = INK;
    cx.font = `400 ${56 * scale}px ${F.s}`;
    (cx as any).letterSpacing = `${34 * scale}px`;
    cx.fillText("ATELIER", W / 2 + 17 * scale, y);
    cx.font = `500 ${215 * scale}px ${F.d}`;
    (cx as any).letterSpacing = `${12 * scale}px`;
    cx.fillText("NAMA", W / 2 + 6 * scale, y + 212 * scale);
    (cx as any).letterSpacing = "0px";
  }

  function frame(cx: CanvasRenderingContext2D, t: number, F: Record<string, string>) {
    cx.globalAlpha = 1;
    cx.fillStyle = PAPER;
    cx.fillRect(0, 0, W, H);
    let t0 = 0;
    let sc = S.scenes[S.scenes.length - 1];
    for (const s of S.scenes) {
      if (t < t0 + s.d) {
        sc = s;
        break;
      }
      t0 += s.d;
    }
    const lt = Math.min(t - t0, sc.d);
    const k = ease(cl(lt / 0.7));
    const out = sc.k === "end" ? 1 : 1 - ease(cl((lt - (sc.d - 0.35)) / 0.35));
    cx.globalAlpha = Math.min(k, out);
    const list = good();

    if (sc.k !== "logo" && sc.k !== "end") {
      cx.save();
      cx.globalAlpha = 1;
      cx.textAlign = "center";
      cx.fillStyle = INK;
      cx.font = `500 40px ${F.d}`;
      (cx as any).letterSpacing = "10px";
      cx.fillText("ATELIER NAMA", W / 2 + 5, 150);
      (cx as any).letterSpacing = "0px";
      cx.restore();
    }

    if (sc.k === "logo") {
      brand(cx, F, 860 + (1 - k) * 40);
      cx.fillStyle = MUTED;
      cx.font = `italic 400 52px ${F.d}`;
      cx.globalAlpha = Math.min(ease(cl((lt - 0.6) / 0.7)), out);
      cx.fillText("la déco qui a du caractère", W / 2, 1220);
    }

    if (sc.k === "text") {
      cx.textAlign = "center";
      if (sc.kicker) {
        cx.fillStyle = MUTED;
        cx.font = `400 38px ${F.s}`;
        (cx as any).letterSpacing = "8px";
        cx.fillText(sc.kicker, W / 2 + 4, 700);
        (cx as any).letterSpacing = "0px";
      }
      sc.lines.forEach((ln, i) => {
        const ki = ease(cl((lt - 0.12 * i) / 0.6));
        cx.globalAlpha = Math.min(ki, out);
        const acc = i === sc.accent;
        cx.fillStyle = acc ? WALNUT : INK;
        cx.font = acc ? `italic 400 120px ${F.d}` : `500 104px ${F.d}`;
        cx.fillText(ln, W / 2, 860 + i * 140 + (1 - ki) * 50, 980);
      });
    }

    if (sc.k === "montage") {
      const cell = 300;
      const gap = 24;
      const gx = (W - 3 * cell - 2 * gap) / 2;
      const step = Math.floor(lt / 0.3);
      for (let i = 0; i < 9; i++) {
        const x = gx + (i % 3) * (cell + gap);
        const y = 330 + Math.floor(i / 3) * (cell + gap);
        const ki = ease(cl((lt - i * 0.06) / 0.5));
        cx.globalAlpha = Math.min(ki, out);
        cx.fillStyle = "#FFFFFF";
        cx.fillRect(x, y + (1 - ki) * 40, cell, cell);
        // une case change à la fois, en cascade, sans jamais montrer deux fois la même pièce
        const im = list.length ? list[(i + Math.floor((step + 9 - i) / 9) * 9) % list.length] : null;
        if (im) cover(cx, im, x, y + (1 - ki) * 40, cell, cell);
      }
      cx.globalAlpha = Math.min(ease(cl((lt - 0.5) / 0.6)), out);
      cx.textAlign = "center";
      cx.fillStyle = INK;
      cx.font = `500 76px ${F.d}`;
      const words = sc.caption.split(" ");
      const lines: string[] = [];
      let line = "";
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (cx.measureText(test).width > 920 && line) (lines.push(line), (line = w));
        else line = test;
      }
      lines.push(line);
      lines.forEach((ln, i) => cx.fillText(ln, W / 2, 1420 + i * 92));
    }

    if (sc.k === "pot") {
      const x = 130;
      const y = 520;
      const w = 820;
      cx.fillStyle = "rgba(21,18,15,0.08)";
      cx.fillRect(x + 20, y + 30, w, 860);
      cx.fillStyle = "#F7F4EF";
      cx.fillRect(x, y, w, 860);
      cx.textAlign = "left";
      cx.fillStyle = MUTED;
      cx.font = `400 34px ${F.s}`;
      (cx as any).letterSpacing = "6px";
      cx.fillText("CAGNOTTE MAISON · 2 MEMBRES", x + 70, y + 110);
      (cx as any).letterSpacing = "0px";
      cx.fillStyle = INK;
      cx.font = `500 96px ${F.d}`;
      cx.fillText("Notre salon", x + 70, y + 240);
      cx.fillStyle = MUTED;
      cx.font = `400 32px ${F.s}`;
      cx.fillText("CHACUN", x + 70, y + 340);
      cx.fillText("OBJECTIF", x + 460, y + 340);
      cx.fillStyle = INK;
      cx.font = `500 76px ${F.d}`;
      cx.fillText("100 €", x + 70, y + 430);
      cx.fillText("2 400 €", x + 460, y + 430);
      cx.fillStyle = MUTED;
      cx.font = `italic 400 40px ${F.d}`;
      cx.fillText("/mois", x + 270, y + 430);
      const p = ease(cl((lt - 0.4) / (sc.d - 1.2)));
      const saved = Math.round((1100 * p) / 10) * 10;
      cx.fillStyle = "#E4DDD2";
      cx.fillRect(x + 70, y + 520, w - 140, 18);
      cx.fillStyle = BRASS;
      cx.fillRect(x + 70, y + 520, (w - 140) * (saved / 2400), 18);
      cx.fillStyle = INK;
      cx.font = `500 64px ${F.d}`;
      cx.fillText(`${saved.toLocaleString("fr-FR")} € épargnés`, x + 70, y + 640);
      cx.fillStyle = MUTED;
      cx.font = `400 32px ${F.s}`;
      cx.fillText("ARRIVÉE PRÉVUE", x + 70, y + 740);
      cx.fillStyle = WALNUT;
      cx.font = `italic 400 64px ${F.d}`;
      cx.fillText("novembre 2027", x + 70, y + 815);
      cx.textAlign = "center";
      cx.fillStyle = INK;
      cx.font = `500 70px ${F.d}`;
      cx.fillText("Une envie, un budget, une date.", W / 2, 1560, 980);
    }

    if (sc.k === "words") {
      cx.textAlign = "center";
      sc.words.forEach((wd, i) => {
        const ki = ease(cl((lt - 0.55 * i) / 0.5));
        cx.globalAlpha = Math.min(ki, out);
        cx.fillStyle = i === 1 ? WALNUT : INK;
        cx.font = i === 1 ? `italic 400 140px ${F.d}` : `500 130px ${F.d}`;
        cx.fillText(wd, W / 2, 780 + i * 210 + (1 - ki) * 40, 1000);
      });
    }

    if (sc.k === "end") {
      brand(cx, F, 640);
      const k2 = ease(cl((lt - 0.5) / 0.7));
      cx.globalAlpha = k2;
      cx.textAlign = "center";
      cx.fillStyle = WALNUT;
      cx.font = `italic 400 60px ${F.d}`;
      cx.fillText("Dénichez, comparez, offrez-vous-la.", W / 2, 1080, 980);
      cx.fillStyle = INK;
      cx.fillRect(W / 2 - 240, 1180, 480, 116);
      cx.fillStyle = PAPER;
      cx.font = `500 42px ${F.s}`;
      (cx as any).letterSpacing = "6px";
      cx.fillText("LIEN EN BIO ↗", W / 2 + 3, 1253);
      (cx as any).letterSpacing = "0px";
      cx.fillStyle = MUTED;
      cx.font = `400 36px ${F.s}`;
      cx.fillText("ateliernama.fr", W / 2, 1420);
    }
    cx.globalAlpha = 1;
  }

  useEffect(() => {
    if (busy) return;
    const cx = canvas.current?.getContext("2d");
    if (!cx) return;
    const F = { d: fontFamily("font-display"), s: fontFamily("font-sans") };
    const first = S.scenes[0];
    document.fonts.ready.then(() => frame(cx, Math.min(first.d * 0.6, 1.6), F));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [script, loaded, busy]);

  async function record() {
    const cv = canvas.current;
    const cx = cv?.getContext("2d");
    if (!cv || !cx) return;
    setBusy(true);
    setVideo(null);
    const F = { d: fontFamily("font-display"), s: fontFamily("font-sans") };
    try {
      await Promise.all([document.fonts.load(`500 100px ${F.d}`), document.fonts.load(`italic 400 80px ${F.d}`), document.fonts.load(`400 40px ${F.s}`)]);
    } catch {}
    const types = ["video/mp4;codecs=avc1.42E01E", "video/mp4;codecs=avc1", "video/mp4", "video/webm;codecs=vp9", "video/webm"];
    const mime = types.find((m) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)) || "";
    const rec = new MediaRecorder(cv.captureStream(30), mime ? { mimeType: mime, videoBitsPerSecond: 8_000_000 } : undefined);
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };
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
    setVideo({ url: URL.createObjectURL(new Blob(chunks, { type })), ext: type.includes("mp4") ? "mp4" : "webm" });
    setBusy(false);
  }

  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div>
        <div className="flex flex-wrap gap-3">
          {SCRIPTS.map((s) => (
            <button
              key={s.id}
              type="button"
              disabled={busy}
              onClick={() => {
                setScript(s.id);
                setVideo(null);
              }}
              className={`border px-4 py-2.5 text-sm transition ${s.id === script ? "border-ink bg-white" : "border-line hover:border-ink/40"}`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <ol className="mt-6 space-y-2 text-sm text-muted">
          {S.scenes.map((s, i) => (
            <li key={i}>
              {i + 1}.{" "}
              {s.k === "logo"
                ? "Logo Atelier Nama"
                : s.k === "text"
                  ? `« ${s.lines.join(" ")} »`
                  : s.k === "montage"
                    ? `Défilé de vraies pièces · « ${s.caption} »`
                    : s.k === "pot"
                      ? "La cagnotte qui se remplit"
                      : s.k === "words"
                        ? s.words.join(" ")
                        : "Fin : logo + « Lien en bio »"}
            </li>
          ))}
        </ol>
        <p className="caps mt-8 text-[11px] text-muted">Légende à copier</p>
        <textarea readOnly value={S.caption} rows={9} className="input mt-3 font-sans text-sm" />
        <button
          type="button"
          className="btn-ghost mt-3"
          onClick={() =>
            navigator.clipboard.writeText(S.caption).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            })
          }
        >
          {copied ? "Copié ✓" : "Copier la légende"}
        </button>
      </div>
      <div className="lg:sticky lg:top-28 lg:h-fit">
        <canvas ref={canvas} width={W} height={H} className="mx-auto block aspect-[9/16] w-full max-w-[360px] border border-line bg-paper" />
        <button type="button" onClick={record} disabled={!ready || busy} className="btn-primary mt-4 w-full uppercase tracking-label">
          {busy ? "Enregistrement en cours…" : !ready ? "Chargement des photos…" : `Créer la vidéo (${Math.round(duration)} s)`}
        </button>
        {busy && <p className="mt-2 text-center text-xs text-muted">Laisse cet onglet ouvert et au premier plan pendant {Math.round(duration)} s.</p>}
        {video && (
          <div className="mt-4 text-center">
            <a href={video.url} download={`atelier-nama-${script}.${video.ext}`} className="btn-ghost w-full">
              Télécharger la vidéo (.{video.ext})
            </a>
            <video src={video.url} controls playsInline className="mx-auto mt-4 aspect-[9/16] w-full max-w-[360px] bg-black" />
          </div>
        )}
      </div>
    </div>
  );
}
