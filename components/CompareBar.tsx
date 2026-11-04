"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAX_COMPARE, useShop } from "./ShopState";

/** La barre qui apparaît dès qu'on coche « Comparer » sur une pièce. */
export default function CompareBar({ fr }: { fr: boolean }) {
  const { compare, toggleCompare, clearCompare, notice } = useShop();
  const path = usePathname();
  const show = compare.length > 0 && !path.startsWith("/comparer");

  return (
    <>
      {show && (
        <div className="wp-rise fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl bg-night p-3 text-bone shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] sm:bottom-5 sm:p-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex min-w-0 flex-1 gap-2">
              {Array.from({ length: MAX_COMPARE }).map((_, i) => {
                const p = compare[i];
                return p ? (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleCompare(p)}
                    title={fr ? `Retirer « ${p.title} »` : `Remove “${p.title}”`}
                    className="group relative h-12 w-12 shrink-0 overflow-hidden bg-white sm:h-14 sm:w-14"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image_url} alt="" referrerPolicy="no-referrer" className="h-full w-full object-contain p-1 mix-blend-multiply" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-lg opacity-0 transition group-hover:opacity-100">×</span>
                  </button>
                ) : (
                  <span key={i} className="hidden h-12 w-12 shrink-0 border border-dashed border-bone/25 sm:block sm:h-14 sm:w-14" />
                );
              })}
            </div>
            <div className="flex shrink-0 items-center gap-3 sm:gap-5">
              <button type="button" onClick={clearCompare} className="caps hidden text-bone/60 hover:text-bone sm:block">
                {fr ? "Vider" : "Clear"}
              </button>
              {compare.length >= 2 ? (
                <Link href={`/comparer?ids=${compare.map((p) => p.id).join(",")}`} className="btn bg-bone !px-5 !py-3 text-[11px] uppercase tracking-label text-ink hover:bg-white">
                  {fr ? `Comparer (${compare.length})` : `Compare (${compare.length})`}
                </Link>
              ) : (
                <span className="text-xs text-bone/70">{fr ? "Ajoutez une 2e pièce" : "Add a 2nd piece"}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div className={`wp-rise fixed inset-x-4 z-50 mx-auto w-fit max-w-md bg-ink px-5 py-3 text-sm text-white shadow-xl ${show ? "bottom-28 sm:bottom-32" : "bottom-6"}`}>
          {notice}
          {notice.includes("sélection") && !notice.startsWith("Retiré") && (
            <Link href="/selection" className="caps ml-4 border-b border-white/50 pb-0.5">
              {fr ? "Voir" : "View"}
            </Link>
          )}
        </div>
      )}
    </>
  );
}
