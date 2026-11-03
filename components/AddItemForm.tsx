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
    <section className="rounded-xl3 bg-ink p-5 text-white shadow-lift sm:p-7">
      <h2 className="display text-3xl">{t.addTitle}</h2>

      {!draft ? (
        <>
          <form
            className="mt-4 flex flex-col gap-2 sm:flex-row"
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
              className="w-full rounded-full border border-white/15 bg-white/10 px-5 py-3.5 text-base text-white outline-none transition placeholder:text-white/50 focus:border-apricot focus:bg-white/15"
            />
            <button disabled={loading || !link} className="btn shrink-0 bg-apricot !px-6 !py-3.5 text-ink hover:bg-white">
              {loading ? t.fetching : t.fetch}
            </button>
          </form>
          <button type="button" onClick={() => setDraft({ ...EMPTY })} className="mt-3 text-sm text-white/60 underline-offset-4 hover:text-white hover:underline">
            {t.orManual}
          </button>
        </>
      ) : (
        <form onSubmit={save} className="mt-5 rounded-xl2 bg-white p-4 text-ink sm:p-5">
          <div className="flex gap-4">
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
              className="h-28 w-28 shrink-0 rounded-xl border border-line object-cover"
            />
            <div className="min-w-0 flex-1 space-y-3">
              {draft.site && <p className="text-xs font-medium text-muted">{draft.site}</p>}
              <div>
                <label className="label" htmlFor="it-title">{t.title}</label>
                <input
                  id="it-title"
                  required
                  autoFocus={!draft.title}
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="input"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label" htmlFor="it-price">{t.price} ({currency})</label>
                  <input
                    id="it-price"
                    required
                    inputMode="decimal"
                    autoFocus={!!draft.title && !draft.price}
                    value={draft.price}
                    onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                    className="input"
                  />
                </div>
                <div className="w-20">
                  <label className="label" htmlFor="it-qty">{t.qty}</label>
                  <input
                    id="it-qty"
                    inputMode="numeric"
                    value={draft.quantity}
                    onChange={(e) => setDraft({ ...draft, quantity: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>
          {notice && <p className="mt-4 rounded-xl bg-apricot-soft px-3 py-2 text-sm text-walnut-dark">{notice}</p>}
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setDraft(null);
                setNotice(null);
              }}
              className="btn-ghost"
            >
              {t.cancel}
            </button>
            <button disabled={saving} className="btn-primary">{saving ? "…" : t.add}</button>
          </div>
        </form>
      )}
    </section>
  );
}
