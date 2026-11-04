import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ROOM_SLOTS } from "@/lib/roomkit";

export const revalidate = 3600;

/** Les produits utiles pour composer une pièce (ceux de la pièce, complétés si une famille manque). */
export async function GET(req: Request) {
  const room = new URL(req.url).searchParams.get("room") || "salon";
  const slots = ROOM_SLOTS[room];
  if (!slots) return NextResponse.json({ products: [] }, { status: 400 });
  const cats = slots.map((s) => s.cat);
  const supabase = await createClient();
  const cols = "id, shop, title, price, image_url, category";

  const { data } = await supabase.from("products").select(cols).eq("active", true).eq("room", room).in("category", cats).limit(400);
  const products = data ?? [];
  const missing = cats.filter((c) => !products.some((p) => p.category === c));
  if (missing.length) {
    const { data: more } = await supabase.from("products").select(cols).eq("active", true).in("category", missing).limit(80);
    products.push(...(more ?? []));
  }
  return NextResponse.json({ products }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
