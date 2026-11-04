"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Deux listes qui suivent le visiteur partout sur le site :
 * - « à comparer » (4 pièces au plus), gardée dans le navigateur ;
 * - « ma sélection », le panier pour acheter plus tard, rattaché au compte Google une fois connecté.
 */

export type Mini = { id: number; title: string; image_url: string; price: number; shop: string; url: string; category?: string };

type Ctx = {
  compare: Mini[];
  saved: Mini[];
  isCompared: (id: number) => boolean;
  isSaved: (id: number) => boolean;
  toggleCompare: (p: Mini) => void;
  toggleSave: (p: Mini) => void;
  clearCompare: () => void;
  setCompareList: (l: Mini[]) => void;
  signedIn: boolean;
  fr: boolean;
  notice: string | null;
};

const ShopCtx = createContext<Ctx | null>(null);
export const MAX_COMPARE = 4;

const read = (k: string): Mini[] => {
  try {
    const v = JSON.parse(localStorage.getItem(k) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};
const write = (k: string, v: Mini[]) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

export function ShopStateProvider({ signedIn, fr, children }: { signedIn: boolean; fr: boolean; children: React.ReactNode }) {
  const [compare, setCompare] = useState<Mini[]>([]);
  const [saved, setSaved] = useState<Mini[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const supabase = useMemo(() => (signedIn ? createClient() : null), [signedIn]);

  const flash = (t: string) => {
    setNotice(t);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(null), 2600);
  };

  // Au chargement : le navigateur d'abord, puis le compte (qui récupère ce qui a été gardé hors connexion)
  useEffect(() => {
    setCompare(read("mp:compare"));
    const local = read("mp:saved");
    setSaved(local);
    if (!supabase) return;
    (async () => {
      const { data: rows } = await supabase.from("saved_items").select("product_id, created_at").order("created_at", { ascending: false });
      const ids = new Set((rows ?? []).map((r) => Number(r.product_id)));
      const missing = local.filter((p) => !ids.has(p.id));
      if (missing.length) await supabase.from("saved_items").upsert(missing.map((p) => ({ product_id: p.id })), { onConflict: "user_id,product_id", ignoreDuplicates: true });
      const all = [...ids, ...missing.map((p) => p.id)];
      if (!all.length) return;
      const { data: ps } = await supabase.from("products").select("id, title, image_url, price, shop, url, category").in("id", all);
      const order = new Map(all.map((id, i) => [id, i]));
      const list = (ps ?? [])
        .map((p) => ({ id: p.id as number, title: p.title as string, image_url: p.image_url as string, price: Number(p.price), shop: p.shop as string, url: p.url as string, category: p.category as string }))
        .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
      setSaved(list);
      write("mp:saved", list);
    })();
  }, [supabase]);

  const toggleCompare = useCallback(
    (p: Mini) => {
      setCompare((cur) => {
        const has = cur.some((x) => x.id === p.id);
        if (!has && cur.length >= MAX_COMPARE) {
          flash(fr ? `${MAX_COMPARE} pièces au plus : retirez-en une pour comparer celle-ci.` : `Up to ${MAX_COMPARE} pieces.`);
          return cur;
        }
        const next = has ? cur.filter((x) => x.id !== p.id) : [...cur, p];
        write("mp:compare", next);
        return next;
      });
    },
    [fr],
  );

  const toggleSave = useCallback(
    (p: Mini) => {
      setSaved((cur) => {
        const has = cur.some((x) => x.id === p.id);
        const next = has ? cur.filter((x) => x.id !== p.id) : [p, ...cur];
        write("mp:saved", next);
        if (supabase) {
          if (has) supabase.from("saved_items").delete().eq("product_id", p.id).then(() => {});
          else supabase.from("saved_items").upsert({ product_id: p.id }, { onConflict: "user_id,product_id", ignoreDuplicates: true }).then(() => {});
        }
        flash(has ? (fr ? "Retiré de votre sélection" : "Removed from your picks") : fr ? "Gardé dans votre sélection" : "Saved to your picks");
        return next;
      });
    },
    [supabase, fr],
  );

  const clearCompare = useCallback(() => {
    setCompare([]);
    write("mp:compare", []);
  }, []);

  const setCompareList = useCallback((l: Mini[]) => {
    const next = l.slice(0, MAX_COMPARE);
    setCompare(next);
    write("mp:compare", next);
  }, []);

  const value: Ctx = {
    compare,
    saved,
    isCompared: (id) => compare.some((x) => x.id === id),
    isSaved: (id) => saved.some((x) => x.id === id),
    toggleCompare,
    toggleSave,
    clearCompare,
    setCompareList,
    signedIn,
    fr,
    notice,
  };
  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>;
}

export function useShop() {
  const c = useContext(ShopCtx);
  if (!c) throw new Error("ShopStateProvider manquant");
  return c;
}

/* ---------- Les deux petits boutons des cartes produit ---------- */
export function SaveButton({ p, fr, className = "" }: { p: Mini; fr: boolean; className?: string }) {
  const { isSaved, toggleSave } = useShop();
  const on = isSaved(p.id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggleSave(p);
      }}
      aria-pressed={on}
      aria-label={on ? (fr ? "Retirer de ma sélection" : "Remove from picks") : fr ? "Garder pour plus tard" : "Save for later"}
      title={fr ? "Garder pour plus tard" : "Save for later"}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-paper/95 shadow-sm transition hover:scale-110 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill={on ? "#8A5530" : "none"} stroke={on ? "#8A5530" : "currentColor"} strokeWidth="1.6">
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
      </svg>
    </button>
  );
}

export function CompareToggle({ p, fr, className = "" }: { p: Mini; fr: boolean; className?: string }) {
  const { isCompared, toggleCompare } = useShop();
  const on = isCompared(p.id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggleCompare(p);
      }}
      aria-pressed={on}
      className={`flex items-center gap-1.5 text-[11px] uppercase tracking-label transition ${on ? "text-ink" : "text-muted hover:text-ink"} ${className}`}
    >
      <span className={`flex h-3.5 w-3.5 items-center justify-center border text-[9px] ${on ? "border-ink bg-ink text-white" : "border-current"}`}>{on ? "✓" : ""}</span>
      {fr ? "Comparer" : "Compare"}
    </button>
  );
}
