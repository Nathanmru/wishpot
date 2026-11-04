import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import { APP_NAME, siteUrl } from "@/lib/config";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import SiteHeader from "@/components/SiteHeader";
import { RegisterSW } from "@/components/AppInstall";
import { ShopStateProvider } from "@/components/ShopState";
import CompareBar from "@/components/CompareBar";
import { Analytics } from "@vercel/analytics/next";

const display = Bodoni_Moda({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Jost({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${APP_NAME} — ${t.tagline}`, template: `%s · ${APP_NAME}` },
    description: t.heroText,
    openGraph: { title: APP_NAME, description: t.heroText, type: "website" },
    icons: { icon: "/favicon-32.png", apple: "/apple-touch-icon.png" },
    appleWebApp: { capable: true, title: APP_NAME, statusBarStyle: "black-translucent" },
  };
}

export const viewport: Viewport = { themeColor: "#15120F", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, t } = await getDict();
  const { user } = await getUser();
  const avatar = (user?.user_metadata?.avatar_url as string | undefined) ?? null;
  const firstName = ((user?.user_metadata?.full_name as string | undefined) ?? "").split(" ")[0];
  const fr = lang === "fr";

  return (
    <html lang={lang} className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <ShopStateProvider signedIn={!!user} fr={fr}>
        <RegisterSW />
        <Analytics />
        <SiteHeader
          appName={APP_NAME}
          lang={lang}
          signedIn={!!user}
          avatar={avatar}
          initial={firstName.slice(0, 1).toUpperCase() || "?"}
          labels={{
            home: fr ? "Catalogue" : "Catalogue",
            travel: fr ? "Inspiration" : "Inspiration",
            myPots: t.myPots,
            newPot: fr ? "Nouvelle cagnotte" : "New pot",
            login: t.login,
            logout: t.logout,
          }}
        />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 pt-24 sm:px-6 sm:pt-28">{children}</main>

        <footer className="bg-night text-bone">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 sm:grid-cols-[2fr_1fr_1fr] sm:px-12">
            <div>
              <p className="font-display text-3xl uppercase tracking-[0.22em]">{APP_NAME}</p>
              <p className="mt-4 max-w-sm text-sm text-bone/60">{t.tagline}</p>
            </div>
            <div className="flex flex-col gap-3 text-[11px] uppercase tracking-label">
              <Link href="/inspiration/maison" className="hover:opacity-60">{fr ? "Tendances maison" : "Home trends"}</Link>
              <Link href="/catalogue" className="hover:opacity-60">{fr ? "Dénicher une pièce" : "Find a piece"}</Link>
              <Link href="/selection" className="hover:opacity-60">{fr ? "Ma sélection" : "My picks"}</Link>
              <Link href="/aide-deco" className="hover:opacity-60">{fr ? "Aide déco" : "Decor guide"}</Link>
              <Link href="/dashboard" className="hover:opacity-60">{t.myPots}</Link>
            </div>
            <div className="flex flex-col gap-3 text-[11px] uppercase tracking-label">
              <Link href="/confidentialite" className="hover:opacity-60">{t.privacy}</Link>
              <a href="mailto:nath.prank@gmail.com" className="hover:opacity-60">Contact</a>
            </div>
          </div>
          <div aria-hidden className="overflow-hidden px-4 sm:px-8">
            <p className="select-none whitespace-nowrap text-center font-display text-[19vw] uppercase leading-[0.8] tracking-[0.06em] text-bone/[0.07]">
              {APP_NAME}
            </p>
          </div>
          <div className="mx-auto max-w-[1400px] border-t border-bone/10 px-6 py-6 text-xs leading-relaxed text-bone/45 sm:px-12">
            {t.affiliateNote} © {new Date().getFullYear()} {APP_NAME}
          </div>
        </footer>
        <CompareBar fr={fr} />
        </ShopStateProvider>
      </body>
    </html>
  );
}
