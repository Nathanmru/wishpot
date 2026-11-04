/**
 * Sélection de départ : ce qu'on compose sur l'accueil sans compte,
 * puis qu'on retrouve dans la cagnotte créée.
 */
import type { Kind } from "./config";
import { TRENDS } from "./inspiration";

export type Starter = {
  id: string;
  kind: Kind;
  title: string;
  short: string;
  price: number;
  quantity?: number;
  img: string;
  url?: string;
  shop?: string;
  packshot?: boolean; // photo produit sur fond blanc
};

const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=75`;
const prod = (t: number, p: number) => TRENDS[t].products[p];

function fromTrend(id: string, short: string, t: number, p: number): Starter {
  const x = prod(t, p);
  return { id, kind: "home", title: x.name, short, price: x.price, img: x.img, url: x.url, shop: x.shop, packshot: true };
}

export const STARTERS: Starter[] = [
  fromTrend("canape", "Canapé nuage", 0, 0),
  fromTrend("miroir", "Miroir arche", 0, 1),
  fromTrend("buffet", "Buffet en rotin", 1, 0),
  fromTrend("tapis", "Tapis en laine", 3, 0),
  fromTrend("lampe", "Lampe en laiton", 2, 1),
  fromTrend("vase", "Vase texturé", 3, 1),

  { id: "vols", kind: "travel", title: "Vols aller-retour Paris – Tokyo", short: "Vols A/R", price: 850, quantity: 2, img: U("1488085061387-422e29b40080") },
  { id: "ryokan", kind: "travel", title: "Ryokan à Kyoto, 2 nuits", short: "Ryokan à Kyoto", price: 640, img: U("1493976040374-85c8e12f0c0e") },
  { id: "hotel", kind: "travel", title: "Hôtel à Tokyo, 5 nuits", short: "Hôtel à Tokyo", price: 900, img: U("1618773928121-c32242e63f39") },
  { id: "train", kind: "travel", title: "Pass de train 7 jours", short: "Pass de train", price: 260, quantity: 2, img: U("1505832018823-50331d70d237") },
  { id: "visites", kind: "travel", title: "Visites et expériences", short: "Visites", price: 300, img: U("1757383670318-d34ce14dab86") },
  { id: "repas", kind: "travel", title: "Repas et izakayas", short: "Repas", price: 600, img: U("1603088549155-6ae9395b928f") },
];

export function startersFor(kind: Kind) {
  return STARTERS.filter((s) => s.kind === kind);
}

export function starterTotal(s: Starter) {
  return s.price * (s.quantity ?? 1);
}
