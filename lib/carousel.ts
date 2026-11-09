import { publicClient } from "@/lib/supabase/public";
import { PACKS, pack } from "@/lib/packs";
import { packPieces } from "@/lib/packPieces";
import type { Piece } from "@/lib/landingPieces";
import { ICONS, icon, type Icon } from "@/lib/dupes";
import { FINDS, find } from "@/lib/finds";

/**
 * Carrousels Instagram (1080×1350) fabriqués à partir du catalogue.
 * Un « deck » = une suite de slides ; chaque slide est une image servie par /carrousel/<deck>/<n>.
 */
export type Slide =
  | { kind: "cover"; kicker: string; title: string; sub: string; photos: string[] }
  | { kind: "piece"; index: number; count: number; label: string; piece: Piece }
  | { kind: "total"; title: string; total: number; pieces: Piece[] }
  | { kind: "tip"; index: number; count: number; rule: string; why: string }
  | { kind: "end"; title: string; sub: string }
  | { kind: "icon"; icon: Icon; best: number }
  | { kind: "pair"; icon: Icon; piece: Piece; index: number; count: number }
  | { kind: "fcover"; name: string; bg: string }
  | { kind: "find"; piece: Piece; bg: string; index: number };

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
  { id: "luxe", label: "Les 8 icônes", group: "Luxe vs bonne affaire" },
  ...ICONS.map((i) => ({ id: `luxe-${i.slug}`, label: i.name, group: "Luxe vs bonne affaire" })),
  ...FINDS.map((f) => ({ id: `finds-${f.slug}`, label: f.name, group: "Finds par marque" })),
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
  if (id.startsWith("finds-")) {
    const f = find(id.slice(6));
    if (!f) return null;
    const pieces = await packPieces(f.items.map(([pid]) => pid));
    const items = f.items.map(([pid, bg]) => ({ piece: pieces.find((p) => p.id === pid), bg })).filter((x): x is { piece: Piece; bg: string } => !!x.piece);
    if (!items.length) return null;
    const tag = "#" + f.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    return {
      id,
      title: `${f.name} Finds`,
      caption: `${f.name} finds ✦ nos pièces préférées du moment chez ${f.shop}\n\n${items.map((x, i) => `${i + 1}. ${x.piece.title} · ${eur(x.piece.price)}`).join("\n")}\n\nLaquelle vous tente le plus ? 👇\n\nToutes les pièces sont sur ateliernama.fr, lien en bio 🔗 Enregistrez ce post pour plus tard 📌\n\nPrix relevés sur le site de la marque, ils peuvent évoluer.\n\n${TAGS} ${tag} #finds #trouvailles`,
      slides: [
        { kind: "fcover", name: f.name, bg: items[0].bg },
        ...items.map((x, i) => ({ kind: "find" as const, piece: x.piece, bg: x.bg, index: i })),
        { kind: "end", title: `Toutes les pièces ${f.name}`, sub: "à découvrir, comparer ou mettre en cagnotte sur ateliernama.fr" },
      ],
    };
  }
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
  if (id === "luxe") {
    const all = await packPieces(ICONS.flatMap((i) => i.dupes));
    const pairs = ICONS.map((i) => ({ i, piece: all.find((p) => i.dupes.includes(p.id)) })).filter((x): x is { i: Icon; piece: Piece } => !!x.piece);
    const maxPct = Math.max(...pairs.map((x) => Math.round((1 - x.piece.price / x.i.price) * 100)));
    return {
      id,
      title: `${pairs.length} icônes du design et leur version abordable`,
      caption: `${pairs.length} icônes du design… et leur version à prix doux ✦\n\nArco, Camaleonda, Pierre Jeanneret, Tulip : les pièces qu'on voit dans tous les intérieurs de rêve. On a trouvé des modèles dans le même esprit, pour une fraction du prix. Pas des copies : d'autres modèles, la même allure.\n\nVotre préférée ? Dites-nous le numéro en commentaire 👇\n\nToutes les pièces sont en lien en bio 🔗 Enregistrez ce post 📌\n\n${TAGS} #dupe #luxeabordable #designicon #petitbudget`,
      slides: [
        { kind: "cover", kicker: "Luxe vs bonne affaire", title: `${pairs.length} icônes du design, version abordable`, sub: `jusqu'à −${maxPct} % sur le prix`, photos: pairs.slice(0, 4).map((x) => x.piece.image_url) },
        ...pairs.map((x, n) => ({ kind: "pair" as const, icon: x.i, piece: x.piece, index: n + 1, count: pairs.length })),
        { kind: "end", title: "Tout est en lien en bio", sub: "Des pièces dans le même esprit que les grandes icônes du design, sans le prix qui va avec." },
      ],
    };
  }
  if (id.startsWith("luxe-")) {
    const i = icon(id.slice(5));
    if (!i) return null;
    const pieces = await packPieces(i.dupes);
    if (!pieces.length) return null;
    const best = Math.min(...pieces.map((p) => p.price));
    return {
      id,
      title: `${i.name} : ${eur(i.price)} ou ${eur(best)} ?`,
      caption: `${i.name} : ${i.from ? "à partir de " : ""}${eur(i.price)} chez ${i.credit.split(" · ")[0]}… ou ${eur(best)} ✦\n\nL'icône signée ${i.credit.split(" · ")[1] ?? i.credit}, on l'adore. Mais pour avoir la même allure chez soi, on a trouvé ${pieces.length > 1 ? "des modèles" : "un modèle"} dans le même esprit, pour une fraction du prix. Pas une copie : un autre modèle, la même vibe.\n\nVous choisissez quoi : l'original ou la bonne affaire ? 👇\n\nEn lien en bio 🔗 Enregistrez ce post 📌\n\n${TAGS} #dupe #luxeabordable ${i.hashtag}`,
      slides: [
        { kind: "icon", icon: i, best },
        ...pieces.map((piece, n) => ({ kind: "pair" as const, icon: i, piece, index: n + 1, count: pieces.length })),
        { kind: "end", title: "La bonne affaire est en lien en bio", sub: "Et d'autres pièces dans le même esprit sur ateliernama.fr" },
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
