import type { LandingFilter } from "@/lib/landings";

/**
 * Guides : des articles de fond qui répondent aux questions que les gens tapent sur Google
 * (« comment choisir la taille de son tapis », « comment reconnaître un meuble vintage »…),
 * illustrés par des pièces du catalogue.
 */
export type GuideSection = { h: string; p: string[]; list?: string[] };

export type Guide = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  kicker: string;
  minutes: number;
  intro: string[];
  sections: GuideSection[];
  faq: [string, string][];
  filter: LandingFilter;
  piecesTitle: string;
  related: { href: string; label: string }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "meubler-un-studio-petit-budget",
    title: "Meubler un studio avec un petit budget : le guide complet",
    h1: "Meubler un studio avec un petit budget",
    description:
      "Par quoi commencer, combien prévoir et comment gagner de la place : notre méthode pour meubler un studio de 20 à 30 m² sans se ruiner, pièce par pièce.",
    kicker: "Premier appartement",
    minutes: 7,
    intro: [
      "Un studio, c'est une seule pièce qui doit tout faire : dormir, manger, travailler, recevoir. La tentation est d'acheter vite et pas cher pour remplir l'espace. C'est souvent là que le budget s'évapore, dans des meubles qu'on remplace un an plus tard.",
      "La bonne méthode tient en trois idées : acheter d'abord ce qui sert tous les jours, choisir des meubles qui font deux choses à la fois, et garder une partie du budget pour les quelques pièces qui donnent du caractère.",
    ],
    sections: [
      {
        h: "1. Commencer par l'essentiel, dans le bon ordre",
        p: [
          "Les premières semaines, il vous faut de quoi bien dormir, de quoi manger assis et de quoi ranger. Tout le reste peut attendre. Classez vos achats en trois vagues et ne passez à la suivante qu'une fois la précédente terminée.",
        ],
        list: [
          "Vague 1, l'indispensable : un bon couchage (lit ou canapé convertible de qualité), une table avec deux chaises, un rangement pour les vêtements, des rideaux occultants.",
          "Vague 2, le confort : un vrai luminaire d'ambiance, un tapis, une étagère, un miroir.",
          "Vague 3, le caractère : la pièce chinée qui raconte quelque chose, les coussins, les vases, l'art au mur.",
        ],
      },
      {
        h: "2. Combien prévoir ?",
        p: [
          "Pour un studio de 20 à 30 m², un budget de 1 500 à 3 000 € permet de s'installer correctement en mélangeant neuf et seconde main. En dessous, privilégiez la seconde main pour les grosses pièces : un buffet ou une table en bois massif d'occasion coûte souvent moins cher qu'un meuble neuf en aggloméré, et dure beaucoup plus longtemps.",
          "Une répartition qui fonctionne : environ 40 % pour le couchage et l'assise, 25 % pour la table et le rangement, 15 % pour la lumière, le reste pour les textiles et la déco.",
        ],
      },
      {
        h: "3. Des meubles qui font deux choses",
        p: [
          "Dans un petit espace, chaque meuble doit mériter sa place. Une table ronde sert de bureau la journée et de table à manger le soir. Un banc en bout de lit range les plaids et sert d'assise d'appoint. Une console derrière le canapé crée une séparation entre le coin nuit et le coin salon.",
        ],
        list: [
          "Préférez une table ronde de 80 à 90 cm : on circule mieux autour qu'autour d'une table carrée.",
          "Choisissez des meubles sur pieds : voir le sol dessous donne une impression d'espace.",
          "Montez en hauteur : une étagère murale haute libère le sol.",
        ],
      },
      {
        h: "4. Créer des zones sans cloisons",
        p: [
          "Ce qui rend un studio agréable, c'est d'y sentir plusieurs espaces. Un tapis délimite le coin salon, une suspension basse marque le coin repas, une étagère ouverte filtre la vue vers le lit sans bloquer la lumière. Trois zones claires valent mieux qu'une pièce où tout se mélange.",
        ],
      },
      {
        h: "5. Garder de la place pour une pièce forte",
        p: [
          "Un studio meublé uniquement de basiques manque d'âme. Gardez 10 à 15 % du budget pour une pièce qui vous plaît vraiment : un fauteuil vintage, une lampe en laiton, un miroir ancien. C'est elle qu'on remarque en entrant, et c'est souvent elle qu'on garde en déménageant.",
          "Si cette pièce dépasse votre budget du moment, mettez-la de côté dans une cagnotte : vous épargnez chaque mois et vous l'achetez quand le montant est atteint, sans crédit.",
        ],
      },
    ],
    faq: [
      ["Quel budget pour meubler un studio ?", "Comptez 1 500 à 3 000 € pour un studio de 20 à 30 m² en mélangeant neuf et seconde main. La seconde main permet de descendre nettement sous ce budget pour les grosses pièces en bois."],
      ["Lit ou canapé convertible dans un studio ?", "Si vous recevez souvent, un convertible de bonne qualité. Si vous dormez dessus tous les soirs, un vrai lit avec un rangement dessous est plus confortable sur la durée, quitte à le séparer du salon par une étagère."],
      ["Comment agrandir visuellement un studio ?", "Des meubles sur pieds, des murs clairs, un grand miroir face à la fenêtre, des rangements qui montent jusqu'au plafond et peu de petits objets posés."],
    ],
    filter: { maxPrice: 400, cats: ["assises", "tables", "rangement", "luminaires", "miroirs"] },
    piecesTitle: "Des pièces à moins de 400 € pour un studio",
    related: [
      { href: "/looks/premier-appart", label: "Look : premier appart à petit prix" },
      { href: "/idees/premier-appartement", label: "Meubler son premier appartement" },
      { href: "/idees/budget-meubler-appartement", label: "Le budget pour meubler un appartement" },
      { href: "/idees/table-a-manger-ronde", label: "Tables à manger rondes" },
    ],
  },
  {
    slug: "reconnaitre-un-meuble-vintage",
    title: "Comment reconnaître un vrai meuble vintage (et bien l'acheter en ligne)",
    h1: "Reconnaître un vrai meuble vintage",
    description:
      "Bois massif ou placage, assemblages, étiquettes, patine : les signes qui ne trompent pas pour reconnaître un meuble vintage de qualité et l'acheter en ligne sans mauvaise surprise.",
    kicker: "Chiner",
    minutes: 6,
    intro: [
      "Acheter vintage, c'est souvent acheter mieux : des bois massifs, des assemblages faits pour durer, des dessins qui ont traversé les décennies. Encore faut-il savoir distinguer une belle pièce d'époque d'un meuble simplement vieux, ou d'une copie récente.",
      "Voici les vérifications que font les brocanteurs, et comment les faire à distance quand on achète en ligne.",
    ],
    sections: [
      {
        h: "Regarder les assemblages",
        p: [
          "C'est le meilleur indice de qualité. Ouvrez un tiroir et regardez ses coins : des assemblages en queue d'aronde (des tenons en forme de trapèze qui s'emboîtent) signent un travail d'ébénisterie. Des agrafes, de la colle seule ou des vis apparentes indiquent une fabrication plus industrielle.",
        ],
      },
      {
        h: "Bois massif, placage ou aggloméré ?",
        p: [
          "Le placage n'est pas un défaut : beaucoup de meubles scandinaves des années 50 et 60 sont en placage de teck ou de palissandre sur une âme solide. Ce qu'il faut éviter, c'est l'aggloméré qui gonfle à l'humidité.",
        ],
        list: [
          "Regardez la tranche d'une porte ou d'un plateau : si le dessin du bois continue sur le chant, c'est du massif.",
          "Sous le meuble et au dos, un bois brut et non peint est bon signe.",
          "Un meuble lourd pour sa taille est généralement de meilleure facture.",
        ],
      },
      {
        h: "Chercher les étiquettes et les marques",
        p: [
          "Beaucoup d'éditeurs marquaient leurs meubles : étiquette métallique, tampon à l'encre, marque au fer sous l'assise ou au dos. Une marque d'éditeur fait monter la valeur, mais son absence ne veut pas dire que la pièce est mauvaise : de nombreux ateliers ne signaient pas.",
        ],
      },
      {
        h: "Distinguer la patine de l'usure",
        p: [
          "La patine, c'est la couleur qu'un bois ou un cuir prend avec le temps : elle est homogène et chaleureuse, elle fait le charme d'une pièce. L'usure problématique, c'est un pied qui bouge, un placage qui se décolle, des traces de vers (petits trous ronds avec de la poussière de bois), ou un cuir craquelé en profondeur.",
        ],
      },
      {
        h: "Acheter en ligne sans mauvaise surprise",
        p: [
          "Sur une brocante en ligne, la photo ne suffit pas. Avant d'acheter, demandez au vendeur ce que vous ne voyez pas.",
        ],
        list: [
          "Des photos du dos, du dessous et de l'intérieur des tiroirs.",
          "Les dimensions exactes, surtout la profondeur : les meubles anciens sont souvent plus profonds que les neufs.",
          "L'état de stabilité : est-ce que la pièce bouge quand on appuie dessus ?",
          "Les conditions de livraison et de retour, qui varient beaucoup d'un vendeur à l'autre.",
        ],
      },
    ],
    faq: [
      ["Quelle différence entre vintage et antiquité ?", "On parle généralement d'antiquité pour un objet de plus de cent ans, et de vintage pour les pièces du XXe siècle, en particulier des années 1950 à 1990."],
      ["Un meuble en placage est-il de mauvaise qualité ?", "Non. Beaucoup de pièces de design scandinave sont en placage de bois noble sur une structure solide. Il faut surtout éviter l'aggloméré bas de gamme, qui supporte mal l'humidité."],
      ["Où acheter des meubles vintage en ligne ?", "Les brocantes en ligne comme Selency réunissent des pièces de professionnels et de particuliers, avec livraison. Atelier Nama les rassemble avec des éditeurs de design pour les comparer."],
    ],
    filter: { shop: "Selency", cats: ["rangement", "assises", "tables"] },
    piecesTitle: "Des meubles vintage chinés en ce moment",
    related: [
      { href: "/idees/deco-vintage", label: "La déco vintage" },
      { href: "/idees/buffet-vintage", label: "Buffets et enfilades vintage" },
      { href: "/idees/meubles-chines", label: "Meubles chinés" },
      { href: "/marques/selency", label: "Selency, la brocante en ligne" },
    ],
  },
  {
    slug: "choisir-taille-tapis-salon",
    title: "Quelle taille de tapis pour son salon ? Le guide des dimensions",
    h1: "Quelle taille de tapis pour son salon ?",
    description:
      "160 x 230, 200 x 300 ou rond ? Comment choisir la taille de son tapis de salon selon le canapé et la pièce, avec les trois placements qui fonctionnent toujours.",
    kicker: "Les bonnes dimensions",
    minutes: 5,
    intro: [
      "L'erreur la plus fréquente avec un tapis, c'est de le choisir trop petit. Posé seul au milieu de la pièce, il flotte et rétrécit visuellement le salon. Un tapis bien dimensionné, au contraire, relie le canapé, les fauteuils et la table basse en un seul ensemble.",
    ],
    sections: [
      {
        h: "La règle de base : le tapis dépasse le canapé",
        p: [
          "Idéalement, le tapis est un peu plus large que le canapé, d'au moins 15 à 20 cm de chaque côté. Il donne ainsi une assise visuelle à tout le coin salon.",
        ],
      },
      {
        h: "Les trois placements qui fonctionnent",
        p: ["Selon la taille de la pièce, choisissez l'une de ces trois configurations."],
        list: [
          "Tous les pieds sur le tapis : canapé et fauteuils posés entièrement dessus. Le plus enveloppant, pour les grands salons (souvent 250 x 350 cm ou plus).",
          "Les pieds avant seulement : seuls les pieds avant du canapé et des fauteuils sont sur le tapis. Le compromis le plus courant (200 x 300 cm pour un canapé trois places).",
          "Le tapis sous la table basse : aucun meuble dessus, sauf la table basse. Pour les petits espaces, à condition que le tapis soit au moins aussi large que la table et une bonne partie du canapé (160 x 230 cm).",
        ],
      },
      {
        h: "Les tailles courantes et leur usage",
        p: [],
        list: [
          "120 x 170 cm : petit salon, coin lecture, chambre d'enfant.",
          "160 x 230 cm : salon de taille moyenne avec un canapé deux ou trois places.",
          "200 x 300 cm : grand salon, tous les pieds avant posés dessus.",
          "Rond de 150 à 200 cm : sous une table à manger ronde ou dans un coin fauteuil.",
        ],
      },
      {
        h: "Laisser respirer les murs",
        p: [
          "Gardez 30 à 60 cm de sol visible entre le tapis et les murs. C'est ce cadre de parquet qui donne l'impression d'un espace maîtrisé.",
          "Astuce simple avant d'acheter : dessinez le contour du tapis au sol avec du ruban de masquage et vivez quelques jours avec.",
        ],
      },
    ],
    faq: [
      ["Quelle taille de tapis pour un canapé trois places ?", "Un 200 x 300 cm si vous voulez poser les pieds avant du canapé dessus, un 160 x 230 cm si le tapis est seulement sous la table basse."],
      ["Quelle taille de tapis sous une table à manger ?", "Le tapis doit dépasser de 60 à 70 cm tout autour de la table, pour que les chaises restent dessus quand on les recule."],
      ["Tapis rond ou rectangulaire dans un salon ?", "Le rectangulaire suit la forme du canapé et convient à la plupart des salons. Le rond adoucit une pièce très anguleuse ou marque un coin fauteuil."],
    ],
    filter: { cats: ["tapis"] },
    piecesTitle: "Des tapis de toutes les tailles",
    related: [
      { href: "/idees/tapis-salon", label: "Tapis de salon" },
      { href: "/idees/tapis-berbere", label: "Tapis berbères" },
      { href: "/idees/tapis-jute", label: "Tapis en jute" },
      { href: "/looks/salon-cognac", label: "Look : salon cuir & cognac" },
    ],
  },
  {
    slug: "choisir-son-canape",
    title: "Comment choisir son canapé : dimensions, assise et tissus",
    h1: "Comment choisir son canapé",
    description:
      "Profondeur d'assise, dimensions, bouclette, lin, velours ou cuir : les critères pour choisir un canapé confortable qui dure, et les erreurs à éviter avant d'acheter.",
    kicker: "Bien acheter",
    minutes: 6,
    intro: [
      "Le canapé est souvent le meuble le plus cher du logement, et celui qu'on garde le plus longtemps. Avant de craquer pour une forme, il faut vérifier trois choses : qu'il rentre, qu'il est confortable pour votre façon de vous asseoir, et que son revêtement supportera votre quotidien.",
    ],
    sections: [
      {
        h: "Mesurer avant de rêver",
        p: [
          "Mesurez l'emplacement, mais aussi le chemin jusqu'au salon : porte d'entrée, couloir, cage d'escalier, ascenseur. Beaucoup de canapés sont refusés à la livraison parce qu'ils ne passent pas un virage.",
        ],
        list: [
          "Laissez 40 à 45 cm entre le canapé et la table basse.",
          "Gardez au moins 80 cm de passage pour circuler autour.",
          "Un canapé trois places mesure en général entre 200 et 240 cm de large.",
        ],
      },
      {
        h: "La profondeur d'assise, le vrai critère de confort",
        p: [
          "Une assise de 55 cm de profondeur se tient droite, idéale pour discuter et pour les personnes de petite taille. Au-delà de 60 cm, on s'enfonce et on replie les jambes : parfait pour se lover, moins pour recevoir. Testez toujours en vous asseyant comme vous le faites chez vous.",
        ],
      },
      {
        h: "Choisir le revêtement selon sa vie",
        p: [],
        list: [
          "Bouclette : très douce et tendance, mais elle accroche les griffes des chats.",
          "Lin : naturel et respirant, il se froisse et c'est son charme. Préférez des housses déhoussables.",
          "Velours : chaleureux et profond, il marque au début puis se patine.",
          "Cuir : il se bonifie avec le temps et se nettoie facilement, idéal avec des enfants. Un cuir vintage a déjà sa patine.",
        ],
      },
      {
        h: "Les détails qui font durer",
        p: [
          "Une structure en bois massif, des coussins d'assise en mousse haute densité ou mélangée de plumes, et des housses amovibles. Un canapé dont on peut changer la housse dans cinq ans est un canapé qu'on garde dix ans.",
        ],
      },
    ],
    faq: [
      ["Quelle profondeur d'assise pour un canapé confortable ?", "Entre 55 et 60 cm pour une assise droite et polyvalente, plus de 60 cm pour un canapé dans lequel on s'allonge."],
      ["Quel tissu de canapé avec un chat ?", "Évitez la bouclette et les tissages lâches. Le cuir, le velours ras et les tissus serrés résistent mieux aux griffes."],
      ["Comment payer un canapé cher sans crédit ?", "En mettant la somme de côté chaque mois dans une cagnotte, éventuellement ouverte à vos proches pour un anniversaire ou une crémaillère."],
    ],
    filter: { cats: ["assises"], all: [["canape", "sofa"]] },
    piecesTitle: "Des canapés à comparer",
    related: [
      { href: "/idees/canape-design", label: "Canapés design" },
      { href: "/idees/canape-bouclette", label: "Canapés en bouclette" },
      { href: "/idees/canape-cuir-vintage", label: "Canapés en cuir vintage" },
      { href: "/idees/cagnotte-canape", label: "Épargner pour un canapé" },
    ],
  },
  {
    slug: "eclairer-son-salon",
    title: "Bien éclairer son salon : la lumière en couches et les bonnes hauteurs",
    h1: "Bien éclairer son salon",
    description:
      "Suspension, lampadaire, lampes à poser, appliques : comment combiner les sources de lumière, à quelle hauteur les placer et quelle température de couleur choisir.",
    kicker: "Lumière",
    minutes: 5,
    intro: [
      "Un plafonnier seul au milieu du salon donne une lumière plate et froide, qui écrase les volumes. Les décorateurs raisonnent autrement : ils superposent plusieurs sources à des hauteurs différentes. C'est ce qu'on appelle l'éclairage en couches, et c'est le moyen le plus simple de rendre une pièce chaleureuse.",
    ],
    sections: [
      {
        h: "Les trois couches de lumière",
        p: [],
        list: [
          "La lumière générale : une suspension ou un plafonnier, pour circuler et ranger.",
          "La lumière d'usage : un lampadaire liseuse près du fauteuil, une lampe de bureau, là où l'on a besoin de voir.",
          "La lumière d'ambiance : des lampes à poser, des appliques, une bougie. C'est elle qu'on allume le soir.",
        ],
      },
      {
        h: "Les bonnes hauteurs",
        p: [],
        list: [
          "Suspension au-dessus d'une table : 70 à 80 cm entre le bas de l'abat-jour et le plateau.",
          "Suspension dans un passage : au moins 2,10 m du sol.",
          "Applique murale : vers 1,60 à 1,80 m, au-dessus du regard.",
          "Lampe à poser : le bas de l'abat-jour à hauteur des yeux quand on est assis.",
        ],
      },
      {
        h: "Choisir la température de couleur",
        p: [
          "Pour un salon, choisissez des ampoules blanc chaud, autour de 2 700 kelvins : c'est la lumière douce des lampes à incandescence. Gardez le blanc neutre pour la cuisine ou le bureau. Et si possible, installez des variateurs : baisser la lumière le soir change complètement l'atmosphère.",
        ],
      },
      {
        h: "Les matières qui filtrent",
        p: [
          "Le papier de riz, le rotin, le lin et le verre opalin diffusent une lumière douce. Le laiton et le verre ambré la réchauffent. Une seule lampe sculpturale bien placée peut devenir la pièce forte du salon.",
        ],
      },
    ],
    faq: [
      ["À quelle hauteur accrocher une suspension au-dessus d'une table ?", "Entre 70 et 80 cm entre le bas du luminaire et le plateau de la table."],
      ["Combien de sources de lumière dans un salon ?", "Au moins trois ou quatre : une lumière générale, une ou deux lampes d'usage et des lampes d'ambiance réparties dans la pièce."],
      ["Quelle température de couleur pour un salon ?", "Du blanc chaud, autour de 2 700 K, pour une lumière douce et chaleureuse."],
    ],
    filter: { cats: ["luminaires"] },
    piecesTitle: "Des luminaires pour chaque couche",
    related: [
      { href: "/idees/suspension-design", label: "Suspensions design" },
      { href: "/idees/lampadaire-design", label: "Lampadaires design" },
      { href: "/idees/lampe-laiton", label: "Lampes en laiton" },
      { href: "/alternative/akari", label: "Alternative à la lampe Akari" },
    ],
  },
  {
    slug: "cagnotte-pour-meubler-son-appartement",
    title: "Faire une cagnotte pour meubler son appartement : mode d'emploi",
    h1: "Faire une cagnotte pour meubler son appartement",
    description:
      "Emménagement, crémaillère, mariage ou simple envie : comment créer une cagnotte déco, fixer un objectif réaliste, épargner chaque mois et inviter ses proches à participer.",
    kicker: "Cagnotte",
    minutes: 5,
    intro: [
      "Meubler un appartement coûte vite plusieurs milliers d'euros. Plutôt que de tout acheter d'un coup, à crédit, ou de recevoir des cadeaux qui ne vous ressemblent pas, une cagnotte déco permet de viser les pièces que vous voulez vraiment et de les financer à votre rythme.",
    ],
    sections: [
      {
        h: "1. Choisir les pièces avant le montant",
        p: [
          "Une cagnotte qui marche est une cagnotte concrète. Listez d'abord les pièces que vous voulez, avec leur prix : le canapé, la table, la lampe. Le montant de l'objectif en découle. Vos proches participent bien plus volontiers à « notre canapé en lin » qu'à une somme abstraite.",
        ],
      },
      {
        h: "2. Fixer une date et un rythme",
        p: [
          "Donnez-vous une date : l'emménagement, la crémaillère, le mariage. La cagnotte calcule alors combien mettre de côté chaque mois pour y arriver. Un objectif de 2 400 € sur un an, c'est 200 € par mois, seul ou à plusieurs.",
        ],
      },
      {
        h: "3. Inviter les bonnes personnes au bon moment",
        p: [
          "Partagez la cagnotte quand il y a une occasion : invitation de crémaillère, faire-part de mariage, anniversaire. Montrez les pièces choisies et l'avancement : voir la jauge monter donne envie de participer.",
        ],
        list: [
          "À deux, partagez l'objectif avec votre conjoint pour épargner ensemble.",
          "En famille, proposez la cagnotte à la place d'une liste de cadeaux.",
          "Entre amis, une pièce commune pour une crémaillère fait un très beau cadeau.",
        ],
      },
      {
        h: "4. Acheter quand c'est le bon moment",
        p: [
          "Une fois une pièce financée, achetez-la directement chez la boutique. Si elle a été vendue entre-temps (c'est fréquent en vintage), remplacez-la par une pièce équivalente : l'épargne, elle, reste disponible.",
        ],
      },
    ],
    faq: [
      ["Comment faire une cagnotte pour une crémaillère ?", "Choisissez les pièces que vous aimeriez recevoir, créez une cagnotte avec un objectif et une date, puis partagez le lien avec l'invitation."],
      ["Une cagnotte déco est-elle payante ?", "Créer une cagnotte sur Atelier Nama est gratuit. Les achats se font ensuite directement chez les boutiques."],
      ["Peut-on mettre n'importe quel objet dans une cagnotte ?", "Oui : une pièce du catalogue, ou n'importe quel objet trouvé ailleurs en ajoutant son lien."],
    ],
    filter: { maxPrice: 1200, cats: ["assises", "tables", "luminaires", "rangement"] },
    piecesTitle: "Des pièces à mettre dans une cagnotte",
    related: [
      { href: "/idees/cagnotte-deco", label: "La cagnotte déco" },
      { href: "/idees/cagnotte-cremaillere", label: "Cagnotte de crémaillère" },
      { href: "/idees/liste-mariage-maison", label: "Liste de mariage pour la maison" },
      { href: "/idees/financer-meubles-sans-credit", label: "Financer ses meubles sans crédit" },
    ],
  },
];

export const guide = (slug: string) => GUIDES.find((g) => g.slug === slug) ?? null;
