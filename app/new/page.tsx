import { getDict } from "@/lib/i18n";
import NewProjectForm from "@/components/NewProjectForm";

export const metadata = { title: "+" };

export default async function NewPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const { kind } = await searchParams;
  const { t } = await getDict();
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-3xl font-semibold">{t.newTitle}</h1>
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
