/** Les maisons présentes dans le catalogue, avec une page chacune (/marques/<slug>). */
export type Brand = { slug: string; shop: string; origin: string; intro: string; style: string };

export const BRANDS: Brand[] = [
  { slug: "selency", shop: "Selency", origin: "Paris", style: "vintage et seconde main", intro: "Selency est la plateforme française de la brocante en ligne : meubles et objets vintage, chinés par des professionnels et des particuliers. Chaque pièce est unique, souvent d'époque, et vendue en seconde main." },
  { slug: "westwing", shop: "Westwing", origin: "Munich", style: "déco et mobilier contemporain", intro: "Westwing est une boutique en ligne de décoration et de mobilier, avec ses propres collections : canapés en bouclette, luminaires, miroirs, linge de maison. Un style contemporain et chaleureux, à des prix accessibles." },
  { slug: "caravane", shop: "Caravane", origin: "Paris", style: "mobilier et textiles d'inspiration voyageuse", intro: "Caravane est une maison française de mobilier, de textiles et d'objets, connue pour ses matières naturelles et son inspiration venue du voyage : lin, laine, bois, pièces artisanales." },
  { slug: "nv-gallery", shop: "NV Gallery", origin: "Paris", style: "mobilier design aux lignes affirmées", intro: "NV Gallery est une marque française de mobilier et de décoration design : tables basses en travertin, lampes sculpturales, fauteuils aux formes généreuses. Des pièces de caractère vendues en direct." },
  { slug: "fleux", shop: "Fleux", origin: "Paris", style: "concept store déco et cadeaux", intro: "Fleux est un concept store parisien de décoration et d'objets design : luminaires, plaids, vaisselle, idées cadeaux, avec une sélection pointue et souvent colorée." },
  { slug: "serax", shop: "Serax", origin: "Belgique", style: "art de la table et objets design", intro: "Serax est une maison belge de design, réputée pour son art de la table et ses objets dessinés par des créateurs : céramique, verrerie, vases, petits meubles." },
  { slug: "harto", shop: "Hartô", origin: "France", style: "luminaires et mobilier en bois", intro: "Hartô est une marque française de luminaires et de mobilier, qui travaille le bois et le métal dans des formes simples et douces : suspensions, lampes, consoles, bureaux." },
  { slug: "ferm-living", shop: "Ferm Living", origin: "Copenhague", style: "design danois chaleureux", intro: "Ferm Living est une marque danoise de design intérieur : mobilier, textiles, céramiques et rangements, dans un style scandinave doux, aux couleurs naturelles." },
  { slug: "house-doctor", shop: "House Doctor", origin: "Danemark", style: "déco scandinave et industrielle", intro: "House Doctor est une marque danoise de décoration et de mobilier, au style scandinave teinté d'industriel : métal, bois brut, verre, objets du quotidien." },
  { slug: "audo-copenhagen", shop: "Audo Copenhagen", origin: "Copenhague", style: "design danois contemporain", intro: "Audo Copenhagen (anciennement Menu) est un éditeur danois de design contemporain : chaises, luminaires, objets dessinés par des architectes et designers reconnus." },
  { slug: "broste-copenhagen", shop: "Broste Copenhagen", origin: "Copenhague", style: "vaisselle et déco nordique", intro: "Broste Copenhagen est une maison danoise de décoration et d'art de la table : grès, verrerie, textiles et petits meubles, dans une palette naturelle et nordique." },
];

export const brand = (slug: string) => BRANDS.find((b) => b.slug === slug) ?? null;
export const brandOfShop = (shop: string) => BRANDS.find((b) => b.shop === shop) ?? null;
