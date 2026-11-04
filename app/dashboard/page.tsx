import Link from "next/link";
import { redirect } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { computeStats, money, monthYear } from "@/lib/format";
import { cover } from "@/lib/covers";
import type { Kind } from "@/lib/config";
import InspirationDoors from "@/components/InspirationDoors";
import { InstallCard } from "@/components/AppInstall";

export const metadata = { title: "Mes cagnottes" };

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
  const fr = lang === "fr";
  const firstName = ((user.user_metadata?.full_name as string | undefined) ?? "").split(" ")[0];

  const { data } = await supabase
    .from("projects")
    .select("id, name, kind, currency, items(price, quantity, purchased), deposits(amount), project_members(monthly_amount)")
    .order("created_at", { ascending: false });
  const projects = (data ?? []) as unknown as Row[];

  const rows = projects.map((p) => ({ p, s: computeStats(p.items, p.deposits, p.project_members.map((m) => m.monthly_amount)) }));

  return (
    <div className="pt-6">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
        <div>
          <p className="caps text-muted">{firstName ? (fr ? `Bonjour ${firstName}` : `Hello ${firstName}`) : t.myPots}</p>
          <h1 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">{fr ? "Vos cagnottes" : "Your pots"}</h1>
        </div>
        {projects.length > 0 && (
          <Link href="/new" className="btn-primary !px-7 !py-3.5 text-[12px] uppercase tracking-label">
            {fr ? "Nouvelle cagnotte" : "New pot"}
          </Link>
        )}
      </div>

      <InstallCard lang={lang} />

      {projects.length === 0 ? (
        <div className="py-16">
          <p className="display max-w-2xl text-4xl leading-tight sm:text-5xl">
            {fr ? "Tout commence par une pièce." : "It all starts with one room."}
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Link href="/new" className="group relative block h-[420px] overflow-hidden bg-night text-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover("home", 1200)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-[1400ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="caps text-white/70">{fr ? "Appartement, maison" : "Flat, house"}</p>
                <p className="display mt-3 text-5xl">{fr ? "Créer ma cagnotte" : "Create my pot"}</p>
                <span className="caps mt-6 inline-flex items-center gap-2 border-b border-white/60 pb-0.5">
                  {t.start} <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
            <Link href="/composer" className="group relative block h-[420px] overflow-hidden bg-night text-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=75" alt="" className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-[1400ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="caps text-white/70">{fr ? "Une pièce, un budget" : "One room, one budget"}</p>
                <p className="display mt-3 text-5xl">{fr ? "Composer une pièce" : "Plan a room"}</p>
                <span className="caps mt-6 inline-flex items-center gap-2 border-b border-white/60 pb-0.5">
                  {fr ? "Essayer" : "Try it"} <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ p, s }) => (
            <li key={p.id}>
              <Link href={`/p/${p.id}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-night">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover(p.kind, 900)} alt="" className="h-full w-full object-cover opacity-95 transition duration-[1400ms] ease-out group-hover:scale-[1.05]" />
                  <span className="caps absolute left-4 top-4 bg-paper/95 px-2.5 py-1.5 text-ink">{p.kind === "travel" ? t.travel : t.home}</span>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h2 className="display truncate text-3xl">{p.name}</h2>
                  <span className="shrink-0 text-sm text-muted">{s.goal > 0 ? `${Math.round(s.progress * 100)} %` : "—"}</span>
                </div>
                <div className="mt-3 h-px bg-line">
                  <div className="h-[2px] -translate-y-[0.5px] bg-ink transition-[width] duration-700" style={{ width: `${s.progress * 100}%` }} />
                </div>
                <p className="mt-3 text-sm text-muted">
                  {money(s.saved, p.currency, lang)} {fr ? "sur" : "of"} {money(s.goal, p.currency, lang)}
                  {" · "}
                  {s.goal > 0 && s.remaining === 0
                    ? t.reached
                    : s.eta
                      ? `${fr ? "prêt en" : "ready by"} ${monthYear(s.eta, lang)}`
                      : `${p.items.length} ${fr ? (p.items.length > 1 ? "envies" : "envie") : "items"}`}
                  {" · "}
                  {p.project_members.length} {fr ? (p.project_members.length > 1 ? "membres" : "membre") : "members"}
                </p>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/new"
              className="flex aspect-[4/3] flex-col items-center justify-center border border-line text-muted transition hover:border-ink hover:text-ink"
            >
              <span className="display text-5xl font-light">+</span>
              <span className="caps mt-3">{fr ? "Nouvelle cagnotte" : "New pot"}</span>
            </Link>
          </li>
        </ul>
      )}

      <InspirationDoors lang={lang} compact />
    </div>
  );
}
