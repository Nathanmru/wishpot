/**
 * Contenu éditorial des pages Inspiration.
 * Produits : vrais articles relevés en novembre 2026 (prix indicatifs, ils peuvent changer).
 * Photos de destinations : Unsplash (licence gratuite).
 */

export type Product = {
  name: string;
  shop: string;
  price: number;
  url: string;
  img: string;
};

export type Trend = {
  id: string;
  title: string;
  text: string;
  tip: string;
  products: Product[];
};

const MDM = "Maisons du Monde";

export const COLORS = [
  { name: "Chocolat", hex: "#4A2C21", text: "La couleur la plus citée par les décorateurs. En velours, en laque ou du sol au plafond." },
  { name: "Bordeaux", hex: "#5E1F28", text: "Théâtral sur un mur d'accent, avec du laiton et du bois foncé." },
  { name: "Jaune paille", hex: "#E3C77A", text: "Éclaire les pièces au nord. Se marie au rotin et au cannage." },
  { name: "Céladon", hex: "#A9B9A3", text: "Le vert-gris qui remplace le sauge. Agrandit visuellement l'espace." },
  { name: "Vieux rose", hex: "#C9A19A", text: "Apaisant en chambre, en total look ou par touches textiles." },
  { name: "Cloud Dancer", hex: "#EEEAE0", text: "Le blanc cassé désigné couleur Pantone 2026. La base de tout le reste." },
];

