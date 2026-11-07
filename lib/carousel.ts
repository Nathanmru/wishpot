import { publicClient } from "@/lib/supabase/public";
import { PACKS, pack } from "@/lib/packs";
import { packPieces } from "@/lib/packPieces";
import type { Piece } from "@/lib/landingPieces";

/**
 * Carrousels Instagram (1080×1350) fabriqués à partir du catalogue.
 * Un « deck » = une suite de slides ; chaque slide est une image servie par /carrousel/<deck>/<n>.
 */
export type Slide =
  | { kind: "cover"; kicker: string; title: string; sub: string; photos: string[] }
  | { kind: "piece"; index: number; count: number; label: string; piece: Piece }
  | { kind: "total"; title: string; total: number; pieces: Piece[] }
  | { kind: "tip"; index: number; count: number; rule: string; why: string }
  | { kind: "end"; title: string; sub: string };

export type Deck = { id: string; title: string; caption: string; slides: Slide[] };

const ROOMS: Record<string, { label: string; pour: string; db: string[] }> = {
  salon: { label: "Salon", pour: "un salon cosy", db: ["salon"] },
  chambre: { label: "Chambre", pour: "une chambre douce", db: ["chambre"] },
  entree: { label: "Entrée", pour: "une entrée qui accueille", db: ["entree"] },
  "salle-a-manger": { label: "Salle à manger", pour: "une salle à manger chic", db: ["salle-a-manger", "cuisine"] },
  bureau: { label: "Bureau", pour: "un coin bureau", db: ["bureau"] },
};

export const RULES: [string, string][] = [
  ["Le tapis passe sous les pieds avant du canapé.", "Un tapis trop petit qui « flotte » au milieu rapetisse toute la pièce."],
  ["Les cadres s'accrochent à hauteur des yeux.", "Le centre de l'image à environ 1,50 m du sol, même sur un grand mur."],
  ["La suspension : 70 à 80 cm au-dessus de la table.", "Assez bas pour créer une bulle de lumière, assez haut pour se voir."],
  ["Les rideaux, au plus près du plafond.", "La tringle posée haut et large donne l'impression d'une pièce plus haute."],
  ["Trois sources de lumière par pièce, minimum.", "Plafonnier, lampe d'appoint, lampe de lecture : c'est ce qui rend une pièce chaleureuse le soir."],
  ["La règle du 60 / 30 / 10.", "60 % de couleur dominante, 30 % de secondaire, 10 % d'accent. Ça marche à tous les coups."],
  ["La table basse fait les 2/3 du canapé.", "Et on garde 40 à 45 cm entre les deux pour circuler."],
  ["Toujours une pièce chinée.", "Un meuble vintage donne de l'âme à un intérieur tout neuf. Et c'est souvent moins cher."],
];

const TAGS = "#decointerieur #inspirationdeco #decoration #interiordesign #homedecor #decovintage #ateliernama";

/** Les carrousels proposés dans le studio. */
export const DECKS: { id: string; label: string; group: string }[] = [
  ...PACKS.map((p) => ({ id: `look-${p.slug}`, label: p.name, group: "Le look complet" })),
  ...Object.entries(ROOMS).map(([k, r]) => ({ id: `sous100-${k}`, label: `${r.label} sous 100 €`, group: "5 pièces sous 100 €" })),
  { id: "regles", label: "8 règles déco", group: "Conseils" },
];

const eur = (v: number) => `${Math.round(v).toLocaleString("fr-FR")} €`;

async function under100(dbRooms: string[]): Promise<Piece[]> {
  const { data } = await publicClient()
    .from("products")
    .select("id, title, shop, price, image_url, url, category, niche")
    .eq("active", true)
    .in("room", dbRooms)
    .gt("price", 15)
    .lte("price", 100)
    .not("image_url", "is", null)
    .order("niche", { ascending: false })
    .order("id", { ascending: false })
    .limit(200);
  const rows = ((data ?? []) as Piece[]).map((r) => ({ ...r, price: Number(r.price) }));
  // une pièce par catégorie, en alternant les boutiques
  const out: Piece[] = [];
  const cats = new Set<string>();
  const shops = new Map<string, number>();
  for (const r of rows) {
    if (out.length >= 5) break;
    if (cats.has(r.category) || (shops.get(r.shop) ?? 0) >= 2) continue;
    out.push(r);
    cats.add(r.category);
    shops.set(r.shop, (shops.get(r.shop) ?? 0) + 1);
  }
  for (const r of rows) if (out.length < 5 && !out.includes(r)) out.push(r);
  return out;
}

