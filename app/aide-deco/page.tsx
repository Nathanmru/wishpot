import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { photo } from "@/lib/covers";
import { STYLES } from "@/lib/catalog";
import PaletteLab from "@/components/PaletteLab";
import { Reveal } from "@/components/Motion";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  title: "Aide déco : associer les couleurs, la règle 60-30-10 et nos conseils",
  alternates: { canonical: "/aide-deco" },
  description:
    "Les règles simples des décorateurs : le 60-30-10, les associations de couleurs, mélanger l'ancien et le neuf, chiner, les bonnes proportions et la lumière en couches.",
};

const PALETTES_FR = [
  {
    id: "cognac",
    name: "Cuir & cognac",
    note: "Des murs crème, du cuir et du bois chaud, une touche de terracotta. La palette la plus accueillante qui soit, qui vieillit très bien.",
    main: { hex: "#EDE3D1", name: "Crème", color: "beige" },
    second: { hex: "#8A5530", name: "Cognac", color: "brun" },
    accent: { hex: "#B8623E", name: "Terracotta", color: "terracotta" },
  },
  {
    id: "sauge",
    name: "Sauge & lin",
    note: "Un vert grisé apaisant, du lin naturel et une pointe de laiton qui réveille le tout. Idéal pour une chambre ou une cuisine.",
    main: { hex: "#B9C0A8", name: "Sauge", color: "vert" },
    second: { hex: "#E3D7C3", name: "Lin", color: "beige" },
    accent: { hex: "#B8954F", name: "Laiton", color: "dore" },
  },
  {
    id: "encre",
    name: "Encre & moutarde",
    note: "Un bleu profond enveloppant, des bois blonds et un jaune moutarde, la complémentaire du bleu : contraste franc mais chaleureux.",
    main: { hex: "#3F5C7A", name: "Bleu encre", color: "bleu" },
    second: { hex: "#C9A57B", name: "Bois clair", color: "bois" },
    accent: { hex: "#D2A23A", name: "Moutarde", color: "jaune" },
  },
  {
    id: "poudre",
    name: "Rose poudré & olive",
    note: "Le rose se tient grâce à son opposé, le vert olive. Un mélange doux et adulte, loin de la chambre d'enfant.",
    main: { hex: "#E8CFC6", name: "Rose poudré", color: "rose" },
    second: { hex: "#6B7048", name: "Olive", color: "vert" },
    accent: { hex: "#7E2C2C", name: "Bordeaux", color: "rouge" },
  },
  {
    id: "noir",
    name: "Blanc, noir & chêne",
    note: "Le classique graphique : des murs blancs, du noir pour dessiner les lignes, et le chêne pour éviter la froideur.",
    main: { hex: "#F4F1EA", name: "Blanc", color: "blanc" },
    second: { hex: "#C9A57B", name: "Chêne", color: "bois" },
    accent: { hex: "#1F1D1B", name: "Noir", color: "noir" },
  },
];

const PALETTES_EN = PALETTES_FR.map((p) => ({ ...p }));

const P = (id: string, w = 1400) => photo(id, w);