export const TRENDS: Trend[] = [
  {
    id: "courbes",
    title: "Tout s'arrondit",
    text: "Canapés nuage, accoudoirs ronds, miroirs en arche : les angles disparaissent. Les formes douces rendent un salon plus accueillant, surtout en bouclette écrue.",
    tip: "Un seul grand meuble courbé suffit. Gardez des lignes droites autour pour le faire ressortir.",
    products: [
      {
        name: "Canapé nuage 2 places, bouclettes écrues — Lilo",
        shop: MDM,
        price: 999,
        url: "https://www.maisonsdumonde.com/FR/fr/p/canape-nuage-2-places-bouclettes-ecrues-lilo-243044.htm",
        img: "https://medias.maisonsdumonde.com/image/upload/ar_1:1,c_fill,f_auto,q_auto,w_800/v1/img/canape-nuage-2-places-bouclettes-ecrues-1000-12-37-243044_1.jpg",
      },
      {
        name: "Grand miroir arche 120 × 170 cm — Alina",
        shop: MDM,
        price: 299,
        url: "https://www.maisonsdumonde.com/FR/fr/p/grand-miroir-arche-117x170-cm-alina-250185.htm",
        img: "https://medias.maisonsdumonde.com/image/upload/ar_1:1,c_fill,f_auto,q_auto,w_800/v1/img/grand-miroir-arche-120x170-cm-1000-13-3-250185_1.jpg",
      },
      {
        name: "Canapé virgule organique 3 places, bouclette — Wave",
        shop: MDM,
        price: 349.99,
        url: "https://www.maisonsdumonde.com/FR/fr/p/canape-virgule-organique-3-places-en-tissu-bouclette-wave-M24009975.htm",
        img: "https://medias.maisonsdumonde.com/images/ar_1:1,c_pad,f_auto,q_auto,w_800/v1/mkp/M24009975_1/canape-virgule-organique-3-places-en-tissu-bouclette.jpg",
      },
    ],
  },
  {
    id: "rotin",
    title: "Le retour du cannage",
    text: "Rotin, osier et cannage reviennent sur les buffets et les assises. Associés à une couleur franche comme le terracotta ou au velours chocolat, ils perdent leur côté bohème pour devenir chics.",
    tip: "Le cannage aime la lumière : placez le buffet face à une fenêtre pour profiter du jeu d'ombres.",
    products: [
      {
        name: "Buffet 3 portes cannage en rotin L154 — Solstice",
        shop: MDM,
        price: 369,
        url: "https://www.maisonsdumonde.com/FR/fr/p/buffet-3-portes-cannage-en-rotin-l154-solstice-230263.htm",
        img: "https://medias.maisonsdumonde.com/image/upload/ar_1:1,c_fill,f_auto,q_auto,w_800/v1/img/buffet-3-portes-cannage-en-rotin-l154-1000-15-7-230263_1.jpg",
      },
      {
        name: "Buffet 2 portes terracotta, cannage L100 — Tarifa",
        shop: MDM,
        price: 299,
        url: "https://www.maisonsdumonde.com/FR/fr/p/buffet-2-portes-terracotta-cannage-en-rotin-l100-tarifa-248523.htm",
        img: "https://medias.maisonsdumonde.com/image/upload/ar_1:1,c_fill,f_auto,q_auto,w_800/v1/img/buffet-2-portes-terracotta-cannage-en-rotin-l100-1000-0-22-248523_1.jpg",
      },
      {
        name: "Fauteuil de table velours marron écureuil, cannage — Sockette",
        shop: MDM,
        price: 159,
        url: "https://www.maisonsdumonde.com/FR/fr/p/fauteuil-de-table-en-velours-marron-ecureuil-cannage-en-rotin-sockette-219993.htm",
        img: "https://medias.maisonsdumonde.com/image/upload/ar_1:1,c_fill,f_auto,q_auto,w_800/v1/img/fauteuil-de-table-en-velours-marron-ecureuil-cannage-en-rotin-1000-13-28-219993_1.jpg",
      },
    ],
  },
  {
    id: "lumiere",
    title: "Lumière en couches",
    text: "On multiplie les sources : suspension en papier plissé, lampe en verre ciselé, petit globe façon Murano. Le plafonnier unique disparaît au profit d'îlots de lumière chaude.",
    tip: "Trois points lumineux par pièce, à trois hauteurs différentes, et des ampoules en 2 700 K.",
    products: [
      {
        name: "Abat-jour suspension IKEA PS 2026, fait main, 90 cm",
        shop: "IKEA",
        price: 24.99,
        url: "https://www.ikea.com/fr/fr/p/ikea-ps-2026-abat-jour-suspension-fait-main-blanc-10617078/",
        img: "https://www.ikea.com/fr/fr/images/products/ikea-ps-2026-abat-jour-suspension-fait-main-blanc__1478251_pe999470_s5.jpg",
      },
      {
        name: "Lampe à poser laiton et verre ciselé — Mistinguett",
        shop: "AM.PM · La Redoute",
        price: 143.31,
        url: "https://www.laredoute.fr/ppdp/prod-512957757.aspx",
        img: "https://cdn.laredoute.com/cdn-cgi/image/width=800,height=800,fit=pad,dpr=1/products/7/f/d/7fd10cad63d649a9155baeb654d0b698.jpg",
      },
      {
        name: "Petite suspension Murano",
        shop: "Westwing",
        price: 139,
        url: "https://www.westwing.fr/petite-suspension-murano-156351.html",
        img: "https://cdn.shopify.com/s/files/1/0613/3107/9307/files/DEQ23NOV93207-200758_564d2000b078d3996c21e365ab1cca34_dtl_1.jpg?v=1728493812",
      },
      {
        name: "Abat-jour suspension GULLSUDARE, fait main, 70 cm",
        shop: "IKEA",
        price: 6.99,
        url: "https://www.ikea.com/fr/fr/p/gullsudare-abat-jour-suspension-blanc-fait-main-80583616/",
        img: "https://www.ikea.com/fr/fr/images/products/gullsudare-abat-jour-suspension-blanc-fait-main__1399276_pe968294_s5.jpg",
      },
    ],
  },
  {
    id: "matieres",
    title: "Des matières qu'on a envie de toucher",
    text: "Laine tuftée, céramique texturée, verre ancien : les surfaces lisses et brillantes cèdent la place au fait-main et aux formes irrégulières.",
    tip: "Un tapis aux contours organiques casse la rigueur d'un salon tout en angles.",
    products: [
      {
        name: "Tapis en laine de forme organique — Kadey",
        shop: "Westwing",
        price: 219,
        url: "https://www.westwing.fr/tapis-en-laine-forme-organique-tufte-main-kadey-140636.html",
        img: "https://cdn.shopify.com/s/files/1/0613/3107/9307/files/DEQ22WES33491-178000_acd97c2dce8031ba0417213d43ab2041_dtl_1.jpg?v=1770222316",
      },
      {
        name: "Vase céramique texturée",
        shop: "Zara Home",
        price: 39.99,
        url: "https://www.zarahome.com/fr/vase-ceramique-texture-l45377046",
        img: "https://static.zarahome.net//assets/public/d959/7c06/6e34471daf69/17dbfb113730/45377046802-a7/45377046802-a7.jpg?ts=1784104632065&f=auto",
      },
      {
        name: "Lampe à poser — Funambule",
        shop: "AM.PM · La Redoute",
        price: 89,
        url: "https://www.laredoute.fr/ppdp/prod-601189009.aspx",
        img: "https://cdn.laredoute.com/cdn-cgi/image/width=800,height=800,fit=pad,dpr=1/products/d/5/e/d5e803c960a38b736f862f318ed99a70.jpg",
      },
    ],
  },
];

