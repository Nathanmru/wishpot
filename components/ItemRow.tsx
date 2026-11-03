"use client";

import { useState, useTransition } from "react";
import { deleteItem, updateItem } from "@/app/actions";
import type { Item } from "@/lib/config";

type T = Record<"buy" | "markBought" | "bought" | "remove" | "addedBy" | "price" | "qty" | "save", string>;

export default function ItemRow({
  item,
  projectId,
  currency,
  lang,
  addedBy,
  t,
}: {
  item: Item;
  projectId: string;
  currency: string;
  lang: "fr" | "en";
  addedBy: string;
  t: T;
}) {
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(String(item.price));
  const [qty, setQty] = useState(String(item.quantity));

  const fmt = (v: number) =>
    new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB", { style: "currency", currency, maximumFractionDigits: v % 1 ? 2 : 0 }).format(v);

  const total = Number(item.price) * item.quantity;

  return (
    <li className={`card flex gap-4 !p-4 transition ${item.purchased ? "opacity-60" : ""} ${pending ? "animate-pulse" : ""}`}>
      {item.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image_url} alt="" referrerPolicy="no-referrer" className="h-20 w-20 shrink-0 rounded-xl border border-line object-cover" />
      ) : (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-cream text-2xl">🎁</div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className={`line-clamp-2 font-medium ${item.purchased ? "line-through" : ""}`}>{item.title}</p>
          {!editing && (
            <button onClick={() => setEditing(true)} className="shrink-0 text-right" title={t.price}>
              <span className="block font-display text-lg font-semibold">{fmt(total)}</span>
              {item.quantity > 1 && (
                <span className="block text-xs text-muted">
                  {item.quantity} × {fmt(Number(item.price))}
                </span>
              )}
            </button>
          )}
        </div>

        {editing ? (
          <form
            className="mt-2 flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              start(async () => {
                await updateItem(projectId, item.id, {
                  price: parseFloat(price.replace(",", ".")) || 0,
                  quantity: parseInt(qty) || 1,
                });
                setEditing(false);
              });
            }}
          >
            <label className="text-xs text-muted">
              {t.price}
              <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" className="input mt-1 w-28 !py-1.5" autoFocus />
            </label>
            <label className="text-xs text-muted">
              {t.qty}
              <input value={qty} onChange={(e) => setQty(e.target.value)} inputMode="numeric" className="input mt-1 w-16 !py-1.5" />
            </label>
            <button className="btn-primary !px-4 !py-1.5">{t.save}</button>
            <button type="button" onClick={() => setEditing(false)} className="px-2 py-1.5 text-sm text-muted">×</button>
          </form>
        ) : (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span>
              {t.addedBy} {addedBy}
            </span>
            {item.url && (
              <a href={`/go?item=${item.id}`} target="_blank" rel="noopener sponsored" className="font-semibold text-ink underline-offset-4 hover:underline">
                {t.buy} ↗
              </a>
            )}
            <button
              onClick={() => start(() => updateItem(projectId, item.id, { purchased: !item.purchased }))}
              className={`rounded-full border px-2 py-0.5 ${item.purchased ? "border-sage bg-sage-soft text-sage" : "border-line hover:border-ink"}`}
            >
              {item.purchased ? `✓ ${t.bought}` : t.markBought}
            </button>
            <button onClick={() => start(() => deleteItem(projectId, item.id))} className="hover:text-terra">
              {t.remove}
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
