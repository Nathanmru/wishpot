/**
 * Fiche technique tirée du nom du produit : dimensions, matières, nombre de places, état.
 * Les boutiques écrivent presque toujours l'essentiel dans le titre (« Table basse en noyer 140 x 60 cm »).
 */

import { normalize } from "./catalog";

export type Dims = { w?: number; d?: number; h?: number; diam?: number; text: string } | null;

const num = (s: string) => Number(s.replace(",", "."));

export function parseDims(title: string): Dims {
  const t = title.toLowerCase().replace(/\s+/g, " ");
  const out: { w?: number; d?: number; h?: number; diam?: number } = {};

  // 140 x 60 x 45 cm · 220x240 · 300/200 cm
  const box = t.match(/(\d{2,3}(?:[.,]\d)?)\s*[x×*/]\s*(\d{2,3}(?:[.,]\d)?)(?:\s*[x×*]\s*(\d{2,3}(?:[.,]\d)?))?\s*(cm|mm)?/);
  if (box) {
    const k = box[4] === "mm" ? 0.1 : 1;
    out.w = num(box[1]) * k;
    out.d = num(box[2]) * k;
    if (box[3]) out.h = num(box[3]) * k;
  }
  // Ø 90 cm · d90
  const di = t.match(/(?:ø|⌀|diam(?:[eè]tre)?\.?)\s*:?\s*(\d{1,3}(?:[.,]\d)?)\s*(cm|mm)?/);
  if (di) out.diam = num(di[1]) * (di[2] === "mm" ? 0.1 : 1);
  // L108 cm · l. 120 · largeur 90
  const l = t.match(/\b(?:l\.?|largeur|long(?:ueur)?\.?)\s*:?\s*(\d{2,3}(?:[.,]\d)?)\s*cm/);
  if (l && !out.w) out.w = num(l[1]);
  // H206 cm · hauteur 45
  const h = t.match(/\b(?:h\.?|hauteur|haut\.?)\s*:?\s*(\d{1,3}(?:[.,]\d)?)\s*cm/);
  if (h && !out.h) out.h = num(h[1]);
  // « 210 cm » tout seul
  if (!out.w && !out.diam && !out.h) {
    const one = t.match(/\b(\d{2,3})\s*cm\b/);
    if (one) out.w = num(one[1]);
  }
  if (!out.w && !out.d && !out.h && !out.diam) return null;

  const parts: string[] = [];
  if (out.diam) parts.push(`Ø ${fmt(out.diam)}`);
  if (out.w) parts.push(`L ${fmt(out.w)}`);
  if (out.d) parts.push(`P ${fmt(out.d)}`);
  if (out.h) parts.push(`H ${fmt(out.h)}`);
  return { ...out, text: `${parts.join(" × ")} cm` };
}

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".", ","));

/** Les matières, en français, dans l'ordre où on les trouve. */
const MATERIALS: [RegExp, string][] = [
  [/\bsimili ?cuir|faux leather|vegan leather/, "Simili cuir"],
  [/\bcuir|leather\b/, "Cuir"],
  [/\bvelours|velvet|cotele|corduroy/, "Velours"],
  [/\bbouclette|boucle\b|boucl/, "Bouclette"],
  [/\blin\b|linen/, "Lin"],
  [/\bcoton|cotton/, "Coton"],
  [/\blaine|wool|beni ourain|mohair/, "Laine"],
  [/\bjute\b/, "Jute"],
  [/\bsisal|seagrass|jonc de mer/, "Fibres naturelles"],
  [/\brotin|rattan|osier|wicker|cannage|\bcane\b/, "Rotin & cannage"],
  [/\bbambou|bamboo/, "Bambou"],
  [/\braphia|raffia/, "Raphia"],
  [/\bchene|\boak\b/, "Chêne"],
  [/\bnoyer|walnut/, "Noyer"],
  [/\bteck|teak/, "Teck"],
  [/\bfrene|\bash\b/, "Frêne"],
  [/\bhetre|beech/, "Hêtre"],
  [/\bpin\b|pine\b|sapin/, "Pin"],
  [/\bacacia|manguier|mango|sheesham|palissandre|rosewood|acajou|merisier/, "Bois exotique"],
  [/\bbois\b|wood/, "Bois"],
  [/\blaiton|brass/, "Laiton"],
  [/\bacier|steel|inox/, "Acier"],
  [/\bfer\b|iron|forge/, "Fer"],
  [/\baluminium|aluminum/, "Aluminium"],
  [/\bchrome/, "Chrome"],
  [/\bmetal/, "Métal"],
  [/\bmarbre|marble/, "Marbre"],
  [/\btravertin|travertine/, "Travertin"],
  [/\bverre|glass|opaline|cristal/, "Verre"],
  [/\bgres\b|stoneware/, "Grès"],
  [/\bporcelaine|porcelain/, "Porcelaine"],
  [/\bterre cuite\b/, "Terre cuite"],
  [/\bceramique|ceramic|faience/, "Céramique"],
  [/\bbeton|concrete/, "Béton"],
  [/\bpapier|paper|washi/, "Papier"],
  [/\bpolyester|polypropylene|plastique|plastic|acrylique|resine|resin/, "Synthétique"],
];

export function parseMaterials(title: string): string[] {
  const t = ` ${normalize(title)} `;
  const found: string[] = [];
  for (const [re, label] of MATERIALS) if (re.test(t) && !found.includes(label)) found.push(label);
  // « Bois » n'apporte rien si une essence est déjà citée
  if (found.includes("Bois") && found.some((x) => ["Chêne", "Noyer", "Teck", "Frêne", "Hêtre", "Pin", "Bois exotique"].includes(x))) found.splice(found.indexOf("Bois"), 1);
  if (found.includes("Métal") && found.some((x) => ["Laiton", "Acier", "Fer", "Aluminium", "Chrome"].includes(x))) found.splice(found.indexOf("Métal"), 1);
  if (found.includes("Cuir") && found.includes("Simili cuir")) found.splice(found.indexOf("Cuir"), 1);
  return found.slice(0, 5);
}

export function parseSeats(title: string): number | null {
  const words: Record<string, number> = { un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, two: 2, three: 3, four: 4 };
  const m = normalize(title).match(/\b(\d|un|une|deux|trois|quatre|cinq|six|two|three|four)[ -]*(?:places?|seater|personnes|pers)\b/);
  return m ? (words[m[1]] ?? Number(m[1])) : null;
}

/** Époque citée (années 60, 1970s, circa 1950…) : utile pour les pièces chinées. */
export function parseEra(title: string): string | null {
  const t = normalize(title);
  const a = t.match(/\bannees (\d0)\b/);
  if (a) return `Années ${a[1]}`;
  const y = t.match(/\b(18\d0|19\d0)s?\b/);
  if (y) return `Années ${y[1].slice(2)}${Number(y[1]) < 1900 ? " (XIXe)" : ""}`;
  return null;
}

export const isSecondHand = (shop: string) => shop === "Selency";
