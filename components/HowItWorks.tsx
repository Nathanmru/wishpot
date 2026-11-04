"use client";

import { useEffect, useRef, useState } from "react";

type Step = { title: string; text: string };

/**
 * Comment ça marche : la liste des étapes reste à gauche,
 * l'aperçu de l'appli défile à droite et allume l'étape en cours.
 */
export default function HowItWorks({ kicker, title, steps, fr, sofaImg }: { kicker: string; title: string; steps: Step[]; fr: boolean; sofaImg: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const visuals = [<GoalMock key="a" fr={fr} />, <PasteMock key="b" fr={fr} img={sofaImg} />, <CircleMock key="c" fr={fr} />];

  return (
    <section id="comment" className="scroll-mt-20 py-24 sm:py-36">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* Les étapes */}
        <div className="lg:sticky lg:top-32 lg:h-fit">
          <p className="caps text-muted">{kicker}</p>
          <h2 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">{title}</h2>
          <ol className="mt-12 hidden border-l border-line lg:block">
            {steps.map((s, i) => (
              <li key={s.title} className="relative py-5 pl-8">
                <span
                  className={`absolute -left-px top-0 h-full w-px bg-ink transition-transform duration-700 ${active === i ? "scale-y-100" : "scale-y-0"}`}
                  style={{ transformOrigin: "top" }}
                />
                <button
                  type="button"
                  onClick={() => refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })}
                  className="text-left"
                >
                  <span className={`caps transition ${active === i ? "text-brass" : "text-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={`display mt-2 block text-3xl transition duration-500 ${active === i ? "text-ink" : "text-ink/30"}`}>{s.title}</span>
                  <span
                    className={`block overflow-hidden text-muted transition-all duration-700 ${active === i ? "mt-3 max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    {s.text}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* Les aperçus */}
        <div className="space-y-16 lg:space-y-[22vh] lg:py-[8vh]">
          {steps.map((s, i) => (
            <div key={s.title} ref={(el) => { refs.current[i] = el; }} data-i={i}>
              <div className="lg:hidden">
                <p className="caps text-brass">{String(i + 1).padStart(2, "0")}</p>
                <p className="display mt-2 text-3xl">{s.title}</p>
                <p className="mt-3 text-muted">{s.text}</p>
              </div>
              <div
                className={`mt-6 flex aspect-[5/4] items-center justify-center bg-[#E4DDD2] p-6 transition duration-700 sm:p-12 lg:mt-0 ${active === i ? "lg:opacity-100" : "lg:opacity-40"}`}
              >
                {visuals[i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Aperçus de l'appli (HTML, pas des captures) ---------- */

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="w-full max-w-sm bg-paper p-6 shadow-[0_30px_60px_-25px_rgba(21,18,15,0.35)] sm:p-8">{children}</div>;
}

function GoalMock({ fr }: { fr: boolean }) {
  return (
    <Frame>
      <p className="caps text-muted">{fr ? "Cagnotte maison · 2 membres" : "Home pot · 2 members"}</p>
      <p className="display mt-3 text-3xl">{fr ? "Notre appartement" : "Our flat"}</p>
      <div className="mt-6 grid grid-cols-2 gap-px bg-line">
        <div className="bg-paper py-3 pr-3">
          <p className="caps text-muted">{fr ? "Chacun" : "Each"}</p>
          <p className="display mt-1 text-2xl">100 €<span className="text-sm text-muted"> /{fr ? "mois" : "mo"}</span></p>
        </div>
        <div className="bg-paper py-3 pl-4">
          <p className="caps text-muted">{fr ? "Objectif" : "Goal"}</p>
          <p className="display mt-1 text-2xl">2 400 €</p>
        </div>
      </div>
      <div className="mt-6 border-t border-line pt-5">
        <p className="caps text-muted">{fr ? "Arrivée prévue" : "Arrival"}</p>
        <p className="display mt-1 text-3xl">{fr ? "Novembre 2027" : "November 2027"}</p>
      </div>
    </Frame>
  );
}

function PasteMock({ fr, img }: { fr: boolean; img: string }) {
  return (
    <Frame>
      <p className="caps text-muted">{fr ? "Ajouter une envie" : "Add a wish"}</p>
      <div className="mt-3 flex items-center gap-3 border-b border-ink pb-2 text-sm">
        <span className="min-w-0 flex-1 truncate text-muted">maisonsdumonde.com/canape-nuage…</span>
        <span className="caps">{fr ? "Ajouter" : "Add"} →</span>
      </div>
      <div className="mt-6 flex gap-4">
        <div className="h-24 w-24 shrink-0 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt="" className="h-full w-full object-contain p-2 mix-blend-multiply" />
        </div>
        <div className="min-w-0">
          <p className="caps text-muted">Maisons du Monde</p>
          <p className="mt-1 leading-snug">{fr ? "Canapé nuage 2 places, bouclettes" : "Cloud sofa, bouclé"}</p>
          <p className="display mt-2 text-2xl">999 €</p>
        </div>
      </div>
      <p className="mt-5 text-xs text-muted">{fr ? "Photo, nom et prix récupérés automatiquement." : "Photo, name and price filled in for you."}</p>
    </Frame>
  );
}

function CircleMock({ fr }: { fr: boolean }) {
  const people = [
    ["C", fr ? "Camille" : "Camille", 600],
    ["M", fr ? "Mathis" : "Mathis", 500],
  ] as const;
  return (
    <Frame>
      <p className="caps text-muted">{fr ? "Épargné ensemble" : "Saved together"}</p>
      <p className="display mt-2 text-4xl">1 100 €</p>
      <p className="text-sm text-muted">{fr ? "sur 2 400 € · 46 %" : "of €2,400 · 46%"}</p>
      <div className="relative mt-5 h-px bg-line">
        <span className="absolute inset-y-0 left-0 w-[46%] bg-ink" />
        <span className="absolute -top-1 left-[46%] h-[9px] w-px bg-ink" />
      </div>
      <ul className="mt-6 space-y-3">
        {people.map(([i, n, v]) => (
          <li key={n} className="flex items-center gap-3 text-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-night text-[11px] text-bone">{i}</span>
            <span className="flex-1">{n}</span>
            <span className="text-muted">{v} €</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-line pt-4 text-xs text-muted">{fr ? "Invitez avec un simple lien." : "Invite with a single link."}</p>
    </Frame>
  );
}
