"use client";

import { useEffect, useState, useTransition } from "react";
import { addComment, clearReservation, deleteComment, deleteItem, setItemRoom, toggleLike, updateItem } from "@/app/actions";
import type { Item, Kind } from "@/lib/config";
import { illustrationFor } from "@/lib/itemImage";
import { ROOMS, roomLabel } from "@/lib/rooms";

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

function Heart({ filled, className = "" }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.4}>
      <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 6.9 4.5c2 0 3.4 1.1 4.1 2.3h2c.7-1.2 2.1-2.3 4.1-2.3 3.5 0 5.5 3.5 4.2 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" />
    </svg>
  );
}

/** Carte épurée : photo, nom, prix, cœur. Tout le reste s'ouvre dans la fiche. */
export default function ItemCard({
  item,
  projectId,
  currency,
  lang,
  addedBy,
  kind,
  likes,
  comments,
  compact = false,
}: {
  item: Item;
  projectId: string;
  currency: string;
  lang: "fr" | "en";
  addedBy: string;
  kind: Kind;
  likes: ItemLikes;
  comments: ItemComment[];
  compact?: boolean;
}) {
  const fr = lang === "fr";
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [liked, setLiked] = useState(likes.mine);
  const likeCount = likes.count + (liked === likes.mine ? 0 : liked ? 1 : -1);

  const fallback = illustrationFor(item.title, kind);
  const [img, setImg] = useState(item.image_url || fallback);
  const illustrative = img === fallback;
  const total = Number(item.price) * item.quantity;
  const fmt = (v: number) =>
    new Intl.NumberFormat(fr ? "fr-FR" : "en-GB", { style: "currency", currency, maximumFractionDigits: v % 1 ? 2 : 0 }).format(v);

  const badge = item.purchased
    ? fr ? "Acheté" : "Bought"
    : item.reserved_by
      ? `${fr ? "Offert par" : "Gifted by"} ${item.reserved_by}`
      : likeCount >= 2
        ? fr ? "Coup de cœur commun" : "Shared favourite"
        : null;

  const like = () => {
    const next = !liked;
    setLiked(next);
    start(() => toggleLike(projectId, item.id, next));
  };

  return (
    <li className={`group relative ${pending ? "opacity-70" : ""}`}>
      <button type="button" onClick={() => setOpen(true)} className="block w-full text-left" aria-label={item.title}>
        <div className={`relative overflow-hidden bg-white ${compact ? "aspect-square" : "aspect-[4/5]"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt=""
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => img !== fallback && setImg(fallback)}
            className={`h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.04] ${item.purchased ? "grayscale-[60%]" : ""}`}
          />
          {badge && <span className="caps absolute left-3 top-3 bg-paper/95 px-2.5 py-1.5 text-ink">{badge}</span>}
          {illustrative && !compact && <span className="absolute bottom-3 right-3 text-[10px] uppercase tracking-[0.14em] text-white/80">Illustration</span>}
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="caps text-muted">
              {roomLabel(kind, item.room, lang)}
              {host(item.url) && <span className="normal-case tracking-normal"> · {host(item.url)}</span>}
            </p>
            <p className={`mt-1.5 line-clamp-2 leading-snug ${item.purchased ? "text-muted line-through" : ""}`}>{item.title}</p>
          </div>
          <p className="shrink-0 pt-[1.35rem] text-[15px]">{fmt(total)}</p>
        </div>
        {comments.length > 0 && (
          <p className="mt-2 text-xs text-muted">
            {comments.length} {fr ? (comments.length > 1 ? "avis" : "avis") : comments.length > 1 ? "comments" : "comment"}
          </p>
        )}
      </button>

      <button
        type="button"
        onClick={like}
        aria-pressed={liked}
        aria-label={fr ? "J'aime" : "Like"}
        className={`absolute right-3 top-3 flex h-9 items-center gap-1.5 bg-paper/95 px-2.5 transition active:scale-90 ${liked ? "text-walnut" : "text-ink"}`}
      >
        <Heart filled={liked} className="h-[18px] w-[18px]" />
        {likeCount > 0 && <span className="text-xs">{likeCount}</span>}
      </button>

      {open && (
        <ItemSheet
          item={item}
          projectId={projectId}
          kind={kind}
          lang={lang}
          img={img}
          fmt={fmt}
          addedBy={addedBy}
          likes={likes}
          liked={liked}
          onLike={like}
          comments={comments}
          onClose={() => setOpen(false)}
        />
      )}
    </li>
  );
}

function ItemSheet({
  item,
  projectId,
  kind,
  lang,
  img,
  fmt,
  addedBy,
  likes,
  liked,
  onLike,
  comments,
  onClose,
}: {
  item: Item;
  projectId: string;
  kind: Kind;
  lang: "fr" | "en";
  img: string;
  fmt: (v: number) => string;
  addedBy: string;
  likes: ItemLikes;
  liked: boolean;
  onLike: () => void;
  comments: ItemComment[];
  onClose: () => void;
}) {
  const fr = lang === "fr";
  const [pending, start] = useTransition();
  const [price, setPrice] = useState(String(item.price));
  const [qty, setQty] = useState(String(item.quantity));
  const [draft, setDraft] = useState("");
  const dirty = price !== String(item.price) || qty !== String(item.quantity);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const likers = likes.names.filter(Boolean);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-end bg-black/45 backdrop-blur-[2px] sm:items-stretch" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92dvh] w-full overflow-y-auto bg-paper text-ink shadow-lift [animation:rise_.45s_cubic-bezier(.2,.8,.2,1)] sm:max-h-none sm:w-[460px] sm:[--rise-from:0] sm:[animation:none]"
      >
        <button onClick={onClose} aria-label={fr ? "Fermer" : "Close"} className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center bg-paper/95 text-2xl font-light">
          ×
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" referrerPolicy="no-referrer" className="aspect-[4/3] w-full bg-white object-cover" />

        <div className="p-6 sm:p-8">
          <select
            value={item.room ?? ""}
            onChange={(e) => start(() => setItemRoom(projectId, item.id, e.target.value || null))}
            aria-label={fr ? "Pièce" : "Room"}
            className="caps -ml-1 cursor-pointer bg-transparent px-1 py-1 text-muted outline-none hover:text-ink"
          >
            <option value="">{fr ? "Sans pièce" : "Unsorted"}</option>
            {ROOMS[kind].map((r) => (
              <option key={r.id} value={r.id}>
                {r[lang]}
              </option>
            ))}
          </select>
          <h3 className="display mt-2 text-3xl leading-tight sm:text-4xl">{item.title}</h3>
          <p className="mt-2 text-sm text-muted">
            {fr ? "Ajouté par" : "Added by"} {addedBy}
          </p>

          {/* Prix et quantité modifiables sur place */}
          <form
            className="mt-6 grid grid-cols-[1fr_88px_auto] items-end gap-4 border-y border-line py-5"
            onSubmit={(e) => {
              e.preventDefault();
              start(() =>
                updateItem(projectId, item.id, { price: parseFloat(price.replace(",", ".")) || 0, quantity: parseInt(qty) || 1 })
              );
            }}
          >
            <label className="block">
              <span className="label">{fr ? "Prix" : "Price"}</span>
              <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" className="input-line text-xl" />
            </label>
            <label className="block">
              <span className="label">{fr ? "Qté" : "Qty"}</span>
              <input value={qty} onChange={(e) => setQty(e.target.value)} inputMode="numeric" className="input-line text-xl" />
            </label>
            <button disabled={!dirty || pending} className="link-caps mb-2">
              OK
            </button>
            {item.quantity > 1 && (
              <p className="col-span-3 -mt-2 text-sm text-muted">
                {fr ? "Total" : "Total"} {fmt(Number(item.price) * item.quantity)}
              </p>
            )}
          </form>

          <div className="mt-6 space-y-3">
            {item.url && (
              <a href={`/go?item=${item.id}`} target="_blank" rel="noopener sponsored" className="btn-primary w-full !py-3.5 text-[12px] uppercase tracking-label">
                {fr ? "Voir sur" : "View on"} {host(item.url)} ↗
              </a>
            )}
            <button
              onClick={() => start(() => updateItem(projectId, item.id, { purchased: !item.purchased }))}
              className="btn-ghost w-full !py-3.5 text-[12px] uppercase tracking-label"
            >
              {item.purchased ? (fr ? "Remettre dans la liste" : "Move back to list") : fr ? "Marquer comme acheté" : "Mark as bought"}
            </button>
            <button onClick={onLike} className="btn-ghost w-full !py-3.5 text-[12px] uppercase tracking-label">
              <Heart filled={liked} className={`h-4 w-4 ${liked ? "text-walnut" : ""}`} />
              {liked ? (fr ? "Dans nos coups de cœur" : "In our favourites") : fr ? "J'adore" : "Love it"}
            </button>
            {likers.length > 0 && (
              <p className="text-center text-xs text-muted">
                {fr ? "Aimé par" : "Loved by"} {likers.join(", ")}
              </p>
            )}
          </div>

          {item.reserved_by && (
            <div className="mt-6 flex items-center justify-between border border-line bg-white px-4 py-3 text-sm">
              <span>
                {fr ? "Offert par" : "Gifted by"} <b className="font-medium">{item.reserved_by}</b>
              </span>
              <button onClick={() => start(() => clearReservation(projectId, item.id))} className="link-caps">
                {fr ? "Annuler" : "Undo"}
              </button>
            </div>
          )}

          {/* Avis */}
          <div className="mt-10">
            <p className="caps text-muted">{fr ? "Vos avis" : "Your thoughts"}</p>
            {comments.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {comments.map((c) => (
                  <li key={c.id} className="group/c border-l border-line pl-4">
                    <p className="text-xs text-muted">{c.name}</p>
                    <p className="mt-0.5 leading-relaxed">
                      {c.body}
                      {c.mine && (
                        <button
                          onClick={() => start(() => deleteComment(projectId, c.id))}
                          className="ml-2 text-xs text-muted opacity-60 hover:text-walnut hover:opacity-100"
                          aria-label={fr ? "Supprimer" : "Delete"}
                        >
                          ×
                        </button>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">{fr ? "La couleur, la taille, le bon moment pour l'acheter…" : "Colour, size, when to buy…"}</p>
            )}
            <form
              className="mt-5 flex items-end gap-3"
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
                placeholder={fr ? "Écrire un avis…" : "Write a comment…"}
                className="input-line"
              />
              <button disabled={!draft.trim()} className="link-caps mb-2 shrink-0">
                {fr ? "Envoyer" : "Send"}
              </button>
            </form>
          </div>

          <button
            onClick={() => {
              if (confirm(fr ? "Retirer cet objet de la liste ?" : "Remove this item?")) {
                start(async () => {
                  await deleteItem(projectId, item.id);
                  onClose();
                });
              }
            }}
            className="mt-12 text-xs text-muted underline-offset-4 hover:text-walnut hover:underline"
          >
            {fr ? "Retirer de la liste" : "Remove from list"}
          </button>
        </div>
      </div>
    </div>
  );
}
