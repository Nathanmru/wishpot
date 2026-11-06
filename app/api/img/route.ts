import { publicClient } from "@/lib/supabase/public";

/**
 * Photo d'une pièce du catalogue, servie depuis notre domaine (?id=123).
 * Sert au studio vidéo : une image venue d'un autre site ne peut pas être enregistrée dans une vidéo par le navigateur.
 * On ne sert que les photos des produits du catalogue (jamais une adresse libre).
 */
export async function GET(req: Request) {
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) return new Response("Bad request", { status: 400 });
  const { data } = await publicClient().from("products").select("image_url").eq("id", id).maybeSingle();
  const src = data?.image_url as string | undefined;
  if (!src || !/^https:\/\//.test(src)) return new Response("Not found", { status: 404 });
  try {
    const res = await fetch(src, { headers: { "user-agent": "Mozilla/5.0 AtelierNama/1.0", accept: "image/*" } });
    const type = res.headers.get("content-type") || "";
    if (!res.ok || !type.startsWith("image/")) return new Response("Not found", { status: 404 });
    const buf = await res.arrayBuffer();
    if (buf.byteLength > 8_000_000) return new Response("Too large", { status: 413 });
    return new Response(buf, { headers: { "content-type": type, "cache-control": "public, max-age=86400, s-maxage=604800" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
