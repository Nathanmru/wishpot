import { LANDINGS, type Landing } from "@/lib/landings";

/**
 * Tableaux Pinterest d'Atelier Nama et les pages « idées » qui vont dans chacun.
 * Chaque tableau a son flux RSS (/flux/<slug>) que Pinterest lit tout seul pour publier les épingles.
 */
export const PIN_BOARDS: { slug: string; name: string; ideas: string[] }[] = [
  { slug: "salon", name: "Salon : idées déco & meubles", ideas: ["salon-vintage", "salon-boheme", "canape-cuir-vintage", "canape-bouclette", "fauteuil-vintage", "table-basse-travertin-marbre", "table-basse-bois", "tapis-berbere", "lampadaire-design", "deco-japandi", "deco-scandinave"] },
  { slug: "chambre", name: "Chambre cocooning", ideas: ["chambre-boheme", "chambre-cosy", "linge-de-lit-lin", "deco-beige-lin", "suspension-rotin-papier", "deco-vert-sauge"] },
  { slug: "salle-a-manger", name: "Salle à manger & cuisine", ideas: ["salle-a-manger-chic", "chaise-cannage", "buffet-vintage", "vase-ceramique", "deco-terracotta"] },
  { slug: "entree", name: "Entrée & couloir", ideas: ["deco-entree", "miroir-dore", "miroir-vintage", "tapis-jute"] },
  { slug: "bureau", name: "Coin bureau à la maison", ideas: ["bureau-design", "lampe-laiton", "deco-industrielle", "deco-noir-laiton"] },
  { slug: "vintage", name: "Pépites vintage & seconde main", ideas: ["deco-vintage", "meubles-chines", "fauteuil-rotin", "deco-art-deco", "deco-parisienne", "deco-cognac-camel", "deco-boheme"] },
  { slug: "premier-appartement", name: "Premier appartement : looks complets", ideas: ["premier-appartement", "cagnotte-deco", "liste-cremaillere", "deco-petit-budget"] },
];

/** Pages déjà épinglées à la main (une par tableau) : on ne les remet pas dans les flux, pour éviter les doublons. */
export const PINNED_BY_HAND = ["salon-vintage", "chambre-boheme", "salle-a-manger-chic", "deco-entree", "bureau-design", "deco-vintage", "cagnotte-deco"];

/** Début de la diffusion (une épingle par tableau tout de suite) puis une toutes les 8 h, tous tableaux confondus : ~3 par jour. */
const START = Date.UTC(2026, 10, 7, 9, 0);
const EVERY = 8 * 3600 * 1000;

/** Ordre de publication : on alterne les tableaux pour que le profil reste varié. */
function schedule(): Map<string, number> {
  const out = new Map<string, number>();
  const queues = PIN_BOARDS.map((b) => b.ideas.filter((s) => !PINNED_BY_HAND.includes(s)));
  let k = 0;
  while (queues.some((q) => q.length)) {
    for (const q of queues) {
      const s = q.shift();
      if (s) out.set(s, START + Math.max(0, k++ - PIN_BOARDS.length + 1) * EVERY);
    }
  }
  return out;
}

/** Les pages « idées » d'un tableau déjà « publiées » (date passée), les plus récentes d'abord. */
export function boardItems(board: string, now = Date.now()): { l: Landing; at: number }[] {
  const b = PIN_BOARDS.find((x) => x.slug === board);
  if (!b) return [];
  const when = schedule();
  return b.ideas
    .filter((s) => when.has(s))
    .map((s) => ({ l: LANDINGS.find((x) => x.slug === s), at: when.get(s)! }))
    .filter((x): x is { l: Landing; at: number } => !!x.l && x.at <= now)
    .sort((a, b) => b.at - a.at);
}
