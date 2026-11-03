"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { setLang } from "@/app/actions";

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
  const immersive = path === "/";
  const [scrolled, setScrolled] = useState(false);

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
    : `text-ink ${scrolled ? "bg-paper/90 backdrop-blur-md border-b border-line" : "bg-paper"}`;

  const link = "text-[11px] font-medium uppercase tracking-label transition-opacity hover:opacity-60";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${tone}`}>
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:h-20 sm:px-8">
        <nav className="hidden flex-1 items-center gap-7 md:flex">
          <Link href="/new?kind=home" className={link}>{labels.home}</Link>
          <Link href="/new?kind=travel" className={link}>{labels.travel}</Link>
        </nav>

        <Link href={signedIn ? "/dashboard" : "/"} aria-label={appName} className="font-display text-2xl uppercase tracking-[0.22em] sm:text-[1.9rem]">
          {appName}
        </Link>

        <nav className="flex flex-1 items-center justify-end gap-5 sm:gap-7">
          <button type="button" onClick={() => setLang(lang === "fr" ? "en" : "fr")} className={link}>
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
            <Link href="/login" className={link}>{labels.login}</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
