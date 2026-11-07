import Link from "next/link";
import { DECKS, getDeck } from "@/lib/carousel";
import CarouselActions from "./CarouselActions";

/** Studio : les carrousels Instagram, slide par slide, prêts à télécharger. */
export default async function CarouselPanel({ id }: { id: string }) {
  const deck = (await getDeck(id)) ?? (await getDeck(DECKS[0].id));
  const groups = [...new Set(DECKS.map((d) => d.group))];
  const urls = deck ? deck.slides.map((_, i) => `/carrousel/${deck.id}/${i}`) : [];

  return (
    <div>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {groups.map((g) => (
          <div key={g}>
            <p className="caps text-[10px] text-muted">{g}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {DECKS.filter((d) => d.group === g).map((d) => (
                <li key={d.id}>
                  <Link
                    href={`/studio?c=${d.id}#carrousels`}
                    scroll={false}
                    className={`block border px-3 py-1.5 text-sm transition ${deck?.id === d.id ? "border-ink bg-ink text-white" : "border-line hover:border-ink/40"}`}
                  >
                    {d.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {deck && (
        <div className="mt-10">
          <h3 className="display text-2xl">{deck.title}</h3>
          <p className="mt-1 text-sm text-muted">{deck.slides.length} slides · format Instagram 1080×1350. Les images se chargent une par une, patiente quelques secondes.</p>
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {urls.map((u, i) => (
              <li key={u}>
                <a href={u} download={`${deck.id}-${String(i + 1).padStart(2, "0")}.png`} className="group block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u} alt={`Slide ${i + 1}`} loading="lazy" className="aspect-[4/5] w-full bg-white object-cover" />
                  <span className="caps mt-2 block text-[10px] text-muted group-hover:text-ink">Slide {i + 1} · télécharger</span>
                </a>
              </li>
            ))}
          </ul>
          <CarouselActions urls={urls} name={deck.id} caption={deck.caption} />
        </div>
      )}
    </div>
  );
}
