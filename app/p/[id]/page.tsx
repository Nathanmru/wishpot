import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { computeStats, money, monthYear } from "@/lib/format";
import { siteUrl, type Deposit, type Item, type Member, type Project } from "@/lib/config";
import { IDEAS, SHOPS } from "@/lib/suggestions";
import { addDeposit, deleteDeposit, deleteProject, leaveProject, regenerateInvite, setMonthly } from "@/app/actions";
import AddItemForm from "@/components/AddItemForm";
import ItemRow from "@/components/ItemRow";
import IdeaChips from "@/components/IdeaChips";
import InviteBox from "@/components/InviteBox";
import ConfirmButton from "@/components/ConfirmButton";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await getUser();
  const { data } = await supabase.from("projects").select("name").eq("id", id).maybeSingle();
  return { title: data?.name ?? "—" };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await getUser();
  if (!user) notFound();
  const { t, lang } = await getDict();

  const [{ data: project }, { data: items }, { data: members }, { data: deposits }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).maybeSingle(),
    supabase.from("items").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase
      .from("project_members")
      .select("user_id, role, monthly_amount, profiles(display_name, avatar_url)")
      .eq("project_id", id)
      .order("joined_at"),
    supabase.from("deposits").select("id, user_id, amount, note, deposited_on").eq("project_id", id).order("deposited_on", { ascending: false }).order("created_at", { ascending: false }),
  ]);

  if (!project) notFound();
  const p = project as Project;
  const list = (items ?? []) as Item[];
  const mems = (members ?? []) as unknown as Member[];
  const deps = (deposits ?? []) as Deposit[];

  const me = mems.find((m) => m.user_id === user.id);
  const isOwner = me?.role === "owner";
  const nameOf = (uid: string | null) => {
    if (uid === user.id) return t.you;
    const m = mems.find((x) => x.user_id === uid);
    return m?.profiles?.display_name?.split(" ")[0] ?? "?";
  };

  const s = computeStats(list, deps, mems.map((m) => m.monthly_amount));
  const cur = p.currency;
  const inviteUrl = `${siteUrl()}/invite/${p.invite_token}`;
  const savedByMember = (uid: string) => deps.filter((d) => d.user_id === uid).reduce((a, d) => a + Number(d.amount), 0);

  return (
    <div>
      {/* ---------- En-tête & jauge ---------- */}
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link href="/dashboard" className="hover:text-ink">← {t.myPots}</Link>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.kind === "travel" ? "bg-sea-soft text-sea" : "bg-terra-soft text-terra-dark"}`}>
          {p.kind === "travel" ? `✈️ ${t.travel}` : `🛋️ ${t.home}`}
        </span>
      </div>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">{p.name}</h1>

      <section className="card mt-6">
        <div className="grid grid-cols-3 gap-3 text-center sm:text-left">
          <Stat label={t.goal} value={money(s.goal, cur, lang)} />
          <Stat label={t.saved} value={money(s.saved, cur, lang)} accent />
          <Stat label={t.remaining} value={money(s.remaining, cur, lang)} />
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-sage transition-all" style={{ width: `${Math.round(s.progress * 100)}%` }} />
        </div>
        <p className="mt-3 text-sm text-muted">
          {s.goal > 0 && s.remaining === 0 ? (
            <strong className="text-sage">{t.reached}</strong>
          ) : s.months !== null && s.eta ? (
            <>
              {t.readyIn} <strong className="text-ink">{s.months} {s.months > 1 ? t.months : t.month}</strong> ({monthYear(s.eta, lang)}) ·{" "}
              {money(s.monthly, cur, lang)} {t.perMonth} {t.together}
            </>
          ) : (
            t.setMonthly
          )}
        </p>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* ---------- Colonne principale : liste ---------- */}
        <div className="space-y-6">
          <AddItemForm
            projectId={p.id}
            currency={cur}
            t={{
              addTitle: t.addTitle, pasteLink: t.pasteLink, fetch: t.fetch, fetching: t.fetching, orManual: t.orManual,
              title: t.title, price: t.price, qty: t.qty, add: t.add, cancel: t.cancel,
              priceNotFound: t.priceNotFound, fetchError: t.fetchError,
            }}
          />

          <section>
            <h2 className="font-display text-2xl font-semibold">
              {t.list} <span className="text-base font-normal text-muted">· {list.length}</span>
            </h2>
            {list.length === 0 ? (
              <p className="card mt-4 text-center text-sm text-muted">{t.empty}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {list.map((it) => (
                  <ItemRow
                    key={it.id}
                    item={it}
                    projectId={p.id}
                    currency={cur}
                    lang={lang}
                    addedBy={nameOf(it.added_by)}
                    t={{ buy: t.buy, markBought: t.markBought, bought: t.bought, remove: t.remove, addedBy: t.addedBy, price: t.price, qty: t.qty, save: t.save }}
                  />
                ))}
              </ul>
            )}
          </section>

          <section className="card">
            <h2 className="font-semibold">💡 {t.ideas}</h2>
            <p className="mt-1 text-sm text-muted">{t.ideasHint}</p>
            <IdeaChips projectId={p.id} ideas={IDEAS[p.kind]} lang={lang} currency={cur} />
            <h3 className="mt-6 font-semibold">🧭 {t.shops}</h3>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SHOPS[p.kind].map((shop) => (
                <li key={shop.name}>
                  <a
                    href={`/go?u=${encodeURIComponent(shop.url)}`}
                    target="_blank"
                    rel="noopener sponsored"
                    className="block rounded-xl border border-line bg-white p-3 text-sm transition hover:border-ink"
                  >
                    <span className="font-semibold">{shop.name}</span>
                    <span className="block text-xs text-muted">{shop.note[lang]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ---------- Colonne latérale ---------- */}
        <aside className="space-y-6">
          <section className="card">
            <h2 className="font-semibold">👥 {t.members}</h2>
            <ul className="mt-3 space-y-3">
              {mems.map((m) => (
                <li key={m.user_id} className="flex items-center gap-3">
                  <Avatar name={m.profiles?.display_name ?? "?"} url={m.profiles?.avatar_url ?? null} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {m.profiles?.display_name ?? "?"} {m.user_id === user.id && <span className="text-muted">({t.you})</span>}
                    </p>
                    <p className="text-xs text-muted">
                      {money(m.monthly_amount, cur, lang)} {t.perMonth} · {t.saved.toLowerCase()} {money(savedByMember(m.user_id), cur, lang)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            {me && (
              <form action={setMonthly.bind(null, p.id)} className="mt-4 border-t border-line pt-4">
                <label className="label" htmlFor="monthly">{t.myMonthly}</label>
                <div className="flex gap-2">
                  <input id="monthly" name="monthly" inputMode="decimal" defaultValue={me.monthly_amount} className="input" />
                  <button className="btn-primary">{t.save}</button>
                </div>
              </form>
            )}
          </section>

          <section className="card">
            <h2 className="font-semibold">🐷 {t.deposits}</h2>
            <form action={addDeposit.bind(null, p.id)} className="mt-3 flex gap-2">
              <input
                name="amount"
                inputMode="decimal"
                defaultValue={me?.monthly_amount || ""}
                placeholder="100"
                className="input"
                aria-label={t.addDeposit}
              />
              <button className="btn-accent whitespace-nowrap">+ {t.addDeposit}</button>
            </form>
            {deps.length === 0 ? (
              <p className="mt-3 text-sm text-muted">{t.noDeposits}</p>
            ) : (
              <ul className="mt-3 max-h-64 divide-y divide-line overflow-auto text-sm">
                {deps.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-2 py-2">
                    <span>
                      <strong>{money(d.amount, cur, lang)}</strong>{" "}
                      <span className="text-muted">
                        · {nameOf(d.user_id)} · {new Date(d.deposited_on).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB")}
                      </span>
                    </span>
                    {d.user_id === user.id && (
                      <form action={deleteDeposit.bind(null, p.id, d.id)}>
                        <button className="text-muted hover:text-terra" aria-label={t.remove}>×</button>
                      </form>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <InviteBox
            url={inviteUrl}
            projectName={p.name}
            canRegenerate={isOwner}
            regenerate={regenerateInvite.bind(null, p.id)}
            t={{ invite: t.invite, inviteText: t.inviteText, copy: t.copy, copied: t.copied, share: t.share, newLink: t.newLink }}
          />

          <div className="px-1 text-sm">
            {isOwner ? (
              <ConfirmButton action={deleteProject.bind(null, p.id)} confirmText={t.confirmDelete} label={t.deleteProject} />
            ) : (
              <ConfirmButton action={leaveProject.bind(null, p.id)} confirmText={`${t.leave} ?`} label={t.leave} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className={`mt-1 font-display text-xl font-semibold sm:text-3xl ${accent ? "text-sage" : ""}`}>{value}</p>
    </div>
  );
}

function Avatar({ name, url }: { name: string; url: string | null }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" referrerPolicy="no-referrer" className="h-9 w-9 rounded-full object-cover" />;
  }
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terra-soft text-sm font-semibold text-terra-dark">
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}