export default async function AideDeco() {
  const { lang } = await getDict();
  const fr = lang === "fr";

  const toc = [
    ["oeil", "Avoir l'œil"],
    ["couleurs", "Associer les couleurs"],
    ["styles", "Trouver son style"],
    ["chiner", "Dénicher la pièce unique"],
    ["melanger", "Mélanger l'ancien et le neuf"],
    ["proportions", "Les bonnes proportions"],
    ["lumiere", "La lumière en couches"],
    ["erreurs", "Les erreurs qu'on fait tous"],
  ];

  const eye = [
    ["Un fil conducteur", "Choisissez trois matières qui reviennent dans toute la pièce (par exemple cuir, chêne et lin). Le reste peut varier : la pièce aura l'air pensée."],
    ["Les groupes impairs", "Trois vases plutôt que deux, cinq cadres plutôt que quatre. L'œil aime les compositions impaires, de hauteurs différentes."],
    ["Des hauteurs qui varient", "Une lampe haute, une plante au sol, un tableau à hauteur des yeux : faites circuler le regard de bas en haut."],
    ["Le vide compte", "Un mur nu, une étagère à moitié remplie : le vide met en valeur ce qui est posé. Mieux vaut moins de pièces, mais mieux choisies."],
    ["Une pièce qui raconte", "Dans chaque pièce, un objet avec une histoire : un fauteuil chiné, une céramique d'artisan, un souvenir de voyage. C'est lui qu'on remarque."],
    ["Des textures avant les couleurs", "Une pièce toute beige peut être magnifique si elle mélange bouclette, lin froissé, bois brut et céramique mate."],
  ];

  const hunt = [
    ["Selency et les brocantes en ligne", "Pour chercher par style et par époque, avec livraison. Filtrez par dimensions avant de tomber amoureux."],
    ["Vide-greniers et Emmaüs", "Arrivez tôt, prenez du liquide et un mètre. Les meilleures affaires partent avant 9 h."],
    ["Les ateliers et artisans", "Céramistes, ébénistes, tisserands : une pièce faite à la main coûte parfois moins qu'un design d'éditeur, et personne ne l'aura."],
    ["Les petites maisons", "Les marques danoises, belges ou françaises moins connues proposent des objets qu'on ne voit pas partout : regardez nos « pépites »."],
  ];

  const check = [
    "Mesurez la pièce, la porte et l'escalier avant d'acheter.",
    "Assis, debout, secoué : un meuble ancien ne doit pas bouger.",
    "Sentez les tiroirs et regardez sous l'assise (humidité, insectes).",
    "Un défaut de surface se répare ; une structure fendue, rarement.",
    "Négociez avec le sourire, surtout en fin de journée.",
  ];

  const sizes = [
    ["Le tapis", "Au minimum, les pieds avant du canapé et des fauteuils posés dessus. Trop petit, il « flotte » et rapetisse la pièce."],
    ["La table basse", "Environ les deux tiers de la longueur du canapé, à 40-45 cm de l'assise, à peu près à sa hauteur."],
    ["La suspension", "Sa base à 75-85 cm au-dessus de la table à manger ; son diamètre autour de la moitié de la largeur de la table."],
    ["Les cadres", "Le centre de la composition à 1,45-1,55 m du sol, et 20 à 25 cm au-dessus du dossier d'un canapé."],
    ["Les rideaux", "Tringle posée au plus près du plafond, rideaux qui frôlent le sol : la pièce paraît plus haute."],
    ["Le lit", "Au moins 60 cm de passage de chaque côté, et des chevets à hauteur du matelas."],
  ];

  const light = [
    ["La lumière générale", "Plafonnier ou suspension, pour voir clair. Seule, elle écrase tout : c'est la plus importante à compléter."],
    ["La lumière utile", "Lampe de lecture, applique au-dessus du plan de travail, lampe de bureau : là où on fait quelque chose."],
    ["La lumière d'ambiance", "Lampes basses, bougies, guirlande dans une bibliothèque : c'est elle qui rend une pièce chaleureuse le soir."],
  ];

  const errors = [
    ["Tout acheter d'un coup, au même endroit", "La pièce ressemble à un catalogue. Commencez par l'essentiel et ajoutez une pièce à la fois : c'est le principe d'une cagnotte."],
    ["Les meubles collés aux murs", "Décollez le canapé, créez un coin conversation autour d'un tapis : la pièce paraît plus grande, pas plus petite."],
    ["Des ampoules trop froides", "Choisissez 2 700 K (blanc chaud) dans les pièces à vivre. Le blanc froid donne un air de bureau."],
    ["Le même bois partout", "Mélangez deux ou trois essences de bois, du clair au foncé : c'est plus vivant que tout assorti."],
    ["Oublier le mur du fond", "Le premier mur qu'on voit en entrant mérite la plus belle pièce : un tableau, un miroir, une étagère composée."],
  ];

  return (
    <div className="-mt-24 sm:-mt-28">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Aide déco : avoir l'œil, associer les couleurs, dénicher la pièce unique",
          description: "La règle du 60-30-10, les associations de couleurs, mélanger l'ancien et le neuf, chiner, les bonnes proportions et la lumière en couches.",
          inLanguage: "fr-FR",
          author: { "@type": "Organization", name: "Atelier Nama" },
          publisher: { "@type": "Organization", name: "Atelier Nama" },
          image: "https://images.unsplash.com/photo-1640276751820-7a295bee77aa?auto=format&fit=crop&w=1600&q=80",
        }}
      />
      {/* ---------- Ouverture ---------- */}
      <section className="relative mx-[calc(50%-50vw)] flex min-h-[92vh] items-end overflow-hidden bg-night">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={P("1640276751820-7a295bee77aa", 2000)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-16 text-white sm:px-8 sm:pb-24">
          <p className="caps wp-rise text-white/70">{fr ? "Aide déco" : "Decor guide"}</p>
          <h1 className="display mt-4 max-w-4xl text-5xl leading-[0.92] sm:text-8xl">
            <span className="wp-line block">{fr ? "Avoir l'œil," : "A good eye"}</span>
            <span className="wp-line block italic" style={{ animationDelay: "0.12s" }}>
              {fr ? "ça s'apprend." : "can be learned."}
            </span>
          </h1>
          <p className="wp-rise mt-6 max-w-xl text-white/80" style={{ animationDelay: "0.4s" }}>
            {fr
              ? "Les règles que les décorateurs appliquent sans y penser, expliquées simplement, avec des pièces du catalogue pour passer à l'action."
              : "The rules decorators apply without thinking, explained simply, with catalogue pieces to act on them."}
          </p>
        </div>
      </section>

      {/* ---------- Sommaire ---------- */}
      <nav className="sticky top-16 z-30 mx-[calc(50%-50vw)] border-b border-line bg-paper/95 backdrop-blur sm:top-20">
        <ul className="mx-auto flex max-w-6xl gap-6 px-4 sm:px-6 overflow-x-auto py-4 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {toc.map(([id, label], k) => (
            <li key={id} className="shrink-0">
              <a href={`#${id}`} className="text-muted transition hover:text-ink">
                <span className="mr-1.5 text-xs">{String(k + 1).padStart(2, "0")}</span>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ---------- 01 L'œil ---------- */}
      <Chapter id="oeil" n="01" title="Avoir l'œil" lead="Une belle pièce n'est pas une pièce chère. C'est une pièce où chaque objet a une raison d'être là, et où le regard circule.">
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {eye.map(([t, d], k) => (
            <li key={t} className="bg-paper p-6 sm:p-8">
              <p className="caps text-muted">{String(k + 1).padStart(2, "0")}</p>
              <p className="display mt-3 text-2xl leading-tight">{t}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{d}</p>
            </li>
          ))}
        </ul>
        <Exercise text="Prenez en photo votre pièce et regardez-la en noir et blanc : vous verrez tout de suite où ça manque de contraste, de hauteur ou de vide." />
      </Chapter>

      {/* ---------- 02 Couleurs ---------- */}
      <Chapter
        id="couleurs"
        n="02"
        title="Associer les couleurs"
        lead="La règle du 60-30-10 : 60 % d'une couleur dominante (murs, grands textiles), 30 % d'une couleur secondaire (canapé, rideaux, tapis), 10 % d'une couleur d'accent (coussins, vases, une lampe). Essayez :"
      >
        <PaletteLab palettes={fr ? PALETTES_FR : PALETTES_EN} fr={fr} />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            ["Le camaïeu", "Plusieurs nuances d'une même couleur, du sable au caramel. Impossible à rater, très reposant ; jouez sur les textures pour éviter la monotonie.", ["#EDE3D1", "#D9C7A7", "#B8946A", "#8A5530"]],
            ["Les voisines", "Des couleurs côte à côte sur le cercle chromatique : vert et bleu, terracotta et moutarde. Harmonieux et chaleureux.", ["#B8623E", "#C98A3E", "#D2A23A", "#E3D7C3"]],
            ["Les opposées", "Des couleurs face à face : bleu et orange, vert et rose. Gardez-en une en petite dose, sinon elles se battent.", ["#3F5C7A", "#EDE3D1", "#C9A57B", "#C9733E"]],
          ].map(([t, d, sw]) => (
            <div key={t as string} className="bg-white p-6">
              <div className="flex h-10 overflow-hidden">
                {(sw as string[]).map((h) => (
                  <span key={h} className="flex-1" style={{ background: h }} />
                ))}
              </div>
              <p className="display mt-5 text-2xl">{t as string}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d as string}</p>
            </div>
          ))}
        </div>
        <ul className="mt-10 grid gap-4 text-sm sm:grid-cols-2">
          <Tip>Le bois, le cuir, le rotin et le lin comptent comme des neutres : ils vont avec presque tout.</Tip>
          <Tip>Testez une couleur de mur sur un grand carton, à différentes heures : elle change avec la lumière.</Tip>
          <Tip>Une pièce au nord supporte les tons chauds (crème, ocre) ; au sud, les tons frais (sauge, bleu gris).</Tip>
          <Tip>Répétez la couleur d'accent au moins trois fois dans la pièce pour qu'elle paraisse voulue.</Tip>
        </ul>
      </Chapter>

      {/* ---------- 03 Styles ---------- */}
      <Chapter id="styles" n="03" title="Trouver son style" lead="Pas besoin d'en choisir un seul : la plupart des beaux intérieurs en mélangent deux. Repérez celui qui vous attire, puis ajoutez une touche d'un autre.">
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {STYLES.map((st) => (
            <li key={st.id}>
              <Link href={`/catalogue?style=${st.id}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-night">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={st.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-[1400ms] group-hover:scale-105" />
                </div>
                <p className="display mt-3 text-2xl leading-tight">{fr ? st.fr : st.en}</p>
                <p className="text-sm text-muted">{st.hint}</p>
                <p className="caps mt-2 text-[11px] group-hover:underline">{fr ? "Voir les pièces" : "See pieces"} →</p>
              </Link>
            </li>
          ))}
        </ul>
        <Exercise text="Enregistrez dix photos d'intérieurs qui vous plaisent, sans réfléchir. Puis cherchez ce qu'elles ont en commun : une matière, une couleur, une époque. C'est votre style." />
      </Chapter>

      {/* ---------- 04 Chiner ---------- */}
      <Chapter id="chiner" n="04" title="Dénicher la pièce unique" lead="Ce qui rend un intérieur personnel, c'est ce qu'on ne trouve pas ailleurs. Une pièce chinée coûte souvent moins cher qu'un meuble neuf, et elle est déjà belle avec le temps.">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="relative min-h-[360px] overflow-hidden bg-night">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={P("1780396378800-75baa6c0602a", 1200)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div>
            <ul className="divide-y divide-line border-y border-line">
              {hunt.map(([t, d]) => (
                <li key={t} className="py-5">
                  <p className="font-medium">{t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
                </li>
              ))}
            </ul>
            <p className="caps mt-8 text-muted">Avant d&apos;acheter ancien</p>
            <ul className="mt-3 space-y-2 text-sm">
              {check.map((c) => (
                <li key={c} className="flex gap-3">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-ink text-[9px]">✓</span>
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-5">
              <Link href="/catalogue?marque=Selency" className="link-caps">Les pièces de seconde main →</Link>
              <Link href="/catalogue?pepites=1" className="link-caps">Les pépites des petites maisons →</Link>
            </div>
          </div>
        </div>
      </Chapter>

      {/* ---------- 05 Mélanger ---------- */}
      <Chapter id="melanger" n="05" title="Mélanger l'ancien et le neuf" lead="Tout neuf, une pièce manque d'âme ; tout ancien, elle fait musée. Le bon dosage : environ 80 % de pièces simples et 20 % de pièces qui ont du caractère.">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Une star par pièce", "Un fauteuil en cuir patiné, un buffet ancien, une grande lampe : une seule pièce forte, et le reste lui laisse la place."],
            ["Relier par la couleur", "Un buffet en noyer des années 60 et un canapé contemporain se répondent si un coussin ou un vase reprend le brun du bois."],
            ["Contraster les formes", "Une table de ferme avec des chaises modernes, un miroir doré au-dessus d'une console épurée : c'est le contraste qui fait le charme."],
          ].map(([t, d]) => (
            <div key={t} className="border-t-2 border-ink pt-5">
              <p className="display text-2xl">{t}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
      </Chapter>

      {/* ---------- 06 Proportions ---------- */}
      <Chapter id="proportions" n="06" title="Les bonnes proportions" lead="Les mesures que les décorateurs gardent en tête. Notez-les avant d'acheter : c'est souvent ce qui fait la différence entre « joli » et « juste ».">
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {sizes.map(([t, d]) => (
            <li key={t} className="bg-paper p-6 sm:p-8">
              <p className="display text-2xl">{t}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </Chapter>

      {/* ---------- 07 Lumière ---------- */}
      <Chapter id="lumiere" n="07" title="La lumière en couches" lead="Le secret des intérieurs chaleureux : au moins trois sources de lumière par pièce, à des hauteurs différentes, et jamais seulement le plafonnier.">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <ol className="space-y-8">
            {light.map(([t, d], k) => (
              <li key={t} className="flex gap-5">
                <span className="display text-5xl leading-none text-walnut">{k + 1}</span>
                <div>
                  <p className="display text-2xl">{t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
                </div>
              </li>
            ))}
            <li>
              <Link href="/catalogue?cat=luminaires" className="link-caps">
                Voir les luminaires →
              </Link>
            </li>
          </ol>
          <div className="relative min-h-[420px] overflow-hidden bg-night">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={P("1628512743826-2c28a508ad5e", 1200)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </Chapter>

      {/* ---------- 08 Erreurs ---------- */}
      <Chapter id="erreurs" n="08" title="Les erreurs qu'on fait tous" lead="Et comment les éviter sans tout racheter.">
        <div className="divide-y divide-line border-y border-line">
          {errors.map(([q, a]) => (
            <details key={q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg [&::-webkit-details-marker]:hidden">
                {q}
                <span className="text-2xl font-light transition duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </Chapter>

      {/* ---------- Passer à l'action ---------- */}
      <section className="relative mx-[calc(50%-50vw)] -mb-20 flex min-h-[70vh] items-end overflow-hidden bg-night">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={P("1606425288528-4cebbfc69de7", 2000)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <Reveal className="relative w-full px-6 pb-20 text-center text-white sm:pb-28">
          <h2 className="display mx-auto max-w-3xl text-5xl leading-[0.95] sm:text-7xl">Vous avez l&apos;œil. Place au projet.</h2>
          <p className="mx-auto mt-5 max-w-md text-white/80">Choisissez vos pièces, réunissez-les dans une cagnotte, et voyez quand vous pourrez vous les offrir.</p>
          <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
            <Link href="/catalogue" className="btn bg-bone !px-10 !py-4 text-[12px] uppercase tracking-label text-ink hover:bg-white">
              Parcourir le catalogue
            </Link>
            <Link href="/#exemples" className="caps border-b border-white/50 pb-0.5 text-white/80 hover:text-white">
              Voir les cagnottes d&apos;exemple
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function Chapter({ id, n, title, lead, children }: { id: string; n: string; title: string; lead: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-36 border-b border-line py-20 sm:py-28">
      <Reveal className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-12">
        <p className="display text-6xl leading-none text-walnut/40 sm:text-8xl">{n}</p>
        <div>
          <h2 className="display text-4xl leading-[0.95] sm:text-6xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p>
        </div>
      </Reveal>
      <div className="mt-12">{children}</div>
    </section>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 border-l-2 border-walnut pl-4">
      <span className="text-muted">{children}</span>
    </li>
  );
}

function Exercise({ text }: { text: string }) {
  return (
    <div className="mt-10 flex gap-5 bg-walnut-soft p-6 sm:p-8">
      <span className="caps shrink-0 text-walnut">À essayer</span>
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}
