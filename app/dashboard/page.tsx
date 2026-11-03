import Link from "next/link";
import { redirect } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { computeStats, money, monthYear } from "@/lib/format";
import { cover, KIND_STYLE } from "@/lib/covers";
import type { Kind } from "@/lib/config";
import Jar from "@/components/Jar";

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

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-muted">{firstName ? (fr ? `Bonjour ${firstName}` : `Hi ${firstName}`) : t.myPots}</p>
          <h1 className="display mt-1 text-5xl sm:text-6xl">{t.myPots}</h1>
        </div>
        {projects.length > 0 && (
          <Link href="/new" className="btn-primary">+ {fr ? "Nouvelle cagnotte" : "New pot"}</Link>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {(["home", "travel"] as const).map((k) => (
            <Link key={k} href={`/new?kind=${k}`} className="group relative block h-80 overflow-hidden rounded-xl3 shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover(k, 1000)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="display text-4xl">{k === "home" ? t.home : t.travel}</p>
                <p className="mt-1 text-white/80">{k === "home" ? t.homeDesc : t.travelDesc}</p>
                <span className="btn mt-5 bg-white text-ink">{t.start}</span>
              </div>
            </Link>
          ))}
          <p className="text-muted md:col-span-2">{t.noPots}</p>
        </div>
      ) : (
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const s = computeStats(p.items, p.deposits, p.project_members.map((m) => m.monthly_amount));
            const st = KIND_STYLE[p.kind];
            return (
              <li key={p.id}>
                <Link
                  href={`/p/${p.id}`}
                  className="group block overflow-hidden rounded-xl3 border border-line bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative h-36 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cover(p.kind, 800)} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${st.chip}`}>
                      {st.emoji} {p.kind === "travel" ? t.travel : t.home}
                    </span>
                  </div>
                  <div className="grid grid-cols-[1fr_56px] gap-4 p-5">
                    <div className="min-w-0">
                      <h2 className="display truncate text-3xl">{p.name}</h2>
                      <p className="mt-3 text-sm text-muted">
                        <span className="text-xl font-semibold text-ink">{money(s.saved, p.currency, lang)}</span> / {money(s.goal, p.currency, lang)}
                      </p>
                      <p className="mt-2 text-xs text-muted">
                        {s.goal > 0 && s.remaining === 0
                          ? t.reached
                          : s.eta
                            ? `${fr ? "Prêt en" : "Ready by"} ${monthYear(s.eta, lang)}`
                            : `${p.items.length} ${fr ? "objets" : "items"}`}
                        {"  "}👥 {p.project_members.length}
                      </p>
                    </div>
                    <Jar progress={s.progress} kind={p.kind} className="h-24 w-14" />
                  </div>
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/new"
              className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-xl3 border-2 border-dashed border-line text-muted transition hover:border-ink/30 hover:text-ink"
            >
              <span className="display text-5xl">+</span>
              <span className="mt-2 font-medium">{fr ? "Nouvelle cagnotte" : "New pot"}</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
