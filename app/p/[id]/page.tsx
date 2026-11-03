import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { computeStats, money, monthYear } from "@/lib/format";
import { siteUrl, type Deposit, type Item, type Member, type Project } from "@/lib/config";
import { cover, KIND_STYLE } from "@/lib/covers";
import { IDEAS, SHOPS } from "@/lib/suggestions";
import { addDeposit, deleteDeposit, deleteProject, leaveProject, regenerateInvite, setMonthly } from "@/app/actions";
import AddItemForm from "@/components/AddItemForm";
import ItemRow from "@/components/ItemRow";
import IdeaChips from "@/components/IdeaChips";
import InviteBox from "@/components/InviteBox";
import ConfirmButton from "@/components/ConfirmButton";
import Jar from "@/components/Jar";

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
  const fr = lang === "fr";

  const [{ data: project }, { data: items }, { data: members }, { data: deposits }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).maybeSingle(),
    supabase.from("items").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase
      .from("project_members")
      .select("user_id, role, monthly_amount, profiles(display_name, avatar_url)")
      .eq("project_id", id)
      .order("joined_at"),
    supabase
      .from("deposits")
      .select("id, user_id, amount, note, deposited_on")
      .eq("project_id", id)
      .order("deposited_on", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  if (!project) notFound();
  const p = project as Project;
  const list = (items ?? []) as Item[];
  const mems = (members ?? []) as unknown as Member[];
  const deps = (deposits ?? []) as Deposit[];
  const st = KIND_STYLE[p.kind];

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
  const savedBy = (uid: string) => deps.filter((d) => d.user_id === uid).reduce((a, d) => a + Number(d.amount), 0);
  const toBuy = list.filter((i) => !i.purchased);
  const bought = list.filter((i) => i.purchased);

  return (
    <div>
      {/* ---------- Bandeau ---------- */}
      <section className="relative -mx-4 -mt-8 h-64 overflow-hidden sm:-mx-6 sm:h-80 lg:mx-0 lg:mt-0 lg:rounded-xl3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover(p.kind, 1800)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
        <Link href="/dashboard" className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium backdrop-blur hover:bg-white">
          ← {t.myPots}
        </Link>
        <div className="absolute bottom-6 left-5 right-5 flex flex-wrap items-end justify-between gap-4 sm:bottom-8 sm:left-8 sm:right-8">
          <div className="text-white">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${st.chip}`}>
              {st.emoji} {p.kind === "travel" ? t.travel : t.home}
            </span>
            <h1 className="display mt-3 text-5xl leading-none sm:text-7xl">{p.name}</h1>
          </div>
          <div className="flex -space-x-2">
            {mems.map((m) => (
              <Avatar key={m.user_id} name={m.profiles?.display_name ?? "?"} url={m.profiles?.avatar_url ?? null} ring />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Jauge ---------- */}
      <section className="mt-8 grid gap-6 rounded-xl3 border border-line bg-white p-6 shadow-soft sm:grid-cols-[auto_1fr] sm:p-8">
        <Jar progress={s.progress} kind={p.kind} className="mx-auto h-48 w-28 sm:h-56 sm:w-32" />
        <div className="flex flex-col justify-center">
          <p className="text-muted">{t.saved}</p>
          <p className="display text-6xl leading-none sm:text-7xl">{money(s.saved, cur, lang)}</p>
          <p className="mt-2 text-muted">
            {fr ? "sur" : "of"} <span className="font-semibold text-ink">{money(s.goal, cur, lang)}</span>
            {s.goal > 0 && <> ({Math.round(s.progress * 100)} %)</>}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5 text-sm">
            <Stat label={t.remaining} value={money(s.remaining, cur, lang)} />
            <Stat label={fr ? "Par mois" : "Per month"} value={money(s.monthly, cur, lang)} />
            <Stat label={t.bought} value={money(s.bought, cur, lang)} />
          </div>

          <p className="mt-5 text-sm">
            {s.goal > 0 && s.remaining === 0 ? (
              <span className="rounded-full bg-moss-soft px-3 py-1.5 font-semibold text-moss">{t.reached}</span>
            ) : s.months !== null && s.eta ? (
              <span className="rounded-full bg-apricot-soft px-3 py-1.5 font-semibold text-walnut-dark">
                {fr ? "Prêt en" : "Ready by"} {monthYear(s.eta, lang)}, {fr ? "dans" : "in"} {s.months} {s.months > 1 ? t.months : t.month}
              </span>
            ) : (
              <span className="text-muted">{t.setMonthly}</span>
            )}
          </p>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* ---------- Colonne principale ---------- */}
        <div className="min-w-0 space-y-10">
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
            <div className="flex items-baseline justify-between">
              <h2 className="display text-4xl">{t.list}</h2>
              <span className="text-sm text-muted">
                {toBuy.length} {fr ? "à acheter" : "to buy"}
                {bought.length > 0 && `, ${bought.length} ${fr ? "acheté" : "bought"}${bought.length > 1 && fr ? "s" : ""}`}
              </span>
            </div>
            {list.length === 0 ? (
              <div className={`mt-5 rounded-xl3 border-2 border-dashed border-line p-10 text-center ${p.kind === "travel" ? "bg-dusk-soft/40" : "bg-walnut-soft/40"}`}>
                <p className="display text-3xl">{fr ? "La liste est vide" : "The list is empty"}</p>
                <p className="mx-auto mt-2 max-w-sm text-muted">{t.empty}</p>
              </div>
            ) : (
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {[...toBuy, ...bought].map((it) => (
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

          <section>
            <h2 className="display text-4xl">{t.ideas}</h2>
            <p className="mt-2 text-muted">{t.ideasHint}</p>
            <IdeaChips projectId={p.id} ideas={IDEAS[p.kind]} lang={lang} currency={cur} />

            <h3 className="mt-10 text-lg font-semibold">{t.shops}</h3>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {SHOPS[p.kind].map((shop) => (
                <li key={shop.name}>
                  <a
                    href={`/go?u=${encodeURIComponent(shop.url)}`}
                    target="_blank"
                    rel="noopener sponsored"
                    className="group flex h-full flex-col rounded-xl2 border border-line bg-white p-4 transition hover:border-ink/30 hover:shadow-soft"
                  >
                    <span className="font-semibold">{shop.name}</span>
                    <span className="mt-0.5 text-xs text-muted">{shop.note[lang]}</span>
                    <span className="mt-3 text-xs font-semibold text-dusk opacity-0 transition group-hover:opacity-100">
                      {fr ? "Ouvrir le site" : "Open site"} ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ---------- Colonne latérale ---------- */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="card">
            <h2 className="text-lg font-semibold">{t.members}</h2>
            <ul className="mt-4 space-y-4">
              {mems.map((m) => (
                <li key={m.user_id} className="flex items-center gap-3">
                  <Avatar name={m.profiles?.display_name ?? "?"} url={m.profiles?.avatar_url ?? null} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {m.profiles?.display_name ?? "?"}
                      {m.user_id === user.id && <span className="font-normal text-muted"> ({t.you})</span>}
                    </p>
                    <p className="text-xs text-muted">
                      {money(m.monthly_amount, cur, lang)} {t.perMonth}, {t.saved.toLowerCase()} {money(savedBy(m.user_id), cur, lang)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            {me && (
              <form action={setMonthly.bind(null, p.id)} className="mt-5 border-t border-line pt-5">
                <label className="label" htmlFor="monthly">{t.myMonthly}</label>
                <div className="flex gap-2">
                  <input id="monthly" name="monthly" inputMode="decimal" defaultValue={me.monthly_amount} className="input" />
                  <button className="btn-ghost">{t.save}</button>
                </div>
              </form>
            )}
          </section>

          <section className="card">
            <h2 className="text-lg font-semibold">{t.deposits}</h2>
            <form action={addDeposit.bind(null, p.id)} className="mt-4 flex gap-2">
              <input
                name="amount"
                inputMode="decimal"
                defaultValue={me?.monthly_amount || ""}
                placeholder="100"
                className="input"
                aria-label={t.addDeposit}
              />
              <button className="btn-primary whitespace-nowrap">{t.addDeposit}</button>
            </form>
            {deps.length === 0 ? (
              <p className="mt-4 text-sm text-muted">{t.noDeposits}</p>
            ) : (
              <ul className="mt-4 max-h-72 divide-y divide-line overflow-auto text-sm">
                {deps.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-2 py-2.5">
                    <span>
                      <span className="font-semibold">+ {money(d.amount, cur, lang)}</span>
                      <span className="block text-xs text-muted">
                        {nameOf(d.user_id)}, {new Date(d.deposited_on).toLocaleDateString(fr ? "fr-FR" : "en-GB", { day: "numeric", month: "short" })}
                      </span>
                    </span>
                    {d.user_id === user.id && (
                      <form action={deleteDeposit.bind(null, p.id, d.id)}>
                        <button className="rounded-full px-2 text-lg text-muted hover:bg-paper hover:text-ink" aria-label={t.remove}>×</button>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5 text-base font-semibold">{value}</p>
    </div>
  );
}

function Avatar({ name, url, ring }: { name: string; url: string | null; ring?: boolean }) {
  const base = `h-10 w-10 shrink-0 rounded-full ${ring ? "border-2 border-white" : ""}`;
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={name} title={name} referrerPolicy="no-referrer" className={`${base} object-cover`} />;
  }
  return (
    <span title={name} className={`${base} flex items-center justify-center bg-apricot-soft text-sm font-bold text-walnut`}>
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}
