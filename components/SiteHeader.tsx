"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { setLang } from "@/app/actions";
import { useShop } from "./ShopState";

type Props = {
  appName: string;
  lang: "fr" | "en";
  signedIn: boolean;
  avatar: string | null;
  initial: string;
  labels: { home: string; travel: string; myPots: string; newPot: string; login: string; logout: string };
};

export default function SiteHeader({ appName, lang, signedIn, avatar, initial, labels }: Props) {
  const path = usePathname();
  const immersive = path.startsWith("/inspiration") || path.startsWith("/aide-deco") || path.startsWith("/l/") || path.startsWith("/p/");
  const [scrolled, setScrolled] = useState(false);
  const { saved } = useShop();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const tone = immersive
    ? scrolled
      ? "text-bone bg-night/85 backdrop-blur-md"
      : "text-white bg-gradient-to-b from-black/50 to-transparent"
    : `text-ink ${scrolled ? "bg-paper/90 backdrop-blur-md border-b border-line" : path === "/" ? "bg-transparent" : "bg-paper"}`;

  const link = "text-[11px] font-medium uppercase tracking-label transition-opacity hover:opacity-60";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${tone}`}>
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:h-20 sm:px-8">
        <nav className="hidden flex-1 items-center gap-7 md:flex">
          <Link href="/catalogue" className={link}>{lang === "fr" ? "Dénicher" : "Find"}</Link>
          <Link href={signedIn ? "/dashboard" : "/#cagnotte"} className={link}>{lang === "fr" ? "Cagnotte" : "Savings pot"}</Link>
          <Link href="/aide-deco" className={link}>{lang === "fr" ? "Aide déco" : "Decor guide"}</Link>
        </nav>

        <Link href={signedIn ? "/dashboard" : "/"} aria-label={appName} className="whitespace-nowrap font-display text-lg uppercase tracking-[0.2em] sm:text-2xl">
          {appName}
        </Link>

        <nav className="flex flex-1 items-center justify-end gap-5 sm:gap-7">
          <Link href="/catalogue" className={`${link} hidden sm:inline md:hidden`}>{lang === "fr" ? "Dénicher" : "Find"}</Link>
          <Link href="/selection" aria-label={lang === "fr" ? "Ma sélection" : "My picks"} className="relative flex items-center gap-2 transition-opacity hover:opacity-60">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill={saved.length ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
              <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
            </svg>
            {saved.length > 0 && <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-walnut px-1 text-[9px] font-semibold text-white">{saved.length}</span>}
            <span className={`${link} hidden lg:inline`}>{lang === "fr" ? "Sélection" : "Picks"}</span>
          </Link>
          <button type="button" onClick={() => setLang(lang === "fr" ? "en" : "fr")} className={`${link} hidden sm:inline`}>
            {lang === "fr" ? "EN" : "FR"}
          </button>
          {signedIn ? (
            <>
              <Link href="/dashboard" className={`${link} hidden sm:inline`}>{labels.myPots}</Link>
              <Link href="/new" className={`${link} hidden lg:inline`}>{labels.newPot}</Link>
              <form action="/auth/signout" method="post" className="flex items-center">
                <button className="flex items-center gap-2" title={labels.logout} aria-label={labels.logout}>
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt="" referrerPolicy="no-referrer" className="h-7 w-7 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-current text-[11px] font-semibold">
                      {initial}
                    </span>
                  )}
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className={`${link} whitespace-nowrap`}>{labels.login}</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