export const HOME_SITES = [
  { name: "Maisons du Monde", note: "Les grandes tendances à prix doux, du canapé au linge.", url: "https://www.maisonsdumonde.com/FR/fr" },
  { name: "AM.PM", note: "La ligne design de La Redoute : lignes épurées, beaux matériaux.", url: "https://www.laredoute.fr/pplp/100/75363/75474/cat-75481.aspx?brndid=ampm" },
  { name: "Westwing", note: "Ventes privées déco et une collection maison très chic.", url: "https://www.westwing.fr/" },
  { name: "Zara Home", note: "Linge de maison, vaisselle et objets au goût du jour.", url: "https://www.zarahome.com/fr/" },
  { name: "IKEA", note: "La collection PS 2026 : des pièces fait-main en série limitée.", url: "https://www.ikea.com/fr/fr/" },
  { name: "Kave Home", note: "Mobilier méditerranéen, bois clair et bouclette.", url: "https://kavehome.com/fr/fr/" },
  { name: "Selency", note: "Meubles vintage de seconde main, pour mêler ancien et neuf.", url: "https://www.selency.fr/" },
  { name: "Sarah Lavoine", note: "Couleurs profondes et esprit parisien.", url: "https://www.sarahlavoine.com/" },
  { name: "Caravane", note: "Textiles, lin lavé et artisanat du monde.", url: "https://www.caravane.fr/" },
];

/* ------------------------------------------------------------------ */

export type Destination = {
  id: string;
  name: string;
  country: string;
  img: string;
  pitch: string;
  insteadOf?: string;
  months: number[]; // 1 = janvier
  flight: string;
  budget: 1 | 2 | 3;
  search: string;
};

