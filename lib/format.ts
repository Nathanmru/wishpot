import type { Lang } from "./i18n";

export function money(value: number, currency = "EUR", lang: Lang = "fr") {
  return new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value || 0);
}

export function monthYear(date: Date, lang: Lang = "fr") {
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", { month: "long", year: "numeric" }).format(date);
}

/** Calcul de la cagnotte : objectif, épargné, reste, nombre de mois estimé. */
export function computeStats(
  items: { price: number; quantity: number; purchased: boolean }[],
  deposits: { amount: number }[],
  monthlyAmounts: number[]
) {
  const goal = items.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
  const bought = items.filter((i) => i.purchased).reduce((s, i) => s + Number(i.price) * i.quantity, 0);
  const saved = deposits.reduce((s, d) => s + Number(d.amount), 0);
  const monthly = monthlyAmounts.reduce((s, m) => s + Number(m), 0);
  const remaining = Math.max(goal - saved, 0);
  const months = remaining === 0 ? 0 : monthly > 0 ? Math.ceil(remaining / monthly) : null;
  const eta = months === null ? null : new Date(new Date().getFullYear(), new Date().getMonth() + months, 1);
  const progress = goal > 0 ? Math.min(saved / goal, 1) : 0;
  return { goal, bought, saved, monthly, remaining, months, eta, progress };
}
