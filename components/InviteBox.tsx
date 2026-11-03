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
    <section className="card bg-sea-soft/60">
      <h2 className="font-semibold">💌 {t.invite}</h2>
      <p className="mt-1 text-sm text-muted">{t.inviteText}</p>
      <div className="mt-3 truncate rounded-xl border border-line bg-white px-3 py-2 font-mono text-xs">{url}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={copy} className="btn-primary">{copied ? t.copied : t.copy}</button>
        {canShare && (
          <button
            onClick={() => navigator.share({ title: projectName, url }).catch(() => null)}
            className="btn-ghost"
          >
            {t.share}
          </button>
        )}
        {canRegenerate && (
          <button disabled={pending} onClick={() => start(() => regenerate())} className="px-2 text-xs text-muted hover:text-ink">
            ↻ {t.newLink}
          </button>
        )}
      </div>
    </section>
  );
}
