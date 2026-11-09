/**
 * Carrousels « Finds » par marque (format TikTok / Instagram) :
 * une photo d'ambiance de la marque en plein écran, avec la fiche de la pièce incrustée par-dessus.
 * Les photos viennent des fiches produit des marques elles-mêmes : la photo d'ambiance et la photo détourée de la même pièce.
 * items = [id de la pièce dans le catalogue, photo d'ambiance, photo détourée]
 * La première photo d'ambiance sert de couverture (sauf si « cover » est donné).
 * Studio : ateliernama.fr/studio, rubrique « Finds par marque ».
 */
export type Find = { slug: string; shop: string; name: string; cover?: string; items: [number, string, string?][] };

const S = "https://cdn.shopify.com/s/files/";

export const FINDS: Find[] = [
  {
    slug: "ferm-living",
    shop: "Ferm Living",
    name: "Ferm Living",
    items: [
      [769, S + "1/0150/3336/8640/files/1104273069_10.jpg?v=1772690383", S + "1/0150/3336/8640/files/1104273069_1.png?v=1772690384"],
      [766, S + "1/0150/3336/8640/files/1104272938_10.jpg?v=1772690409", S + "1/0150/3336/8640/files/1104272938_1.png?v=1772690409"],
      [708, S + "1/0150/3336/8640/files/1104273944_10.jpg?v=1788770329", S + "1/0150/3336/8640/files/1104273944_1.png?v=1788770329"],
      [891, S + "1/0150/3336/8640/files/57859_1104272397_10.jpg?v=1762177766", S + "1/0150/3336/8640/files/196885_1104272397_1.png?v=1762177766"],
      [816, S + "1/0150/3336/8640/files/1104273175_10.jpg?v=1772689467", S + "1/0150/3336/8640/files/1104273171_1.png?v=1772689467"],
      [852, S + "1/0150/3336/8640/files/1104272746_12.jpg?v=1781000026", S + "1/0150/3336/8640/files/1104272746_1.png?v=1772688684"],
    ],
  },
  {
    slug: "harto",
    shop: "Hartô",
    name: "Hartô",
    items: [
      [5984, S + "1/0885/9231/8728/files/12010723672_MARIUS_COMMODE_A_TROIS_TIROIRS_100_CM_CHENE_TEINTE_AMBIANCE_2.webp?v=1785424069", S + "1/0885/9231/8728/files/12010723672_MARIUS_COMMODE_A_TROIS_TIROIRS_100_CM_CHENE_TEINTE_PACKSHOT_2.jpg?v=1785424061"],
      [5929, S + "1/0885/9231/8728/files/12010723530-Harto-Gustave-Tabouret-65cm-Frene-naturel-Vert-cendre-3.webp?v=1762511841", S + "1/0885/9231/8728/files/12010723530-Harto-Gustave-Tabouret-65cm-Frene-naturel-Vert-cendre-1.webp?v=1753871824"],
      [5943, S + "1/0885/9231/8728/files/12010723539_CARMEN_SUSPENSION_SMALL_50_CM_SABLE_DORE_AMBIANCE_1.webp?v=1785425621", S + "1/0885/9231/8728/files/12010723539_CARMEN_SUSPENSION_SMALL_50_CM_SABLE_DORE_PACKSHOT_1.png?v=1785425609"],
      [5995, S + "1/0885/9231/8728/files/12010723550_CARMEN_APPLIQUE_90CM_BLANC_AMBIANCE_1.webp?v=1785425282", S + "1/0885/9231/8728/files/12010723550_CARMEN_APPLIQUE_90CM_BLANC_PACKSHOT_1.png?v=1785425276"],
      [5938, S + "1/0885/9231/8728/files/12010723605-PATERE_ANDREE_S_FRENE_NATUREL_AMBIANCE_1.webp?v=1785417320", S + "1/0885/9231/8728/files/12010723605-PATERE_ANDREE_S_FRENE_NATUREL_PACKSHOT_2.png?v=1785417318"],
      [5903, S + "1/0885/9231/8728/files/12010723635-BUREAU_HYPPOLITE_CHENE_NATUREL_PIEDS_METAL_SAUGE_AMBIANCE_1.webp?v=1784648896", S + "1/0885/9231/8728/files/12010723635-BUREAU_HYPPOLITE_CHENE_NATUREL_PIEDS_METAL_SAUGE_PACKSHOT_1.png?v=1784648778"],
    ],
  },
  {
    slug: "nv-gallery",
    shop: "NV Gallery",
    name: "NV Gallery",
    items: [
      [6351, S + "1/0932/3701/8954/files/WHITE7_9d90c97b-33ed-4596-90cd-b5f98a0033cf.jpg?v=1758288249", S + "1/0932/3701/8954/files/WHITE1_b4c97c3f-d3d6-4dc3-9f33-25fd657c70a0.jpg?v=1758288249"],
      [6054, S + "1/0932/3701/8954/files/64d627e8734bb510381221.jpg?v=1758635998", S + "1/0932/3701/8954/files/64d627ea485c1701009994.jpg?v=1758635998"],
      [6003, S + "1/0932/3701/8954/files/CHAFRCRENA001-A-FRANCESCA-7.jpg?v=1789649616", S + "1/0932/3701/8954/files/CHAFRCRENA001-A-FRANCESCA-1.jpg?v=1789649616"],
      [6117, S + "1/0932/3701/8954/files/6523e4ee78849058666776.jpg?v=1758289087", S + "1/0932/3701/8954/files/6523e4e5f221e722481611.jpg?v=1758289068"],
      [6112, S + "1/0932/3701/8954/files/EmptyName25.jpg?v=1765207228", S + "1/0932/3701/8954/files/EmptyName24.jpg?v=1765207228"],
      [6233, S + "1/0932/3701/8954/files/Luna_olgluagrwh001_01_face_eteinte_4x5_3acdac9c-b935-4e0f-ad2c-d472a7599f63.jpg?v=1791893220", S + "1/0932/3701/8954/files/6787da349df88300404593.jpg?v=1758725454"],
    ],
  },
  {
    slug: "caravane",
    shop: "Caravane",
    name: "Caravane",
    items: [
      [1068, S + "1/0046/8087/6150/files/Sofa-cover-canape-coton-velours-Noely-Sarrasin.jpg?v=1772791159", S + "1/0046/8087/6150/files/SOFACOVERNOELYSARRASIN.png?v=1771931709"],
      [1077, S + "1/0046/8087/6150/files/JAD5578.jpg?v=1770225314", S + "1/0046/8087/6150/files/COUSSINTALLINOLICHEN.png?v=1776703108"],
      [1135, S + "1/0046/8087/6150/files/20260423_Caravane_JadeDeshayes36897.jpg?v=1778689447", S + "1/0046/8087/6150/files/Packshot-tabouret-murgi-losange.jpg?v=1770132514"],
      [1011, S + "1/0046/8087/6150/files/MG_1170.jpg?v=1761042985", S + "1/0046/8087/6150/files/Selena_drap_blanc_casse_pd.jpg?v=1750169906"],
      [1235, S + "1/0046/8087/6150/files/caravane-marine-brusson-4.jpg?v=1727691966", S + "1/0046/8087/6150/files/PLAT_A_TARTE_KOTERRA_BLANC.jpg?v=1727691967"],
      [1043, S + "1/0046/8087/6150/files/20260423_Caravane_JadeDeshayes36682.jpg?v=1778063275", S + "1/0046/8087/6150/files/Assiette_creuse_Amalfi_D22.jpg?v=1778063407"],
    ],
  },
  {
    slug: "fleux",
    shop: "Fleux",
    name: "Fleux",
    items: [
      [1868, S + "1/0589/5959/3531/files/4_4ae4bf50-58af-45f0-90a5-38ab829e0757.png?v=1787130891", S + "1/0589/5959/3531/files/2_639d5a98-0631-438a-8092-51eec1bca9e0.png?v=1787130891"],
      [1910, S + "1/0589/5959/3531/files/5_ae1e8fa1-d38b-4633-9c03-3ba04db80686.png?v=1783342708", S + "1/0589/5959/3531/files/1_6b9d81e2-21df-4e48-a1b9-7bb2e699d1d2.png?v=1783342706"],
      [1902, S + "1/0589/5959/3531/files/5_ec2a02b9-d272-40e8-9d5b-c75e38b4a770.png?v=1783516234", S + "1/0589/5959/3531/files/1_e30d1dcd-7233-40a4-b98c-a0bad3034769.png?v=1783516233"],
      [1615, S + "1/0589/5959/3531/files/2_0861c85c-5e5d-4321-9a1e-42c6c8138da8.png?v=1792763239", S + "1/0589/5959/3531/files/1_df82cb90-742f-447c-8fbe-68599ed4e205.png?v=1792763238"],
      [1765, S + "1/0589/5959/3531/files/7_0fd3fed0-186d-40a3-880e-059a95be051c.jpg?v=1790251826", S + "1/0589/5959/3531/files/5_822f9ef5-0472-49f6-9d10-e8c3b62fecd5.jpg?v=1790251825"],
      [1893, S + "1/0589/5959/3531/files/4_6528c0f9-689b-4e3a-8e0d-4a3b74aa3503.png?v=1784112211", S + "1/0589/5959/3531/files/1_b2dbcce6-d881-467c-87d2-1b48300aea7c.png?v=1784112211"],
    ],
  },
  {
    slug: "serax",
    shop: "Serax",
    name: "Serax",
    items: [
      [1366, S + "1/0681/5816/1172/files/Ecom_B8926302-350_02-jpg.jpg?v=1789564989", S + "1/0681/5816/1172/files/Ecom_B8926302-350_01-jpg.jpg?v=1786453520"],
      [1548, S + "1/0681/5816/1172/files/Ecom_B7218562_02-jpeg.jpg?v=1764731054", S + "1/0681/5816/1172/files/Ecom_B7218562_01-jpeg.jpg?v=1764731054"],
      [1283, S + "1/0681/5816/1172/files/Ecom_B4326204-705_05-jpg.jpg?v=1792113373", S + "1/0681/5816/1172/files/Ecom_B4326204-705_01-jpg.jpg?v=1792113373"],
      [1376, S + "1/0681/5816/1172/files/Ecom_B7325002-504_05-jpg.jpg?v=1786669461", S + "1/0681/5816/1172/files/Ecom_B7325002-504_01-jpg.jpg?v=1786669460"],
      [1275, S + "1/0681/5816/1172/files/Ecom_B6526012-004_02-jpg.jpg?v=1792545283", S + "1/0681/5816/1172/files/Ecom_B6526012-004_01-jpg.jpg?v=1792545282"],
      [1335, S + "1/0681/5816/1172/files/Ecom_B0426018-500_04-jpg.jpg?v=1787619927", S + "1/0681/5816/1172/files/Ecom_B0426018-500_01-jpg.jpg?v=1787619928"],
    ],
  },
  {
    slug: "audo-copenhagen",
    shop: "Audo Copenhagen",
    name: "Audo",
    items: [
      [2161, S + "1/0262/3959/8658/products/MENU_Planters_6_6e94b70d-01f3-4979-89ff-9772d93143b0.jpg?v=1599202756", S + "1/0262/3959/8658/files/Umanoff_Planter_Medium_Front_fcd2d43a-3919-4594-a37e-452cd3cc723e.png?v=1756114386"],
      [2100, S + "1/0262/3959/8658/products/MENU_Daiza_Planters_2.jpg?v=1671612702", S + "1/0262/3959/8658/files/4844649__Daiza_Planter_H35_O25_front_WEB.png?v=1755599794"],
      [2022, S + "1/0262/3959/8658/files/Audo_Reverse_Portable_Sentiment_Paper_Weight_2_db9e6424-fa12-41b8-b8bb-ca8fad2196a2.jpg?v=1772541097", S + "1/0262/3959/8658/files/71231-007329_On.png?v=1772541097"],
      [2051, S + "1/0262/3959/8658/files/androgyne_side_table_grey_galaxy_table_top.jpg?v=1756284582", S + "1/0262/3959/8658/files/71148-007253_Top_5ce4e015-85b7-45fe-9e9a-c1c03d3f2cb0.png?v=1756284582"],
      [1925, S + "1/0262/3959/8658/files/Audo_Wing_Floor_Lamp_Eave_Moular_Sofa_Duomo_Rug_2_86ec89ed-87d2-40d6-9bbc-3e43230af8da.jpg?v=1772450608", S + "1/0262/3959/8658/files/71264-017323_angle_OFF.png?v=1772450600"],
      [1937, S + "1/0262/3959/8658/files/Audo_Penguin_Wooden_Lounge_Chair_645.jpg?v=1780904436", S + "1/0262/3959/8658/files/71317-020610_Oak-Base_Natural-Oak_angle.png?v=1780904166"],
    ],
  },
  {
    slug: "broste-copenhagen",
    shop: "Broste Copenhagen",
    name: "Broste",
    items: [
      [2634, S + "1/0917/3168/9821/files/71210416-5.jpg?v=1768190901", S + "1/0917/3168/9821/files/71210416.jpg?v=1768190901"],
      [2635, S + "1/0917/3168/9821/files/71210415-4.jpg?v=1768190901", S + "1/0917/3168/9821/files/71210415.jpg?v=1768190901"],
      [2759, S + "1/0917/3168/9821/files/32000016-9.jpg?v=1768186291", S + "1/0917/3168/9821/files/32000016.jpg?v=1768186290"],
      [2641, S + "1/0917/3168/9821/files/71177735-4.jpg?v=1768190711", S + "1/0917/3168/9821/files/71177735.jpg?v=1768190710"],
      [2786, S + "1/0917/3168/9821/files/70195002-11_f82af14a-7814-42a6-97d6-9ed31205363e.jpg?v=1768189544", S + "1/0917/3168/9821/files/70195002_0e0e7b80-6a37-461e-8026-41732f416b8e.jpg?v=1768189544"],
      [2827, S + "1/0917/3168/9821/files/14576100-5_342c6c80-3ded-4892-8ea0-9a4e095d6601.jpg?v=1768185535", S + "1/0917/3168/9821/files/14576100_6bd7d71f-6e1e-4d94-a7a3-93eb27207b2e.jpg?v=1768185535"],
    ],
  },
];

export const find = (slug: string) => FINDS.find((f) => f.slug === slug) ?? null;

/** Photo Shopify redimensionnée et convertie en JPEG (Satori ne lit pas le WebP). */
export const sized = (url: string, w = 1200) => (url.includes("cdn.shopify.com") ? url.replace("?v=", `?width=${w}&format=pjpg&v=`) : url);
