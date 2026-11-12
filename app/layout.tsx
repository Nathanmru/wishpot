import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Bodoni_Moda, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { APP_NAME, CONTACT_EMAIL, siteUrl } from "@/lib/config";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import SiteHeader from "@/components/SiteHeader";
import { RegisterSW } from "@/components/AppInstall";
import { ShopStateProvider } from "@/components/ShopState";
import CompareBar from "@/components/CompareBar";
import { Analytics } from "@vercel/analytics/next";

const display = Bodoni_Moda({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const hero = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400"], style: ["normal", "italic"], variable: "--font-hero", display: "swap" });
const sans = Jost({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await getDict();
  const fr = lang === "fr";
  const description = fr
    ? "Venez dénicher vos pépites en déco et ameublement, vintage ou design, et créez une cagnotte pour financer vos projets les plus fous."
    : "Vintage decor, pre-loved finds and design from small makers: find the piece your home needs, compare it, or save for it with a shared decor pot.";
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: fr ? `${APP_NAME} — Pépites déco, vintage & cagnotte maison` : `${APP_NAME} — Vintage decor, finds & a savings pot for your home`,
      template: `%s | ${APP_NAME}`,
    },
    description,
    applicationName: APP_NAME,
    keywords: ["déco vintage", "meubles chinés", "décoration intérieur", "canapé cuir vintage", "déco bohème", "pièces uniques", "cagnotte déco", "liste de crémaillère", "mobilier design", "seconde main"],
    openGraph: { title: APP_NAME, description, type: "website", siteName: APP_NAME, locale: fr ? "fr_FR" : "en_GB", url: siteUrl() },
    twitter: { card: "summary_large_image", title: APP_NAME, description },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
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
    <html lang={lang} className={`${display.variable} ${hero.variable} ${sans.variable}`}>
      <head>
        {/* Icône PNG pour Google (en plus de l'icône SVG) */}
        <link rel="icon" href="/favicon.ico" sizes="48x48" type="image/png" />
      </head>
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
          <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 sm:grid-cols-[1.6fr_1fr_1fr_1fr] sm:px-12">
            <div>
              <p className="font-display text-3xl uppercase tracking-[0.22em]">{APP_NAME}</p>
              <p className="mt-4 max-w-sm text-sm text-bone/60">{t.tagline}</p>
            </div>
            <div className="flex flex-col gap-3 text-[11px] uppercase tracking-label">
              <Link href="/inspiration/maison" className="hover:opacity-60">{fr ? "Tendances maison" : "Home trends"}</Link>
              <Link href="/catalogue" className="hover:opacity-60">{fr ? "Dénicher une pièce" : "Find a piece"}</Link>
              <Link href="/vintage" className="hover:opacity-60">{fr ? "Meubles vintage" : "Vintage furniture"}</Link>
              <Link href="/selection" className="hover:opacity-60">{fr ? "Ma sélection" : "My picks"}</Link>
              <Link href="/aide-deco" className="hover:opacity-60">{fr ? "Aide déco" : "Decor guide"}</Link>
              <Link href="/idees" className="hover:opacity-60">{fr ? "Idées déco" : "Decor ideas"}</Link>
              <Link href="/guides" className="hover:opacity-60">{fr ? "Guides" : "Guides"}</Link>
              <Link href="/looks" className="hover:opacity-60">{fr ? "Looks complets" : "Complete looks"}</Link>
              <Link href="/dashboard" className="hover:opacity-60">{t.myPots}</Link>
            </div>
            <div className="flex flex-col gap-3 text-[11px] uppercase tracking-label">
              {[
                ["canape-cuir-vintage", "Canapé cuir vintage"],
                ["deco-boheme", "Déco bohème"],
                ["salon-vintage", "Salon vintage"],
                ["tapis-berbere", "Tapis berbère"],
                ["lampe-laiton", "Lampe laiton"],
                ["deco-terracotta", "Déco terracotta"],
                ["meubles-chines", "Meubles chinés"],
                ["chaise-vintage", "Chaise vintage"],
                ["lampe-vintage", "Lampe vintage"],
                ["meuble-scandinave-vintage", "Meuble scandinave vintage"],
                ["cagnotte-deco", "Cagnotte déco"],
              ].map(([slug, label]) => (
                <Link key={slug} href={`/idees/${slug}`} className="hover:opacity-60">
                  {label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3 text-[11px] uppercase tracking-label">
              <Link href="/a-propos" className="hover:opacity-60">{fr ? "À propos" : "About"}</Link>
              <Link href="/mentions-legales" className="hover:opacity-60">{fr ? "Mentions légales" : "Legal notice"}</Link>
              <Link href="/confidentialite" className="hover:opacity-60">{t.privacy}</Link>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:opacity-60">Contact</a>
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
