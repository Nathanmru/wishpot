"use client";

import { useEffect, useState, useTransition } from "react";

type T = Record<"invite" | "inviteText" | "copy" | "copied" | "share" | "newLink", string>;

export default function InviteBox({
  url,
  projectName,
  canRegenerate,
  regenerate,
  t,
}: {
  url: string;
  projectName: string;
  canRegenerate: boolean;
  regenerate: () => Promise<void>;
  t: T;
}) {
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare("share" in navigator), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* rien */
    }
  }

  return (
    <section className="overflow-hidden rounded-xl2 bg-dusk p-5 text-white shadow-soft">
      <h2 className="text-lg font-semibold">{t.invite}</h2>
      <p className="mt-1 text-sm text-white/75">{t.inviteText}</p>
      <div className="mt-4 truncate rounded-xl bg-white/10 px-3 py-2.5 text-xs text-white/85">{url}</div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button onClick={copy} className="btn bg-apricot text-ink hover:bg-white">{copied ? t.copied : t.copy}</button>
        {canShare && (
          <button
            onClick={() => navigator.share({ title: projectName, url }).catch(() => null)}
            className="btn border border-white/25 text-white hover:bg-white/10"
          >
            {t.share}
          </button>
        )}
        {canRegenerate && (
          <button disabled={pending} onClick={() => start(() => regenerate())} className="ml-auto px-1 text-xs text-white/60 hover:text-white">
            ↻ {t.newLink}
          </button>
        )}
      </div>
    </section>
  );
}
