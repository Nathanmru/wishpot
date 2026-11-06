import { publicClient } from "@/lib/supabase/public";
import { siteUrl } from "@/lib/config";
import type { Landing, LandingFilter } from "@/lib/landings";

export type Piece = { id: number; title: string; shop: string; price: number; image_url: string; url: string; category: string; niche: boolean | null };
type Row = Piece;

/** Les pièces d'une page « idées » : filtrées, pépites d'abord, en alternant les maisons. */
export async function fetchPieces(f: LandingFilter): Promise<Row[]> {
  const sb = publicClient();
  let q = sb.from("products").select("id, title, shop, price, image_url, url, category, niche").eq("active", true);
  if (f.room) q = q.eq("room", f.room);
  if (f.cats?.length) q = q.in("category", f.cats);
  if (f.style) q = q.eq("style", f.style);
  if (f.colors?.length) q = q.in("color", f.colors);
  if (f.shop) q = q.eq("shop", f.shop);
  if (f.maxPrice) q = q.lte("price", f.maxPrice);
  for (const g of f.all ?? []) q = q.or(g.map((w) => `search.ilike."*${w}*"`).join(","));
  const { data } = await q.order("niche", { ascending: false }).order("id", { ascending: false }).limit(240);
  const rows = ((data ?? []) as Row[]).map((r) => ({ ...r, price: Number(r.price) }));
  // On alterne les maisons pour une vitrine variée
  const byShop = new Map<string, Row[]>();
  for (const r of rows) byShop.set(r.shop, [...(byShop.get(r.shop) ?? []), r]);
  const lanes = [...byShop.values()];
  const out: Row[] = [];
  for (let i = 0; out.length < Math.min(rows.length, 24); i++) {
    let added = false;
    for (const lane of lanes) if (lane[i] && out.length < 24) (out.push(lane[i]), (added = true));
    if (!added) break;
  }
  return out;
}

/** Lien Pinterest « Épingler » avec l'image verticale de la page. */
export function pinUrl(l: Landing) {
  const base = siteUrl();
  const page = `${base}/idees/${l.slug}`;
  const media = `${base}/idees/${l.slug}/pin`;
  const text = `${l.h1.split(" : ")[0]} — ${l.description}`;
  return `https://www.pinterest.fr/pin/create/button/?url=${encodeURIComponent(page)}&media=${encodeURIComponent(media)}&description=${encodeURIComponent(text)}`;
}
