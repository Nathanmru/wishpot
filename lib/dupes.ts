/**
 * « Luxe vs bonne affaire » : des icônes du design et des pièces du catalogue dans le même esprit.
 * Ce ne sont pas des copies : des modèles différents, avec la même allure, à une fraction du prix.
 * Prix des icônes relevés en novembre 2026 chez des revendeurs officiels (à mettre à jour de temps en temps).
 */
export type Icon = {
  slug: string;
  name: string;
  /** éditeur · designer, année */
  credit: string;
  price: number;
  /** « dès » quand le prix dépend de la finition */
  from?: boolean;
  source: string;
  /** pièces du catalogue, la moins chère d'abord */
  dupes: number[];
  hashtag: string;
};

export const ICONS: Icon[] = [
  { slug: "arco", name: "Lampadaire Arco", credit: "Flos · Achille et Pier Giacomo Castiglioni, 1962", price: 2229, source: "Connox", dupes: [6608, 6604, 6625], hashtag: "#flosarco" },
  { slug: "camaleonda", name: "Canapé Camaleonda", credit: "B&B Italia · Mario Bellini, 1970", price: 10778, from: true, source: "Osea Interiors", dupes: [7001, 6986], hashtag: "#camaleonda" },
  { slug: "jeanneret-fauteuil", name: "Fauteuil Capitol Complex", credit: "Cassina · hommage à Pierre Jeanneret, Chandigarh", price: 3909, from: true, source: "Nordiska Galleriet", dupes: [6492], hashtag: "#pierrejeanneret" },
  { slug: "jeanneret-chaise", name: "Chaise Capitol Complex", credit: "Cassina · hommage à Pierre Jeanneret, Chandigarh", price: 2374, from: true, source: "Nordiska Galleriet", dupes: [6393], hashtag: "#pierrejeanneret" },
  { slug: "tulip", name: "Table Tulip", credit: "Knoll · Eero Saarinen, 1957", price: 3162, from: true, source: "MyAreaDesign (Ø 120 cm)", dupes: [6964, 6972], hashtag: "#tuliptable" },
  { slug: "curvy", name: "Miroir Curvy", credit: "Gustaf Westman, 2020", price: 2400, source: "Gustaf Westman", dupes: [6673], hashtag: "#curvymirror" },
  { slug: "s34", name: "Fauteuil S 34", credit: "Thonet · Mart Stam, 1926", price: 1678, source: "MyAreaDesign", dupes: [3792], hashtag: "#bauhaus" },
  { slug: "akari", name: "Suspension Akari", credit: "Vitra · Isamu Noguchi, 1951", price: 380, from: true, source: "Nordiska Galleriet", dupes: [6798], hashtag: "#akari" },
];

export const icon = (slug: string) => ICONS.find((i) => i.slug === slug) ?? null;
