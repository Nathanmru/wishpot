import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/supabase/server";
import { fetchProduct, isSafeUrl } from "@/lib/extract";
import { illustrationFor } from "@/lib/itemImage";
import { guessRoom } from "@/lib/rooms";
import { cover } from "@/lib/covers";
import type { Kind } from "@/lib/config";

export const metadata = { title: "Ajouter depuis le partage" };
export const maxDuration = 20;

type Search = { title?: string; text?: string; url?: string };

async function addShared(formData: FormData) {
  "use server";
  const { supabase, user } = await getUser();
  if (!user) redirect("/login");
  const projectId = String(formData.get("project") || "");
  const kind: Kind = formData.get("kind_" + projectId) === "travel" ? "travel" : "home";
  const title = String(formData.get("title") || "—").trim().slice(0, 200) || "—";
  const url = String(formData.get("url") || "");
  const img = String(formData.get("img") || "");
  const price = parseFloat(String(formData.get("price") || "0").replace(",", ".")) || 0;
  await supabase.from("items").insert({
    project_id: projectId,
    added_by: user.id,
    title,
    price: Math.max(0, Math.round(price * 100) / 100),
    quantity: 1,
    url: url && isSafeUrl(url) ? url : null,
    image_url: /^https:\/\//.test(img) ? img : null,
    room: guessRoom(title, kind),
  });
  revalidatePath(`/p/${projectId}`);
  redirect(`/p/${projectId}#liste`);
}

export default async function SharePage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const { supabase, user } = await getUser();
  if (!user) redirect("/login");

  // Les applis mettent le lien tantôt dans "url", tantôt dans le texte partagé.
  const raw = [sp.url, sp.text, sp.title].filter(Boolean).join(" ");
  const link = (raw.match(/https?:\/\/[^\s<>"']+/i)?.[0] ?? "").replace(/[).,;!?]+$/, "");

  const product = link
    ? await fetchProduct(link).catch(() => null)
    : null;
  const title = (product?.title || sp.title || "").slice(0, 200);

  const { data } = await supabase.from("projects").select("id, name, kind").order("created_at", { ascending: false });
  const projects = (data ?? []) as { id: string; name: string; kind: Kind }[];

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-[11px] uppercase tracking-label text-muted">Ajouter depuis le partage</p>

      {!link ? (
        <div className="mt-6 rounded-xl3 border border-line bg-white p-8">
          <p className="display text-3xl">Aucun lien reçu</p>
          <p className="mt-3 text-muted">Partage une page produit depuis ton navigateur ou l&apos;appli d&apos;une boutique, puis choisis Wishpot.</p>
          <Link href="/dashboard" className="btn-primary mt-6">Mes cagnottes</Link>
        </div>
      ) : projects.length === 0 ? (
        <div className="mt-6 rounded-xl3 border border-line bg-white p-8">
          <p>Crée d&apos;abord une cagnotte, puis partage à nouveau ce lien.</p>
          <Link href="/new" className="btn-primary mt-6">Créer une cagnotte</Link>
        </div>
      ) : (
        <form action={addShared} className="mt-6 overflow-hidden rounded-xl3 border border-line bg-white shadow-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product?.image || illustrationFor(title)}
            alt=""
            referrerPolicy="no-referrer"
            className="aspect-[4/3] w-full bg-paper object-cover"
          />
          <div className="space-y-4 p-5">
            {product?.site && <p className="text-xs font-medium text-muted">{product.site}</p>}
            <div>
              <label className="label" htmlFor="sh-title">Nom</label>
              <input id="sh-title" name="title" required defaultValue={title} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="sh-price">Prix (€)</label>
              <input
                id="sh-price"
                name="price"
                inputMode="decimal"
                required
                defaultValue={product?.price != null ? String(product.price) : ""}
                placeholder={product?.price == null ? "Ce site ne donne pas son prix : indique-le" : ""}
                className="input"
              />
            </div>
            <input type="hidden" name="url" value={product?.url || link} />
            <input type="hidden" name="img" value={product?.image || ""} />

            <fieldset>
              <legend className="label">Dans quelle cagnotte ?</legend>
              <div className="mt-2 space-y-2">
                {projects.map((p, i) => (
                  <label key={p.id} className="flex cursor-pointer items-center gap-3 rounded-xl2 border border-line p-2 has-[:checked]:border-ink">
                    <input type="radio" name="project" value={p.id} defaultChecked={i === 0} className="accent-[#15120F]" />
                    <input type="hidden" name={`kind_${p.id}`} value={p.kind} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cover(p.kind, 200)} alt="" className="h-10 w-14 rounded-lg object-cover" />
                    <span className="flex-1 font-medium">{p.name}</span>
                    <span className="text-[11px] uppercase tracking-label text-muted">{p.kind === "travel" ? "Voyage" : "Maison"}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button className="btn-primary w-full !py-3.5">Ajouter à la liste</button>
          </div>
        </form>
      )}
    </div>
  );
}
