/** Catalogue : pièces, familles de produits et « essentiels » de chaque pièce. */

export type Product = {
  id: number;
  shop: string;
  title: string;
  price: number;
  image_url: string;
  url: string;
  room: string;
  category: string;
  style?: string | null;
  color?: string | null;
  niche?: boolean | null;
};

const U = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export const CATALOG_ROOMS = [
  { id: "salon", fr: "Salon", en: "Living room", img: U("1687877954051-3c24d2c60c7d") },
  { id: "chambre", fr: "Chambre", en: "Bedroom", img: U("1522771739844-6a9f6d5f14af") },
  { id: "salle-a-manger", fr: "Salle à manger", en: "Dining room", img: U("1617806118233-18e1de247200") },
  { id: "cuisine", fr: "Cuisine", en: "Kitchen", img: U("1556911220-bff31c812dba") },
  { id: "salle-de-bain", fr: "Salle de bain", en: "Bathroom", img: U("1552321554-5fefe8c9ef14") },
  { id: "bureau", fr: "Bureau", en: "Study", img: U("1593062096033-9a26b09da705") },
  { id: "entree", fr: "Entrée", en: "Hallway", img: U("1600210492486-724fe5c67fb0") },
  { id: "exterieur", fr: "Balcon & jardin", en: "Outdoor", img: U("1600585154340-be6161a56a0c") },
] as const;

export type RoomId = (typeof CATALOG_ROOMS)[number]["id"];

export const CATEGORIES: Record<string, { fr: string; en: string }> = {
  assises: { fr: "Canapés & assises", en: "Seating" },
  tables: { fr: "Tables", en: "Tables" },
  rangement: { fr: "Rangement", en: "Storage" },
  lits: { fr: "Lits", en: "Beds" },
  luminaires: { fr: "Luminaires", en: "Lighting" },
  tapis: { fr: "Tapis", en: "Rugs" },
  textiles: { fr: "Textiles", en: "Textiles" },
  miroirs: { fr: "Miroirs", en: "Mirrors" },
  deco: { fr: "Objets déco", en: "Decor" },
  art: { fr: "Cadres & affiches", en: "Wall art" },
  plantes: { fr: "Plantes & pots", en: "Plants" },
  vaisselle: { fr: "Arts de la table", en: "Tableware" },
};

/** Ce qu'il faut pour qu'une pièce soit « faite ». */
export const ESSENTIALS: Record<string, string[]> = {
  salon: ["assises", "tables", "tapis", "luminaires", "rangement", "textiles", "deco"],
  chambre: ["lits", "rangement", "textiles", "luminaires", "miroirs"],
  "salle-a-manger": ["tables", "assises", "luminaires", "rangement"],
  cuisine: ["vaisselle", "assises"],
  "salle-de-bain": ["textiles", "miroirs", "rangement"],
  bureau: ["tables", "assises", "luminaires"],
  entree: ["rangement", "miroirs", "assises"],
  exterieur: ["assises", "tables", "luminaires", "plantes"],
};

export function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/œ/g, "oe")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const PRICE_STEPS = [50, 100, 250, 500, 1000];

/** Les styles, devinés à partir des matières et des formes. */
export const STYLES: { id: string; fr: string; en: string; hint: string; img: string }[] = [
  { id: "vintage", fr: "Vintage & cuir", en: "Vintage & leather", hint: "Cuir patiné, teck, pièces chinées", img: U("1606425288528-4cebbfc69de7", 900) },
  { id: "boheme", fr: "Bohème", en: "Boho", hint: "Rotin, jute, macramé", img: U("1558603668-6570496b66f8", 900) },
  { id: "art-deco", fr: "Art déco", en: "Art deco", hint: "Laiton, marbre, velours, arches", img: U("1563219125-1db796e20ff2", 900) },
  { id: "naturel", fr: "Naturel & japandi", en: "Natural & japandi", hint: "Lin, grès, travertin", img: U("1512972972907-6d71529c5e92", 900) },
  { id: "scandinave", fr: "Scandinave", en: "Scandinavian", hint: "Chêne clair, lignes simples", img: U("1609081144289-eacc3108cd03", 900) },
  { id: "classique", fr: "Classique parisien", en: "Parisian classic", hint: "Moulures, bistrot, capitonné", img: U("1785441513847-aa6a6576b99e", 900) },
  { id: "industriel", fr: "Industriel", en: "Industrial", hint: "Métal noir, béton, atelier", img: U("1783990349147-906f62b882c1", 900) },
  { id: "contemporain", fr: "Contemporain", en: "Contemporary", hint: "Formes nettes, tons doux", img: U("1605774337664-7a846e9cdf17", 900) },
];

