import Link from "next/link";
import { COLORS, HOME_HERO, HOME_SITES, TRENDS } from "@/lib/inspiration";
import { ProductCard, goUrl } from "@/components/InspirationBits";
import { Reveal } from "@/components/Motion";

export const metadata = {
  title: "Tendances déco 2026",
  description: "Les tendances maison 2026, les couleurs du moment et une sélection de vrais meubles et objets, avec les liens vers les boutiques.",
};

export default function MaisonInspiration() {
  return (
    <div className="-mt-24 sm:-mt-28">
      {/* ---------- Ouverture ---------- */}
      <section className="relative mx-[calc(50%-50vw)] flex h-[92vh] min-h-[560px] items-end overflow-hidden bg-night">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HOME_HERO} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/30" />
        <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-16 text-white sm:px-12 sm:pb-24">
          <p className="text-[11px] uppercase tracking-label text-white/75">Inspiration maison · Saison 2026</p>
          <h1 className="display mt-5 max-w-4xl text-5xl leading-[0.98] sm:text-7xl lg:text-8xl">L&apos;intérieur qui se porte cette année.</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Les couleurs, les formes et les matières qui reviennent dans les intérieurs, avec de vraies pièces à acheter dès maintenant.
          </p>
          <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[11px] uppercase tracking-label">
            <a href="#couleurs" className="border-b border-white/50 pb-1 hover:border-white">Couleurs</a>
            {TRENDS.map((t) => (
              <a key={t.id} href={`#${t.id}`} className="border-b border-white/50 pb-1 hover:border-white">
                {t.title}
              </a>
            ))}
            <a href="#boutiques" className="border-b border-white/50 pb-1 hover:border-white">Boutiques</a>
          </nav>
        </div>
      </section>

      {/* ---------- Nuancier ---------- */}
      <section id="couleurs" className="scroll-mt-24 py-24 sm:py-32">
        <Reveal className="mx-auto max-w-[1200px]">
          <div className="grid gap-6 md:grid-cols-[1fr_1.2fr] md:items-end">
            <h2 className="display text-5xl leading-[0.95] sm:text-7xl">Le nuancier de la saison</h2>
            <p className="max-w-md text-muted">
              Les neutres froids s&apos;effacent. On revient à des teintes profondes et chaudes, posées sur un blanc cassé.
            </p>
          </div>
        </Reveal>
        <div className="mx-[calc(50%-50vw)] mt-14 flex flex-col sm:h-[520px] sm:flex-row">
          {COLORS.map((c) => {
            const light = ["#E3C77A", "#A9B9A3", "#C9A19A", "#EEEAE0"].includes(c.hex);
            return (
              <div
                key={c.name}
                tabIndex={0}
                className={`group relative flex min-h-[120px] flex-1 flex-col justify-end overflow-hidden p-5 outline-none transition-[flex-grow] duration-700 ease-out sm:min-h-0 sm:p-6 sm:hover:flex-[2.6] sm:focus:flex-[2.6] ${light ? "text-ink" : "text-bone"}`}
                style={{ backgroundColor: c.hex }}
              >
                <p className="display text-3xl leading-none sm:text-[2rem] lg:text-4xl">
                  {c.name}
                </p>
                <p className="mt-3 max-w-xs text-sm leading-relaxed opacity-80 sm:hidden sm:group-hover:block sm:group-focus:block">{c.text}</p>
                <p className="mt-2 text-[10px] uppercase tracking-label opacity-60">{c.hex}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- Tendances ---------- */}
      {TRENDS.map((t, i) => (
        <section key={t.id} id={t.id} className="scroll-mt-24 border-t border-line py-24 sm:py-32">
          <div className="mx-auto max-w-[1200px]">
            <Reveal className="grid gap-8 md:grid-cols-[auto_1fr_1fr] md:gap-14">
              <span className="display text-6xl leading-none text-brass sm:text-8xl">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="display text-4xl leading-[0.98] sm:text-6xl">{t.title}</h2>
              <div>
                <p className="leading-relaxed text-muted">{t.text}</p>
                <p className="mt-5 border-l border-brass pl-4 text-sm italic leading-relaxed">{t.tip}</p>
              </div>
            </Reveal>
            <div
              className={`mt-16 grid gap-x-8 gap-y-14 ${
                t.products.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]"
              }`}
            >
              {t.products.map((p, j) => (
                <Reveal key={p.url}>
                  <ProductCard p={p} big={j === 0 && t.products.length === 3} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ---------- Ancien + neuf ---------- */}
      <section className="mx-[calc(50%-50vw)] bg-night px-6 py-24 text-bone sm:px-12 sm:py-32">
        <Reveal className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-2 md:items-center">
          <h2 className="display text-5xl leading-[0.95] sm:text-7xl">Une pièce chinée par pièce.</h2>
          <div>
            <p className="text-lg leading-relaxed text-bone/75">
              La règle de l&apos;année : mélanger les époques. Un buffet des années 60 trouvé en seconde main à côté d&apos;un canapé neuf donne
              tout de suite du caractère, et coûte souvent moins cher.
            </p>
            <a
              href={goUrl("https://www.selency.fr/")}
              target="_blank"
              rel="noopener sponsored"
              className="btn mt-8 border border-bone/40 !px-7 !py-3.5 text-[12px] uppercase tracking-label text-bone hover:bg-bone/10"
            >
              Chiner sur Selency ↗
            </a>
          </div>
        </Reveal>
      </section>

      {/* ---------- Boutiques ---------- */}
      <section id="boutiques" className="scroll-mt-24 py-24 sm:py-32">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <h2 className="display text-5xl leading-[0.95] sm:text-7xl">Les adresses du moment</h2>
          </Reveal>
          <ul className="mt-14 divide-y divide-line border-y border-line">
            {HOME_SITES.map((s) => (
              <li key={s.name}>
                <a
                  href={goUrl(s.url)}
                  target="_blank"
                  rel="noopener sponsored"
                  className="group grid items-baseline gap-2 py-6 transition-colors hover:bg-white/60 sm:grid-cols-[1fr_1.4fr_auto] sm:gap-8 sm:px-4"
                >
                  <span className="display text-3xl sm:text-4xl">{s.name}</span>
                  <span className="text-muted">{s.note}</span>
                  <span className="text-[11px] uppercase tracking-label transition group-hover:translate-x-1">Visiter ↗</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-muted">
            Prix relevés en novembre 2026, à titre indicatif. Certains liens sont affiliés : un achat peut nous rapporter une commission, sans surcoût pour
            vous.
          </p>
        </div>
      </section>

      <section className="mx-[calc(50%-50vw)] -mb-20 bg-walnut px-6 py-24 text-center text-bone sm:py-32">
        <Reveal>
          <h2 className="display mx-auto max-w-3xl text-5xl leading-[0.95] sm:text-7xl">Un coup de cœur ? Mettez-le de côté.</h2>
          <Link href="/new?kind=home" className="btn mt-10 bg-bone !px-9 !py-4 text-[12px] uppercase tracking-label text-ink hover:bg-white">
            Créer ma cagnotte maison
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
