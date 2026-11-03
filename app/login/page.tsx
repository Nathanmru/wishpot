import { redirect } from "next/navigation";
import { APP_NAME } from "@/lib/config";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { cover } from "@/lib/covers";
import GoogleButton from "@/components/GoogleButton";
import Logo from "@/components/Logo";

export const metadata = { title: "Connexion" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  const { user } = await getUser();
  if (user) redirect(safeNext);
  const { t, lang } = await getDict();
  const fr = lang === "fr";

  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-xl3 border border-line bg-white shadow-lift md:grid-cols-2">
      <div className="relative hidden min-h-[560px] md:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover("travel", 1000)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dusk/80 via-dusk/10 to-transparent" />
        <p className="display absolute bottom-8 left-8 right-8 text-4xl leading-tight text-white">
          {fr ? "Ce que vous mettez de côté, ensemble, au même endroit." : "What you save, together, in one place."}
        </p>
      </div>
      <div className="flex flex-col justify-center p-8 sm:p-14">
        <Logo name={APP_NAME} />
        <h1 className="display mt-10 text-5xl">{t.loginTitle}</h1>
        <p className="mt-3 max-w-sm leading-relaxed text-muted">{t.loginText}</p>
        {error && (
          <p className="mt-5 rounded-xl bg-apricot-soft p-3 text-sm text-walnut-dark">
            {fr ? "La connexion a échoué. Réessaie avec ton compte Google." : "Sign-in failed. Try again with your Google account."}
          </p>
        )}
        <div className="mt-8">
          <GoogleButton next={safeNext} label={t.continueGoogle} />
        </div>
        <p className="mt-6 text-xs leading-relaxed text-muted">
          {fr
            ? "Nous utilisons seulement ton nom, ton email et ta photo pour créer ton compte."
            : "We only use your name, email and photo to create your account."}{" "}
          <a href="/confidentialite" className="underline">{t.privacy}</a>
        </p>
      </div>
    </div>
  );
}
