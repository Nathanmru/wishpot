/**
 * Trois cagnottes d'exemple, montées avec de vrais produits du catalogue.
 * Chaque pièce a été choisie pour aller avec les autres : une palette, des matières qui se répondent.
 */

export type ExampleItem = { id: number; qty?: number; role: { fr: string; en: string } };

export type ExamplePot = {
  slug: string;
  room: string;
  title: { fr: string; en: string };
  mood: { fr: string; en: string };
  why: { fr: string; en: string };
  palette: { hex: string; fr: string; en: string }[];
  months: number;
  people: number;
  items: ExampleItem[];
};

export const EXAMPLE_POTS: ExamplePot[] = [
  {
    slug: "salon-cuir-cognac",
    room: "salon",
    title: { fr: "Le salon cuir & cognac", en: "The leather & cognac living room" },
    mood: { fr: "Vintage chaleureux", en: "Warm vintage" },
    why: {
      fr: "Le cuir cognac donne le ton. Le teck et la terracotta prolongent sa chaleur, le jute et le globe opalin l'adoucissent.",
      en: "Cognac leather sets the tone. Teak and terracotta carry its warmth; jute and an opaline globe soften it.",
    },
    palette: [
      { hex: "#8A5530", fr: "Cognac", en: "Cognac" },
      { hex: "#5C3B22", fr: "Teck", en: "Teak" },
      { hex: "#B8623E", fr: "Terracotta", en: "Terracotta" },
      { hex: "#D9C7A7", fr: "Jute", en: "Jute" },
      { hex: "#B8954F", fr: "Laiton", en: "Brass" },
    ],
    months: 12,
    people: 2,
    items: [
      { id: 3673, role: { fr: "La pièce maîtresse", en: "The centrepiece" } },
      { id: 2870, role: { fr: "Le bois qui répond", en: "Matching wood" } },
      { id: 939, role: { fr: "La matière douce", en: "Soft texture" } },
      { id: 3869, role: { fr: "La lumière", en: "The light" } },
      { id: 1392, role: { fr: "La touche de couleur", en: "A touch of colour" } },
    ],
  },
  {
    slug: "chambre-lin-terracotta",
    room: "chambre",
    title: { fr: "La chambre lin & terracotta", en: "The linen & terracotta bedroom" },
    mood: { fr: "Bohème apaisé", en: "Calm boho" },
    why: {
      fr: "L'édredon terre brûlée réchauffe, le rotin et le chêne restent dans les tons miel, le papier de riz adoucit la lumière et le miroir doré l'accroche.",
      en: "A burnt-earth quilt adds warmth, rattan and oak stay honey-toned, rice paper softens the light and the gilded mirror catches it.",
    },
    palette: [
      { hex: "#B8623E", fr: "Terracotta", en: "Terracotta" },
      { hex: "#E3D7C3", fr: "Lin", en: "Linen" },
      { hex: "#C49A6C", fr: "Rotin", en: "Rattan" },
      { hex: "#A67C52", fr: "Chêne", en: "Oak" },
      { hex: "#B8954F", fr: "Laiton", en: "Brass" },
    ],
    months: 6,
    people: 2,
    items: [
      { id: 3576, role: { fr: "La tête de lit chinée", en: "Vintage headboard" } },
      { id: 1754, role: { fr: "L'édredon", en: "The quilt" } },
      { id: 1812, role: { fr: "Le motif", en: "The pattern" } },
      { id: 6579, role: { fr: "Le chevet", en: "Bedside" } },
      { id: 6798, role: { fr: "La suspension", en: "Pendant" } },
      { id: 4075, role: { fr: "Le reflet", en: "The reflection" } },
    ],
  },
  {
    slug: "salle-a-manger-sauge-chene",
    room: "salle-a-manger",
    title: { fr: "La salle à manger sauge & chêne", en: "The sage & oak dining room" },
    mood: { fr: "Maison de campagne", en: "Country house" },
    why: {
      fr: "Une table en chêne des années 50 et un buffet ancien pour la patine, des chaises vert sauge pour la fraîcheur, une soupière en céramique verte en écho.",
      en: "A 1950s oak table and an old sideboard for patina, sage chairs for freshness, a green ceramic tureen as an echo.",
    },
    palette: [
      { hex: "#8C9A76", fr: "Sauge", en: "Sage" },
      { hex: "#5F6B4A", fr: "Mousse", en: "Moss" },
      { hex: "#A67C52", fr: "Chêne", en: "Oak" },
      { hex: "#EDE6D6", fr: "Crème", en: "Cream" },
      { hex: "#D9C7A7", fr: "Jute", en: "Jute" },
    ],
    months: 10,
    people: 2,
    items: [
      { id: 2932, role: { fr: "La table chinée", en: "Vintage table" } },
      { id: 1855, qty: 4, role: { fr: "Les chaises", en: "The chairs" } },
      { id: 3124, role: { fr: "Le buffet", en: "The sideboard" } },
      { id: 6162, role: { fr: "La suspension", en: "Pendant" } },
      { id: 1323, role: { fr: "La touche verte", en: "A touch of green" } },
    ],
  },
];

export const exampleIds = () => [...new Set(EXAMPLE_POTS.flatMap((p) => p.items.map((i) => i.id)))];
