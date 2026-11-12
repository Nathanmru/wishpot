import { publicClient } from "@/lib/supabase/public";
import { siteUrl } from "@/lib/config";
import type { Landing, LandingFilter } from "@/lib/landings";

export type Piece = { id: number; title: string; shop: string; price: number; image_url: string; url: string; category: string; niche: boolean | null };
type Row = Piece;

/** Selency est notre partenaire principal (affiliation 8 %) : ses pièces passent en premier et occupent une place sur deux. */
export const PARTNER = "Selency";

/** Les pièces d'une page « idées » : filtrées, pépites d'abord, Selency en tête, en alternant les maisons. */
export async function fetchPieces(f: LandingFilter, max = 24): Promise<Row[]> {
  const sb = publicClient();
  const base = () => {
    let q = sb.from("products").select("id, title, shop, price, image_url, url, category, niche").eq("active", true);
    if (f.room) q = q.eq("room", f.room);
    if (f.cats?.length) q = q.in("category", f.cats);
    if (f.style) q = q.eq("style", f.style);
    if (f.colors?.length) q = q.in("color", f.colors);
    if (f.maxPrice) q = q.lte("price", f.maxPrice);
    for (const g of f.all ?? []) q = q.or(g.map((w) => `search.ilike."*${w}*"`).join(","));
    return q;
  };
  const clean = (d: unknown) => ((d ?? []) as Row[]).map((r) => ({ ...r, price: Number(r.price) }));

  if (f.shop) {
    const { data } = await base().eq("shop", f.shop).order("niche", { ascending: false }).order("id", { ascending: false }).limit(max);
    return clean(data);
  }

  const [{ data: partner }, { data: rest }] = await Promise.all([
    base().eq("shop", PARTNER).order("niche", { ascending: false }).order("id", { ascending: false }).limit(max),
    base().neq("shop", PARTNER).order("niche", { ascending: false }).order("id", { ascending: false }).limit(240),
  ]);
  // Les autres maisons, en alternance pour une vitrine variée
  const byShop = new Map<string, Row[]>();
  for (const r of clean(rest)) byShop.set(r.shop, [...(byShop.get(r.shop) ?? []), r]);
  const lanes = [...byShop.values()];
  const others: Row[] = [];
  for (let i = 0; others.length < max; i++) {
    let added = false;
    for (const lane of lanes) if (lane[i] && others.length < max) (others.push(lane[i]), (added = true));
    if (!added) break;
  }
  // Une pièce Selency, une pièce d'une autre maison, et ainsi de suite
  const sel = clean(partner);
  const out: Row[] = [];
  for (let i = 0; out.length < max && (i < sel.length || i < others.length); i++) {
    if (sel[i]) out.push(sel[i]);
    if (others[i] && out.length < max) out.push(others[i]);
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
