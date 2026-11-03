"use client";

import { useEffect, useState } from "react";

type BIP = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

/** Enregistre le service worker (à placer une fois dans la mise en page). */
export function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}

/** Encart « Installer l'appli » : bouton sur Android/ordinateur, mode d'emploi sur iPhone. */
export function InstallCard({ lang = "fr" }: { lang?: "fr" | "en" }) {
  const fr = lang === "fr";
  const [evt, setEvt] = useState<BIP | null>(null);
  const [ios, setIos] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
    let dismissed = false;
    try {
      dismissed = localStorage.getItem("wp-install-dismissed") === "1";
    } catch {}
    if (standalone || dismissed) return;
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIos(isIos);
    if (isIos) setHidden(false);
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIP);
      setHidden(false);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (hidden) return null;
  const close = () => {
    setHidden(true);
    try {
      localStorage.setItem("wp-install-dismissed", "1");
    } catch {}
  };

  return (
    <div className="mt-8 flex items-center gap-4 rounded-xl3 bg-night p-5 text-bone">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icon-192.png" alt="" className="h-14 w-14 shrink-0 rounded-2xl" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{fr ? "Wishpot sur ton téléphone" : "Wishpot on your phone"}</p>
        <p className="mt-0.5 text-sm text-bone/70">
          {ios
            ? fr
              ? "Dans Safari : touche Partager ⬆︎ puis « Sur l'écran d'accueil »."
              : "In Safari: tap Share ⬆︎ then “Add to Home Screen”."
            : fr
              ? "Installe l'appli : depuis une boutique, « Partager → Wishpot » ajoute l'objet à ta liste."
              : "Install the app: from any shop, “Share → Wishpot” adds the item to your list."}
        </p>
      </div>
      {evt && (
        <button
          onClick={async () => {
            await evt.prompt();
            setHidden(true);
          }}
          className="btn shrink-0 bg-bone !px-5 !py-2.5 text-ink hover:bg-white"
        >
          {fr ? "Installer" : "Install"}
        </button>
      )}
      <button onClick={close} aria-label={fr ? "Fermer" : "Close"} className="shrink-0 px-1 text-xl text-bone/50 hover:text-bone">
        ×
      </button>
    </div>
  );
}
