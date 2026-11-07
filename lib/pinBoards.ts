import { LANDINGS } from "@/lib/landings";
import { pack } from "@/lib/packs";

/**
 * Tableaux Pinterest d'Atelier Nama et les pages « idées » qui vont dans chacun.
 * Chaque tableau a son flux RSS (/flux/<slug>) que Pinterest lit tout seul pour publier les épingles.
 * « look:xxx » = une page « Le look complet » (/looks/xxx), le reste = une page « idées » (/idees/xxx).
 */
export const PIN_BOARDS: { slug: string; name: string; ideas: string[] }[] = [
  { slug: "salon", name: "Salon : idées déco & meubles", ideas: ["salon-vintage", "look:salon-japandi", "salon-boheme", "look:salon-cognac", "canape-cuir-vintage", "canape-bouclette", "fauteuil-vintage", "look:salon-boheme", "table-basse-travertin-marbre", "look:salon-ambre", "table-basse-bois", "tapis-berbere", "lampadaire-design", "deco-japandi", "deco-scandinave"] },
  { slug: "chambre", name: "Chambre cocooning", ideas: ["chambre-boheme", "look:chambre-lin", "chambre-cosy", "linge-de-lit-lin", "deco-beige-lin", "suspension-rotin-papier", "deco-vert-sauge"] },
  { slug: "salle-a-manger", name: "Salle à manger & cuisine", ideas: ["salle-a-manger-chic", "look:salle-a-manger", "chaise-cannage", "buffet-vintage", "vase-ceramique", "deco-terracotta"] },
  { slug: "entree", name: "Entrée & couloir", ideas: ["deco-entree", "look:entree", "miroir-dore", "miroir-vintage", "tapis-jute"] },
  { slug: "bureau", name: "Coin bureau à la maison", ideas: ["bureau-design", "look:coin-bureau", "lampe-laiton", "deco-industrielle", "deco-noir-laiton"] },
  { slug: "vintage", name: "Pépites vintage & seconde main", ideas: ["deco-vintage", "meubles-chines", "fauteuil-rotin", "deco-art-deco", "deco-parisienne", "deco-cognac-camel", "deco-boheme"] },
  { slug: "premier-appartement", name: "Premier appartement : looks complets", ideas: ["premier-appartement", "cagnotte-deco", "look:premier-appart", "liste-cremaillere", "deco-petit-budget"] },
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

export type FeedItem = { path: string; title: string; description: string; at: number };

function item(key: string, at: number): FeedItem | null {
  if (key.startsWith("look:")) {
    const p = pack(key.slice(5));
    return p ? { path: `/looks/${p.slug}`, title: `Le look complet : ${p.name}`, description: `${p.mood}. Toutes les pièces du look, avec le prix total, à shopper ou à mettre en cagnotte.`, at } : null;
  }
  const l = LANDINGS.find((x) => x.slug === key);
  return l ? { path: `/idees/${l.slug}`, title: l.h1.split(" : ")[0], description: l.description, at } : null;
}

/** Les épingles d'un tableau déjà « publiées » (date passée), les plus récentes d'abord. */
export function boardItems(board: string, now = Date.now()): FeedItem[] {
  const b = PIN_BOARDS.find((x) => x.slug === board);
  if (!b) return [];
  const when = schedule();
  return b.ideas
    .filter((s) => when.has(s) && when.get(s)! <= now)
    .map((s) => item(s, when.get(s)!))
    .filter((x): x is FeedItem => !!x)
    .sort((a, b) => b.at - a.at);
}
