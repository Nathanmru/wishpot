"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useShop, type Mini } from "./ShopState";

/** La page de comparaison fait foi : la barre reprend les pièces affichées. */
export function CompareSync({ items }: { items: Mini[] }) {
  const { setCompareList } = useShop();
  const key = items.map((p) => p.id).join(",");
  useEffect(() => {
    setCompareList(items);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export function CompareRemove({ id, ids, fr }: { id: number; ids: number[]; fr: boolean }) {
  const router = useRouter();
  const { compare, setCompareList } = useShop();
  return (
    <button
      type="button"
      onClick={() => {
        const rest = ids.filter((x) => x !== id);
        setCompareList(compare.filter((p) => p.id !== id));
        router.push(rest.length ? `/comparer?ids=${rest.join(",")}` : "/catalogue");
      }}
      className="caps absolute left-3 top-3 bg-paper/95 px-2 py-1 text-[10px] text-muted hover:text-ink"
    >
      × {fr ? "Retirer" : "Remove"}
    </button>
  );
}
