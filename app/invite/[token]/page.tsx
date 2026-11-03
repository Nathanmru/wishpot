import Link from "next/link";
import { redirect } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { joinProject } from "@/app/actions";

export const metadata = { title: "Invitation" };

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string; auto?: string }>;
}) {
  const { token } = await params;
  const { error, auto } = await searchParams;
  const { t } = await getDict();
  const { supabase, user } = await getUser();

  const { data } = await supabase.rpc("invite_preview", { p_token: token });
  const preview = (Array.isArray(data) ? data[0] : data) as { name: string; kind: string; members: number } | undefined;

  if (!preview || error) {
    return (
      <div className="mx-auto max-w-sm pt-10 text-center">
        <p className="text-4xl">🔗</p>
        <p className="mt-4 text-muted">{t.inviteInvalid}</p>
        <Link href="/" className="btn-ghost mt-6">←</Link>
      </div>
    );
  }

  // Retour de connexion depuis un lien d'invitation : on rejoint directement
  if (user && auto === "1") {
    const { data: pid } = await supabase.rpc("join_project", { p_token: token });
    if (pid) redirect(`/p/${pid}`);
  }

  const join = joinProject.bind(null, token);

  return (
    <div className="mx-auto max-w-sm pt-10 text-center">
      <p className="text-5xl">{preview.kind === "travel" ? "✈️" : "🛋️"}</p>
      <p className="eyebrow mt-6">{t.inviteJoinTitle}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">{preview.name}</h1>
      <p className="mt-2 text-sm text-muted">👥 {preview.members}</p>
      <div className="mt-8">
        {user ? (
          <form action={join}>
            <button className="btn-accent w-full !py-3 text-base">{t.join}</button>
          </form>
        ) : (
          <Link href={`/login?next=${encodeURIComponent(`/invite/${token}?auto=1`)}`} className="btn-accent w-full !py-3 text-base">
            {t.loginToJoin}
          </Link>
        )}
      </div>
    </div>
  );
}
