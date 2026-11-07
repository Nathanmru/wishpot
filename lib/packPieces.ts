import { publicClient } from "@/lib/supabase/public";
import type { Piece } from "@/lib/landingPieces";

/** Les pièces d'un look, dans l'ordre du look, en ne gardant que celles encore en vente. */
export async function packPieces(ids: number[]): Promise<Piece[]> {
  const { data } = await publicClient().from("products").select("id, title, shop, price, image_url, url, category, niche").in("id", ids).eq("active", true);
  const rows = ((data ?? []) as Piece[]).map((r) => ({ ...r, price: Number(r.price) }));
  return ids.map((id) => rows.find((r) => r.id === id)).filter((r): r is Piece => !!r);
}

export const eur = (v: number) => `${Math.round(v).toLocaleString("fr-FR")} €`;
