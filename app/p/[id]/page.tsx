import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { computeStats, money, monthYear } from "@/lib/format";
import { siteUrl, type Deposit, type Item, type Member, type Project } from "@/lib/config";
import { cover } from "@/lib/covers";
import { IDEAS, SHOPS } from "@/lib/suggestions";
import { ROOMS, roomLabel } from "@/lib/rooms";
import { illustrationFor } from "@/lib/itemImage";
import { addDeposit, deleteDeposit, deleteProject, leaveProject, regenerateInvite, setMonthly, setShare } from "@/app/actions";
import AddItemForm from "@/components/AddItemForm";
import ItemCard, { type ItemComment, type ItemLikes } from "@/components/ItemCard";
import IdeaChips from "@/components/IdeaChips";
import InviteBox from "@/components/InviteBox";
import ConfirmButton from "@/components/ConfirmButton";
import ProjectInspiration from "@/components/ProjectInspiration";
import { CopyLink, Milestones, Simulator } from "@/components/Motivation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await getUser();
  const { data } = await supabase.from("projects").select("name").eq("id", id).maybeSingle();
  return { title: data?.name ?? "—" };
}

type Tab = "liste" | "epargne" | "cercle";

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ room?: string; view?: string; tab?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
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

  const me = mems.find((m) => m.user_id === user.id);
  const isOwner = me?.role === "owner";
  const nameOf = (uid: string | null) => {
    if (uid === user.id) return t.you;
    const m = mems.find((x) => x.user_id === uid);
    return m?.profiles?.display_name?.split(" ")[0] ?? "?";
  };
  const firstNames = mems.map((m) => m.profiles?.display_name?.split(" ")[0] || "?");

  const s = computeStats(list, deps, mems.map((m) => m.monthly_amount));
  const cur = p.currency;
  const inviteUrl = `${siteUrl()}/invite/${p.invite_token}`;
  const shareUrl = p.share_token ? `${siteUrl()}/l/${p.share_token}` : null;
  const savedBy = (uid: string) => deps.filter((d) => d.user_id === uid).reduce((a, d) => a + Number(d.amount), 0);

  // ----- Cœurs et commentaires
  const ids = list.map((i) => i.id);
  const [{ data: likeRows }, { data: commentRows }] = ids.length
    ? await Promise.all([
        supabase.from("item_likes").select("item_id, user_id").in("item_id", ids),
        supabase.from("item_comments").select("id, item_id, user_id, body, created_at").in("item_id", ids).order("created_at"),
      ])
    : [{ data: [] }, { data: [] }];
  const likesOf = (iid: string): ItemLikes => {
    const rows = ((likeRows ?? []) as { item_id: string; user_id: string }[]).filter((l) => l.item_id === iid);
    return { count: rows.length, mine: rows.some((l) => l.user_id === user.id), names: rows.map((l) => nameOf(l.user_id)) };
  };
  const commentsOf = (iid: string): ItemComment[] =>
    ((commentRows ?? []) as { id: string; item_id: string; user_id: string; body: string; created_at: string }[])
      .filter((c) => c.item_id === iid)
      .map((c) => ({ id: c.id, name: nameOf(c.user_id), body: c.body, mine: c.user_id === user.id, at: c.created_at }));

  // ----- Navigation : onglet, pièce, vue
  const tab: Tab = sp.tab === "epargne" || sp.tab === "cercle" ? sp.tab : "liste";
  const roomList = ROOMS[p.kind];
  const activeRoom = sp.room && (sp.room === "none" || roomList.some((r) => r.id === sp.room)) ? sp.room : null;
  const view = sp.view === "board" ? "board" : "grid";
  const href = (patch: { tab?: Tab; room?: string | null; view?: string | null }) => {
    const q = new URLSearchParams();
    const tb = patch.tab ?? tab;
    const room = patch.room === undefined ? activeRoom : patch.room;
    const v = patch.view === undefined ? view : patch.view;
    if (tb !== "liste") q.set("tab", tb);
    if (tb === "liste" && room) q.set("room", room);
    if (tb === "liste" && v === "board") q.set("view", "board");
    const str = q.toString();
    return `/p/${p.id}${str ? `?${str}` : ""}#onglets`;
  };

  const inRoom = (i: Item) =>
    !activeRoom ? true : activeRoom === "none" ? !i.room || !roomList.some((r) => r.id === i.room) : i.room === activeRoom;
  const toBuy = list
    .filter((i) => !i.purchased)
    .sort((a, b) => likesOf(b.id).count - likesOf(a.id).count)
    .filter(inRoom);
  const bought = list.filter((i) => i.purchased).filter(inRoom);
  const roomTotals = roomList
    .map((r) => {
      const its = list.filter((i) => i.room === r.id);
      return { ...r, count: its.length, total: its.reduce((a, i) => a + Number(i.price) * i.quantity, 0) };
    })
    .filter((r) => r.count > 0);
  const unsortedCount = list.filter((i) => !i.room || !roomList.some((r) => r.id === i.room)).length;

  // ----- Rappel du mois
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const paidThisMonth = deps.some((d) => d.user_id === user.id && d.deposited_on.startsWith(monthKey));
  const monthName = now.toLocaleDateString(fr ? "fr-FR" : "en-GB", { month: "long" });

  const kindLabel = p.kind === "travel" ? (fr ? "Cagnotte voyage" : "Travel pot") : fr ? "Cagnotte maison" : "Home pot";
  const card = (it: Item, compact = false) => (
    <ItemCard
      key={it.id}
      item={it}
      projectId={p.id}
      currency={cur}
      lang={lang}
      addedBy={nameOf(it.added_by)}
      kind={p.kind}
      likes={likesOf(it.id)}
      comments={commentsOf(it.id)}
      compact={compact}
    />
  );

  return (
    <div className="-mt-24 sm:-mt-28">
      {/* ================= Ouverture ================= */}
      <section className="relative mx-[calc(50%-50vw)] flex h-[56vh] min-h-[420px] items-end overflow-hidden bg-night sm:h-[68vh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover(p.kind, 2200)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/35" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-12 text-white sm:px-6 sm:pb-16">
          <Link href="/dashboard" className="caps text-white/70 transition hover:text-white">
            ← {t.myPots}
          </Link>
          <p className="caps mt-10 text-white/75">
            {kindLabel} · {mems.length} {fr ? (mems.length > 1 ? "membres" : "membre") : mems.length > 1 ? "members" : "member"}
          </p>
          <h1 className="display mt-4 max-w-4xl text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">{p.name}</h1>
          <div className="mt-7 flex items-center gap-4">
            <div className="flex -space-x-2">
              {mems.map((m) => (
                <Avatar key={m.user_id} name={m.profiles?.display_name ?? "?"} url={m.profiles?.avatar_url ?? null} ring />
              ))}
            </div>
            <p className="text-sm text-white/80">{firstNames.join(fr ? " & " : " & ")}</p>
          </div>
        </div>
      </section>

      {/* ================= Où on en est ================= */}
      <section className="py-14 sm:py-20">
        {me && Number(me.monthly_amount) > 0 && !paidThisMonth && s.remaining > 0 && (
          <form
            action={addDeposit.bind(null, p.id)}
            className="mb-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-y border-line py-4"
          >
            <p className="text-sm">
              <span className="caps mr-3 text-brass">{monthName}</span>
              {fr ? "Ta part n'est pas encore mise de côté ce mois-ci." : "Your share isn't set aside yet this month."}
            </p>
            <input type="hidden" name="amount" value={me.monthly_amount} />
            <button className="link-caps">
              {fr ? "C'est fait" : "Done"} · {money(Number(me.monthly_amount), cur, lang)}
            </button>
          </form>
        )}

        <div className="grid items-end gap-10 md:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="caps text-muted">{fr ? "Épargné ensemble" : "Saved together"}</p>
            <p className="display mt-3 text-[4.2rem] leading-none sm:text-8xl lg:text-9xl">{money(s.saved, cur, lang)}</p>
            <p className="mt-4 text-muted">
              {fr ? "sur" : "of"} {money(s.goal, cur, lang)}
              {s.goal > 0 && <> · {Math.round(s.progress * 100)} %</>}
            </p>
          </div>
          <div className="md:text-right">
            <p className="caps text-muted">{fr ? "Arrivée prévue" : "Expected"}</p>
            {s.goal > 0 && s.remaining === 0 ? (
              <p className="display mt-3 text-4xl sm:text-5xl">{fr ? "C'est prêt." : "You're there."}</p>
            ) : s.months !== null && s.eta ? (
              <>
                <p className="display mt-3 text-4xl capitalize sm:text-5xl">{monthYear(s.eta, lang)}</p>
                <p className="mt-2 text-muted">
                  {fr ? "dans" : "in"} {s.months} {s.months > 1 ? t.months : t.month}
                </p>
              </>
            ) : (
              <>
                <p className="display mt-3 text-3xl text-muted">—</p>
                <Link href={href({ tab: "epargne" })} className="link-caps mt-3">
                  {fr ? "Fixer ma part du mois" : "Set my monthly share"}
                </Link>
              </>
            )}
          </div>
        </div>

        {s.goal > 0 && <Milestones progress={s.progress} projectId={p.id} lang={lang} />}

        <dl className="mt-14 grid grid-cols-3 gap-4 border-t border-line pt-6">
          <Figure label={t.remaining} value={money(s.remaining, cur, lang)} />
          <Figure label={fr ? "Chaque mois" : "Each month"} value={money(s.monthly, cur, lang)} />
          <Figure label={fr ? "Déjà acheté" : "Bought"} value={money(s.bought, cur, lang)} />
        </dl>
      </section>

      {/* ================= Onglets ================= */}
      <nav id="onglets" className="sticky top-16 z-30 mx-[calc(50%-50vw)] scroll-mt-16 border-y border-line bg-paper/95 backdrop-blur sm:top-20 sm:scroll-mt-20">
        <div className="mx-auto flex max-w-6xl gap-8 overflow-x-auto px-5 sm:gap-12 sm:px-6">
          {(
            [
              ["liste", fr ? `La liste · ${list.length}` : `The list · ${list.length}`],
              ["epargne", fr ? "Épargne" : "Savings"],
              ["cercle", fr ? "Le cercle" : "The circle"],
            ] as [Tab, string][]
          ).map(([k, label]) => (
            <Link
              key={k}
              href={href({ tab: k, room: null, view: null })}
              className={`caps -mb-px shrink-0 border-b-2 py-4 transition ${tab === k ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* ================= La liste ================= */}
      {tab === "liste" && (
        <div className="py-12 sm:py-16">
          <AddItemForm
            projectId={p.id}
            currency={cur}
            t={{
              addTitle: fr ? "Ajouter une envie" : "Add a wish",
              pasteLink: fr ? "Collez le lien d'un produit, d'un hôtel…" : "Paste a product or hotel link…",
              fetch: fr ? "Ajouter" : "Add",
              fetching: fr ? "Lecture…" : "Reading…",
              orManual: fr ? "Saisir à la main" : "Enter manually",
              title: t.title,
              price: t.price,
              qty: t.qty,
              add: fr ? "Ajouter à la liste" : "Add to list",
              cancel: t.cancel,
              priceNotFound: t.priceNotFound,
              fetchError: t.fetchError,
            }}
          />

          {list.length === 0 ? (
            <div className="py-20 text-center">
              <p className="display mx-auto max-w-xl text-4xl leading-tight sm:text-5xl">
                {fr ? "Votre liste commence ici." : "Your list starts here."}
              </p>
              <p className="mx-auto mt-4 max-w-md text-muted">
                {fr ? "Collez un lien ci-dessus, ou partez d'une idée :" : "Paste a link above, or start from an idea:"}
              </p>
              <div className="mx-auto mt-4 flex max-w-3xl justify-center">
                <IdeaChips projectId={p.id} ideas={IDEAS[p.kind]} lang={lang} currency={cur} />
              </div>
            </div>
          ) : (
            <>
              <div className="mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
                <div className="-mx-1 flex max-w-full gap-6 overflow-x-auto px-1 pb-1">
                  <FilterLink href={href({ room: null })} active={!activeRoom} label={fr ? "Tout" : "All"} meta={money(s.goal, cur, lang)} />
                  {roomTotals.map((r) => (
                    <FilterLink key={r.id} href={href({ room: r.id })} active={activeRoom === r.id} label={r[lang]} meta={money(r.total, cur, lang)} />
                  ))}
                  {unsortedCount > 0 && roomTotals.length > 0 && (
                    <FilterLink href={href({ room: "none" })} active={activeRoom === "none"} label={fr ? "Sans pièce" : "Unsorted"} meta={String(unsortedCount)} />
                  )}
                </div>
                <div className="flex gap-5">
                  <FilterLink href={href({ view: null })} active={view === "grid"} label={fr ? "Grille" : "Grid"} />
                  <FilterLink href={href({ view: "board" })} active={view === "board"} label="Moodboard" />
                </div>
              </div>

              {view === "board" ? (
                <div className="mt-10 columns-2 gap-3 sm:columns-3 lg:columns-4">
                  {[...toBuy, ...bought].map((it, i) => (
                    <figure key={it.id} className="group relative mb-3 break-inside-avoid overflow-hidden bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={it.image_url || illustrationFor(it.title, p.kind)}
                        alt={it.title}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className={`w-full object-cover transition duration-[1200ms] group-hover:scale-[1.04] ${
                          ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[4/3]"][i % 4]
                        } ${it.purchased ? "grayscale-[60%]" : ""}`}
                      />
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-12 text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                        <p className="line-clamp-1 text-sm">{it.title}</p>
                        <p className="caps mt-1 text-white/75">
                          {money(Number(it.price) * it.quantity, cur, lang)}
                          {it.room && ` · ${roomLabel(p.kind, it.room, lang)}`}
                        </p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ) : (
                <>
                  {toBuy.length > 0 ? (
                    <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-3">{toBuy.map((it) => card(it))}</ul>
                  ) : (
                    <p className="mt-10 text-muted">{fr ? "Rien à acheter ici pour l'instant." : "Nothing to buy here yet."}</p>
                  )}
                  {bought.length > 0 && (
                    <div className="mt-20">
                      <p className="caps border-b border-line pb-3 text-muted">
                        {fr ? "Déjà acheté" : "Already bought"} · {bought.length}
                      </p>
                      <ul className="mt-8 grid grid-cols-3 gap-x-4 gap-y-8 opacity-80 sm:grid-cols-4 lg:grid-cols-6">
                        {bought.map((it) => card(it, true))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          <div className="mt-24">
            <ProjectInspiration projectId={p.id} kind={p.kind} existingUrls={list.map((i) => i.url ?? "").filter(Boolean)} />
          </div>

          {list.length > 0 && (
            <section className="mt-20">
              <p className="caps text-muted">{fr ? "Idées rapides" : "Quick ideas"}</p>
              <h2 className="display mt-2 text-4xl">{fr ? "Il manque peut-être…" : "You might be missing…"}</h2>
              <IdeaChips projectId={p.id} ideas={IDEAS[p.kind]} lang={lang} currency={cur} />
            </section>
          )}

          <section className="mt-20">
            <p className="caps text-muted">{fr ? "Où chercher" : "Where to look"}</p>
            <h2 className="display mt-2 text-4xl">{fr ? "Les bonnes adresses" : "Good addresses"}</h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {SHOPS[p.kind].map((shop) => (
                <li key={shop.name}>
                  <a
                    href={`/go?u=${encodeURIComponent(shop.url)}`}
                    target="_blank"
                    rel="noopener sponsored"
                    className="group grid grid-cols-[1fr_auto] items-baseline gap-4 py-5 sm:grid-cols-[1fr_1.4fr_auto] sm:px-2"
                  >
                    <span className="display text-2xl">{shop.name}</span>
                    <span className="hidden text-muted sm:block">{shop.note[lang]}</span>
                    <span className="caps transition group-hover:translate-x-1">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {/* ================= Épargne ================= */}
      {tab === "epargne" && (
        <div className="grid gap-14 py-12 sm:py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="space-y-10">
            {me && (
              <form action={setMonthly.bind(null, p.id)}>
                <p className="caps text-muted">{t.myMonthly}</p>
                <div className="mt-4 flex items-end gap-4">
                  <input
                    name="monthly"
                    inputMode="decimal"
                    defaultValue={me.monthly_amount}
                    aria-label={t.myMonthly}
                    className="input-line display !text-5xl"
                  />
                  <span className="display pb-2 text-3xl text-muted">{cur === "EUR" ? "€" : cur}</span>
                  <button className="link-caps mb-3 shrink-0">{t.save}</button>
                </div>
              </form>
            )}

            <form action={addDeposit.bind(null, p.id)}>
              <p className="caps text-muted">{fr ? "J'ai mis de côté" : "I've saved"}</p>
              <div className="mt-4 flex items-end gap-4">
                <input
                  name="amount"
                  inputMode="decimal"
                  defaultValue={me?.monthly_amount || ""}
                  placeholder="100"
                  aria-label={t.addDeposit}
                  className="input-line display !text-5xl"
                />
                <span className="display pb-2 text-3xl text-muted">{cur === "EUR" ? "€" : cur}</span>
                <button className="link-caps mb-3 shrink-0">{fr ? "Ajouter" : "Add"}</button>
              </div>
            </form>

            <Simulator remaining={s.remaining} monthly={s.monthly} currency={cur} lang={lang} />
          </div>

          <div className="space-y-12">
            <div>
              <p className="caps text-muted">{fr ? "Qui a mis quoi" : "Who saved what"}</p>
              <ul className="mt-5 space-y-5">
                {mems.map((m) => {
                  const saved = savedBy(m.user_id);
                  const share = s.saved > 0 ? saved / s.saved : 0;
                  return (
                    <li key={m.user_id}>
                      <div className="flex items-baseline justify-between gap-4">
                        <span>{m.user_id === user.id ? t.you : m.profiles?.display_name?.split(" ")[0] ?? "?"}</span>
                        <span className="display text-2xl">{money(saved, cur, lang)}</span>
                      </div>
                      <div className="mt-2 h-px bg-line">
                        <div className="h-[2px] -translate-y-[0.5px] bg-ink" style={{ width: `${share * 100}%` }} />
                      </div>
                      <p className="mt-1.5 text-xs text-muted">
                        {money(m.monthly_amount, cur, lang)} {t.perMonth}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <p className="caps text-muted">{t.deposits}</p>
              {deps.length === 0 ? (
                <p className="mt-4 text-muted">{t.noDeposits}</p>
              ) : (
                <ul className="mt-4 divide-y divide-line border-y border-line">
                  {deps.map((d) => (
                    <li key={d.id} className="grid grid-cols-[88px_1fr_auto_24px] items-baseline gap-3 py-4">
                      <span className="caps text-muted">
                        {new Date(d.deposited_on).toLocaleDateString(fr ? "fr-FR" : "en-GB", { day: "numeric", month: "short" })}
                      </span>
                      <span>{nameOf(d.user_id)}</span>
                      <span className="display text-xl">+ {money(d.amount, cur, lang)}</span>
                      {d.user_id === user.id ? (
                        <form action={deleteDeposit.bind(null, p.id, d.id)}>
                          <button className="text-lg text-muted hover:text-walnut" aria-label={t.remove}>
                            ×
                          </button>
                        </form>
                      ) : (
                        <span />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= Le cercle ================= */}
      {tab === "cercle" && (
        <div className="grid gap-14 py-12 sm:py-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="caps text-muted">{t.members}</p>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {mems.map((m) => (
                <li key={m.user_id} className="flex items-center gap-4 py-5">
                  <Avatar name={m.profiles?.display_name ?? "?"} url={m.profiles?.avatar_url ?? null} />
                  <div className="min-w-0 flex-1">
                    <p className="display truncate text-2xl">
                      {m.profiles?.display_name ?? "?"}
                      {m.user_id === user.id && <span className="text-base text-muted"> ({t.you})</span>}
                    </p>
                    <p className="caps mt-1 text-muted">
                      {m.role === "owner" ? (fr ? "Créateur" : "Owner") : fr ? "Membre" : "Member"} · {money(m.monthly_amount, cur, lang)}{" "}
                      {t.perMonth}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <InviteBox
                url={inviteUrl}
                projectName={p.name}
                canRegenerate={isOwner}
                regenerate={regenerateInvite.bind(null, p.id)}
                t={{ invite: t.invite, inviteText: t.inviteText, copy: t.copy, copied: t.copied, share: t.share, newLink: t.newLink }}
              />
            </div>
          </div>

          <div className="space-y-10">
            <section className="border border-line bg-white p-6 sm:p-8">
              <p className="caps text-muted">{fr ? "Liste pour les proches" : "Wish list for loved ones"}</p>
              <p className="display mt-3 text-3xl leading-tight">
                {fr ? "Pour une crémaillère, un anniversaire, un mariage." : "For a housewarming, a birthday, a wedding."}
              </p>
              <p className="mt-3 leading-relaxed text-muted">
                {fr
                  ? "Vos proches voient la liste, sans vos montants, et réservent un objet avec « Je l'offre ». Personne n'offre deux fois la même chose."
                  : "Loved ones see the list (not your savings) and reserve an item with “I'll gift it”. No duplicates."}
              </p>
              {shareUrl ? (
                <>
                  <p className="mt-5 truncate border-b border-line pb-2 text-sm text-muted">{shareUrl}</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <CopyLink url={shareUrl} label={fr ? "Envoyer le lien" : "Send the link"} done={fr ? "Lien copié ✓" : "Link copied ✓"} />
                    <a href={shareUrl} target="_blank" className="btn-ghost w-full !py-3 text-[12px] uppercase tracking-label">
                      {fr ? "Voir la page" : "Preview"} ↗
                    </a>
                  </div>
                  {isOwner && (
                    <form action={setShare.bind(null, p.id, false)} className="mt-4">
                      <button className="text-xs text-muted underline-offset-4 hover:text-walnut hover:underline">
                        {fr ? "Désactiver le lien" : "Turn off the link"}
                      </button>
                    </form>
                  )}
                </>
              ) : isOwner ? (
                <form action={setShare.bind(null, p.id, true)} className="mt-6">
                  <button className="btn-primary w-full !py-3.5 text-[12px] uppercase tracking-label">
                    {fr ? "Créer le lien de partage" : "Create the share link"}
                  </button>
                </form>
              ) : (
                <p className="mt-5 text-sm text-muted">{fr ? "Le créateur de la cagnotte peut l'activer." : "The pot owner can turn it on."}</p>
              )}
            </section>

            <div className="border-t border-line pt-6 text-sm">
              {isOwner ? (
                <ConfirmButton action={deleteProject.bind(null, p.id)} confirmText={t.confirmDelete} label={t.deleteProject} />
              ) : (
                <ConfirmButton action={leaveProject.bind(null, p.id)} confirmText={`${t.leave} ?`} label={t.leave} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="caps text-muted">{label}</dt>
      <dd className="display mt-2 text-2xl sm:text-4xl">{value}</dd>
    </div>
  );
}

function FilterLink({ href, active, label, meta }: { href: string; active: boolean; label: string; meta?: string }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={`caps shrink-0 border-b pb-1 transition ${active ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"}`}
    >
      {label}
      {meta && <span className="ml-1.5 normal-case tracking-normal opacity-60">{meta}</span>}
    </Link>
  );
}

function Avatar({ name, url, ring }: { name: string; url: string | null; ring?: boolean }) {
  const base = `h-10 w-10 shrink-0 rounded-full ${ring ? "border-2 border-night" : ""}`;
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={name} title={name} referrerPolicy="no-referrer" className={`${base} object-cover`} />;
  }
  return (
    <span title={name} className={`${base} flex items-center justify-center bg-bone text-sm font-medium text-ink`}>
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}
