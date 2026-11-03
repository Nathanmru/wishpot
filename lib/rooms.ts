/** Pièces (maison) et postes de dépense (voyage), avec devinette à partir du titre. */
import type { Kind } from "./config";

export type Room = { id: string; fr: string; en: string };

export const ROOMS: Record<Kind, Room[]> = {
  home: [
    { id: "salon", fr: "Salon", en: "Living room" },
    { id: "chambre", fr: "Chambre", en: "Bedroom" },
    { id: "cuisine", fr: "Cuisine", en: "Kitchen" },
    { id: "salle-a-manger", fr: "Salle à manger", en: "Dining room" },
    { id: "salle-de-bain", fr: "Salle de bain", en: "Bathroom" },
    { id: "bureau", fr: "Bureau", en: "Study" },
    { id: "entree", fr: "Entrée", en: "Hallway" },
    { id: "exterieur", fr: "Extérieur", en: "Outdoor" },
    { id: "autre", fr: "Autre", en: "Other" },
  ],
  travel: [
    { id: "transport", fr: "Transport", en: "Transport" },
    { id: "logement", fr: "Logement", en: "Stay" },
    { id: "activites", fr: "Activités", en: "Activities" },
    { id: "repas", fr: "Repas", en: "Food" },
    { id: "formalites", fr: "Formalités", en: "Paperwork" },
    { id: "shopping", fr: "Shopping", en: "Shopping" },
    { id: "autre", fr: "Autre", en: "Other" },
  ],
};

const GUESS: Record<Kind, [string, string[]][]> = {
  home: [
    ["chambre", ["lit", "matelas", "sommier", "couette", "draps", "oreiller", "linge de lit", "table de chevet", "chevet", "armoire", "dressing", "commode", "bed", "mattress", "wardrobe"]],
    ["salle-de-bain", ["serviette", "salle de bain", "bain", "douche", "lavabo", "towel", "bathroom", "shower"]],
    ["cuisine", ["vaisselle", "assiette", "verre", "casserole", "poele", "ustensile", "robot", "blender", "four", "frigo", "refrigerateur", "micro-onde", "machine a cafe", "cafetiere", "lave-vaisselle", "bouilloire", "grille-pain", "cuisine", "kitchen", "coffee"]],
    ["salle-a-manger", ["table a manger", "chaise", "chaises", "buffet", "dining", "chair"]],
    ["bureau", ["bureau", "desk", "chaise de bureau", "lampe de bureau"]],
    ["entree", ["porte-manteau", "meuble a chaussures", "entree", "console"]],
    ["exterieur", ["balcon", "jardin", "terrasse", "transat", "parasol", "barbecue", "outdoor"]],
    ["salon", ["canape", "fauteuil", "tapis", "table basse", "meuble tv", "television", "tv", "rideau", "etagere", "bibliotheque", "lampadaire", "coussin", "plaid", "sofa", "armchair", "rug", "luminaire", "lampe", "miroir", "plante", "cadre", "affiche", "vase"]],
  ],
  travel: [
    ["transport", ["vol", "avion", "billet", "train", "bus", "ferry", "voiture", "location", "essence", "navette", "transport", "flight", "car"]],
    ["logement", ["hotel", "hebergement", "logement", "airbnb", "auberge", "nuit", "chambre", "stay", "hostel"]],
    ["activites", ["activite", "visite", "excursion", "tour", "musee", "plongee", "spa", "cours", "activity", "museum"]],
    ["repas", ["repas", "restaurant", "nourriture", "manger", "diner", "food", "dinner"]],
    ["formalites", ["assurance", "visa", "passeport", "esim", "sim", "vaccin", "insurance", "passport"]],
    ["shopping", ["souvenir", "cadeau", "shopping", "valise", "gift"]],
  ],
};

function norm(s: string) {
  return ` ${s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9' -]+/g, " ")} `;
}

export function guessRoom(title: string, kind: Kind): string | null {
  const t = norm(title);
  for (const [room, words] of GUESS[kind]) if (words.some((w) => t.includes(` ${w}`))) return room;
  return null;
}

export function roomLabel(kind: Kind, id: string | null | undefined, lang: "fr" | "en" = "fr") {
  const r = ROOMS[kind].find((x) => x.id === id);
  return r ? r[lang] : lang === "fr" ? "Sans pièce" : "Unsorted";
}
