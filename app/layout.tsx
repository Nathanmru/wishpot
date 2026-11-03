import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { APP_NAME, siteUrl } from "@/lib/config";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import LangSwitch from "@/components/LangSwitch";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${APP_NAME} — ${t.tagline}`, template: `%s · ${APP_NAME}` },
    description: t.heroText,
    openGraph: { title: APP_NAME, description: t.heroText, type: "website" },
  };
}

export const viewport: Viewport = { themeColor: "#FBF7F1", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, t } = await getDict();
  const { user } = await getUser();

  return (
    <html lang={lang} className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-dvh">
        <header className="sticky top-0 z-20 border-b border-line/70 bg-cream/85 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            <Link href={user ? "/dashboard" : "/"} className="font-display text-xl font-semibold tracking-tight">
              {APP_NAME}
              <span className="text-terra">.</span>
            </Link>
            <nav className="flex items-center gap-2 text-sm">
              <LangSwitch lang={lang} label={t.langSwitch} />
              {user ? (
                <>
                  <Link href="/dashboard" className="hidden rounded-full px-3 py-1.5 hover:bg-white sm:inline">
                    {t.myPots}
                  </Link>
                  <form action="/auth/signout" method="post">
                    <button className="rounded-full px-3 py-1.5 text-muted hover:bg-white">{t.logout}</button>
                  </form>
                </>
              ) : (
                <Link href="/login" className="btn-primary !py-1.5">
                  {t.login}
                </Link>
              )}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 pb-16 pt-6">{children}</main>

        <footer className="border-t border-line/70">
          <div className="mx-auto max-w-5xl px-4 py-6 text-xs leading-relaxed text-muted">
            <p>{t.affiliateNote}</p>
            <p className="mt-2">
              © {new Date().getFullYear()} {APP_NAME}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
