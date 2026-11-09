/**
 * Carrousels « Finds » par marque (format TikTok / Instagram) :
 * une photo d'ambiance de la marque en plein écran, avec la fiche de la pièce incrustée par-dessus.
 * Les photos d'ambiance viennent des fiches produit des marques elles-mêmes (galerie de la pièce).
 * items = [id de la pièce dans le catalogue, photo d'ambiance]
 */
export type Find = { slug: string; shop: string; name: string; items: [number, string][] };

export const FINDS: Find[] = [
  {
    slug: "ferm-living",
    shop: "Ferm Living",
    name: "Ferm Living",
    items: [
      [579, "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/1104274557_10.jpg?v=1788766543"],
      [709, "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/1104273497_10.jpg?v=1788770981"],
      [702, "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/1104273994_10.jpg?v=1788770137"],
      [726, "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/1104273868_10.jpg?v=1788770235"],
      [729, "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/1104273499_10.jpg?v=1788770999"],
      [563, "https://cdn.shopify.com/s/files/1/0150/3336/8640/files/1104274224_13.jpg?v=1788769165"],
    ],
  },
  {
    slug: "harto",
    shop: "Hartô",
    name: "Hartô",
    items: [
      [5920, "https://cdn.shopify.com/s/files/1/0885/9231/8728/files/getpubthumb_ca7f3e90-61e2-4776-9681-09ab47d2b71b.jpg?v=1763419416"],
      [5926, "https://cdn.shopify.com/s/files/1/0885/9231/8728/files/getpubthumb_79fb2303-ae51-4f36-aca6-41fe689008f3.jpg?v=1730876622"],
      [5941, "https://cdn.shopify.com/s/files/1/0885/9231/8728/files/getpubthumb_b42415fd-6df4-487d-a882-019464a248d5.jpg?v=1730739987"],
      [5953, "https://cdn.shopify.com/s/files/1/0885/9231/8728/files/getpubthumb_6c8f6470-916a-4dfc-a1fd-6ac309d824b9.jpg?v=1730843369"],
      [5984, "https://cdn.shopify.com/s/files/1/0885/9231/8728/files/12010723672_MARIUS_COMMODE_A_TROIS_TIROIRS_100_CM_CHENE_TEINTE_PACKSHOT_4.jpg?v=1785424061"],
    ],
  },
  {
    slug: "nv-gallery",
    shop: "NV Gallery",
    name: "NV Gallery",
    items: [
      [6346, "https://cdn.shopify.com/s/files/1/0932/3701/8954/files/CORTEX-RCRCOXWHWH001-A-160x230-1.jpg?v=1790337217"],
      [6312, "https://cdn.shopify.com/s/files/1/0932/3701/8954/files/6818b70d1eec9797981977.jpg?v=1758642781"],
      [6252, "https://cdn.shopify.com/s/files/1/0932/3701/8954/files/667e72d1587f7890031034.jpg?v=1758635765"],
      [6245, "https://cdn.shopify.com/s/files/1/0932/3701/8954/files/PICTURES4_6915c96d-e924-407c-b379-ceb694e6c591.jpg?v=1777383655"],
      [6288, "https://cdn.shopify.com/s/files/1/0932/3701/8954/files/68486-852.160230.1_TS001.jpg?v=1790157727"],
      [6281, "https://cdn.shopify.com/s/files/1/0932/3701/8954/files/62663-616.160213_TS101.jpg?v=1784274615"],
    ],
  },
  {
    slug: "caravane",
    shop: "Caravane",
    name: "Caravane",
    items: [
      [1128, "https://cdn.shopify.com/s/files/1/0046/8087/6150/files/Shoot61_093copie_9f3b3db9-51aa-413a-9fd9-151ad3e0ee88.jpg?v=1770729742"],
      [1045, "https://cdn.shopify.com/s/files/1/0046/8087/6150/files/Lix_lampadaire_7_c9f481da-9794-439a-be8c-eba53a4e1519.jpg?v=1770645733"],
      [1267, "https://cdn.shopify.com/s/files/1/0046/8087/6150/files/rPXA6FOw.jpg?v=1727690254"],
      [1177, "https://cdn.shopify.com/s/files/1/0046/8087/6150/files/MG_1176_1f5010da-ff09-4bb5-a025-5a9c180957c7.jpg?v=1774878625"],
      [960, "https://cdn.shopify.com/s/files/1/0046/8087/6150/files/CRVN_20250623_SHOWROOM-028_HD2.jpg?v=1752075646"],
      [995, "https://cdn.shopify.com/s/files/1/0046/8087/6150/files/NIGELLEP_TERRACOTTA_CACAO_46x47_2.jpg?v=1787132352"],
    ],
  },
  {
    slug: "fleux",
    shop: "Fleux",
    name: "Fleux",
    items: [
      [1724, "https://cdn.shopify.com/s/files/1/0589/5959/3531/files/2_e7909b78-7143-4a23-b640-30a64c0ff87e.jpg?v=1791801647"],
      [1803, "https://cdn.shopify.com/s/files/1/0589/5959/3531/files/1_177d9fc1-862a-4456-b46f-cda930a351bb.jpg?v=1788532798"],
      [1696, "https://cdn.shopify.com/s/files/1/0589/5959/3531/files/2_b284c307-8073-444f-8c47-06aa48d7cc34.jpg?v=1792055616"],
      [1890, "https://cdn.shopify.com/s/files/1/0589/5959/3531/files/panton-wire-half-chrome.jpg?v=1742205896"],
      [1801, "https://cdn.shopify.com/s/files/1/0589/5959/3531/files/2_0a79d4c6-33a8-4975-8b0e-67e43c955feb.jpg?v=1788534062"],
    ],
  },
  {
    slug: "serax",
    shop: "Serax",
    name: "Serax",
    items: [
      [1586, "https://cdn.shopify.com/s/files/1/0681/5816/1172/files/Ecom_B5117139_02-jpg.jpg?v=1752548429"],
      [1399, "https://cdn.shopify.com/s/files/1/0681/5816/1172/files/Ecom_B0826204-600_04-jpg.jpg?v=1786453449"],
      [1417, "https://cdn.shopify.com/s/files/1/0681/5816/1172/files/Ecom_-A8521100C_02-jpg.jpg?v=1752544884"],
      [1364, "https://cdn.shopify.com/s/files/1/0681/5816/1172/files/Ecom_B8926302-521_02-jpg.jpg?v=1789564990"],
      [1541, "https://cdn.shopify.com/s/files/1/0681/5816/1172/files/Ecom_B7221022_02-jpg.jpg?v=1752550371"],
    ],
  },
  {
    slug: "audo-copenhagen",
    shop: "Audo Copenhagen",
    name: "Audo",
    items: [
      [2103, "https://cdn.shopify.com/s/files/1/0262/3959/8658/products/byLassen_KubusBowlSmall_300.jpg?v=1694092795"],
      [2120, "https://cdn.shopify.com/s/files/1/0262/3959/8658/products/MENU_Clip_Candle_Holder_Wall_3_copy.jpg?v=1664270446"],
      [1976, "https://cdn.shopify.com/s/files/1/0262/3959/8658/products/MENU_Ready_Dining_Chair_10_v1.jpg?v=1697462049"],
      [2141, "https://cdn.shopify.com/s/files/1/0262/3959/8658/products/MENU_Epoch_Rack_3.jpg?v=1631622942"],
      [1965, "https://cdn.shopify.com/s/files/1/0262/3959/8658/products/MENU_CoChair_FU_01_dcb955ab-11ec-4be2-b71c-99f7bdeb7984.jpg?v=1678872579"],
    ],
  },
  {
    slug: "broste-copenhagen",
    shop: "Broste Copenhagen",
    name: "Broste",
    items: [
      [2663, "https://cdn.shopify.com/s/files/1/0917/3168/9821/files/31001107-5.jpg?v=1768186267"],
      [2812, "https://cdn.shopify.com/s/files/1/0917/3168/9821/files/31000319-1.jpg?v=1768186246"],
      [2619, "https://cdn.shopify.com/s/files/1/0917/3168/9821/files/70030226-1.jpg?v=1768188756"],
      [2801, "https://cdn.shopify.com/s/files/1/0917/3168/9821/files/32000076-1.jpg?v=1768186306"],
      [2840, "https://cdn.shopify.com/s/files/1/0917/3168/9821/files/14469061-5.jpg?v=1768184442"],
    ],
  },
];

export const find = (slug: string) => FINDS.find((f) => f.slug === slug) ?? null;

/** Photo Shopify redimensionnée (plus légère à télécharger pour fabriquer la slide). */
export const sized = (url: string, w = 1200) => (url.includes("cdn.shopify.com") ? url.replace("?v=", `?width=${w}&v=`) : url);
