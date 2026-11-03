"use client";

import { useState, useTransition } from "react";
import { deleteItem, updateItem } from "@/app/actions";
import type { Item } from "@/lib/config";

type T = Record<"buy" | "markBought" | "bought" | "remove" | "addedBy" | "price" | "qty" | "save", string>;

function host(url: string | null) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

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
  const site = host(item.url);

  return (
    <li
      className={`group flex flex-col overflow-hidden rounded-xl2 border border-line bg-white shadow-soft transition ${
        item.purchased ? "opacity-60" : "hover:shadow-lift"
      } ${pending ? "animate-pulse" : ""}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-paper">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image_url} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="display text-6xl text-ink/15">{item.title.slice(0, 1).toUpperCase()}</span>
          </div>
        )}
        {item.purchased && (
          <span className="absolute left-3 top-3 rounded-full bg-moss px-3 py-1 text-xs font-semibold text-white">✓ {t.bought}</span>
        )}
        {site && <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-muted backdrop-blur">{site}</span>}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <p className={`line-clamp-2 font-medium leading-snug ${item.purchased ? "line-through" : ""}`}>{item.title}</p>
          {!editing && (
            <button onClick={() => setEditing(true)} className="shrink-0 text-right" title={t.price}>
              <span className="block text-lg font-bold">{fmt(total)}</span>
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
            className="mt-3 flex flex-wrap items-end gap-2"
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
              <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" className="input mt-1 w-28 !py-2" autoFocus />
            </label>
            <label className="text-xs text-muted">
              {t.qty}
              <input value={qty} onChange={(e) => setQty(e.target.value)} inputMode="numeric" className="input mt-1 w-16 !py-2" />
            </label>
            <button className="btn-primary !px-4 !py-2">{t.save}</button>
            <button type="button" onClick={() => setEditing(false)} className="px-2 py-2 text-sm text-muted">×</button>
          </form>
        ) : (
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-4 text-xs">
            {item.url && (
              <a
                href={`/go?item=${item.id}`}
                target="_blank"
                rel="noopener sponsored"
                className="rounded-full bg-ink px-3 py-1.5 font-semibold text-white hover:bg-dusk-dark"
              >
                {t.buy} ↗
              </a>
            )}
            <button
              onClick={() => start(() => updateItem(projectId, item.id, { purchased: !item.purchased }))}
              className={`rounded-full border px-3 py-1.5 font-medium transition ${
                item.purchased ? "border-moss bg-moss-soft text-moss" : "border-line hover:border-ink/40"
              }`}
            >
              {item.purchased ? `✓ ${t.bought}` : t.markBought}
            </button>
            <span className="ml-auto text-muted">
              {t.addedBy} {addedBy}
            </span>
            <button onClick={() => start(() => deleteItem(projectId, item.id))} className="text-muted hover:text-walnut" aria-label={t.remove} title={t.remove}>
              ✕
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
