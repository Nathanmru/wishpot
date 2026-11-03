import Link from "next/link";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/supabase/server";
import { isSafeUrl } from "@/lib/extract";
import { CLASSICS, NICHE, TRENDS, activitiesUrl, bookingUrl, type Destination } from "@/lib/inspiration";
import { MONTHS, euro, goUrl } from "@/components/InspirationBits";

/** Ajoute une pièce repérée dans l'inspiration directement à cette cagnotte. */
async function addPiece(projectId: string, formData: FormData) {
  "use server";
  const { supabase, user } = await getUser();
  if (!user) return;
  const url = String(formData.get("url") || "");
  const img = String(formData.get("img") || "");
  const price = parseFloat(String(formData.get("price") || "0")) || 0;
  await supabase.from("items").insert({
    project_id: projectId,
    added_by: user.id,
    title: String(formData.get("title") || "—").slice(0, 200),
    price: Math.max(0, Math.round(price * 100) / 100),
    quantity: 1,
    url: url && isSafeUrl(url) ? url : null,
    image_url: /^https:\/\//.test(img) ? img : null,
  });
  revalidatePath(`/p/${projectId}`);
}

/** Bloc « Inspiration » d'une cagnotte : déco pour une cagnotte maison, destinations pour une cagnotte voyage. */
export default function ProjectInspiration({
  projectId,
  kind,
  existingUrls = [],
}: {
  projectId: string;
  kind: "home" | "travel";
  existingUrls?: string[];
}) {
  return kind === "home" ? <HomeIdeas projectId={projectId} existingUrls={existingUrls} /> : <TravelIdeas />;
}

function Header({ kicker, title, href, cta }: { kicker: string; title: string; href: string; cta: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-[11px] uppercase tracking-label text-muted">{kicker}</p>
        <h2 className="display mt-2 text-4xl">{title}</h2>
      </div>
      <Link href={href} className="border-b border-ink pb-0.5 text-[11px] uppercase tracking-label hover:opacity-60">
        {cta} →
      </Link>
    </div>
  );
}

function HomeIdeas({ projectId, existingUrls }: { projectId: string; existingUrls: string[] }) {
  // Une pièce phare par tendance, pour un aperçu varié.
  const picks = TRENDS.map((t) => ({ ...t.products[0], trend: t.title }));
  const action = addPiece.bind(null, projectId);

  return (
    <section className="border-y border-line py-10">
      <Header kicker="Inspiration déco · Saison 2026" title="Les pièces du moment" href="/inspiration/maison" cta="Toutes les tendances" />
      <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4">
        {picks.map((p) => {
          const added = existingUrls.includes(p.url);
          return (
            <li key={p.url} className="group flex w-[70%] shrink-0 snap-start flex-col sm:w-auto">
              <a href={goUrl(p.url)} target="_blank" rel="noopener sponsored" className="relative block overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="aspect-square w-full object-contain p-5 mix-blend-multiply transition duration-700 group-hover:scale-[1.05]"
                />
                <span className="absolute left-2.5 top-2.5 bg-paper/90 px-2 py-1 text-[9px] uppercase tracking-label">{p.trend}</span>
              </a>
              <p className="mt-3 line-clamp-2 text-[12px] uppercase leading-snug tracking-[0.08em]">{p.name}</p>
              <p className="mt-1 text-sm text-muted">
                {euro(p.price)} · {p.shop}
              </p>
              <div className="mt-auto flex items-center gap-4 pt-3 text-[11px] uppercase tracking-label">
                {added ? (
                  <span className="text-moss">✓ Dans la liste</span>
                ) : (
                  <form action={action}>
                    <input type="hidden" name="title" value={p.name} />
                    <input type="hidden" name="url" value={p.url} />
                    <input type="hidden" name="price" value={p.price} />
                    <input type="hidden" name="img" value={p.img} />
                    <button className="border-b border-ink pb-0.5 uppercase tracking-label hover:opacity-60">+ Ajouter</button>
                  </form>
                )}
                <a href={goUrl(p.url)} target="_blank" rel="noopener sponsored" className="text-muted hover:text-ink">
                  Voir ↗
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function TravelIdeas() {
  // Les destinations dont la bonne saison arrive : ce mois-ci et les deux suivants.
  const now = new Date().getMonth() + 1;
  const soon = [now, (now % 12) + 1, ((now + 1) % 12) + 1];
  const all = [...NICHE, ...CLASSICS];
  const inSeason = all.filter((d) => d.months.some((m) => soon.includes(m)));
  const picks: Destination[] = [...inSeason, ...all.filter((d) => !inSeason.includes(d))].slice(0, 3);

  return (
    <section className="border-y border-line py-10">
      <Header kicker={`Inspiration voyage · Idéal en ${MONTHS[now - 1].toLowerCase()} et après`} title="Où partir bientôt" href="/inspiration/voyage" cta="Toutes les destinations" />
      <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
        {picks.map((d) => (
          <li key={d.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
            <article className="group relative h-[340px] overflow-hidden bg-night text-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.img} alt={`${d.name}, ${d.country}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-[1400ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[10px] uppercase tracking-label text-white/70">{d.country}</p>
                <Link href={`/inspiration/voyage#${d.id}`} className="display mt-1 block text-3xl leading-none hover:underline">
                  {d.name}
                </Link>
                <p className="mt-2 text-xs text-white/75">
                  {[...d.months].sort((a, b) => a - b).map((m) => MONTHS[m - 1]).join(", ")} · {d.flight}
                </p>
                <div className="mt-4 flex gap-4 text-[10px] uppercase tracking-label">
                  <a href={goUrl(bookingUrl(d.search))} target="_blank" rel="noopener sponsored" className="border-b border-white/70 pb-0.5 hover:opacity-70">
                    Hébergements ↗
                  </a>
                  <a href={goUrl(activitiesUrl(d.search))} target="_blank" rel="noopener sponsored" className="border-b border-white/70 pb-0.5 hover:opacity-70">
                    Activités ↗
                  </a>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