export async function getDeck(id: string): Promise<Deck | null> {
  if (id.startsWith("look-")) {
    const p = pack(id.slice(5));
    if (!p) return null;
    const pieces = (await packPieces(p.ids)).slice(0, 8);
    const total = pieces.reduce((a, x) => a + x.price, 0);
    return {
      id,
      title: `Le look complet : ${p.name}`,
      caption: `Le look complet : ${p.name.toLowerCase()} ✦ ${eur(total)} pour ${pieces.length} pièces\n\n${p.mood}. Des pièces choisies pour aller ensemble : prenez tout, ou seulement celles qui vous manquent.\n\nToutes les pièces sont en lien en bio 🔗 Pas le budget tout de suite ? Mettez le look en cagnotte et épargnez à votre rythme.\n\nEnregistrez ce post pour votre futur ${p.room.toLowerCase()} 📌\n\n${TAGS} #${p.room.toLowerCase().replace(/[^a-zà-ÿ]/g, "")}`,
      slides: [
        { kind: "cover", kicker: `Le look complet · ${p.room}`, title: p.name, sub: `${eur(total)} pour ${pieces.length} pièces`, photos: pieces.slice(0, 4).map((x) => x.image_url) },
        ...pieces.map((piece, i) => ({ kind: "piece" as const, index: i + 1, count: pieces.length, label: p.room, piece })),
        { kind: "total", title: p.name, total, pieces },
        { kind: "end", title: "Tout est en lien en bio", sub: "Shoppez le look pièce par pièce, ou mettez-le en cagnotte et épargnez à votre rythme." },
      ],
    };
  }
  if (id.startsWith("sous100-")) {
    const r = ROOMS[id.slice(8)];
    if (!r) return null;
    const pieces = await under100(r.db);
    if (!pieces.length) return null;
    return {
      id,
      title: `5 pièces sous 100 € pour ${r.pour}`,
      caption: `5 pièces sous 100 € pour ${r.pour} 🤎\n\nLa preuve qu'on peut avoir un intérieur qui a du style sans exploser son budget. Laquelle vous tente le plus ? 1, 2, 3, 4 ou 5 ? 👇\n\nToutes les pièces sont en lien en bio 🔗\n\nEnregistrez ce post pour plus tard 📌\n\n${TAGS} #petitbudget #decopascher`,
      slides: [
        { kind: "cover", kicker: "Petit budget, grand effet", title: `5 pièces sous 100 €`, sub: `pour ${r.pour}`, photos: pieces.slice(0, 4).map((x) => x.image_url) },
        ...pieces.map((piece, i) => ({ kind: "piece" as const, index: i + 1, count: pieces.length, label: "Sous 100 €", piece })),
        { kind: "end", title: "Tout est en lien en bio", sub: "Et des centaines d'autres pièces, chinées ou design, sur ateliernama.fr" },
      ],
    };
  }
  if (id === "regles") {
    return {
      id,
      title: "8 règles déco qu'on aurait aimé connaître plus tôt",
      caption: `8 règles déco qu'on aurait aimé connaître plus tôt ✦\n\nLa n°1 change tout dans un salon. Vous les connaissiez toutes ? Dites-nous en commentaire celle que vous ne respectez pas 😅\n\nEnregistrez ce post, il vous servira le jour où vous emménagez 📌\n\nToutes nos idées et nos pièces chinées : lien en bio 🔗\n\n${TAGS} #astucedeco #conseildeco`,
      slides: [
        { kind: "cover", kicker: "Le guide Atelier Nama", title: "8 règles déco qu'on aurait aimé connaître plus tôt", sub: "Enregistrez, ça sert toujours", photos: [] },
        ...RULES.map(([rule, why], i) => ({ kind: "tip" as const, index: i + 1, count: RULES.length, rule, why })),
        { kind: "end", title: "Plus d'idées en lien en bio", sub: "Des looks complets, des pièces chinées et une cagnotte pour financer votre intérieur." },
      ],
    };
  }
  return null;
}
