import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cover } from "@/lib/covers";
import { illustrationFor } from "@/lib/itemImage";
import { roomLabel } from "@/lib/rooms";
import type { Kind } from "@/lib/config";

type PublicItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image_url: string | null;
  url: string | null;
  room: string | null;
  reserved: boolean;
};
type PublicList = { name: string; kind: Kind; currency: string; owner: string; items: PublicItem[] };

async function load(token: string) {
  const supabase = await createClient();
  const { data } = await supabase.rpc("public_list", { p_token: token });
  return (data as PublicList | null) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const list = await load(token);
  if (!list) return { title: "Liste introuvable" };
  return {
    title: `${list.name} · liste de ${list.owner || "envies"}`,
    description: "Choisissez un objet à offrir : il sera réservé pour que personne ne l'offre en double.",
    robots: { index: false },
  };
}

async function reserve(token: string, formData: FormData) {
  "use server";
  const supabase = await createClient();
  const item = String(formData.get("item") || "");
  const name = String(formData.get("name") || "").trim().slice(0, 60);
  if (!item || !name) redirect(`/l/${token}?err=name#${item}`);
  const { data } = await supabase.rpc("reserve_item", { p_token: token, p_item: item, p_name: name });
  redirect(`/l/${token}?${data ? "ok" : "taken"}=${item}#${item}`);
}

export default async function PublicListPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ ok?: string; taken?: string; err?: string }>;
}) {
  const { token } = await params;
  const sp = await searchParams;
  const list = await load(token);
  if (!list) notFound();

  const fmt = (v: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: list.currency || "EUR", maximumFractionDigits: v % 1 ? 2 : 0 }).format(v);
  const free = list.items.filter((i) => !i.reserved);
  const action = reserve.bind(null, token);

  return (
    <div className="-mt-24 sm:-mt-28">
      <section className="relative mx-[calc(50%-50vw)] flex h-[62vh] min-h-[420px] items-end overflow-hidden bg-night">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover(list.kind, 2000)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />
        <div className="relative mx-auto w-full max-w-[1200px] px-6 pb-14 text-white sm:px-10">
          <p className="text-[11px] uppercase tracking-label text-white/75">
            {list.kind === "travel" ? "Liste voyage" : "Liste maison"}
            {list.owner && ` · de la part de ${list.owner}`}
          </p>
          <h1 className="display mt-4 max-w-3xl text-5xl leading-[0.98] sm:text-7xl">{list.name}</h1>
          <p className="mt-5 max-w-xl text-white/80">
            Choisissez une idée à offrir et cliquez « Je l&apos;offre » : elle sera réservée à votre nom, pour éviter les doublons.
            {free.length > 0 && ` Il reste ${free.length} idée${free.length > 1 ? "s" : ""} disponible${free.length > 1 ? "s" : ""}.`}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] py-16">
        {sp.ok && (
          <p className="mb-8 rounded-xl2 bg-moss-soft px-5 py-4 text-moss">
            <b>Merci !</b> C&apos;est réservé à votre nom. Vous pouvez acheter l&apos;objet sur le site de la boutique.
          </p>
        )}
        {sp.taken && <p className="mb-8 rounded-xl2 bg-apricot-soft px-5 py-4 text-walnut-dark">Quelqu&apos;un vient de réserver cette idée. Choisissez-en une autre !</p>}

        {list.items.length === 0 ? (
          <p className="text-muted">La liste est encore vide.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.items.map((it) => (
              <li key={it.id} id={it.id} className={`flex scroll-mt-28 flex-col overflow-hidden rounded-xl2 border border-line bg-white shadow-soft ${it.reserved ? "opacity-60" : ""}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-paper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.image_url || illustrationFor(it.title, list.kind)} alt="" referrerPolicy="no-referrer" loading="lazy" className="h-full w-full object-cover" />
                  {it.reserved && <span className="absolute left-3 top-3 rounded-full bg-moss px-3 py-1 text-xs font-semibold text-white">🎁 Déjà offert</span>}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium leading-snug">{it.title}</p>
                    <p className="shrink-0 font-semibold">{fmt(Number(it.price) * it.quantity)}</p>
                  </div>
                  {it.room && <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted">{roomLabel(list.kind, it.room)}</p>}
                  {!it.reserved && (
                    <form action={action} className="mt-auto pt-5">
                      <input type="hidden" name="item" value={it.id} />
                      <div className="flex gap-2">
                        <input name="name" required maxLength={60} placeholder="Votre prénom" aria-label="Votre prénom" className="input !py-2 text-sm" />
                        <button className="btn-primary whitespace-nowrap !px-4 !py-2 text-sm">Je l&apos;offre</button>
                      </div>
                    </form>
                  )}
                  {it.url && (
                    <a href={it.url} target="_blank" rel="noopener noreferrer" className="mt-3 text-xs text-muted underline-offset-2 hover:text-ink hover:underline">
                      Voir l&apos;objet sur le site ↗
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-20 rounded-xl3 bg-night px-6 py-12 text-center text-bone">
          <p className="display text-3xl sm:text-4xl">Vous aussi, préparez un projet à plusieurs.</p>
          <Link href="/" className="btn mt-6 bg-bone !px-7 !py-3 text-[12px] uppercase tracking-label text-ink hover:bg-white">
            Découvrir Atelier Nama
          </Link>
        </div>
      </div>
    </div>
  );
}
