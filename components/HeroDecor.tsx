import Link from "next/link";

type Props = {
  fr: boolean;
  total: number;
  shops: number;
  photos: { main: string; side: string; detail: string };
  sample: { title: string; items: { image_url: string }[]; total: string; monthly: string; months: number } | null;
};

/**
 * Accueil : on comprend en une phrase. Chercher une pièce, la mettre dans un budget, épargner.
 * À droite, un intérieur vintage et une vraie cagnotte en cours.
 */
export default function HeroDecor({ fr, total, shops, photos, sample }: Props) {
  const quick = fr
    ? [
        ["Canapé cuir", "canapé cuir"],
        ["Lampe laiton", "lampe laiton"],
        ["Tapis berbère", "tapis berbère"],
        ["Rotin", "rotin"],
        ["Teck vintage", "teck"],
      ]
    : [
        ["Leather sofa", "leather sofa"],
        ["Brass lamp", "brass lamp"],
        ["Berber rug", "berbere"],
        ["Rattan", "rattan"],
        ["Vintage teak", "teck"],
      ];

  return (
    <section className="relative mx-[calc(50%-50vw)] overflow-hidden bg-paper">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
        {/* Le message */}
        <div>
          <p className="caps wp-rise text-muted" style={{ animationDelay: "0.05s" }}>
            {fr ? `${total.toLocaleString("fr-FR")} pièces · ${shops} maisons · neuf & chiné` : `${total} pieces · ${shops} brands · new & vintage`}
          </p>
          <h2 className="display mt-5 text-[2.7rem] leading-[0.95] sm:text-7xl xl:text-[4.6rem]">
            {(fr ? ["Trouvez vos pièces.", "Fixez le budget.", "Épargnez pour chez vous."] : ["Find your pieces.", "Set the budget.", "Save for your home."]).map((l, i) => (
              <span key={l} className="block overflow-hidden pb-[0.06em]">
                <span className={`wp-line block ${i === 2 ? "italic text-walnut" : ""}`} style={{ animationDelay: `${0.12 + i * 0.12}s` }}>
                  {l}
                </span>
              </span>
            ))}
          </h2>
          <p className="wp-rise mt-6 max-w-lg text-[15px] leading-relaxed text-muted sm:text-lg" style={{ animationDelay: "0.5s" }}>
            {fr
              ? "Maison Piécette rassemble la déco de grandes enseignes, de petites maisons et de brocanteurs. Ajoutez ce qui vous plaît à une cagnotte : on calcule ce qu'il faut mettre de côté chaque mois, seul ou à plusieurs, pour s'offrir le projet."
              : "Maison Piécette gathers decor from big retailers, small makers and vintage dealers. Add what you love to a pot: we work out what to set aside each month, alone or together, to make the project happen."}
          </p>

          <form action="/catalogue" className="wp-rise mt-8 flex max-w-xl items-center gap-2 border border-ink bg-white p-1.5 pl-5" style={{ animationDelay: "0.62s" }}>
            <span aria-hidden className="text-muted">⌕</span>
            <input
              name="q"
              placeholder={fr ? "Que cherchez-vous ? Un fauteuil en cuir, une lampe…" : "What are you looking for?"}
              className="min-w-0 flex-1 bg-transparent py-3 text-[15px] outline-none placeholder:text-muted"
            />
            <button className="btn-primary !px-6 !py-3 text-[11px] uppercase tracking-label">{fr ? "Chercher" : "Search"}</button>
          </form>
          <div className="wp-rise mt-4 flex flex-wrap items-center gap-2 text-sm" style={{ animationDelay: "0.7s" }}>
            <span className="text-muted">{fr ? "Idées :" : "Try:"}</span>
            {quick.map(([label, q]) => (
              <Link key={q} href={`/catalogue?q=${encodeURIComponent(q)}`} className="border border-line bg-white px-3 py-1 transition hover:border-ink">
                {label}
              </Link>
            ))}
          </div>
          <div className="wp-rise mt-8 flex flex-wrap items-center gap-6" style={{ animationDelay: "0.78s" }}>
            <Link href="#exemples" className="link-caps">
              {fr ? "Voir des cagnottes d'exemple" : "See example pots"} ↓
            </Link>
            <Link href="/new" className="caps text-muted hover:text-ink">
              {fr ? "Créer ma cagnotte" : "Create my pot"} →
            </Link>
          </div>
        </div>

        {/* L'image et la cagnotte en cours */}
        <div className="relative h-[62vh] min-h-[420px] lg:h-[78vh]">
          <div className="wp-layer-in absolute inset-y-0 left-0 right-[18%] overflow-hidden rounded-t-[999px] bg-night">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos.main} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute bottom-[12%] right-0 hidden w-[34%] overflow-hidden bg-night shadow-2xl sm:block" style={{ aspectRatio: "3/4" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos.side} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute right-[6%] top-[6%] hidden h-24 w-24 overflow-hidden rounded-full border-4 border-paper bg-night lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos.detail} alt="" className="h-full w-full object-cover" />
          </div>

          {sample && (
            <div className="wp-rise absolute -bottom-4 left-3 w-[min(92%,330px)] bg-white p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)] sm:left-[-6%]" style={{ animationDelay: "0.9s" }}>
              <p className="caps text-muted">{fr ? "Cagnotte en cours" : "Pot in progress"}</p>
              <p className="display mt-1 text-2xl leading-tight">{sample.title}</p>
              <div className="mt-3 flex -space-x-3">
                {sample.items.slice(0, 5).map((x, k) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={k} src={x.image_url} alt="" referrerPolicy="no-referrer" className="h-12 w-12 rounded-full border-2 border-white bg-paper object-cover" />
                ))}
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-paper">
                <div className="h-full w-[38%] rounded-full bg-walnut" />
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span>
                  <b className="font-medium">{sample.monthly}</b>
                  <span className="text-muted">/{fr ? "mois à deux" : "mo for two"}</span>
                </span>
                <span className="text-muted">
                  {sample.total} · {sample.months} {fr ? "mois" : "mo"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
