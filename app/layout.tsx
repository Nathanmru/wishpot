import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";
import { APP_NAME, siteUrl } from "@/lib/config";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import LangSwitch from "@/components/LangSwitch";
import Logo from "@/components/Logo";

const display = Instrument_Serif({ subsets: ["latin"], variable: "--font-display", weight: "400", style: ["normal", "italic"] });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${APP_NAME} — ${t.tagline}`, template: `%s · ${APP_NAME}` },
    description: t.heroText,
    openGraph: { title: APP_NAME, description: t.heroText, type: "website" },
  };
}

export const viewport: Viewport = { themeColor: "#F7F5F1", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, t } = await getDict();
  const { user } = await getUser();
  const avatar = (user?.user_metadata?.avatar_url as string | undefined) ?? null;
  const firstName = ((user?.user_metadata?.full_name as string | undefined) ?? "").split(" ")[0];

  return (
    <html lang={lang} className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href={user ? "/dashboard" : "/"} aria-label={APP_NAME}>
              <Logo name={APP_NAME} />
            </Link>
            <nav className="flex items-center gap-1 text-sm sm:gap-2">
              <LangSwitch lang={lang} label={t.langSwitch} />
              {user ? (
                <>
                  <Link href="/dashboard" className="hidden rounded-full px-3 py-2 font-medium hover:bg-white sm:inline">
                    {t.myPots}
                  </Link>
                  <Link href="/new" className="btn-primary hidden !px-4 !py-2 sm:inline-flex">
                    + {lang === "fr" ? "Nouvelle cagnotte" : "New pot"}
                  </Link>
                  <form action="/auth/signout" method="post" className="flex items-center">
                    <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-muted hover:bg-white" title={t.logout}>
                      {avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatar} alt="" referrerPolicy="no-referrer" className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-dusk-soft text-xs font-bold text-dusk">
                          {firstName.slice(0, 1).toUpperCase() || "?"}
                        </span>
                      )}
                      <span className="hidden sm:inline">{t.logout}</span>
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/login" className="btn-primary !px-4 !py-2">
                  {t.login}
                </Link>
              )}
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 pt-8 sm:px-6">{children}</main>

        <footer className="border-t border-line bg-white/60">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm sm:grid-cols-[1.4fr_1fr] sm:px-6">
            <div>
              <Logo name={APP_NAME} />
              <p className="mt-3 max-w-sm text-muted">{t.tagline}</p>
              <p className="mt-4 max-w-md text-xs leading-relaxed text-muted">{t.affiliateNote}</p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <Link href="/new?kind=home" className="hover:underline">{t.home}</Link>
              <Link href="/new?kind=travel" className="hover:underline">{t.travel}</Link>
              <Link href="/confidentialite" className="hover:underline">{t.privacy}</Link>
              <p className="mt-4 text-xs text-muted">© {new Date().getFullYear()} {APP_NAME}</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
