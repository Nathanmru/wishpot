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
  {
    slug: "entretenir-canape-cuir",
    title: "Entretenir un canapé en cuir (vintage ou neuf) : la méthode simple",
    h1: "Entretenir un canapé en cuir, vintage ou neuf",
    description:
      "Dépoussiérer, nettoyer, nourrir, rattraper une tache ou une craquelure : la méthode simple pour garder un canapé en cuir beau pendant des décennies, même chiné.",
    kicker: "Entretien",
    minutes: 6,
    intro: [
      "Un canapé en cuir bien entretenu vieillit mieux que n'importe quel autre canapé : il se patine, prend une couleur plus profonde et gagne en caractère. Mal entretenu, il sèche, se craquelle et se décolore. La différence tient à quelques gestes, quelques fois par an.",
      "Avant toute chose, identifiez votre cuir. C'est lui qui décide de ce que vous pouvez faire, et surtout de ce qu'il ne faut pas faire.",
    ],
    sections: [
      {
        h: "1. Reconnaître son type de cuir",
        p: [
          "Faites le test de la goutte d'eau sur une zone cachée (sous un coussin, à l'arrière). Si la goutte perle et reste en surface, le cuir est protégé par une finition pigmentée ou semi-aniline : c'est le cas de la plupart des canapés. Si elle pénètre en quelques secondes en laissant une trace sombre, c'est un cuir aniline ou nubuck, beaucoup plus délicat.",
        ],
        list: [
          "Cuir pigmenté (le plus courant) : couleur uniforme, résistant, se nettoie facilement.",
          "Cuir semi-aniline : aspect naturel avec une fine protection, le bon compromis.",
          "Cuir aniline et nubuck : très doux, très beau, mais il absorbe tout. Pas d'eau, pas de produit gras sans test préalable.",
        ],
      },
      {
        h: "2. Le geste de chaque semaine : dépoussiérer",
        p: [
          "La poussière est l'ennemi discret du cuir : elle s'incruste dans le grain et agit comme un abrasif à chaque fois qu'on s'assoit. Passez un chiffon microfibre sec, ou l'aspirateur avec la brosse à poils doux, en insistant sur les coutures et les plis du capitonnage d'un chesterfield.",
        ],
      },
      {
        h: "3. Nettoyer deux à quatre fois par an",
        p: [
          "Utilisez un lait ou un savon spécial cuir, jamais un produit ménager, du vinaigre ou des lingettes pour bébé, qui dessèchent le cuir et attaquent sa finition. Appliquez avec un chiffon doux légèrement humide, par petites zones, sans frotter fort, puis essuyez avec un chiffon sec.",
        ],
      },
      {
        h: "4. Nourrir une à deux fois par an",
        p: [
          "C'est le geste qui fait vieillir un cuir en beauté. Une crème ou un baume nourrissant redonne au cuir les matières grasses qu'il perd avec le temps, la chaleur et la lumière. Appliquez une fine couche, laissez pénétrer quelques heures, puis lustrez. Sur un cuir vintage très sec, deux applications espacées d'une semaine valent mieux qu'une couche épaisse.",
        ],
      },
      {
        h: "5. Bien le placer",
        p: [
          "Le meilleur entretien ne compensera pas un mauvais emplacement. Gardez le canapé à au moins 50 cm d'un radiateur et à l'abri du soleil direct, qui décolore et dessèche le cuir en quelques mois. Si votre salon est très lumineux, un voilage suffit à le protéger.",
        ],
      },
      {
        h: "6. Taches, griffures et craquelures",
        p: [
          "Épongez immédiatement un liquide en tamponnant, sans frotter. Une tache de gras s'estompe souvent d'elle-même en quelques jours en migrant dans le cuir. Les petites griffures superficielles disparaissent avec un baume nourrissant et un peu de chaleur de la main. Pour des craquelures profondes ou un cuir décoloré, un artisan rénovateur pourra recolorer et assouplir le cuir : sur un beau canapé vintage, c'est souvent un investissement rentable.",
        ],
      },
      {
        h: "7. Acheter un canapé en cuir d'occasion : ce qu'il faut vérifier",
        p: [
          "Sur un canapé chiné, un cuir patiné ou légèrement griffé n'est pas un défaut : c'est son charme. Ce qu'il faut surveiller, c'est la structure.",
        ],
        list: [
          "Le cuir ne doit pas être cartonné ni fendu sur les zones d'appui (accoudoirs, assise).",
          "Les coutures doivent tenir : une couture qui lâche se refait, mais c'est à négocier dans le prix.",
          "L'assise ne doit pas s'affaisser : soulevez les coussins et appuyez sur les sangles ou les ressorts.",
          "Demandez les dimensions exactes et mesurez vos portes et escaliers avant d'acheter.",
        ],
      },
    ],
    faq: [
      ["Avec quoi nourrir un canapé en cuir ?", "Avec une crème ou un baume spécial cuir, une à deux fois par an. Évitez l'huile de cuisine, la vaseline ou les produits maison : ils tachent et rancissent."],
      ["Peut-on nettoyer un canapé en cuir avec du savon de Marseille ?", "Sur un cuir pigmenté et en très petite quantité, c'est possible, mais un savon spécial cuir est plus sûr. Sur un cuir aniline ou nubuck, évitez toute eau savonneuse."],
      ["Comment raviver un canapé en cuir décoloré ?", "Un baume nourrissant redonne de la profondeur à un cuir terni. Pour une vraie décoloration, une recoloration par un rénovateur de cuir donne les meilleurs résultats."],
      ["Un canapé en cuir vintage est-il un bon achat ?", "Oui, s'il a une bonne structure : un cuir de qualité bien entretenu dure plusieurs décennies et se revend bien, contrairement à un canapé neuf d'entrée de gamme."],
    ],
    filter: { cats: ["assises"], all: [["canape", "sofa", "chesterfield", "fauteuil"], ["cuir", "leather"]] },
    piecesTitle: "Des canapés et fauteuils en cuir",
    related: [
      { href: "/idees/canape-cuir-vintage", label: "Canapés en cuir vintage" },
      { href: "/idees/fauteuil-vintage", label: "Fauteuils vintage" },
      { href: "/guides/choisir-son-canape", label: "Bien choisir son canapé" },
      { href: "/idees/deco-cognac-camel", label: "Déco cognac et camel" },
    ],
  },
  {
    slug: "table-basse-travertin",
    title: "Table basse en travertin : avis, entretien et comment bien la choisir",
    h1: "Table basse en travertin : le guide pour bien choisir",
    description:
      "Travertin, marbre ou pierre reconstituée ? Avantages, défauts, entretien, forme et taille : tout ce qu'il faut savoir avant d'acheter une table basse en travertin.",
    kicker: "Matières",
    minutes: 6,
    intro: [
      "La table basse en travertin est partout depuis quelques années, et ce n'est pas qu'une mode : cette pierre calcaire beige et douce réchauffe un salon, se marie avec le bois, le lin et le cuir, et donne immédiatement une allure plus soignée à la pièce.",
      "Mais le travertin est une pierre naturelle, avec ses qualités et ses caprices. Voici ce qu'il faut savoir avant de se décider.",
    ],
    sections: [
      {
        h: "1. Le travertin, c'est quoi exactement ?",
        p: [
          "Le travertin est un calcaire qui se forme autour des sources chaudes. Les bulles de gaz piégées pendant sa formation lui donnent ses petits trous et ses veines horizontales caractéristiques. On le trouve surtout en Italie et en Turquie, dans des teintes qui vont du crème au beige rosé, au miel et au noyer.",
        ],
        list: [
          "Travertin rebouché (ou « bouché ») : les trous sont remplis d'une résine de la même couleur. Surface lisse, plus facile à vivre.",
          "Travertin non rebouché : les alvéoles restent ouvertes. Plus brut, plus authentique, mais les miettes et la poussière s'y logent.",
          "Finition polie, adoucie (mate) ou brute : la finition adoucie est la plus courante en déco, douce au toucher et moins brillante.",
        ],
      },
      {
        h: "2. Travertin ou marbre ?",
        p: [
          "Le marbre est plus dense, plus veiné et souvent plus froid visuellement, avec des contrastes marqués (blanc et gris, vert, noir). Le travertin est plus chaud, plus uniforme et plus doux. Pour une ambiance chaleureuse, naturelle ou méditerranéenne, le travertin est plus facile à intégrer. Pour une ambiance graphique ou art déco, le marbre a plus de présence.",
        ],
      },
      {
        h: "3. Les défauts à connaître",
        p: [
          "Le travertin est poreux : il absorbe les liquides et craint les acides. Un verre de vin, un jus de citron ou un vinaigre posé directement peuvent laisser une auréole mate ou une tache. C'est le principal point d'attention, surtout avec des enfants ou si la table sert d'appui pour l'apéritif.",
          "Il est aussi lourd : une table basse en travertin massif dépasse facilement 60 à 100 kg. Vérifiez qu'elle passe dans l'escalier, et prévoyez de la déplacer à deux.",
        ],
      },
      {
        h: "4. L'entretien au quotidien",
        p: [
          "Une table bien traitée vit très bien au quotidien. Le secret tient en trois gestes.",
        ],
        list: [
          "Un hydrofuge ou imperméabilisant pour pierre naturelle, à renouveler une fois par an : c'est la meilleure protection contre les taches.",
          "Des sous-verres et un plateau pour les bouteilles, surtout pour les boissons acides.",
          "Un chiffon doux et de l'eau, avec quelques gouttes de savon noir au besoin. Jamais de vinaigre, d'anticalcaire ou de produit acide, qui attaquent la pierre.",
        ],
      },
      {
        h: "5. Choisir la bonne taille et la bonne forme",
        p: [
          "La table basse idéale fait environ les deux tiers de la longueur du canapé et se place à 40 à 45 cm de l'assise, pour pouvoir circuler et attraper son verre sans se lever. Sa hauteur doit être proche de celle de l'assise, ou légèrement en dessous.",
          "Une table ronde ou ovale adoucit un salon carré et facilite la circulation. Une table rectangulaire convient mieux devant un grand canapé droit. Les modèles sur pied central (la fameuse forme « champignon » ou colonne) allègent la silhouette malgré le poids de la pierre.",
        ],
      },
      {
        h: "6. Avec quoi l'associer ?",
        p: [
          "Le travertin aime les matières naturelles : lin lavé, bois clair ou noyer, cuir cognac, laine bouclée, céramique mate. Pour éviter un salon trop monochrome beige, ajoutez une touche de contraste : un métal noir, une lampe en laiton, un tapis avec du motif ou une couleur profonde comme le vert sauge ou le terracotta.",
        ],
      },
    ],
    faq: [
      ["Le travertin est-il fragile ?", "Il est solide mais sensible aux taches et aux acides car poreux. Avec un traitement hydrofuge annuel et des sous-verres, il vieillit très bien."],
      ["Comment enlever une tache sur une table en travertin ?", "Agissez vite avec de l'eau et un savon neutre. Pour une tache incrustée, il existe des cataplasmes spéciaux pierre naturelle. Évitez tout produit acide, qui aggrave le problème."],
      ["Une table basse en travertin, est-ce encore à la mode ?", "C'est devenu un classique de la déco naturelle et méditerranéenne, comme le rotin ou le lin. Bien choisie, elle traverse les tendances."],
      ["Quel prix pour une table basse en travertin ?", "Comptez de 300 à 600 € pour des modèles en pierre fine ou reconstituée, et de 800 à plus de 2 000 € pour du travertin massif ou une pièce vintage."],
    ],
    filter: { cats: ["tables"], all: [["basse", "coffee", "d appoint", "appoint"], ["travertin", "travertine", "marbre", "marble", "pierre"]] },
    piecesTitle: "Des tables en travertin et en marbre",
    related: [
      { href: "/idees/table-basse-travertin-marbre", label: "Tables basses travertin et marbre" },
      { href: "/idees/table-basse-bois", label: "Tables basses en bois" },
      { href: "/idees/deco-beige-lin", label: "Déco beige et lin" },
      { href: "/guides/choisir-taille-tapis-salon", label: "Choisir la taille de son tapis" },
    ],
  },
  {
    slug: "tapis-beni-ouarain",
    title: "Tapis Beni Ouarain : reconnaître un vrai, prix et entretien",
    h1: "Tapis Beni Ouarain : le guide pour ne pas se tromper",
    description:
      "Origine, laine, motifs, prix : comment reconnaître un vrai tapis berbère Beni Ouarain, éviter les copies et l'entretenir pour qu'il dure des décennies.",
    kicker: "Matières",
    minutes: 6,
    intro: [
      "Épais, crème, traversé de lignes brunes ou noires qui dessinent des losanges : le tapis Beni Ouarain est devenu l'un des tapis les plus copiés de la déco. Il doit son succès à sa douceur et à sa simplicité graphique, qui fonctionne aussi bien dans un salon scandinave que dans une chambre bohème.",
      "Mais entre les vrais tapis noués à la main au Maroc et les copies industrielles vendues sous le même nom, la différence de qualité est immense. Voici comment s'y retrouver.",
    ],
    sections: [
      {
        h: "1. D'où vient le Beni Ouarain ?",
        p: [
          "Les Beni Ouarain sont un ensemble de tribus berbères du Moyen Atlas, au Maroc. Dans ces montagnes froides, les femmes tissaient des tapis épais, à poils longs, en laine de mouton non teinte, qui servaient autant de couverture que de tapis de sol. Les motifs, transmis de génération en génération, sont propres à chaque tisserande : il n'y a jamais deux tapis identiques.",
        ],
      },
      {
        h: "2. Reconnaître un vrai Beni Ouarain",
        p: [
          "Retournez le tapis : c'est au dos qu'on voit la différence.",
        ],
        list: [
          "Au dos, on voit les nœuds un par un et le motif apparaît en négatif. Un dos lisse, collé ou recouvert d'une toile signale un tapis tufté, pas noué.",
          "La laine est naturelle, un peu grasse au toucher, dans des teintes allant du blanc écru au crème. Un blanc parfaitement uniforme et éclatant est souvent synthétique ou blanchi.",
          "Les motifs sont légèrement irréguliers : les lignes ondulent, les losanges ne sont pas parfaitement symétriques. C'est la signature du travail à la main.",
          "Les franges sont la continuation des fils de chaîne du tissage, pas un galon cousu après coup.",
          "Le poids : un vrai Beni Ouarain de 2 x 3 m pèse lourd, souvent 15 à 25 kg.",
        ],
      },
      {
        h: "3. Quel prix pour un vrai ?",
        p: [
          "Un tapis noué main demande plusieurs semaines de travail. Comptez en général quelques centaines d'euros le mètre carré pour un tapis neuf de bonne qualité, et davantage pour une pièce ancienne. Un « Beni Ouarain » de 2 x 3 m à moins de 200 € est presque toujours une copie tuftée ou synthétique : ce n'est pas forcément un mauvais tapis, mais ce n'est pas le même objet.",
          "Les copies d'inspiration berbère ont leur place si le budget est serré : choisissez-les alors en pure laine plutôt qu'en polyester, elles vieilliront beaucoup mieux.",
        ],
      },
      {
        h: "4. Les autres tapis berbères",
        p: [
          "Le Beni Ouarain n'est qu'une famille parmi les tapis berbères. Le Azilal est plus coloré, avec des motifs vifs sur fond crème. Le Boucherouite est fait de chutes de tissus recyclés, très coloré et souple. Le kilim est tissé à plat, sans poils, plus fin et facile à entretenir. Selon la pièce, l'un ou l'autre sera plus adapté.",
        ],
      },
      {
        h: "5. L'entretenir",
        p: [
          "La laine berbère est naturellement grasse : elle repousse bien les taches et la poussière. Les premières semaines, il est normal qu'un tapis neuf perde des fibres, ça s'arrête ensuite.",
        ],
        list: [
          "Aspirez sans brosse rotative, dans le sens des poils, une fois par semaine.",
          "Une tache : tamponnez avec de l'eau froide et un peu de savon neutre, jamais de frottement.",
          "Une fois par an, secouez-le dehors ou faites-le nettoyer par un professionnel du tapis.",
          "Tournez-le de temps en temps pour qu'il s'use et se décolore de façon uniforme.",
        ],
      },
      {
        h: "6. Où le mettre ?",
        p: [
          "Ses poils longs le rendent parfait dans un salon ou une chambre, là où on marche pieds nus. Évitez l'entrée ou sous une table à manger, où les chaises le tirent et l'abîment : un kilim ou un tapis en jute y sera plus à l'aise. Pour bien choisir la taille, gardez en tête que les pieds avant du canapé doivent reposer dessus.",
        ],
      },
    ],
    faq: [
      ["Comment savoir si un tapis Beni Ouarain est authentique ?", "Regardez le dos : on doit voir les nœuds et le motif en négatif. La laine doit être naturelle, les motifs légèrement irréguliers et les franges issues du tissage."],
      ["Un tapis Beni Ouarain perd-il ses poils ?", "Oui, les premières semaines c'est normal pour une laine nouée main. Aspirez régulièrement sans brosse rotative, la perte diminue rapidement."],
      ["Peut-on mettre un tapis berbère avec des enfants ?", "Oui, la laine grasse résiste bien aux taches. Évitez seulement les copies blanches en synthétique, qui grisent vite."],
      ["Quelle différence entre Beni Ouarain et Azilal ?", "Le Beni Ouarain est crème avec des lignes sombres géométriques. L'Azilal vient de la même région mais il est beaucoup plus coloré."],
    ],
    filter: { cats: ["tapis"], all: [["berbere", "beni", "kilim", "laine", "wool", "marocain"]] },
    piecesTitle: "Des tapis berbères et en laine",
    related: [
      { href: "/idees/tapis-berbere", label: "Tapis berbères" },
      { href: "/guides/choisir-taille-tapis-salon", label: "Choisir la taille de son tapis" },
      { href: "/idees/tapis-salon", label: "Tapis de salon" },
      { href: "/idees/deco-boheme", label: "Déco bohème" },
    ],
  },
  {
    slug: "couleurs-avec-cognac-camel",
    title: "Quelles couleurs associer au cognac et au camel en déco ?",
    h1: "Quelles couleurs associer au cognac et au camel ?",
    description:
      "Canapé cognac, fauteuil camel, cuir patiné : les couleurs de mur, de textiles et de bois qui vont avec, et 5 associations qui marchent à coup sûr.",
    kicker: "Couleurs",
    minutes: 5,
    intro: [
      "Le cognac et le camel sont les couleurs du cuir patiné, du noyer et des tissus chauds. Ils ont un énorme avantage : ce sont presque des neutres. Ils réchauffent une pièce sans la saturer, et se marient avec beaucoup plus de couleurs qu'on ne le croit.",
      "La règle d'or est simple : plus la pièce est claire et douce autour, plus le cognac ressort. Voici comment construire une palette autour.",
    ],
    sections: [
      {
        h: "1. Cognac ou camel, quelle différence ?",
        p: [
          "Le cognac est un brun orangé profond, celui d'un cuir de selle ou d'un canapé chesterfield patiné. Le camel est plus clair, plus doré, proche du sable foncé : c'est la couleur d'un manteau en laine ou d'un daim. On peut parfaitement les mélanger dans une même pièce, ils appartiennent à la même famille.",
        ],
      },
      {
        h: "2. Quelle couleur de mur avec un canapé cognac ?",
        p: [
          "Les murs donnent le ton de toute la pièce. Avec du cognac, trois directions fonctionnent particulièrement bien.",
        ],
        list: [
          "Blanc cassé, crème ou beige rosé : la valeur sûre. Le cuir ressort, la pièce reste lumineuse et chaleureuse.",
          "Vert profond (sapin, olive, vert anglais) : l'association la plus élégante, très « club anglais ».",
          "Bleu nuit ou bleu pétrole : un contraste chaud-froid qui met le cognac en valeur, idéal dans un salon ou un bureau.",
        ],
      },
      {
        h: "3. Cinq associations qui marchent à coup sûr",
        p: [
          "Pour une pièce réussie, choisissez une couleur dominante (souvent les murs), le cognac en couleur d'accent principal, et une ou deux touches complémentaires.",
        ],
        list: [
          "Crème + cognac + laiton : chic et chaleureux, l'esprit années 70 revisité.",
          "Vert sauge + cognac + bois clair : naturel, doux, très facile à vivre.",
          "Bleu marine + cognac + blanc : intemporel, un peu marin, très lumineux.",
          "Terracotta + camel + lin : méditerranéen et solaire.",
          "Gris chaud + cognac + noir : plus urbain, avec une touche industrielle.",
        ],
      },
      {
        h: "4. Les textiles et le tapis",
        p: [
          "Autour d'un canapé cognac, les textiles servent à équilibrer. Le lin écru, la laine crème et la bouclette adoucissent le cuir. Un tapis clair, berbère ou en jute, évite que l'ensemble devienne trop sombre. Pour les coussins, osez la rouille, le vert olive, le bleu nuit ou un motif géométrique dans les mêmes tons.",
        ],
      },
      {
        h: "5. Les bois et les métaux",
        p: [
          "Le noyer et le teck prolongent naturellement la chaleur du cognac. Le chêne clair apporte de la légèreté. Côté métaux, le laiton et le bronze sont les meilleurs alliés : ils reflètent la lumière chaude du cuir. Le noir mat donne du contraste et modernise l'ensemble.",
        ],
      },
      {
        h: "6. Les erreurs à éviter",
        p: [
          "Évitez d'accumuler trop de bruns différents qui ne se répondent pas : un cuir cognac, un parquet orangé et des meubles acajou finissent par se battre. Évitez aussi les gris froids et bleutés, qui rendent le cognac terne. Enfin, ne multipliez pas les couleurs d'accent : deux suffisent.",
        ],
      },
    ],
    faq: [
      ["Quelle couleur de coussin sur un canapé cognac ?", "Crème, lin, vert olive, rouille ou bleu nuit. Mélangez deux couleurs maximum et variez les matières (lin, velours, laine)."],
      ["Le cognac va-t-il avec le gris ?", "Avec un gris chaud, tirant vers le beige (greige), oui. Avec un gris froid et bleuté, le cognac paraît terne."],
      ["Quelle couleur de tapis avec un canapé marron ?", "Un tapis clair (crème, écru, beige) ou un berbère à motifs pour équilibrer. Un tapis sombre alourdit la pièce."],
      ["Cognac et vert, c'est une bonne idée ?", "C'est l'une des plus belles associations : vert sapin ou olive avec un cuir cognac donne un salon élégant et chaleureux."],
    ],
    filter: { colors: ["brun"] },
    piecesTitle: "Des pièces cognac et camel",
    related: [
      { href: "/idees/deco-cognac-camel", label: "Déco cognac et camel" },
      { href: "/looks/salon-cognac", label: "Look : salon cuir & cognac" },
      { href: "/idees/canape-cuir-vintage", label: "Canapés en cuir vintage" },
      { href: "/idees/deco-vert-sauge", label: "Déco vert sauge" },
    ],
  },
  {
    slug: "organiser-cremaillere",
    title: "Organiser sa crémaillère : invitations, budget, cadeaux et cagnotte",
    h1: "Organiser sa crémaillère sans stress",
    description:
      "Quand la faire, qui inviter, quoi servir, combien prévoir et comment demander des cadeaux utiles (cagnotte, liste) sans gêne : le guide complet de la crémaillère.",
    kicker: "Emménagement",
    minutes: 6,
    intro: [
      "Pendre la crémaillère, c'est la tradition de fêter son nouveau chez-soi avec ses proches. L'expression vient de la tige de métal crantée qui servait à suspendre la marmite au-dessus du feu : l'installer était la dernière étape de l'emménagement, et on invitait ceux qui avaient aidé à partager le premier repas.",
      "Aujourd'hui, c'est surtout l'occasion de faire visiter, de remercier ceux qui ont porté les cartons, et de recevoir de quoi finir de s'installer. Voici comment l'organiser simplement.",
    ],
    sections: [
      {
        h: "1. Quand la faire ?",
        p: [
          "Idéalement un à trois mois après l'emménagement : assez tôt pour que ce soit encore une « nouvelle maison », assez tard pour que les cartons soient vidés et que l'essentiel soit en place. Pas besoin que tout soit parfait : une crémaillère dans un appartement encore un peu vide est aussi l'occasion de montrer ce qu'il reste à faire.",
        ],
      },
      {
        h: "2. Qui inviter et comment",
        p: [
          "Les amis proches, la famille, ceux qui ont aidé au déménagement, et pourquoi pas les voisins : c'est le meilleur moyen de démarrer en bons termes, et de les prévenir du bruit. Envoyez l'invitation deux à trois semaines avant, avec l'adresse complète, le digicode et l'étage.",
        ],
      },
      {
        h: "3. Le format et le budget",
        p: [
          "Le format le plus simple est l'apéritif dînatoire : pas besoin de places assises pour tout le monde, chacun circule et visite. Comptez une dizaine de pièces salées et quelques pièces sucrées par personne, et environ une bouteille pour deux à trois invités.",
        ],
        list: [
          "Budget serré : demandez à chacun d'apporter un plat ou une bouteille, vous fournissez le principal.",
          "Préparez la veille ce qui peut l'être : les invités arrivent toujours au moment où on finit de couper.",
          "Prévoyez de la place pour les manteaux, des sacs poubelle et quelques chaises pliantes.",
        ],
      },
      {
        h: "4. Les cadeaux : oser dire ce qui ferait plaisir",
        p: [
          "La plupart des invités viennent avec un cadeau, et se demandent quoi offrir. Résultat : beaucoup de bougies, de plantes et de bouteilles. Si vous avez besoin de choses précises pour finir de vous installer, dites-le : c'est un service rendu à vos invités, pas une impolitesse.",
          "Deux options fonctionnent bien : une liste de quelques objets précis (avec leurs liens), ou une cagnotte pour une pièce plus importante qu'aucun invité n'offrirait seul, comme un canapé, une table ou une belle lampe.",
        ],
      },
      {
        h: "5. Faire une cagnotte de crémaillère sans gêne",
        p: [
          "Une cagnotte réussie est concrète : on participe plus volontiers à « la table en chêne de notre salle à manger » qu'à une somme abstraite. Montrez la pièce, le montant, l'avancement, et laissez chacun donner ce qu'il veut.",
        ],
        list: [
          "Mentionnez-la discrètement dans l'invitation : « si vous voulez nous faire plaisir, on rêve de cette table ».",
          "Fixez un objectif réaliste : mieux vaut une pièce entièrement financée que trois à moitié.",
          "Remerciez chaque participant, et envoyez une photo de la pièce une fois installée.",
        ],
      },
      {
        h: "6. Le jour J",
        p: [
          "Faites une vraie visite au début de la soirée, quand tout le monde arrive : c'est ce que vos invités attendent. Prévoyez une playlist, une lumière douce (lampes d'appoint et bougies plutôt que plafonnier), et une pièce fermée pour les sacs et les manteaux. Le lendemain, un petit message de remerciement avec une photo de la soirée fait toujours plaisir.",
        ],
      },
    ],
    faq: [
      ["Combien de temps après l'emménagement faire la crémaillère ?", "En général un à trois mois après, une fois les cartons vidés. Il n'y a pas de règle stricte : certains la font plus tard, quand la décoration est terminée."],
      ["Est-ce malpoli de faire une cagnotte pour une crémaillère ?", "Non, c'est de plus en plus courant et ça évite les cadeaux en double. L'important est de la proposer sans l'imposer et de montrer à quoi elle servira."],
      ["Quoi offrir pour une crémaillère ?", "Un objet utile qu'ils ont choisi (d'où l'intérêt d'une liste ou d'une cagnotte), une belle pièce de déco, une plante, ou une participation à un meuble."],
      ["Quel budget pour une crémaillère ?", "Pour un apéritif dînatoire, comptez environ 10 à 20 € par invité selon ce que vous servez, moins si chacun apporte quelque chose."],
    ],
    filter: { maxPrice: 600, cats: ["luminaires", "assises", "tables", "miroirs", "tapis"] },
    piecesTitle: "Des idées de pièces pour une cagnotte de crémaillère",
    related: [
      { href: "/idees/cagnotte-cremaillere", label: "Cagnotte de crémaillère" },
      { href: "/idees/liste-cremaillere", label: "Liste de crémaillère" },
      { href: "/idees/cadeau-emmenagement", label: "Idées cadeau d'emménagement" },
      { href: "/guides/cagnotte-pour-meubler-son-appartement", label: "Faire une cagnotte pour meubler son appartement" },
    ],
  },
  {
    slug: "acheter-meubles-vintage-en-ligne",
    title: "Acheter des meubles vintage en ligne sans se tromper",
    h1: "Acheter des meubles vintage en ligne sans se tromper",
    description:
      "Photos, dimensions, état, livraison, prix : les vérifications à faire avant d'acheter un meuble vintage ou d'occasion en ligne, et les questions à poser au vendeur.",
    kicker: "Vintage",
    minutes: 6,
    intro: [
      "Acheter un meuble vintage en ligne, c'est accéder à des pièces introuvables près de chez soi : un buffet scandinave, un fauteuil de designer, une table en travertin des années 70. Mais on ne peut ni toucher, ni s'asseoir, ni ouvrir les tiroirs. Tout repose sur ce que l'annonce montre, et sur les bonnes questions.",
      "Voici la méthode pour acheter sereinement, que ce soit sur une plateforme spécialisée ou auprès d'un brocanteur.",
    ],
    sections: [
      {
        h: "1. Choisir où acheter",
        p: [
          "Les plateformes spécialisées en vintage sélectionnent leurs vendeurs, organisent la livraison et offrent en général un délai de rétractation et une protection en cas de problème. Les sites de petites annonces entre particuliers sont moins chers, mais tout repose sur la confiance et il faut souvent aller chercher le meuble soi-même.",
          "Pour une pièce chère ou fragile, la sécurité d'une plateforme avec livraison suivie vaut souvent la différence de prix.",
        ],
      },
      {
        h: "2. Lire les photos comme un pro",
        p: [
          "Une bonne annonce montre le meuble sous tous les angles, en lumière naturelle. Méfiez-vous des annonces avec une seule photo, ou des photos visiblement retouchées.",
        ],
        list: [
          "Regardez les zones d'usure : arêtes, pieds, plateau, accoudoirs.",
          "Cherchez les signes d'humidité : taches sombres, bois gonflé, placage qui se décolle.",
          "Comparez la couleur entre plusieurs photos : une teinte qui change beaucoup signale une retouche.",
          "Demandez une photo du dos et du dessous, qui révèlent la qualité de fabrication.",
        ],
      },
      {
        h: "3. Les questions à poser au vendeur",
        p: [
          "Un vendeur sérieux répond volontiers et précisément. Avant d'acheter, demandez :",
        ],
        list: [
          "Les dimensions exactes, y compris la hauteur d'assise pour une chaise ou un canapé.",
          "L'état réel : rayures, restaurations passées, odeur, présence de vers à bois traités ou non.",
          "Si les tiroirs coulissent bien et si les portes ferment correctement.",
          "S'il existe une signature, une étiquette ou un tampon d'éditeur, pour une pièce de designer.",
        ],
      },
      {
        h: "4. Les dimensions, encore et toujours",
        p: [
          "C'est l'erreur numéro un : le meuble est parfait, mais il ne passe pas la porte, ou il écrase la pièce. Mesurez l'emplacement, mais aussi les portes, le couloir, l'escalier et l'ascenseur. Tracez l'emprise au sol avec du ruban de masquage pour visualiser la place qu'il prendra.",
        ],
      },
      {
        h: "5. Le prix juste",
        p: [
          "Comparez avec des pièces similaires vendues ailleurs : le même modèle, la même époque, dans le même état. Une pièce de designer authentique se vend nettement plus cher qu'un modèle « dans le style de ». À l'inverse, un prix très bas sur une pièce recherchée doit faire poser des questions. Et n'oubliez pas d'ajouter la livraison, qui peut représenter une part importante du prix pour un grand meuble.",
        ],
      },
      {
        h: "6. Réception et livraison",
        p: [
          "À la livraison, déballez et inspectez le meuble devant le livreur si possible. Notez toute casse ou tout dommage sur le bon de livraison et prenez des photos immédiatement : c'est indispensable pour faire jouer une garantie. Une fois chez vous, laissez un meuble en bois massif s'acclimater quelques jours avant de le nourrir ou de le traiter.",
        ],
      },
    ],
    faq: [
      ["Où acheter des meubles vintage en ligne ?", "Sur des plateformes spécialisées comme Selency, chez des brocanteurs qui vendent en ligne, ou sur des sites d'annonces entre particuliers. Atelier Nama réunit des pièces de plusieurs boutiques pour les comparer."],
      ["Comment savoir si un meuble de designer est authentique ?", "Cherchez une signature, une étiquette d'éditeur ou un tampon, comparez les détails de fabrication avec le modèle d'origine, et demandez au vendeur sa provenance."],
      ["Peut-on retourner un meuble vintage acheté en ligne ?", "Auprès d'un vendeur professionnel, vous bénéficiez en général d'un délai de rétractation de 14 jours. Entre particuliers, ce n'est pas obligatoire : vérifiez les conditions avant d'acheter."],
      ["Comment éviter les arnaques ?", "Payez via la plateforme plutôt que par virement direct, méfiez-vous des prix trop bas et des vendeurs pressés, et demandez toujours des photos supplémentaires."],
    ],
    filter: { shop: "Selency" },
    piecesTitle: "Des pièces vintage sélectionnées",
    related: [
      { href: "/vintage", label: "Toutes nos pièces vintage" },
      { href: "/guides/selency-avis", label: "Notre avis sur Selency" },
      { href: "/guides/reconnaitre-un-meuble-vintage", label: "Reconnaître un meuble vintage" },
      { href: "/idees/buffet-vintage", label: "Buffets vintage" },
      { href: "/idees/deco-vintage", label: "Déco vintage" },
    ],
  },
  {
    slug: "selency-avis",
    title: "Selency : notre avis sur la brocante en ligne (fonctionnement, conseils)",
    h1: "Selency : notre avis sur la brocante en ligne",
    description:
      "Comment fonctionne Selency, qui vend, comment se passe l'achat et la livraison, ce qu'on y trouve et nos conseils pour bien acheter un meuble vintage sur la plateforme.",
    kicker: "Vintage",
    minutes: 6,
    intro: [
      "Selency est une brocante en ligne française, spécialisée dans le mobilier et la décoration de seconde main. On y trouve des fauteuils, des buffets, des lampes, des miroirs et des objets d'époque, vendus par des brocanteurs professionnels et par des particuliers.",
      "Nous mettons beaucoup de pièces Selency en avant sur Atelier Nama. Voici comment fonctionne la plateforme, ce qu'on y trouve, et nos conseils pour bien y acheter. Transparence : Selency est notre partenaire, nous touchons une commission si vous achetez depuis nos liens, sans aucun surcoût pour vous.",
    ],
    sections: [
      {
        h: "1. Selency, c'est quoi ?",
        p: [
          "Selency a été créée en 2014 à Paris par Charlotte Cadé et Maxime Brousse, sous le nom de BrocanteLab, avant de prendre le nom de Selency. Le principe : une place de marché où des vendeurs proposent des meubles et objets de seconde main, avec une sélection orientée déco et design.",
          "C'est ce qui la distingue des sites de petites annonces généralistes : on y cherche moins une bonne affaire au hasard qu'une belle pièce, avec des photos soignées et une description détaillée.",
        ],
      },
      {
        h: "2. Ce qu'on y trouve",
        p: [
          "Le catalogue couvre presque tout l'intérieur, avec des pièces de toutes les époques, du XIXe siècle aux années 90.",
        ],
        list: [
          "Assises : fauteuils club, chaises bistrot et cannées, canapés en cuir, chaises scandinaves.",
          "Rangements : enfilades en teck, buffets, commodes, secrétaires.",
          "Tables : tables de ferme, tables basses en travertin ou en verre, bureaux.",
          "Luminaires : lampes en laiton ou céramique, suspensions, appliques.",
          "Objets : miroirs, vases, vaisselle, cadres, textiles.",
        ],
      },
      {
        h: "3. Comment se passe un achat",
        p: [
          "Chaque annonce indique le prix, les dimensions, l'état et le vendeur. Le paiement se fait sur la plateforme, ce qui est plus sûr qu'un virement direct à un inconnu. Selon la pièce et le vendeur, la livraison est organisée à domicile ou la pièce est à récupérer : c'est précisé dans l'annonce, avec le coût.",
          "Pour un grand meuble, la livraison peut représenter une part importante du prix : regardez toujours le total avant de vous décider.",
        ],
      },
      {
        h: "4. Les points forts",
        list: [
          "Des pièces uniques, qu'on ne retrouvera chez personne d'autre.",
          "Des meubles souvent mieux construits que du neuf au même prix : bois massif, assemblages solides.",
          "Une sélection orientée déco : on trouve vite des pièces qui ont du style.",
          "Un achat de seconde main, qui évite de produire un meuble de plus.",
        ],
        p: [],
      },
      {
        h: "5. Les points d'attention",
        list: [
          "Une pièce unique peut partir vite : si elle vous plaît vraiment, n'attendez pas trop.",
          "Les traces d'usage sont normales sur du vintage : lisez bien la description de l'état.",
          "Les frais de livraison varient beaucoup selon la taille de la pièce et la distance.",
          "Les conditions de retour peuvent dépendre du vendeur (professionnel ou particulier) : vérifiez-les avant d'acheter.",
        ],
        p: [],
      },
      {
        h: "6. Nos conseils pour bien acheter",
        p: [
          "Mesurez votre emplacement, mais aussi vos portes et votre escalier. Demandez des photos supplémentaires si un détail vous inquiète (dessous, dos, tiroirs). Comparez avec des pièces similaires pour juger le prix. Et si une pièce dépasse votre budget du moment, mettez-la dans une cagnotte Atelier Nama pour l'épargner, ou la faire offrir à plusieurs.",
        ],
      },
    ],
    faq: [
      ["Selency est-il fiable ?", "C'est une plateforme française qui existe depuis 2014. Le paiement passe par le site, ce qui protège davantage qu'un paiement direct au vendeur. Comme pour tout achat de seconde main, lisez bien l'annonce et posez vos questions avant d'acheter."],
      ["Qui vend sur Selency ?", "Des brocanteurs et antiquaires professionnels, ainsi que des particuliers. Le type de vendeur est indiqué sur chaque annonce."],
      ["Comment est livré un meuble acheté sur Selency ?", "Selon l'annonce, par une livraison organisée jusqu'à chez vous ou en retrait chez le vendeur. Le mode et le coût de livraison sont indiqués avant l'achat."],
      ["Comment trouver les meilleures pièces Selency ?", "Sur Atelier Nama, nos pages vintage regroupent une sélection de pièces Selency par type de meuble, mise à jour chaque jour."],
    ],
    filter: { shop: "Selency" },
    piecesTitle: "Une sélection de pièces Selency",
    related: [
      { href: "/vintage", label: "Toutes nos pièces vintage" },
      { href: "/marques/selency", label: "Selency : notre sélection" },
      { href: "/guides/acheter-meubles-vintage-en-ligne", label: "Acheter des meubles vintage en ligne" },
      { href: "/idees/meubles-chines", label: "Meubles chinés" },
    ],
  },
];

export const guide = (slug: string) => GUIDES.find((g) => g.slug === slug) ?? null;
