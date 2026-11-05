"use client";

import { useEffect, useState } from "react";
import NamaShatter from "./NamaShatter";

const KEY = "nama-intro-seen";

/**
 * Écran d'intro, à la première visite seulement : NAMA se forme, tient, puis se brise et laisse place au site.
 * Le script en ligne le masque avant tout affichage pour les visiteurs qui l'ont déjà vu.
 */
export default function IntroSplash() {
  const [gone, setGone] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY)) return setGone(true);
      localStorage.setItem(KEY, "1");
    } catch {}
  }, []);

  const end = () => {
    setFade(true);
    setTimeout(() => setGone(true), 500);
  };

  if (gone) return null;
  return (
    <div
      id="nama-intro"
      onClick={end}
      className={`fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-night transition-opacity duration-500 ${fade ? "pointer-events-none opacity-0" : ""}`}
      style={{ animation: "nama-intro-out 0.5s ease 4.5s forwards" }}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(localStorage.getItem("${KEY}"))document.getElementById("nama-intro").style.display="none"}catch(e){}`,
        }}
      />
      <p className="caps absolute top-[30%] text-[11px] tracking-[0.5em] text-bone/50">Atelier</p>
      <div className="h-[44vh] w-full max-w-5xl">
        <NamaShatter mode="intro" onDone={end} />
      </div>
      <p className="caps absolute bottom-8 text-[10px] tracking-[0.3em] text-bone/35">Toucher pour entrer</p>
      <style>{`@keyframes nama-intro-out{to{opacity:0;visibility:hidden;pointer-events:none}}`}</style>
    </div>
  );
}
