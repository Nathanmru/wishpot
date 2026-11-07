"use client";

import { useState } from "react";

/** Télécharger toutes les slides d'un coup + copier la légende. */
export default function CarouselActions({ urls, name, caption }: { urls: string[]; name: string; caption: string }) {
  const [state, setState] = useState<"" | "busy" | "done">("");
  const [copied, setCopied] = useState(false);

  async function downloadAll() {
    setState("busy");
    for (let i = 0; i < urls.length; i++) {
      try {
        const blob = await fetch(urls[i]).then((r) => r.blob());
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${name}-${String(i + 1).padStart(2, "0")}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
        await new Promise((r) => setTimeout(r, 400));
      } catch {}
    }
    setState("done");
  }

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-[auto_1fr] md:items-start">
      <button type="button" onClick={downloadAll} disabled={state === "busy"} className="btn btn-primary !px-7 !py-4 text-[12px] uppercase tracking-label">
        {state === "busy" ? "Téléchargement…" : state === "done" ? "Téléchargé ✓" : `Tout télécharger (${urls.length})`}
      </button>
      <div>
        <p className="caps text-[10px] text-muted">Légende à copier</p>
        <textarea readOnly value={caption} rows={9} className="input mt-2 font-sans text-sm" />
        <button
          type="button"
          onClick={() =>
            navigator.clipboard.writeText(caption).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            })
          }
          className="link-caps mt-3"
        >
          {copied ? "Copiée ✓" : "Copier la légende"}
        </button>
      </div>
    </div>
  );
}