/** Les couleurs dominantes et leur nuancier. */
export const COLORS: { id: string; fr: string; en: string; hex: string }[] = [
  { id: "beige", fr: "Beige & lin", en: "Beige & linen", hex: "#E3D7C3" },
  { id: "blanc", fr: "Blanc", en: "White", hex: "#F7F4EE" },
  { id: "bois", fr: "Bois clair", en: "Light wood", hex: "#C9A57B" },
  { id: "brun", fr: "Cognac & noyer", en: "Cognac & walnut", hex: "#8A5530" },
  { id: "terracotta", fr: "Terracotta", en: "Terracotta", hex: "#B8623E" },
  { id: "jaune", fr: "Moutarde", en: "Mustard", hex: "#D2A23A" },
  { id: "rose", fr: "Rose poudré", en: "Dusty pink", hex: "#D9A9A0" },
  { id: "rouge", fr: "Bordeaux", en: "Burgundy", hex: "#7E2C2C" },
  { id: "vert", fr: "Vert sauge & olive", en: "Sage & olive", hex: "#8C9A76" },
  { id: "bleu", fr: "Bleu", en: "Blue", hex: "#3F5C7A" },
  { id: "gris", fr: "Gris", en: "Grey", hex: "#A3A3A0" },
  { id: "noir", fr: "Noir", en: "Black", hex: "#1F1D1B" },
  { id: "dore", fr: "Laiton & doré", en: "Brass & gold", hex: "#B8954F" },
];

/**
 * La recherche comprend les synonymes, le pluriel et l'anglais des marques nordiques :
 * chaque mot devient une liste de variantes, dont une au moins doit apparaître.
 */
const SYNONYMS: string[][] = [
  ["canape", "sofa", "banquette", "meridienne"],
  ["fauteuil", "armchair", "lounge chair", "bergere"],
  ["chaise", "chair"],
  ["tabouret", "stool"],
  ["lampe", "lamp", "luminaire", "lampadaire", "suspension", "applique", "baladeuse"],
  ["suspension", "pendant", "plafonnier"],
  ["tapis", "rug", "kilim"],
  ["miroir", "mirror"],
  ["coussin", "cushion"],
  ["plaid", "throw", "couverture", "blanket"],
  ["vase", "soliflore"],
  ["bougie", "candle", "bougeoir", "photophore"],
  ["etagere", "shelf", "bibliotheque", "shelving"],
  ["table basse", "coffee table"],
  ["bureau", "desk"],
  ["lit", "bed", "tete de lit", "headboard"],
  ["assiette", "plate"],
  ["verre", "glass", "verres"],
  ["tasse", "mug", "cup"],
  ["bol", "bowl"],
  ["plateau", "tray"],
  ["panier", "basket", "corbeille"],
  ["rotin", "rattan", "osier", "wicker", "cannage", "cane"],
  ["cuir", "leather"],
  ["lin", "linen"],
  ["laine", "wool"],
  ["chene", "oak"],
  ["noyer", "walnut"],
  ["laiton", "brass", "dore"],
  ["marbre", "marble"],
  ["velours", "velvet"],
  ["ceramique", "ceramic", "gres", "stoneware"],
  ["verre", "glass"],
  ["noir", "black"],
  ["blanc", "white"],
  ["vert", "green", "sauge", "sage", "olive", "kaki"],
  ["bleu", "blue"],
  ["rose", "pink"],
  ["beige", "sable", "sand", "ecru", "creme"],
  ["vintage", "retro", "annees", "chine", "ancien"],
  ["boheme", "boho"],
  ["scandinave", "nordic", "scandi"],
  ["exterieur", "outdoor", "jardin", "terrasse", "balcon"],
];

const STOP = new Set(["de", "du", "des", "le", "la", "les", "en", "et", "un", "une", "pour", "a", "au", "aux", "avec", "the", "and"]);

export function searchTerms(q: string): string[][] {
  let s = ` ${normalize(q)} `;
  const groups: string[][] = [];
  // Les expressions de plusieurs mots d'abord (« table basse »)
  for (const g of SYNONYMS) {
    const hit = g.find((w) => w.includes(" ") && s.includes(` ${w} `));
    if (hit) {
      groups.push(g);
      s = s.replace(` ${hit} `, " ");
    }
  }
  for (const raw of s.trim().split(" ")) {
    if (raw.length < 2 || STOP.has(raw)) continue;
    // Pluriel : « lampes » → « lampe », « bureaux » → « bureau »
    const w = raw.length > 3 && /[sx]$/.test(raw) ? raw.slice(0, -1) : raw;
    const g = SYNONYMS.find((x) => x.includes(w) || x.includes(raw));
    groups.push(g ? [...new Set([w, ...g])] : [w]);
  }
  return groups.slice(0, 5);
}
