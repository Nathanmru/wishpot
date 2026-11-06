import type { Metadata } from "next";
import Link from "next/link";
import { GROUPS, LANDINGS, landing, type Landing } from "@/lib/landings";
import { fetchPieces, type Piece } from "@/lib/landingPieces";
import { PACKS, pack } from "@/lib/packs";
import { publicClient } from "@/lib/supabase/public";
import VideoStudio from "@/components/VideoStudio";
import BrandVideo from "@/components/BrandVideo";

/** Page de travail (non référencée) : fabrique les vidéos TikTok / Reels « Le look complet pour X € ». */
export const metadata: Metadata = { title: "Studio vidéo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const ORDER: Landing["group"][] = ["styles", "pieces", "couleurs", "objets", "projets"];
const eur = (v: number) => `${Math.round(v).toLocaleString("fr-FR")} €`;

async function packPieces(ids: number[]) {
  const { data } = await publicClient().from("products").select("id, title, shop, price, image_url, url, category, niche").in("id", ids).eq("active", true);
  const rows = ((data ?? []) as Piece[]).map((r) => ({ ...r, price: Number(r.price) }));
  return ids.map((id) => rows.find((r) => r.id === id)).filter((r): r is Piece => !!r);
}

export default async function StudioPage({ searchParams }: { searchParams: Promise<{ p?: string; pack?: string }> }) {
  const sp = await searchParams;
  const pk = pack(sp.pack || "") ?? (sp.p ? null : PACKS[0]);
  const l = pk ? null : (landing(sp.p || "") ?? landing("salon-vintage")!);

  // Totaux des packs (pièces encore en ligne)
  const allIds = PACKS.flatMap((x) => x.ids);
  const { data: live } = await publicClient().from("products").select("id, price").in("id", allIds).eq("active", true);
  const price = new Map((live ?? []).map((r) => [r.id as number, Number(r.price)]));

  // Photos pour les vidéos de présentation : une pièce de chaque pack, puis les autres
  const all = await packPieces(allIds);
  const showcase = [...PACKS.map((x) => all.find((r) => x.ids.includes(r.id))).filter((r): r is Piece => !!r), ...all].filter((r, i, a) => a.findIndex((q) => q.id === r.id) === i).slice(0, 18);

  let pieces: Piece[];
  let title: string;
  let slug: string;
  if (pk) {
    const own = await packPieces(pk.ids);
    // de quoi remplacer une pièce vendue : d'autres pièces des autres packs
    const extra = (await packPieces(PACKS.filter((x) => x.slug !== pk.slug).flatMap((x) => x.ids))).slice(0, 12);
    pieces = [...own, ...extra];
    title = pk.name;
    slug = pk.slug;
  } else {
    pieces = (await fetchPieces(l!.filter)).filter((x) => x.price > 0 && x.image_url).slice(0, 18);
    title = l!.h1.split(" : ")[0];
    slug = l!.slug;
  }

  return (
    <div className="pt-4">
      <p className="caps text-muted">Atelier Nama · Studio vidéo</p>
      <h1 className="display mt-4 text-5xl leading-[0.95] sm:text-6xl">Tes vidéos, prêtes à publier</h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted">
        Choisis un pack (des pièces qui vont ensemble), clique sur « Créer la vidéo » : elle se joue une fois en direct pendant l&apos;enregistrement, puis tu
        la télécharges. Ajoute ensuite une musique tendance directement dans TikTok ou Instagram.
      </p>

      <section className="mt-12 border-t border-line pt-10">
        <h2 className="display text-3xl sm:text-4xl">Présenter Atelier Nama</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">Trois vidéos pour faire découvrir le site sur Instagram, TikTok et Pinterest. Choisis un script, crée la vidéo, télécharge-la.</p>
        <BrandVideo pieces={showcase} />
      </section>

      <section className="mt-16 border-t border-line pt-10">
        <h2 className="display text-3xl sm:text-4xl">Le look complet</h2>
        <p className="caps mt-4 text-[11px] text-muted">Les packs</p>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {PACKS.map((x) => {
            const ok = x.ids.filter((id) => price.has(id));
            const total = ok.reduce((a, id) => a + (price.get(id) ?? 0), 0);
            const on = pk?.slug === x.slug;
            return (
              <li key={x.slug}>
                <Link href={`/studio?pack=${x.slug}`} className={`block h-full border p-4 transition ${on ? "border-ink bg-white" : "border-line hover:border-ink/40"}`}>
                  <span className="caps block text-[10px] text-muted">{x.room}</span>
                  <span className="display mt-1 block text-xl leading-tight">{x.name}</span>
                  <span className="mt-2 block text-xs text-muted">{x.mood}</span>
                  <span className="mt-3 block text-sm">
                    {eur(total)} · {ok.length} pièces{ok.length < x.ids.length ? ` (${x.ids.length - ok.length} vendue${x.ids.length - ok.length > 1 ? "s" : ""})` : ""}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <details className="mt-8 border-y border-line py-4">
        <summary className="caps cursor-pointer text-[11px]">Ou partir d&apos;une page « Idées »{l ? ` — ${title}` : ""}</summary>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ORDER.map((g) => (
            <div key={g}>
              <p className="caps text-[10px] text-muted">{GROUPS[g]}</p>
              <ul className="mt-2 space-y-1 text-sm">
                {LANDINGS.filter((x) => x.group === g).map((x) => (
                  <li key={x.slug}>
                    <Link href={`/studio?p=${x.slug}`} className={x.slug === l?.slug ? "font-medium underline" : "hover:underline"}>
                      {x.h1.split(" : ")[0]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>

      <VideoStudio key={slug} slug={slug} title={title} pieces={pieces} initial={pk?.ids} kicker={pk ? `PACK ${pk.room.toUpperCase()}` : "IDÉE DÉCO"} />
    </div>
  );
}
