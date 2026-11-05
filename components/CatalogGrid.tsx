"use client";

import { out } from "@/lib/out";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addItem, addProduct } from "@/app/actions";
import { CATALOG_ROOMS, type Product } from "@/lib/catalog";
import { CompareToggle, SaveButton } from "./ShopState";

type Pot = { id: string; name: string };

const eur = (v: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: v % 1 ? 2 : 0 }).format(v);

export default function CatalogGrid({
  products,
  pots,
  potId,
  signedIn,
  loginHref,
  room,
  fr,
}: {
  products: Product[];
  pots: Pot[];
  potId: string | null;
  signedIn: boolean;
  loginHref: string;
  room: string | null;
  fr: boolean;
}) {
  const router = useRouter();
  const [added, setAdded] = useState<Record<number, string>>({});
  const [menu, setMenu] = useState<number | null>(null);
  const [toast, setToast] = useState<{ text: string; pot: string } | null>(null);
  const [pending, start] = useTransition();

  const target = potId ?? (pots.length === 1 ? pots[0].id : null);

  function add(p: Product, pid?: string) {
    if (!signedIn) return router.push(loginHref);
    if (pots.length === 0) return router.push(`/new?name=${encodeURIComponent(fr ? "Notre intérieur" : "Our home")}`);
    const to = pid ?? target;
    if (!to) return setMenu(menu === p.id ? null : p.id);
    setMenu(null);
    start(async () => {
      await addProduct(to, p.id);
      setAdded((a) => ({ ...a, [p.id]: to }));
      const name = pots.find((x) => x.id === to)?.name ?? "";
      setToast({ text: `${fr ? "Ajouté à" : "Added to"} « ${name} »`, pot: to });
      setTimeout(() => setToast(null), 3500);
    });
  }

  return (
    <>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 sm:gap-x-6">
        <li>
          <CustomItem pots={pots} potId={target} signedIn={signedIn} loginHref={loginHref} room={room} fr={fr} onDone={(t) => setToast(t)} />
        </li>
        {products.map((p) => {
          const done = added[p.id];
          return (
            <li key={p.id} className="group relative">
              <div className="relative aspect-square overflow-hidden bg-white">
                <a href={out(p.id)} target="_blank" rel="noopener nofollow sponsored" aria-label={`${p.title} · ${p.shop}`} className="block h-full w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image_url}
                    alt={p.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain p-5 mix-blend-multiply transition duration-700 ease-out group-hover:scale-[1.06] sm:p-7"
                  />
                </a>
                <SaveButton p={mini(p)} fr={fr} className="absolute right-3 top-3" />
                <button
                  type="button"
                  onClick={() => add(p)}
                  disabled={pending}
                  aria-label={fr ? "Ajouter à une cagnotte" : "Add to a pot"}
                  title={fr ? "Ajouter à une cagnotte" : "Add to a pot"}
                  className={`absolute bottom-3 right-3 flex h-9 items-center gap-1.5 px-3 text-[10px] font-medium uppercase tracking-label transition ${
                    done ? "bg-moss text-white" : "bg-ink text-white hover:bg-black"
                  } sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 ${done ? "!translate-y-0 !opacity-100" : ""}`}
                >
                  {done ? "✓" : "+"} <span className="hidden sm:inline">{done ? (fr ? "Dans la cagnotte" : "In the pot") : fr ? "Cagnotte" : "Pot"}</span>
                </button>

                {menu === p.id && (
                  <div className="absolute inset-x-3 bottom-14 z-10 border border-ink bg-paper p-3 shadow-xl">
                    <p className="caps text-muted">{fr ? "Dans quelle cagnotte ?" : "Which pot?"}</p>
                    <ul className="mt-2">
                      {pots.map((pt) => (
                        <li key={pt.id}>
                          <button type="button" onClick={() => add(p, pt.id)} className="w-full truncate py-1.5 text-left text-sm hover:underline">
                            {pt.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <p className="caps flex items-center gap-2 text-[10px] text-muted">
                  {p.shop}
                  {p.shop === "Selency" ? (
                    <span className="bg-walnut-soft px-1.5 py-0.5 text-[9px] text-walnut">{fr ? "Seconde main" : "Pre-loved"}</span>
                  ) : p.niche ? (
                    <span className="border border-brass/50 px-1.5 py-0.5 text-[9px] text-brass">{fr ? "Pépite" : "Gem"}</span>
                  ) : null}
                </p>
                <a href={out(p.id)} target="_blank" rel="noopener nofollow sponsored" className="mt-1 line-clamp-2 text-sm leading-snug hover:underline">
                  {p.title}
                </a>
                <p className="display mt-1 text-xl">{eur(Number(p.price))}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <CompareToggle p={mini(p)} fr={fr} />
                  <a href={out(p.id)} target="_blank" rel="noopener nofollow sponsored" className="caps border-b border-ink pb-0.5 text-[10px]">
                    {fr ? "Voir" : "View"} ↗
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {toast && (
        <div className="fixed inset-x-4 bottom-6 z-50 mx-auto flex max-w-md items-center justify-between gap-4 bg-night px-5 py-4 text-bone shadow-2xl">
          <span className="truncate text-sm">{toast.text}</span>
          <Link href={`/p/${toast.pot}`} className="caps shrink-0 border-b border-bone/50 pb-0.5">
            {fr ? "Voir" : "View"} →
          </Link>
        </div>
      )}
    </>
  );
}

const mini = (p: Product) => ({ id: p.id, title: p.title, image_url: p.image_url, price: Number(p.price), shop: p.shop, url: p.url, category: p.category });

/* ---------- Créer son propre objet ---------- */
function CustomItem({
  pots,
  potId,
  signedIn,
  loginHref,
  room,
  fr,
  onDone,
}: {
  pots: Pot[];
  potId: string | null;
  signedIn: boolean;
  loginHref: string;
  room: string | null;
  fr: boolean;
  onDone: (t: { text: string; pot: string }) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [url, setUrl] = useState("");
  const [r, setR] = useState(room ?? "salon");
  const [pot, setPot] = useState(potId ?? pots[0]?.id ?? "");
  const [pending, start] = useTransition();

  function openForm() {
    if (!signedIn) return router.push(loginHref);
    if (pots.length === 0) return router.push(`/new?name=${encodeURIComponent(fr ? "Notre intérieur" : "Our home")}`);
    setOpen(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(price.replace(",", ".").replace(/[^\d.]/g, ""));
    if (!title.trim() || !pot) return;
    start(async () => {
      await addItem(pot, { title: title.trim(), price: Number.isFinite(n) ? n : 0, url: url.trim() || null, room: r });
      const name = pots.find((x) => x.id === pot)?.name ?? "";
      onDone({ text: `« ${title.trim()} » ${fr ? "ajouté à" : "added to"} ${name}`, pot });
      setTitle("");
      setPrice("");
      setUrl("");
      setOpen(false);
    });
  }

  if (!open)
    return (
      <button
        type="button"
        onClick={openForm}
        className="flex aspect-square w-full flex-col items-center justify-center border border-dashed border-ink/30 bg-paper px-6 text-center transition hover:border-ink hover:bg-white"
      >
        <span className="display text-5xl font-light">+</span>
        <span className="display mt-3 text-2xl leading-tight">{fr ? "Créer mon objet" : "Create my own"}</span>
        <span className="mt-2 text-xs text-muted">{fr ? "Une trouvaille ailleurs, une pièce chinée, un artisan…" : "A find elsewhere, a vintage piece, a maker…"}</span>
      </button>
    );

  return (
    <form onSubmit={submit} className="flex aspect-square w-full flex-col justify-between border border-ink bg-white p-4 text-sm">
      <input autoFocus required value={title} onChange={(e) => setTitle(e.target.value)} placeholder={fr ? "Nom de l'objet" : "Item name"} className="w-full border-b border-line bg-transparent pb-1.5 outline-none focus:border-ink" />
      <div className="flex gap-3">
        <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" placeholder={fr ? "Prix €" : "Price €"} className="w-1/2 border-b border-line bg-transparent pb-1.5 outline-none focus:border-ink" />
        <select value={r} onChange={(e) => setR(e.target.value)} className="w-1/2 border-b border-line bg-transparent pb-1.5 outline-none">
          {CATALOG_ROOMS.map((x) => (
            <option key={x.id} value={x.id}>
              {fr ? x.fr : x.en}
            </option>
          ))}
        </select>
      </div>
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={fr ? "Lien (facultatif)" : "Link (optional)"} className="w-full border-b border-line bg-transparent pb-1.5 outline-none focus:border-ink" />
      {pots.length > 1 && (
        <select value={pot} onChange={(e) => setPot(e.target.value)} className="w-full border-b border-line bg-transparent pb-1.5 outline-none">
          {pots.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      )}
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-muted hover:text-ink">
          {fr ? "Annuler" : "Cancel"}
        </button>
        <button disabled={pending} className="caps bg-ink px-3 py-2 text-white disabled:opacity-50">
          {pending ? "…" : fr ? "Ajouter" : "Add"}
        </button>
      </div>
    </form>
  );
}
