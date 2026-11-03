import Link from "next/link";
import { getDict } from "@/lib/i18n";
import NewProjectForm from "@/components/NewProjectForm";

export const metadata = { title: "Nouvelle cagnotte" };

export default async function NewPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const { kind } = await searchParams;
  const { t } = await getDict();
  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/dashboard" className="text-sm text-muted hover:text-ink">← {t.myPots}</Link>
      <h1 className="display mt-4 text-5xl sm:text-6xl">{t.newTitle}</h1>
      <NewProjectForm
        initialKind={kind === "travel" ? "travel" : kind === "home" ? "home" : null}
        t={{
          step1: t.step1,
          step2: t.step2,
          step3: t.step3,
          travel: t.travel,
          home: t.home,
          travelDesc: t.travelDesc,
          homeDesc: t.homeDesc,
          namePhTravel: t.namePhTravel,
          namePhHome: t.namePhHome,
          monthlyHint: t.monthlyHint,
          create: t.create,
          perMonth: t.perMonth,
        }}
      />
    </div>
  );
}
