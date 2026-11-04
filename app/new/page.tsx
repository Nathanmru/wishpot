import Link from "next/link";
import { getDict } from "@/lib/i18n";
import NewProjectForm from "@/components/NewProjectForm";
import { STARTERS } from "@/lib/starters";

export const metadata = { title: "Nouvelle cagnotte" };

type Search = { kind?: string; name?: string; monthly?: string; starter?: string };

export default async function NewPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const { t, lang } = await getDict();
  const fr = lang === "fr";
  const kind = sp.kind === "travel" ? "travel" : sp.kind === "home" ? "home" : null;
  const monthly = Number(sp.monthly);
  const starters = (sp.starter || "")
    .split(",")
    .filter((id) => STARTERS.some((s) => s.id === id && s.kind === kind));
  const fromDemo = starters.length > 0;

  return (
    <div className="mx-auto max-w-3xl pt-6">
      <Link href="/dashboard" className="caps text-muted hover:text-ink">
        ← {t.myPots}
      </Link>
      <p className="caps mt-12 text-muted">{fr ? "Nouvelle cagnotte" : "New pot"}</p>
      <h1 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">
        {fromDemo ? (fr ? "Votre projet est presque prêt." : "Your project is almost ready.") : fr ? "On commence par l'essentiel." : "Let's start with the essentials."}
      </h1>
      <p className="mt-5 max-w-lg text-muted">
        {fromDemo
          ? fr
            ? "Nous avons repris ce que vous avez composé. Vérifiez, donnez-lui un nom, et c'est parti."
            : "We kept what you composed. Check it, give it a name, and you're set."
          : fr
            ? "Quatre questions, moins d'une minute. Tout reste modifiable ensuite."
            : "Four questions, under a minute. Everything stays editable."}
      </p>
      <NewProjectForm
        initialKind={kind}
        initialName={(sp.name || "").slice(0, 80)}
        initialMonthly={Number.isFinite(monthly) && monthly > 0 ? monthly : undefined}
        initialStarters={starters}
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
