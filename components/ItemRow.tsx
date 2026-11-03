"use client";

import { useState, useTransition } from "react";
import { addComment, clearReservation, deleteComment, deleteItem, setItemRoom, toggleLike, updateItem } from "@/app/actions";
import type { Item, Kind } from "@/lib/config";
import { illustrationFor } from "@/lib/itemImage";
import { ROOMS } from "@/lib/rooms";

type T = Record<"buy" | "markBought" | "bought" | "remove" | "addedBy" | "price" | "qty" | "save", string>;

export type ItemComment = { id: string; name: string; body: string; mine: boolean; at: string };
export type ItemLikes = { count: number; mine: boolean; names: string[] };

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
  kind = "home",
  likes = { count: 0, mine: false, names: [] },
  comments = [],
  t,
}: {
  item: Item;
  projectId: string;
  currency: string;
  lang: "fr" | "en";
  addedBy: string;
  kind?: Kind;
  likes?: ItemLikes;
  comments?: ItemComment[];
  t: T;
}) {
  const fr = lang === "fr";
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(String(item.price));
  const [qty, setQty] = useState(String(item.quantity));
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  // Cœur optimiste : réagit tout de suite
  const [liked, setLiked] = useState(likes.mine);
  const likeCount = likes.count + (liked === likes.mine ? 0 : liked ? 1 : -1);

  const fmt = (v: number) =>
    new Intl.NumberFormat(fr ? "fr-FR" : "en-GB", { style: "currency", currency, maximumFractionDigits: v % 1 ? 2 : 0 }).format(v);

  const total = Number(item.price) * item.quantity;
  const site = host(item.url);
  const fallback = illustrationFor(item.title, kind);
  const [img, setImg] = useState(item.image_url || fallback);
  const illustrative = img === fallback;

  return (
    <li
      className={`group flex flex-col overflow-hidden rounded-xl2 border bg-white shadow-soft transition ${
        likeCount >= 2 ? "border-apricot" : "border-line"
      } ${item.purchased ? "opacity-60" : "hover:shadow-lift"} ${pending ? "animate-pulse" : ""}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-paper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt=""
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => img !== fallback && setImg(fallback)}
          className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.03] ${illustrative ? "saturate-[0.85]" : ""}`}
        />
        {illustrative && (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] text-white/90 backdrop-blur-sm">Illustration</span>
        )}
        {item.purchased ? (
          <span className="absolute left-3 top-3 rounded-full bg-moss px-3 py-1 text-xs font-semibold text-white">✓ {t.bought}</span>
        ) : likeCount >= 2 ? (
          <span className="absolute left-3 top-3 rounded-full bg-apricot px-3 py-1 text-xs font-semibold text-ink">{fr ? "Coup de cœur commun" : "You both love it"}</span>
        ) : null}
        {site && <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-muted backdrop-blur">{site}</span>}

        <button
          type="button"
          onClick={() => {
            const next = !liked;
            setLiked(next);
            start(() => toggleLike(projectId, item.id, next));
          }}
          aria-pressed={liked}
          title={likes.names.length ? likes.names.join(", ") : fr ? "J'aime" : "Like"}
          className={`absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-semibold shadow-soft backdrop-blur transition active:scale-90 ${
            liked ? "bg-walnut text-white" : "bg-white/90 text-ink hover:bg-white"
          }`}
        >
          <span aria-hidden>{liked ? "♥" : "♡"}</span>
          {likeCount > 0 && <span className="text-xs">{likeCount}</span>}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={`line-clamp-2 font-medium leading-snug ${item.purchased ? "line-through" : ""}`}>{item.title}</p>
            <select
              value={item.room ?? ""}
              onChange={(e) => start(() => setItemRoom(projectId, item.id, e.target.value || null))}
              aria-label={fr ? "Pièce" : "Room"}
              className="mt-1 -ml-1 max-w-full cursor-pointer rounded-md bg-transparent px-1 py-0.5 text-[11px] uppercase tracking-[0.12em] text-muted outline-none hover:bg-paper focus:bg-paper"
            >
              <option value="">{fr ? "Sans pièce" : "Unsorted"}</option>
              {ROOMS[kind].map((r) => (
                <option key={r.id} value={r.id}>
                  {r[lang]}
                </option>
              ))}
            </select>
          </div>
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

        {item.reserved_by && (
          <p className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-apricot-soft px-3 py-2 text-xs text-walnut-dark">
            <span>
              🎁 {fr ? "Offert par" : "Gifted by"} <b>{item.reserved_by}</b>
            </span>
            <button onClick={() => start(() => clearReservation(projectId, item.id))} className="underline-offset-2 hover:underline">
              {fr ? "Annuler" : "Undo"}
            </button>
          </p>
        )}

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
            <button
              onClick={() => setOpen((o) => !o)}
              className={`rounded-full border px-3 py-1.5 font-medium transition ${open ? "border-ink" : "border-line hover:border-ink/40"}`}
              aria-expanded={open}
            >
              💬 {comments.length > 0 ? comments.length : fr ? "Avis" : "Comment"}
            </button>
            <span className="ml-auto text-muted">
              {t.addedBy} {addedBy}
            </span>
            <button onClick={() => start(() => deleteItem(projectId, item.id))} className="text-muted hover:text-walnut" aria-label={t.remove} title={t.remove}>
              ✕
            </button>
          </div>
        )}

        {open && (
          <div className="mt-4 border-t border-line pt-4">
            {comments.length > 0 && (
              <ul className="mb-3 space-y-2.5 text-sm">
                {comments.map((c) => (
                  <li key={c.id} className="group/c">
                    <span className="font-semibold">{c.name}</span> <span className="text-ink/85">{c.body}</span>
                    {c.mine && (
                      <button
                        onClick={() => start(() => deleteComment(projectId, c.id))}
                        className="ml-2 text-xs text-muted opacity-0 transition hover:text-walnut group-hover/c:opacity-100"
                        aria-label={t.remove}
                      >
                        ✕
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const body = draft;
                setDraft("");
                start(() => addComment(projectId, item.id, body));
              }}
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={500}
                placeholder={fr ? "Ton avis : la couleur, la taille…" : "Your take: colour, size…"}
                className="input !py-2 text-sm"
              />
              <button disabled={!draft.trim()} className="btn-primary !px-4 !py-2 text-sm">
                {fr ? "Envoyer" : "Send"}
              </button>
            </form>
          </div>
        )}
      </div>
    </li>
  );
}
