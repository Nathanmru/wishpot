"use client";

import { useState, useTransition } from "react";
import { addItem } from "@/app/actions";
import { illustrationFor } from "@/lib/itemImage";

type T = Record<
  "addTitle" | "pasteLink" | "fetch" | "fetching" | "orManual" | "title" | "price" | "qty" | "add" | "cancel" | "priceNotFound" | "fetchError",
  string
>;

type Draft = { url: string | null; title: string; price: string; quantity: string; image: string | null; site: string | null };

const EMPTY: Draft = { url: null, title: "", price: "", quantity: "1", image: null, site: null };

export default function AddItemForm({ projectId, currency, t }: { projectId: string; currency: string; t: T }) {
  const [link, setLink] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, start] = useTransition();

  async function fetchLink(raw?: string) {
    // Accepte aussi un texte partagé depuis une appli ("Regarde ça https://…")
    const url = ((raw ?? link).match(/https?:\/\/[^\s<>"']+/i)?.[0] ?? "").replace(/[).,;!?]+$/, "");
    if (!url) return;
    setLink(url);
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok || data.failed) setNotice(t.fetchError);
      else if (data.price == null) setNotice(t.priceNotFound);
      setDraft({
        url: data.url || url,
        title: data.title || "",
        price: data.price != null ? String(data.price) : "",
        quantity: "1",
        image: data.image || null,
        site: data.site || null,
      });
    } catch {
      setNotice(t.fetchError);
      setDraft({ ...EMPTY, url });
    } finally {
      setLoading(false);
    }
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    start(async () => {
      await addItem(projectId, {
        title: draft.title,
        price: parseFloat(draft.price.replace(",", ".")) || 0,
        quantity: parseInt(draft.quantity) || 1,
        url: draft.url,
        image_url: draft.image,
      });
      setDraft(null);
      setLink("");
      setNotice(null);
    });
  }

  return (
    <section className="border-y border-line py-8 sm:py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="display text-3xl sm:text-4xl">{t.addTitle}</h2>
        {!draft && (
          <button type="button" onClick={() => setDraft({ ...EMPTY })} className="caps text-muted underline-offset-4 hover:text-ink hover:underline">
            {t.orManual}
          </button>
        )}
      </div>

      {!draft ? (
        <>
          <form
            className="mt-6 flex items-center gap-4 border-b border-ink pb-2"
            onSubmit={(e) => {
              e.preventDefault();
              fetchLink();
            }}
          >
            <input
              type="text"
              inputMode="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("text");
                if (/https?:\/\//i.test(pasted)) {
                  e.preventDefault();
                  fetchLink(pasted);
                }
              }}
              placeholder={t.pasteLink}
              aria-label={t.pasteLink}
              className="min-w-0 flex-1 bg-transparent py-2 text-lg outline-none placeholder:text-muted/60"
            />
            {!link && !loading && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    const txt = await navigator.clipboard.readText();
                    if (txt) fetchLink(txt);
                  } catch {}
                }}
                className="caps shrink-0 text-muted hover:text-ink"
              >
                Coller
              </button>
            )}
            <button disabled={loading || !link} className="caps shrink-0 disabled:opacity-40">
              {loading ? t.fetching : `${t.fetch} →`}
            </button>
          </form>
          <p className="mt-3 text-sm text-muted">La photo, le nom et le prix sont récupérés tout seuls quand la boutique le permet.</p>
        </>
      ) : (
        <form onSubmit={save} className="mt-8 grid gap-6 sm:grid-cols-[200px_1fr] sm:gap-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={draft.image || draft.title}
            src={draft.image || illustrationFor(draft.title || "")}
            alt=""
            referrerPolicy="no-referrer"
            onError={(e) => {
              const fb = illustrationFor(draft.title || "");
              if (e.currentTarget.src !== fb) e.currentTarget.src = fb;
            }}
            className="aspect-[4/5] w-full bg-white object-cover sm:w-[200px]"
          />
          <div className="space-y-5">
            {draft.site && <p className="caps text-muted">{draft.site}</p>}
            <label className="block">
              <span className="label">{t.title}</span>
              <input
                required
                autoFocus={!draft.title}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className="input-line text-lg"
              />
            </label>
            <div className="grid grid-cols-[1fr_88px] gap-5">
              <label className="block">
                <span className="label">
                  {t.price} ({currency})
                </span>
                <input
                  required
                  inputMode="decimal"
                  autoFocus={!!draft.title && !draft.price}
                  value={draft.price}
                  onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                  className="input-line text-lg"
                />
              </label>
              <label className="block">
                <span className="label">{t.qty}</span>
                <input
                  inputMode="numeric"
                  value={draft.quantity}
                  onChange={(e) => setDraft({ ...draft, quantity: e.target.value })}
                  className="input-line text-lg"
                />
              </label>
            </div>
            {notice && <p className="border-l-2 border-brass pl-3 text-sm text-muted">{notice}</p>}
            <div className="flex items-center gap-6 pt-2">
              <button disabled={saving} className="btn-primary !px-8 !py-3.5 text-[12px] uppercase tracking-label">
                {saving ? "…" : t.add}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft(null);
                  setNotice(null);
                }}
                className="caps text-muted hover:text-ink"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
