/** Compose automatiquement une pièce complète qui tient dans un budget. */

export type KitProduct = { id: number; shop: string; title: string; price: number; image_url: string; category: string };

type Slot = { cat: string; share: number; qty?: number };

/** Ce qu'il faut dans chaque pièce, et la part du budget que ça prend en général. */
export const ROOM_SLOTS: Record<string, Slot[]> = {
  salon: [
    { cat: "assises", share: 0.38 },
    { cat: "rangement", share: 0.15 },
    { cat: "tapis", share: 0.13 },
    { cat: "tables", share: 0.12 },
    { cat: "luminaires", share: 0.1 },
    { cat: "textiles", share: 0.05 },
    { cat: "deco", share: 0.04 },
    { cat: "plantes", share: 0.03 },
  ],
  chambre: [
    { cat: "lits", share: 0.45 },
    { cat: "rangement", share: 0.25 },
    { cat: "textiles", share: 0.1 },
    { cat: "miroirs", share: 0.1 },
    { cat: "luminaires", share: 0.1 },
  ],
  "salle-a-manger": [
    { cat: "tables", share: 0.4 },
    { cat: "assises", share: 0.3, qty: 4 },
    { cat: "rangement", share: 0.18 },
    { cat: "luminaires", share: 0.12 },
  ],
  cuisine: [
    { cat: "vaisselle", share: 0.35 },
    { cat: "assises", share: 0.35, qty: 2 },
    { cat: "rangement", share: 0.3 },
  ],
  "salle-de-bain": [
    { cat: "miroirs", share: 0.4 },
    { cat: "rangement", share: 0.35 },
    { cat: "textiles", share: 0.25 },
  ],
  bureau: [
    { cat: "tables", share: 0.5 },
    { cat: "assises", share: 0.35 },
    { cat: "luminaires", share: 0.15 },
  ],
  entree: [
    { cat: "rangement", share: 0.5 },
    { cat: "miroirs", share: 0.3 },
    { cat: "assises", share: 0.2 },
  ],
  exterieur: [
    { cat: "assises", share: 0.45 },
    { cat: "tables", share: 0.3 },
    { cat: "luminaires", share: 0.12 },
    { cat: "plantes", share: 0.13 },
  ],
};

export const ROOM_BUDGET: Record<string, { min: number; max: number; def: number }> = {
  salon: { min: 300, max: 5000, def: 1500 },
  chambre: { min: 250, max: 4000, def: 1200 },
  "salle-a-manger": { min: 300, max: 4000, def: 1200 },
  cuisine: { min: 100, max: 2000, def: 500 },
  "salle-de-bain": { min: 80, max: 1500, def: 350 },
  bureau: { min: 150, max: 2000, def: 600 },
  entree: { min: 80, max: 1500, def: 400 },
  exterieur: { min: 150, max: 3000, def: 800 },
};

export type KitSlot = { cat: string; qty: number; options: KitProduct[]; pick: number };

/**
 * Pour chaque besoin de la pièce, range les produits du plus proche au plus éloigné
 * de la part de budget qui lui revient : le premier est la proposition, les suivants
 * sont les alternatives qu'on fait défiler.
 */
export function buildKit(room: string, products: KitProduct[], budget: number): KitSlot[] {
  const slots = ROOM_SLOTS[room] ?? [];
  return slots
    .map((s) => {
      const qty = s.qty ?? 1;
      const target = (budget * s.share) / qty;
      const pool = products.filter((p) => p.category === s.cat);
      const scored = pool
        .map((p) => {
          // On préfère rester sous la cible ; dépasser coûte deux fois plus cher.
          const d = p.price <= target ? (target - p.price) / target : ((p.price - target) / target) * 2;
          return { p, d };
        })
        .sort((a, b) => a.d - b.d)
        .slice(0, 16)
        .map((x) => x.p);
      return { cat: s.cat, qty, options: scored, pick: 0 };
    })
    .filter((s) => s.options.length > 0);
}

export function kitTotal(slots: KitSlot[], off: Set<string>) {
  return slots.reduce((a, s) => (off.has(s.cat) ? a : a + (s.options[s.pick]?.price ?? 0) * s.qty), 0);
}
