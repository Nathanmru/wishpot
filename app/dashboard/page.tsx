import Link from "next/link";
import { redirect } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { computeStats, money } from "@/lib/format";
import type { Kind } from "@/lib/config";

export const metadata = { title: "Dashboard" };

type Row = {
  id: string;
  name: string;
  kind: Kind;
  currency: string;
  items: { price: number; quantity: number; purchased: boolean }[];
  deposits: { amount: number }[];
  project_members: { monthly_amount: number }[];
};

export default async function Dashboard() {
  const { supabase, user } = await getUser();
  if (!user) redirect("/login");
  const { t, lang } = await getDict();

  const { data } = await supabase
    .from("projects")
    .select("id, name, kind, currency, items(price, quantity, purchased), deposits(amount), project_members(monthly_amount)")
    .order("created_at", { ascending: false });
  const projects = (data ?? []) as unknown as Row[];

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold">{t.myPots}</h1>
        <Link href="/new" className="btn-accent">
          + {t.start}
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="card mt-8 text-center">
          <p className="text-muted">{t.noPots}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/new?kind=travel" className="btn-ghost">✈️ {t.travel}</Link>
            <Link href="/new?kind=home" className="btn-ghost">🛋️ {t.home}</Link>
          </div>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {projects.map((p) => {
            const s = computeStats(p.items, p.deposits, p.project_members.map((m) => m.monthly_amount));
            return (
              <li key={p.id}>
                <Link href={`/p/${p.id}`} className="card block transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.kind === "travel" ? "bg-sea-soft text-sea" : "bg-terra-soft text-terra-dark"}`}>
                      {p.kind === "travel" ? `✈️ ${t.travel}` : `🛋️ ${t.home}`}
                    </span>
                    <span className="text-xs text-muted">👥 {p.project_members.length}</span>
                  </div>
                  <h2 className="mt-3 font-display text-xl font-semibold">{p.name}</h2>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-sage" style={{ width: `${Math.round(s.progress * 100)}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    <strong className="text-ink">{money(s.saved, p.currency, lang)}</strong> / {money(s.goal, p.currency, lang)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
