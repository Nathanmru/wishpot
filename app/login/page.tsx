import { redirect } from "next/navigation";
import { APP_NAME } from "@/lib/config";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import GoogleButton from "@/components/GoogleButton";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  const { user } = await getUser();
  if (user) redirect(safeNext);
  const { t } = await getDict();

  return (
    <div className="mx-auto max-w-sm pt-10 text-center">
      <h1 className="font-display text-3xl font-semibold">{t.loginTitle}</h1>
      <p className="mt-3 text-muted">{t.loginText}</p>
      {error && <p className="mt-4 rounded-xl bg-terra-soft p-3 text-sm text-terra-dark">Oups — réessaie.</p>}
      <div className="mt-8">
        <GoogleButton next={safeNext} label={t.continueGoogle} />
      </div>
      <p className="mt-6 text-xs text-muted">{APP_NAME}</p>
    </div>
  );
}
