import Link from "next/link";
import { redirect } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import { joinProject } from "@/app/actions";
import { cover } from "@/lib/covers";

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

  const kind = preview.kind === "travel" ? "travel" : "home";

  return (
    <div className="mx-auto max-w-lg overflow-hidden rounded-xl3 border border-line bg-white text-center shadow-lift">
      <div className="relative h-56">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover(kind, 1000)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <h1 className="display absolute bottom-5 left-5 right-5 text-5xl leading-none text-white">{preview.name}</h1>
      </div>
      <div className="p-8">
        <p className="text-lg font-semibold">{t.inviteJoinTitle}</p>
        <p className="mt-1 text-muted">
          {t.inviteJoinText}, 👥 {preview.members}
        </p>
        <div className="mt-8">
          {user ? (
            <form action={join}>
              <button className="btn-primary w-full !py-4 text-base">{t.join}</button>
            </form>
          ) : (
            <Link href={`/login?next=${encodeURIComponent(`/invite/${token}?auto=1`)}`} className="btn-primary w-full !py-4 text-base">
              {t.loginToJoin}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
