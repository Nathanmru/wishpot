import type { Landing } from "@/lib/landings";

/**
 * Pages « idées » vintage : uniquement des pièces Selency (notre partenaire affilié, brocante en ligne).
 * Elles ciblent les recherches « chaise vintage », « lampe vintage »… où l'on cherche justement de la seconde main.
 */
const SEL = "Selency";
const cat = (q: string) => `/catalogue?marque=${SEL}&q=${encodeURIComponent(q)}`;

export const VINTAGE: Landing[] = [
  {
    slug: "chaise-vintage",
    group: "objets",
    h1: "Chaise vintage : bistrot, scandinave, cannée",
    title: "Chaise vintage : bistrot, scandinave, cannée, design",
    description: "Des chaises vintage chinées : bistrot en bois courbé, chaises scandinaves en teck, chaises cannées, modèles de designers. Des pièces uniques de seconde main.",
    intro: [
      "Une chaise vintage, c'est souvent mieux construite qu'une chaise neuve au même prix : bois massif, assemblages tenonnés, cannage tressé à la main. Et dépareillées autour d'une table, elles donnent tout de suite du caractère à une salle à manger.",
      "Voici des chaises de seconde main chinées par des brocanteurs : bistrot, scandinaves, cannées, en métal ou signées. Chaque pièce est unique, souvent vendue en lot de deux, quatre ou six.",
    ],
    tips: ["Des chaises dépareillées, mais dans le même bois ou la même couleur.", "Vérifiez que la chaise ne bouge pas quand on s'assoit.", "Un cannage abîmé se refait chez un artisan."],
    faq: [
      ["Comment vérifier une chaise vintage avant achat ?", "Demandez si elle est stable, si les assemblages ont été recollés et l'état de l'assise (cannage, paille, tissu). Une chaise qui grince se resserre, une chaise qui bouge beaucoup demande une restauration."],
      ["Peut-on mélanger des chaises différentes autour d'une table ?", "Oui, c'est même très réussi : gardez un point commun (le bois, la couleur ou la hauteur d'assise) pour que l'ensemble reste harmonieux."],
      ["Où acheter des chaises vintage ?", "Sur une brocante en ligne comme Selency, qui réunit des milliers de pièces d'époque vendues par des professionnels et des particuliers. Chaque chaise de cette page renvoie vers son annonce."],
    ],
    filter: { shop: SEL, cats: ["assises"], all: [["chaise", "chair", "bistrot"]] },
    catalogue: cat("chaise"),
    related: ["chaise-cannage", "salle-a-manger-chic", "meubles-chines"],
  },
  {
    slug: "lampe-vintage",
    group: "objets",
    h1: "Lampe vintage : à poser, de bureau, en laiton ou céramique",
    title: "Lampe vintage : laiton, céramique, champignon, bureau",
    description: "Des lampes vintage chinées : lampes en laiton, pieds en céramique, lampes champignon, lampes de bureau articulées. Des pièces d'époque uniques.",
    intro: [
      "Rien ne réchauffe une pièce comme une lampe vintage. Un pied en céramique émaillée, une lampe champignon des années 70 ou une lampe de bureau articulée apportent une lumière basse et chaleureuse, et une vraie personnalité.",
      "Voici des lampes de seconde main sélectionnées chez des brocanteurs. Pensez à vérifier l'électricité : un recâblage est simple et peu coûteux chez un électricien.",
    ],
    tips: ["Une ampoule 2700 K pour une lumière chaude.", "Plusieurs lampes basses valent mieux qu'un plafonnier.", "Faites vérifier le câblage d'une lampe ancienne."],
    faq: [
      ["Une lampe vintage est-elle sûre ?", "La plupart des vendeurs testent leurs lampes, mais un câble ancien ou une douille fatiguée se remplacent facilement. Demandez au vendeur si elle a été recâblée."],
      ["Quelle ampoule pour une lampe vintage ?", "Une LED à filament en blanc chaud (2700 K) garde le charme d'une ampoule ancienne en consommant beaucoup moins."],
      ["Où trouver une lampe vintage ?", "Sur Selency, la brocante en ligne : chaque lampe de cette page renvoie vers son annonce, avec photos, dimensions et état."],
    ],
    filter: { shop: SEL, cats: ["luminaires"], all: [["lampe", "lamp", "chevet", "bureau"]] },
    catalogue: cat("lampe"),
    related: ["lampe-laiton", "lampe-de-chevet", "lampadaire-design"],
  },
  {
    slug: "luminaire-vintage",
    group: "objets",
    h1: "Luminaire vintage : suspensions, appliques et lampadaires",
    title: "Luminaire vintage : suspension, applique, lampadaire",
    description: "Suspensions en verre et en rotin, appliques en laiton, lampadaires d'époque : des luminaires vintage chinés, en pièces uniques.",
    intro: [
      "Un luminaire vintage est souvent la pièce qu'on remarque en premier : une suspension en opaline au-dessus de la table, une paire d'appliques en laiton, un lampadaire arc des années 70.",
      "Voici des luminaires de seconde main trouvés chez des brocanteurs, de l'art déco au space age.",
    ],
    tips: ["Suspension à 70-80 cm au-dessus de la table.", "Les appliques se posent par paire.", "Un variateur rend la lumière plus douce."],
    faq: [
      ["Peut-on installer une suspension ancienne soi-même ?", "Si elle a été recâblée aux normes, oui, comme n'importe quel luminaire. En cas de doute, faites-la vérifier par un électricien."],
      ["Comment dater un luminaire vintage ?", "Les matériaux (opaline, laiton, plastique moulé), la forme et parfois une étiquette d'éditeur donnent la période. Le vendeur indique souvent l'époque dans l'annonce."],
    ],
    filter: { shop: SEL, cats: ["luminaires"], all: [["suspension", "applique", "lampadaire", "plafonnier", "lustre"]] },
    catalogue: cat("suspension"),
    related: ["suspension-design", "applique-murale", "lampadaire-design"],
  },
  {
    slug: "table-basse-vintage",
    group: "objets",
    h1: "Table basse vintage : teck, verre, travertin, rotin",
    title: "Table basse vintage : teck, verre, travertin, rotin",
    description: "Des tables basses vintage chinées : scandinaves en teck, plateaux en verre fumé, travertin des années 70, rotin. Des pièces uniques à petit prix.",
    intro: [
      "La table basse vintage est l'une des meilleures affaires de la seconde main : un plateau en teck massif, en travertin ou en verre fumé coûte souvent moins cher d'occasion qu'un modèle neuf en aggloméré.",
      "Voici des tables basses d'époque chinées par des brocanteurs, du scandinave des années 60 au travertin des années 70.",
    ],
    tips: ["Environ 2/3 de la longueur du canapé.", "40 à 45 cm entre le canapé et la table.", "Un teck terne se ravive à l'huile."],
    faq: [
      ["Quelle table basse vintage choisir ?", "Le teck scandinave pour un salon chaleureux, le travertin pour une ambiance méditerranéenne, le verre pour alléger une petite pièce."],
      ["Comment rénover une table basse en teck ?", "Un nettoyage doux puis une huile pour teck suffisent à raviver la couleur. Les petites rayures s'estompent avec une laine d'acier très fine et de l'huile."],
    ],
    filter: { shop: SEL, cats: ["tables"], all: [["basse", "coffee", "appoint", "bout de canape"]] },
    catalogue: cat("table basse"),
    related: ["table-basse-travertin-marbre", "table-basse-bois", "salon-vintage"],
  },
  {
    slug: "table-vintage",
    group: "objets",
    h1: "Table à manger vintage : bois massif, ronde, à rallonges",
    title: "Table à manger vintage : bois massif, ronde, ferme",
    description: "Des tables à manger vintage : tables de ferme en bois massif, tables rondes, scandinaves à rallonges. Chinées, solides, uniques.",
    intro: [
      "Une table à manger, c'est le meuble qui doit durer. Les tables vintage en bois massif ont déjà prouvé qu'elles tenaient, et leur patine raconte des années de repas.",
      "Voici des tables de seconde main : tables de ferme, tables rondes, modèles scandinaves à rallonges, chinées par des brocanteurs.",
    ],
    tips: ["Comptez 60 cm de largeur par convive.", "Une table ronde de 110 cm accueille 4 à 5 personnes.", "Les rallonges sont précieuses pour recevoir."],
    faq: [
      ["Quelle taille de table pour 6 personnes ?", "Environ 180 x 90 cm pour une table rectangulaire, ou 130 cm de diamètre pour une table ronde."],
      ["Une table ancienne en bois massif s'entretient comment ?", "Un chiffon humide au quotidien, une cire ou une huile une à deux fois par an selon la finition, et des sous-plats pour la chaleur."],
    ],
    filter: { shop: SEL, cats: ["tables"], all: [["manger", "dining", "repas", "ferme", "rallonge"]] },
    catalogue: cat("table"),
    related: ["table-a-manger-ronde", "salle-a-manger-chic", "chaise-vintage"],
  },
  {
    slug: "bureau-vintage",
    group: "objets",
    h1: "Bureau vintage : secrétaire, bureau scandinave, ministre",
    title: "Bureau vintage : secrétaire, scandinave, bureau ministre",
    description: "Des bureaux vintage chinés : secrétaires, bureaux scandinaves en teck, bureaux ministre, consoles-bureaux. Pour travailler dans un coin de caractère.",
    intro: [
      "Un bureau vintage transforme un coin de pièce en vrai lieu de travail. Les secrétaires se referment le soir, les bureaux scandinaves tiennent dans un petit salon, les bureaux ministre ont de la prestance.",
      "Voici des bureaux de seconde main, chinés par des brocanteurs.",
    ],
    tips: ["Au moins 60 cm de profondeur pour un ordinateur.", "Près d'une fenêtre, lumière sur le côté.", "Une lampe articulée vintage complète le coin bureau."],
    faq: [
      ["Un bureau vintage convient-il pour télétravailler ?", "Oui si sa profondeur atteint 55 à 60 cm et sa hauteur environ 73-75 cm. Vérifiez ces deux mesures avant d'acheter."],
      ["Qu'est-ce qu'un secrétaire ?", "Un meuble avec un abattant qui se rabat pour devenir plan de travail. Fermé, il cache tout : idéal dans un salon."],
    ],
    filter: { shop: SEL, all: [["bureau", "desk", "secretaire"]] },
    catalogue: cat("bureau"),
    related: ["bureau-design", "lampe-vintage", "meubles-chines"],
  },
  {
    slug: "vase-vintage",
    group: "objets",
    h1: "Vase vintage : céramique, verre, grès",
    title: "Vase vintage : céramique, verre soufflé, grès",
    description: "Des vases vintage chinés : céramique émaillée, verre soufflé coloré, grès, pièces d'atelier. Des objets uniques pour un bouquet ou seuls.",
    intro: [
      "Un vase vintage, c'est la façon la plus simple et la moins chère d'apporter une touche d'époque : une céramique émaillée des années 60, un verre soufflé coloré, un grès d'atelier.",
      "Voici des vases de seconde main sélectionnés chez des brocanteurs, beaux même sans fleurs.",
    ],
    tips: ["Groupez trois vases de hauteurs différentes.", "Un vase coloré sur un meuble en bois.", "Une seule branche suffit dans un grand vase."],
    faq: [
      ["Comment reconnaître un vase en céramique de qualité ?", "Regardez le dessous : une signature, un cachet d'atelier ou une marque de manufacture. L'émail doit être régulier, sans éclat au bord."],
      ["Un vase ancien est-il étanche ?", "Pas toujours : la céramique non émaillée à l'intérieur peut suinter. Glissez un verre ou un tube à l'intérieur pour les fleurs fraîches."],
    ],
    filter: { shop: SEL, all: [["vase"]] },
    catalogue: cat("vase"),
    related: ["vase-ceramique", "deco-vintage", "bougeoir"],
  },
  {
    slug: "vaisselle-vintage",
    group: "objets",
    h1: "Vaisselle vintage : assiettes, verres, carafes",
    title: "Vaisselle vintage : assiettes, verres, carafes chinés",
    description: "De la vaisselle vintage chinée : assiettes dépareillées, verres anciens, carafes, plats. Pour une table qui a du caractère.",
    intro: [
      "La vaisselle vintage permet de dresser une table unique pour presque rien : des assiettes dépareillées en faïence, des verres ciselés, une carafe d'époque.",
      "Voici de la vaisselle de seconde main, chinée chez des brocanteurs.",
    ],
    tips: ["Dépareillez, mais dans une même palette.", "Les verres ciselés se lavent à la main.", "Une belle carafe change toute une table."],
    faq: [
      ["La vaisselle ancienne va-t-elle au lave-vaisselle ?", "Évitez pour les dorures, la faïence ancienne et le cristal : un lavage à la main les préserve."],
      ["Peut-on manger dans de la vaisselle ancienne ?", "Oui pour la porcelaine et la faïence en bon état. Évitez les pièces très craquelées ou décoratives, et demandez au vendeur en cas de doute."],
    ],
    filter: { shop: SEL, all: [["assiette", "verre", "carafe", "plat", "tasse", "service", "bol"]] },
    catalogue: cat("assiette"),
    related: ["art-de-la-table", "salle-a-manger-chic", "vase-vintage"],
  },
  {
    slug: "meuble-scandinave-vintage",
    group: "objets",
    h1: "Meuble scandinave vintage : teck et design danois",
    title: "Meuble scandinave vintage : teck, design danois, années 60",
    description: "Des meubles scandinaves vintage : enfilades et buffets en teck, chaises danoises, tables basses des années 60. Chinés, en pièces uniques.",
    intro: [
      "Le mobilier scandinave des années 50 et 60 reste l'un des plus recherchés en seconde main : du teck ou du palissandre, des lignes simples, des pieds fuselés et une fabrication très soignée.",
      "Voici des meubles scandinaves d'époque chinés par des brocanteurs : enfilades, buffets, chaises, tables et bureaux.",
    ],
    tips: ["Le teck se nourrit à l'huile une fois par an.", "Une enfilade basse agrandit visuellement la pièce.", "Mélangez avec des pièces contemporaines pour éviter l'effet musée."],
    faq: [
      ["Comment reconnaître un vrai meuble scandinave vintage ?", "Cherchez une étiquette ou un tampon de fabricant (souvent danois), du teck ou du palissandre massif ou plaqué de qualité, et des tiroirs à queues d'aronde."],
      ["Pourquoi le teck vintage est-il si apprécié ?", "C'est un bois dense et stable, qui prend une belle couleur miel en vieillissant et se restaure facilement."],
    ],
    filter: { shop: SEL, all: [["scandinave", "danois", "teck", "teak", "scandinavian"]] },
    catalogue: cat("scandinave"),
    related: ["deco-scandinave", "buffet-vintage", "table-basse-vintage"],
  },
  {
    slug: "rotin-vintage",
    group: "objets",
    h1: "Rotin et osier vintage : fauteuils, miroirs, étagères",
    title: "Rotin vintage : fauteuils, miroirs, étagères en osier",
    description: "Des pièces en rotin et osier vintage : fauteuils, miroirs soleil, étagères, tables d'appoint. L'esprit bohème des années 70, en seconde main.",
    intro: [
      "Le rotin et l'osier vintage apportent une douceur naturelle et un air de vacances. Fauteuils coquille, miroirs soleil, étagères et chevets des années 70 se trouvent facilement en seconde main, souvent à petit prix.",
      "Voici des pièces en rotin, osier et cannage chinées par des brocanteurs.",
    ],
    tips: ["Le rotin craint le soleil direct et l'humidité.", "Un coussin en lin sur un fauteuil en rotin.", "Mélangez avec du bois foncé pour éviter l'effet tout beige."],
    faq: [
      ["Comment nettoyer un meuble en rotin ancien ?", "Un aspirateur avec une brosse douce, puis un chiffon à peine humide. Laissez sécher à l'air, loin d'une source de chaleur."],
      ["Rotin ou osier, quelle différence ?", "Le rotin est une liane tropicale, plus épaisse et rigide. L'osier vient de branches de saule, plus fines et souples, souvent tressées."],
    ],
    filter: { shop: SEL, all: [["rotin", "osier", "rattan", "cannage", "wicker"]] },
    catalogue: cat("rotin"),
    related: ["fauteuil-rotin", "suspension-rotin-papier", "deco-boheme"],
  },
];
