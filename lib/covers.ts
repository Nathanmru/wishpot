import type { Kind } from "./config";

// Photos Unsplash (licence gratuite). Remplacer ces identifiants pour changer les visuels.
export const PHOTOS = {
  loft: "1678895223308-da40c609e39b", // salon chaleureux, grandes baies
  cognac: "1554995207-c18c203602cb", // canapé cognac, lumière
  blueSofa: "1546555648-fb7876c40c58", // canapé cuir bleu
  lamp: "1546555802-01af0341ec23", // salon, lampe laiton
  nook: "1781249144049-dc1f8a2f5292", // banquette sous fenêtre
  leather: "1560185007-c5ca9d2c014d", // canapé cuir, table bois
  seaWindow: "1551524163-d00af9f12253", // fenêtre sur la mer au coucher
  seaSunset: "1620221730082-ec2e5712e509", // mer, ciel orangé
  palms: "1618360945198-3460f54d2ee5", // palmiers, ciel bleu
  curtain: "1534432189786-f47e376dc8c7", // rideau, soleil couchant
  palmWindow: "1562865582-d6317ab58923", // palmier à travers la fenêtre
  positano: "1583844056361-4418a8f2a985", // Positano illuminé au crépuscule
  parisSalon: "1687877954051-3c24d2c60c7d", // salon parisien, bibliothèque et moulures
  terrace: "1783597165321-e4fdd8e7c930", // couple sur une terrasse face à la mer
} as const;

export function photo(id: string, width = 1600) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const COVERS: Record<Kind, string> = {
  home: PHOTOS.loft,
  travel: PHOTOS.seaWindow,
};

export function cover(kind: Kind, width = 1600) {
  return photo(COVERS[kind], width);
}

export const KIND_STYLE: Record<Kind, { chip: string; soft: string; text: string; emoji: string }> = {
  home: { chip: "bg-walnut-soft text-walnut", soft: "bg-walnut-soft", text: "text-walnut", emoji: "🛋️" },
  travel: { chip: "bg-dusk-soft text-dusk", soft: "bg-dusk-soft", text: "text-dusk", emoji: "✈️" },
};
