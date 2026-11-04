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
    <section className="border border-line bg-white p-6 sm:p-8">
      <p className="caps text-muted">{t.invite}</p>
      <p className="mt-3 leading-relaxed">{t.inviteText}</p>
      <p className="mt-5 truncate border-b border-line pb-2 text-sm text-muted">{url}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button onClick={copy} className="btn-primary !px-6 !py-3 text-[12px] uppercase tracking-label">
          {copied ? t.copied : t.copy}
        </button>
        {canShare && (
          <button
            onClick={() => navigator.share({ title: projectName, url }).catch(() => null)}
            className="btn-ghost !px-6 !py-3 text-[12px] uppercase tracking-label"
          >
            {t.share}
          </button>
        )}
        {canRegenerate && (
          <button disabled={pending} onClick={() => start(() => regenerate())} className="ml-auto text-xs text-muted hover:text-ink">
            ↻ {t.newLink}
          </button>
        )}
      </div>
    </section>
  );
}
