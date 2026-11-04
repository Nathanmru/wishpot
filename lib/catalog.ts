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