const U = (id: string, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const NICHE: Destination[] = [
  {
    id: "vis",
    name: "Île de Vis",
    country: "Croatie",
    img: U("1596182325210-a4f1c8943166"),
    pitch: "L'île la plus au large de la Dalmatie, fermée aux étrangers jusqu'en 1989. Criques, vignes et villages de pêcheurs, à deux heures de ferry de Split.",
    insteadOf: "Dubrovnik ou Split",
    months: [6, 9],
    flight: "≈ 2 h 15 jusqu'à Split, puis ferry",
    budget: 2,
    search: "Vis, Croatia",
  },
  {
    id: "gaziantep",
    name: "Gaziantep",
    country: "Turquie",
    img: U("1662047159388-f5954f2dc592"),
    pitch: "Ville créative de l'UNESCO pour la gastronomie : baklava à la pistache, bazars couverts et les mosaïques de Zeugma.",
    insteadOf: "Istanbul ou la Cappadoce",
    months: [4, 5, 10],
    flight: "≈ 5 h 30 avec escale à Istanbul",
    budget: 1,
    search: "Gaziantep",
  },
  {
    id: "transylvanie",
    name: "Via Transilvanica",
    country: "Roumanie",
    img: U("1787165838176-0cfe8be39060"),
    pitch: "Un sentier de randonnée qui traverse la Roumanie de village en village, entre forêts et églises fortifiées comme celle de Biertan.",
    months: [5, 6, 9],
    flight: "≈ 3 h jusqu'à Cluj ou Sibiu",
    budget: 1,
    search: "Sibiu",
  },
  {
    id: "oulu",
    name: "Oulu",
    country: "Finlande",
    img: U("1674558211660-4e9e78dc6f36"),
    pitch: "Capitale européenne de la culture 2026, au bord d'une mer qui gèle l'hiver. Saunas, vélo sur la glace et nuits presque blanches en juin.",
    months: [2, 3, 6],
    flight: "≈ 4 h 30 avec escale à Helsinki",
    budget: 3,
    search: "Oulu",
  },
  {
    id: "jaffna",
    name: "Jaffna",
    country: "Sri Lanka",
    img: U("1725773682183-f0c885081ce5"),
    pitch: "Le nord tamoul, que peu de voyageurs atteignent : temples colorés, îles reliées par des chaussées et une cuisine différente du reste de l'île.",
    months: [2, 3, 4, 7, 8],
    flight: "≈ 13 h jusqu'à Colombo, puis train",
    budget: 1,
    search: "Jaffna",
  },
  {
    id: "quynhon",
    name: "Quy Nhơn",
    country: "Viêt Nam",
    img: U("1722944175475-6bbc2d6812c6"),
    pitch: "La côte centrale sans la foule : longues plages, rochers sculptés par la mer et tours cham, entre Hội An et Nha Trang.",
    months: [3, 4, 5, 6],
    flight: "≈ 15 h avec escale",
    budget: 1,
    search: "Quy Nhon",
  },
  {
    id: "oaxaca",
    name: "Oaxaca et la Sierra Norte",
    country: "Mexique",
    img: U("1763821530010-89534ec80d19"),
    pitch: "Une ville de marchés et de mezcal, puis les villages zapotèques de la montagne, qui accueillent les randonneurs en coopérative.",
    months: [11, 12, 1, 2, 3],
    flight: "≈ 14 h avec escale à Mexico",
    budget: 1,
    search: "Oaxaca",
  },
  {
    id: "kirghizstan",
    name: "Monts Tian Shan",
    country: "Kirghizstan",
    img: U("1489421382202-f7ec0cfd96f7"),
    pitch: "Des nuits en yourte au bord de lacs d'altitude, à cheval avec des familles de bergers nomades.",
    months: [7, 8, 9],
    flight: "≈ 8 h avec escale à Istanbul",
    budget: 1,
    search: "Bishkek",
  },
];

export const CLASSICS: Destination[] = [
  {
    id: "kyoto",
    name: "Kyoto et Tokyo",
    country: "Japon",
    img: U("1493976040374-85c8e12f0c0e"),
    pitch: "Temples, ryokans et izakayas. À faire au printemps pour les cerisiers ou en novembre pour les érables rouges.",
    months: [3, 4, 11],
    flight: "≈ 14 h direct",
    budget: 3,
    search: "Kyoto",
  },
  {
    id: "islande",
    name: "Islande",
    country: "Islande",
    img: U("1531168556467-80aace0d0144"),
    pitch: "Le tour de l'île en van : canyons moussus, plages noires, glaciers. Soleil de minuit l'été, aurores l'hiver.",
    months: [6, 7, 8, 2, 3],
    flight: "≈ 3 h 30 direct",
    budget: 3,
    search: "Reykjavik",
  },
  {
    id: "sardaigne",
    name: "Sardaigne",
    country: "Italie",
    img: U("1558508006-b47365cf0e61"),
    pitch: "Eaux turquoise, villages perchés et cuisine de bergers. Choisie par Lonely Planet parmi les destinations 2026.",
    months: [5, 6, 9],
    flight: "≈ 2 h direct",
    budget: 2,
    search: "Sardinia",
  },
  {
    id: "cadix",
    name: "Cadix",
    country: "Espagne",
    img: U("1788277476702-16cdc8f90ac5"),
    pitch: "Une des plus vieilles villes d'Europe, entourée par l'Atlantique. Tapas, plages en pleine ville et lumière andalouse.",
    months: [4, 5, 6, 9, 10],
    flight: "≈ 2 h 15 jusqu'à Séville",
    budget: 2,
    search: "Cadiz",
  },
  {
    id: "marrakech",
    name: "Marrakech",
    country: "Maroc",
    img: U("1771148886150-fe1784951a68"),
    pitch: "Souks, riads et jardins, avec l'Atlas à une heure de route. Le week-end dépaysant par excellence.",
    months: [3, 4, 5, 10, 11],
    flight: "≈ 3 h 20 direct",
    budget: 1,
    search: "Marrakech",
  },
  {
    id: "reunion",
    name: "La Réunion",
    country: "France",
    img: U("1698625799324-346a6145b973"),
    pitch: "Cirques, volcan actif, cascades et cuisine créole, sans passeport. Le paradis des randonneurs.",
    months: [5, 6, 7, 8, 9, 10],
    flight: "≈ 11 h direct",
    budget: 2,
    search: "La Reunion",
  },
];

export const TRAVEL_HERO = U("1493976040374-85c8e12f0c0e", 2200);
export const HOME_HERO = "https://images.unsplash.com/photo-1678895223308-da40c609e39b?auto=format&fit=crop&w=2200&q=80";

export function bookingUrl(q: string) {
  return `https://www.booking.com/searchresults.fr.html?ss=${encodeURIComponent(q)}`;
}
export function activitiesUrl(q: string) {
  return `https://www.getyourguide.com/s/?q=${encodeURIComponent(q)}`;
}

/** Domaines autorisés pour la redirection /go depuis les pages Inspiration. */
export function inspirationHosts(): string[] {
  const urls = [
    ...TRENDS.flatMap((t) => t.products.map((p) => p.url)),
    ...HOME_SITES.map((s) => s.url),
    "https://www.booking.com/",
    "https://www.getyourguide.com/",
  ];
  return Array.from(new Set(urls.map((u) => new URL(u).hostname.replace(/^www\d?\./, ""))));
}
