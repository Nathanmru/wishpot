import type { Kind } from "./config";
import type { Lang } from "./i18n";

export type Shop = { name: string; url: string; note: { fr: string; en: string } };
export type Idea = { fr: string; en: string; price: number; qty?: number; category: string; emoji: string };

export const SHOPS: Record<Kind, Shop[]> = {
  home: [
    { name: "IKEA", url: "https://www.ikea.com/fr/fr/", note: { fr: "Meubles, rangement", en: "Furniture, storage" } },
    { name: "Maisons du Monde", url: "https://www.maisonsdumonde.com/FR/fr", note: { fr: "Meubles & déco", en: "Furniture & decor" } },
    { name: "La Redoute Intérieurs", url: "https://www.laredoute.fr/maison.aspx", note: { fr: "Meubles, linge", en: "Furniture, linen" } },
    { name: "Made in Design", url: "https://www.madeindesign.com/", note: { fr: "Design", en: "Design" } },
    { name: "Westwing", url: "https://www.westwing.fr/", note: { fr: "Ventes privées déco", en: "Decor flash sales" } },
    { name: "Leroy Merlin", url: "https://www.leroymerlin.fr/", note: { fr: "Bricolage, luminaires", en: "DIY, lighting" } },
    { name: "Amazon", url: "https://www.amazon.fr/", note: { fr: "Électroménager, petits objets", en: "Appliances, small items" } },
    { name: "Zara Home", url: "https://www.zarahome.com/fr/", note: { fr: "Linge, vaisselle", en: "Linen, tableware" } },
  ],
  travel: [
    { name: "Skyscanner", url: "https://www.skyscanner.fr/", note: { fr: "Vols", en: "Flights" } },
    { name: "Booking.com", url: "https://www.booking.com/", note: { fr: "Hôtels", en: "Hotels" } },
    { name: "Airbnb", url: "https://www.airbnb.fr/", note: { fr: "Logements", en: "Stays" } },
    { name: "GetYourGuide", url: "https://www.getyourguide.fr/", note: { fr: "Activités, visites", en: "Activities, tours" } },
    { name: "Klook", url: "https://www.klook.com/fr/", note: { fr: "Activités en Asie, pass", en: "Asia activities, passes" } },
    { name: "Trainline", url: "https://www.thetrainline.com/fr", note: { fr: "Trains", en: "Trains" } },
    { name: "Hostelworld", url: "https://www.hostelworld.com/", note: { fr: "Auberges", en: "Hostels" } },
  ],
};

export const IDEAS: Record<Kind, Idea[]> = {
  home: [
    { fr: "Canapé", en: "Sofa", price: 600, category: "salon", emoji: "🛋️" },
    { fr: "Lit + matelas", en: "Bed + mattress", price: 700, category: "chambre", emoji: "🛏️" },
    { fr: "Table à manger", en: "Dining table", price: 300, category: "cuisine", emoji: "🍽️" },
    { fr: "Chaises", en: "Chairs", price: 50, qty: 4, category: "cuisine", emoji: "🪑" },
    { fr: "Luminaires", en: "Lamps", price: 60, qty: 3, category: "déco", emoji: "💡" },
    { fr: "Tapis", en: "Rug", price: 120, category: "déco", emoji: "🧶" },
    { fr: "Rideaux", en: "Curtains", price: 60, category: "déco", emoji: "🪟" },
    { fr: "Plantes", en: "Plants", price: 25, qty: 3, category: "déco", emoji: "🪴" },
    { fr: "Miroir", en: "Mirror", price: 70, category: "déco", emoji: "🪞" },
    { fr: "Étagère", en: "Shelf", price: 90, category: "salon", emoji: "📚" },
    { fr: "Vaisselle", en: "Tableware", price: 100, category: "cuisine", emoji: "🍵" },
    { fr: "Linge de lit", en: "Bedding", price: 80, category: "chambre", emoji: "🧺" },
    { fr: "Aspirateur", en: "Vacuum", price: 150, category: "électroménager", emoji: "🧹" },
    { fr: "Machine à café", en: "Coffee machine", price: 120, category: "électroménager", emoji: "☕" },
    { fr: "Cadres & affiches", en: "Frames & posters", price: 40, qty: 2, category: "déco", emoji: "🖼️" },
  ],
  travel: [
    { fr: "Vol aller-retour", en: "Return flight", price: 900, qty: 2, category: "transport", emoji: "✈️" },
    { fr: "Hébergement", en: "Accommodation", price: 800, category: "logement", emoji: "🏨" },
    { fr: "Activités & visites", en: "Activities & tours", price: 300, category: "activités", emoji: "🎟️" },
    { fr: "Transport sur place", en: "Local transport", price: 200, category: "transport", emoji: "🚆" },
    { fr: "Repas", en: "Food", price: 500, category: "nourriture", emoji: "🍜" },
    { fr: "Assurance voyage", en: "Travel insurance", price: 60, qty: 2, category: "formalités", emoji: "🛡️" },
    { fr: "eSIM / Internet", en: "eSIM / data", price: 25, qty: 2, category: "formalités", emoji: "📶" },
    { fr: "Souvenirs", en: "Souvenirs", price: 150, category: "shopping", emoji: "🎁" },
  ],
};

export function allowedShopHosts(): string[] {
  return [...SHOPS.home, ...SHOPS.travel].map((s) => new URL(s.url).hostname.replace(/^www\./, ""));
}

export function ideaLabel(i: Idea, lang: Lang) {
  return lang === "en" ? i.en : i.fr;
}
