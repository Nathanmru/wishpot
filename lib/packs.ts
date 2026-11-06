/**
 * Packs déco : des pièces choisies pour aller ensemble (même palette, même esprit), pièce par pièce.
 * Servent au studio vidéo (« Le look complet pour X € ») et pourront devenir des pages du site.
 * Les pièces vintage peuvent être vendues : le studio n'affiche que celles encore en ligne.
 */
export type Pack = { slug: string; name: string; room: string; mood: string; ids: number[] };

export const PACKS: Pack[] = [
  { slug: "salon-japandi", name: "Salon japandi", room: "Salon", mood: "Bois clair, lin et céramique écrue, tout en douceur", ids: [6078, 5941, 6214, 1761, 869, 1844] },
  { slug: "salon-cognac", name: "Salon cuir & cognac", room: "Salon", mood: "Cuir patiné, noyer et tapis berbère, l'esprit vintage chaleureux", ids: [6481, 6113, 3911, 4108, 1933, 6302] },
  { slug: "salon-boheme", name: "Salon bohème naturel", room: "Salon", mood: "Cannage, jute, papier de riz et lin terracotta", ids: [6492, 6798, 939, 4098, 1820, 605] },
  { slug: "salon-ambre", name: "Salon ambre & laiton", room: "Salon", mood: "Courbes, verre ambré et touches de laiton, un brin art déco", ids: [6039, 3047, 6177, 6269, 4161, 688] },
  { slug: "chambre-lin", name: "Chambre cosy en lin", room: "Chambre", mood: "Rotin, teck et linge lavé couleur terre", ids: [3586, 960, 3038, 1906, 919, 1811] },
  { slug: "salle-a-manger", name: "Salle à manger chic", room: "Salle à manger", mood: "Bois sculpté, bouclette et suspension sable doré", ids: [6093, 6023, 5943, 668, 765, 5956] },
  { slug: "coin-bureau", name: "Coin bureau design", room: "Bureau", mood: "Bois blond, bouclette et touches de vert", ids: [6152, 6021, 1738, 6461, 4239, 908] },
  { slug: "entree", name: "Entrée qui accueille", room: "Entrée", mood: "Bois, céramique blanche et miroir organique", ids: [6263, 1554, 1873, 658, 5938, 2087] },
  { slug: "premier-appart", name: "Premier appart à petit prix", room: "Salon", mood: "Jute, bois et papier de riz : le cosy sans se ruiner", ids: [6539, 6798, 6461, 6640, 869, 6302] },
];

export const pack = (slug: string) => PACKS.find((p) => p.slug === slug) ?? null;
