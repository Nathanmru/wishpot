"use client";

import { out } from "@/lib/out";
import Link from "next/link";
import { useShop } from "@/components/ShopState";

const eur = (v: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: v % 1 ? 2 : 0 }).format(v);

/** « Ma sélection » : les pièces gardées pour plus tard, rangées par boutique pour acheter facilement. */
export default function SelectionPage() {
  const { saved, toggleSave, signedIn, fr } = useShop();

  const byShop = new Map<string, typeof saved>();
  for (const p of saved) byShop.set(p.shop, [...(byShop.get(p.shop) ?? []), p]);
  const groups = [...byShop.entries()].sort((a, b) => b[1].length - a[1].length);
  const total = saved.reduce((a, p) => a + Number(p.price), 0);

  return (
    <div className="pt-4">
      <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <p className="caps text-muted">{fr ? "Ma sélection" : "My picks"}</p>
          <h1 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">{fr ? "À acheter plus tard." : "To buy later."}</h1>
        </div>
        <p className="text-muted">
          {fr
            ? "Les pièces que vous avez gardées avec le cœur, rangées par boutique. Achetez quand vous voulez, ou transformez la sélection en cagnotte."
            : "The pieces you saved, grouped by shop. Buy whenever you like, or turn them into a pot."}
        </p>
      </div>

      {!signedIn && (
        <div className="mt-10 flex flex-col gap-4 bg-walnut-soft p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm">
            {fr
              ? "Votre sélection est gardée sur cet appareil. Connectez-vous avec Google pour la retrouver partout, sur votre téléphone comme sur votre ordinateur."
              : "Your picks are kept on this device. Sign in with Google to find them everywhere."}
          </p>
          <Link href="/login?next=/selection" className="btn-primary shrink-0 justify-center !px-6 !py-3 text-[11px] uppercase tracking-label">
            {fr ? "Se connecter" : "Sign in"}
          </Link>
        </div>
      )}

      {saved.length === 0 ? (
        <div className="mt-12 bg-white p-12 text-center">
          <p className="display text-3xl">{fr ? "Rien pour l'instant." : "Nothing yet."}</p>
          <p className="mx-auto mt-3 max-w-md text-muted">
            {fr ? "Dans le catalogue, touchez le cœur d'une pièce pour la garder ici." : "Tap the heart on any piece to keep it here."}
          </p>
          <Link href="/catalogue" className="btn-primary mt-8 inline-flex !px-8 !py-4 text-[12px] uppercase tracking-label">
            {fr ? "Dénicher des pièces" : "Find pieces"}
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-3 bg-night p-6 text-bone sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
              <p>
                <span className="display text-4xl">{eur(total)}</span>
                <span className="ml-2 text-sm text-bone/60">
                  {saved.length} {fr ? (saved.length > 1 ? "pièces" : "pièce") : "pieces"} · {groups.length} {fr ? (groups.length > 1 ? "boutiques" : "boutique") : "shops"}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {saved.length >= 2 && (
                <Link href={`/comparer?ids=${saved.slice(0, 4).map((p) => p.id).join(",")}`} className="btn border border-bone/40 !px-5 !py-3 text-[11px] uppercase tracking-label hover:border-bone">
                  {fr ? "Comparer" : "Compare"}
                </Link>
              )}
              <Link href={`/new?product=${saved.slice(0, 20).map((p) => p.id).join(",")}`} className="btn bg-bone !px-5 !py-3 text-[11px] uppercase tracking-label text-ink hover:bg-white">
                {fr ? "En faire une cagnotte" : "Make it a pot"}
              </Link>
            </div>
          </div>

          <div className="mt-12 space-y-14">
            {groups.map(([shop, list]) => (
              <section key={shop}>
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink pb-3">
                  <h2 className="display text-3xl">{shop}</h2>
                  <p className="text-sm text-muted">
                    {list.length} {fr ? (list.length > 1 ? "pièces" : "pièce") : "pieces"} · {eur(list.reduce((a, p) => a + Number(p.price), 0))}
                  </p>
                </div>
                <ul className="divide-y divide-line">
                  {list.map((p) => (
                    <li key={p.id} className="flex items-center gap-4 py-4">
                      <a href={out(p.id)} target="_blank" rel="noopener nofollow sponsored" className="h-20 w-20 shrink-0 bg-white sm:h-24 sm:w-24">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image_url} alt="" referrerPolicy="no-referrer" className="h-full w-full object-contain p-2 mix-blend-multiply" />
                      </a>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm leading-snug">{p.title}</p>
                        <p className="display mt-1 text-xl">{eur(Number(p.price))}</p>
                        <button type="button" onClick={() => toggleSave(p)} className="mt-1 text-xs text-muted hover:text-ink">
                          {fr ? "Retirer" : "Remove"}
                        </button>
                      </div>
                      <a href={out(p.id)} target="_blank" rel="noopener nofollow sponsored" className="btn-primary shrink-0 !px-4 !py-3 text-[10px] uppercase tracking-label sm:!px-6 sm:text-[11px]">
                        {fr ? "Acheter" : "Buy"} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <p className="mt-12 text-xs text-muted">
            {fr
              ? "Les liens mènent aux boutiques. Certains sont affiliés : un achat peut nous rémunérer, sans rien vous coûter de plus."
              : "Links go to the shops. Some are affiliate links, at no extra cost to you."}
          </p>
        </>
      )}
    </div>
  );
}
