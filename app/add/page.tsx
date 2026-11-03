import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/supabase/server";
import { isSafeUrl } from "@/lib/extract";
import { cover } from "@/lib/covers";
import type { Kind } from "@/lib/config";

export const metadata = { title: "Ajouter à une cagnotte" };

type Search = { title?: string; url?: string; price?: string; img?: string; kind?: string };

async function addTo(formData: FormData) {
  "use server";
  const { supabase, user } = await getUser();
  if (!user) redirect("/login");
  const projectId = String(formData.get("project") || "");
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
  redirect(`/p/${projectId}`);
}

export default async function AddPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const { supabase, user } = await getUser();
  if (!user) redirect("/login");
  const kind: Kind = sp.kind === "travel" ? "travel" : "home";
  const title = (sp.title || "").slice(0, 200);

  const { data } = await supabase.from("projects").select("id, name, kind").order("created_at", { ascending: false });
  const projects = ((data ?? []) as { id: string; name: string; kind: Kind }[]).sort((a, b) => Number(b.kind === kind) - Number(a.kind === kind));

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-[11px] uppercase tracking-label text-muted">Ajouter à une cagnotte</p>
      <h1 className="display mt-3 text-4xl leading-tight sm:text-5xl">{title || "Nouvel objet"}</h1>
      {sp.price && <p className="mt-2 text-muted">{Number(sp.price).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</p>}

      {projects.length === 0 ? (
        <div className="mt-10 border border-line bg-white p-8">
          <p>Tu n&apos;as pas encore de cagnotte. Crée-la d&apos;abord, puis reviens ajouter cette idée.</p>
          <Link href={`/new?kind=${kind}`} className="btn-primary mt-6 !px-7 !py-3.5 text-[12px] uppercase tracking-label">
            Créer une cagnotte
          </Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-3">
          {projects.map((p) => (
            <li key={p.id}>
              <form action={addTo}>
                <input type="hidden" name="project" value={p.id} />
                <input type="hidden" name="title" value={title} />
                <input type="hidden" name="url" value={sp.url || ""} />
                <input type="hidden" name="price" value={sp.price || ""} />
                <input type="hidden" name="img" value={sp.img || ""} />
                <button className="group flex w-full items-center gap-5 border border-line bg-white p-3 text-left transition hover:border-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover(p.kind, 300)} alt="" className="h-16 w-20 object-cover" />
                  <span className="flex-1">
                    <span className="block font-display text-2xl">{p.name}</span>
                    <span className="text-[11px] uppercase tracking-label text-muted">{p.kind === "travel" ? "Voyage" : "Maison"}</span>
                  </span>
                  <span className="pr-3 text-[11px] uppercase tracking-label transition group-hover:translate-x-1">Ajouter</span>
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
