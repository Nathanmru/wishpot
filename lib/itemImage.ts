/**
 * Image d'illustration pour un objet sans photo (ajout manuel ou idée rapide).
 * On cherche un mot-clé dans le titre ; sinon on prend une image d'ambiance selon le type de cagnotte.
 * Photos Unsplash (licence gratuite).
 */
import type { Kind } from "./config";

const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&h=675&q=75`;

// Ordre important : les mots les plus précis d'abord ("table de chevet" avant "table").
const RULES: [string[], string][] = [
  // ---- Maison
  [["linge de lit", "housse de couette", "couette", "draps", "drap", "oreiller", "bedding", "duvet", "sheets", "pillowcase"], "1444341658138-5fbf6377e0cf"],
  [["coussin", "plaid", "cushion", "pillow", "throw"], "1592789705501-f9ae4278a9c9"],
  [["canape", "sofa", "couch", "banquette", "convertible"], "1623353283172-2518d7e6f5ab"],
  [["fauteuil", "armchair", "pouf"], "1586023492125-27b2c045efd7"],
  [["matelas", "lit", "sommier", "tete de lit", "bed", "mattress"], "1560185128-e173042f79dd"],
  [["chaise", "tabouret", "chair", "stool"], "1640938776314-4d303f8a1380"],
  [["cadre", "affiche", "poster", "tableau", "frame", "print", "art"], "1535056626760-b283260686b1"],
  [["bureau", "desk"], "1669490893500-97456444f578"],
  [["table", "dining"], "1773578978637-c9771e7a9913"],
  [["tapis", "rug", "carpet"], "1617103996702-96ff29b1c467"],
  [["rideau", "voilage", "store", "curtain", "blind"], "1588840908083-3b854a29ee5f"],
  [["plante", "pot de fleur", "fleur", "plant", "cache-pot"], "1592150621744-aca64f48394a"],
  [["miroir", "mirror"], "1617228206053-477863025d9c"],
  [["etagere", "bibliotheque", "shelf", "bookcase", "bookshelf", "meuble tv"], "1593430980369-68efc5a5eb34"],
  [["armoire", "dressing", "penderie", "commode", "wardrobe", "closet", "dresser"], "1558769132-cb1aea458c5e"],
  [["lampe", "luminaire", "suspension", "lampadaire", "applique", "ampoule", "lamp", "light", "chandelier"], "1604610728890-6f4b631ed081"],
  [["vaisselle", "assiette", "verre", "bol", "tasse", "couverts", "tableware", "plates", "glasses", "mug"], "1740478949628-ff562c3c3923"],
  [["casserole", "poele", "ustensile", "robot", "blender", "four", "micro-onde", "frigo", "refrigerateur", "cookware", "pan", "oven", "fridge", "kitchen", "cuisine"], "1777499455310-80354aa1021f"],
  [["machine a cafe", "cafetiere", "nespresso", "expresso", "espresso", "coffee"], "1772134141698-c47b78663c55"],
  [["aspirateur", "vacuum", "dyson"], "1778062868373-e3cb41963ae5"],
  [["lave-linge", "lave linge", "machine a laver", "seche-linge", "lave-vaisselle", "washing", "dishwasher"], "1626806787461-102c1bfaaea1"],
  [["serviette", "salle de bain", "bain", "towel", "bathroom"], "1523471826770-c437b4636fe6"],
  [["television", "tele", "tv", "ecran", "enceinte", "speaker", "screen"], "1521607630287-ee2e81ad3ced"],
  [["vase", "bougie", "deco", "objet", "candle", "decor"], "1597696929736-6d13bed8e6a8"],
  // ---- Voyage
  [["vol", "avion", "billet", "flight", "plane", "airline"], "1488085061387-422e29b40080"],
  [["hotel", "hebergement", "logement", "airbnb", "auberge", "chambre", "nuit", "accommodation", "stay", "hostel", "room"], "1618773928121-c32242e63f39"],
  [["train", "rail", "metro", "bus", "transport", "navette", "ferry"], "1505832018823-50331d70d237"],
  [["voiture", "location", "essence", "road trip", "van", "car", "rental"], "1468818438311-4bab781ab9b8"],
  [["activite", "visite", "excursion", "tour", "musee", "billet d'entree", "plongee", "activity", "museum", "ticket"], "1757383670318-d34ce14dab86"],
  [["repas", "restaurant", "nourriture", "manger", "food", "dinner", "meal"], "1603088549155-6ae9395b928f"],
  [["assurance", "visa", "passeport", "insurance", "passport"], "1454496406107-dc34337da8d6"],
  [["esim", "sim", "internet", "data", "forfait", "telephone", "phone"], "1548345680-f5475ea5df84"],
  [["souvenir", "cadeau", "shopping", "gift", "market"], "1690094399942-227d0da664e0"],
  [["valise", "bagage", "sac", "suitcase", "luggage", "backpack"], "1670888664952-efff442ec0d2"],
  [["plage", "beach", "spa", "piscine", "pool"], "1602088113235-229c19758e9f"],
];

const FALLBACK: Record<Kind, string> = {
  home: "1678895223308-da40c609e39b",
  travel: "1551524163-d00af9f12253",
};

function normalize(s: string) {
  return ` ${s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9' -]+/g, " ")} `;
}

/** Image d'illustration correspondant au titre (jamais vide). */
export function illustrationFor(title: string, kind: Kind = "home"): string {
  const t = normalize(title);
  for (const [words, id] of RULES) {
    if (words.some((w) => t.includes(` ${w}`))) return U(id);
  }
  return U(FALLBACK[kind]);
}
