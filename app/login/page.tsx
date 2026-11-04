import { redirect } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { PHOTOS, photo } from "@/lib/covers";
import GoogleButton from "@/components/GoogleButton";

export const metadata = { title: "Connexion" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  const { user } = await getUser();
  if (user) redirect(safeNext);
  const { t, lang } = await getDict();
  const fr = lang === "fr";
  const creating = safeNext.startsWith("/new");

  return (
    <div className="-mt-24 grid min-h-[100dvh] sm:-mt-28 md:mx-[calc(50%-50vw)] md:grid-cols-2">
      <div className="relative -mx-4 h-[42vh] overflow-hidden bg-night sm:-mx-6 md:mx-0 md:h-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo(PHOTOS.parisSalon, 1600)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
        <p className="display absolute bottom-8 left-6 right-6 text-3xl leading-tight text-white sm:left-12 sm:text-5xl">
          {fr ? "Ce que vous mettez de côté, ensemble, au même endroit." : "What you save, together, in one place."}
        </p>
      </div>

      <div className="flex flex-col justify-center py-14 md:px-16 lg:px-24">
        <p className="caps text-muted">{creating ? (fr ? "Dernière étape" : "Last step") : fr ? "Connexion" : "Log in"}</p>
        <h1 className="display mt-4 text-5xl leading-[0.95] sm:text-6xl">
          {creating ? (fr ? "Gardez votre projet." : "Keep your project.") : fr ? "Bon retour." : "Welcome back."}
        </h1>
        <p className="mt-5 max-w-sm leading-relaxed text-muted">
          {creating
            ? fr
              ? "Un compte Google suffit pour enregistrer votre cagnotte et la retrouver sur tous vos appareils."
              : "A Google account is all you need to save your pot and find it on every device."
            : t.loginText}
        </p>
        {error && (
          <p className="mt-6 border-l-2 border-walnut pl-3 text-sm text-walnut-dark">
            {fr ? "La connexion a échoué. Réessayez avec votre compte Google." : "Sign-in failed. Try again with your Google account."}
          </p>
        )}
        <div className="mt-10 max-w-sm">
          <GoogleButton next={safeNext} label={t.continueGoogle} />
        </div>
        <ul className="mt-10 max-w-sm space-y-2 border-t border-line pt-6 text-sm text-muted">
          <li>{fr ? "Gratuit, sans carte bancaire." : "Free, no card needed."}</li>
          <li>{fr ? "Nous utilisons seulement votre nom, votre e-mail et votre photo." : "We only use your name, email and photo."}</li>
          <li>
            <a href="/confidentialite" className="underline underline-offset-4">
              {t.privacy}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
