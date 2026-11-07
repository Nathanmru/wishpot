import { publicClient } from "@/lib/supabase/public";
import { piecePath } from "@/lib/piece";
import type { FeedItem } from "@/lib/pinBoards";

/**
 * Les pièces du catalogue dans les flux Pinterest : chaque pièce reçoit un jour (et une heure) de publication fixe,
 * tiré de son numéro, réparti sur un an à partir du 8 novembre 2026. Les nouvelles pièces trouvent leur place sans rien décaler.
 * Seconde main (Selency) → tableau « Pépites vintage » ; le reste → le tableau de sa pièce de la maison.
 */
const START = Date.UTC(2026, 10, 8, 5, 0);
const DAYS = 365;

const ROOMS: Record<string, string[]> = {
  salon: ["salon"],
  chambre: ["chambre"],
  "salle-a-manger": ["salle-a-manger", "cuisine"],
  entree: ["entree"],
  bureau: ["bureau"],
};

function hash(n: number, salt: number) {
  let h = (n ^ salt) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
}

export const pieceSlot = (id: number) => START + (hash(id, 0x9e37) % DAYS) * 86400000 + (hash(id, 0x7f4a) % 24) * 3600000;

type Row = { id: number; title: string; shop: string; price: number };

export async function boardPieces(board: string, now = Date.now(), limit = 25): Promise<FeedItem[]> {
  if (now < START) return [];
  const sb = publicClient();
  const rows: Row[] = [];
  for (let from = 0; from < 20000; from += 1000) {
    let q = sb.from("products").select("id, title, shop, price").eq("active", true).gt("price", 0).not("image_url", "is", null);
    if (board === "vintage") q = q.eq("shop", "Selency");
    else if (ROOMS[board]) q = q.neq("shop", "Selency").in("room", ROOMS[board]);
    else return [];
    const { data } = await q.order("id").range(from, from + 999);
    rows.push(...((data ?? []) as Row[]));
    if (!data || data.length < 1000) break;
  }
  return rows
    .map((r) => ({ r, at: pieceSlot(r.id) }))
    .filter((x) => x.at <= now)
    .sort((a, b) => b.at - a.at)
    .slice(0, limit)
    .map(({ r, at }) => ({
      path: piecePath(r),
      pin: `/piece/${r.id}/pin`,
      title: r.title,
      description: `${r.title}, ${Math.round(Number(r.price))} € chez ${r.shop}. Une trouvaille Atelier Nama, à shopper ou à mettre dans une cagnotte déco.`,
      at,
    }));
}
