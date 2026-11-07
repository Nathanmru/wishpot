import { publicClient } from "@/lib/supabase/public";

/** Une pièce du catalogue, telle qu'affichée sur sa page publique /piece/<id>-<slug>. */
export type PieceRow = {
  id: number;
  title: string;
  shop: string;
  price: number;
  image_url: string;
  url: string;
  room: string | null;
  category: string | null;
  style: string | null;
  niche: boolean | null;
  active: boolean;
};

const COLS = "id, title, shop, price, image_url, url, room, category, style, niche, active";

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

export const piecePath = (p: { id: number; title: string }) => `/piece/${p.id}-${slugify(p.title)}`;

/** « 123-canape-cuir » → 123 */
export const pieceId = (param: string) => {
  const n = Number(decodeURIComponent(param).split("-")[0]);
  return Number.isInteger(n) && n > 0 ? n : null;
};

export async function getPiece(id: number): Promise<PieceRow | null> {
  const { data } = await publicClient().from("products").select(COLS).eq("id", id).maybeSingle();
  return data ? ({ ...data, price: Number(data.price) } as PieceRow) : null;
}

/** Des pièces qui vont avec : même pièce de la maison, d'autres catégories d'abord, en alternant les boutiques. */
export async function companions(p: PieceRow, n = 8): Promise<PieceRow[]> {
  const sb = publicClient();
  let q = sb.from("products").select(COLS).eq("active", true).neq("id", p.id);
  if (p.room) q = q.eq("room", p.room);
  if (p.style) q = q.eq("style", p.style);
  const { data } = await q.order("niche", { ascending: false }).order("id", { ascending: false }).limit(80);
  let rows = ((data ?? []) as PieceRow[]).map((r) => ({ ...r, price: Number(r.price) }));
  if (rows.length < n && p.room) {
    const { data: more } = await sb.from("products").select(COLS).eq("active", true).eq("room", p.room).neq("id", p.id).limit(80);
    rows = [...rows, ...((more ?? []) as PieceRow[]).map((r) => ({ ...r, price: Number(r.price) }))].filter((r, i, a) => a.findIndex((x) => x.id === r.id) === i);
  }
  // une seule pièce par catégorie d'abord, celle de la pièce en dernier
  const out: PieceRow[] = [];
  const seen = new Set<string>();
  for (const r of rows) if (r.category !== p.category && !seen.has(r.category ?? "")) (out.push(r), seen.add(r.category ?? ""));
  for (const r of rows) if (out.length < n && !out.includes(r)) out.push(r);
  return out.slice(0, n);
}
