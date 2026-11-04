import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { getUser } from "@/lib/supabase/server";
import NewProjectForm, { type Picked } from "@/components/NewProjectForm";
import { parseExtra, encodeExtra } from "@/lib/starters";

export const metadata = { title: "Nouvelle cagnotte" };

type Search = { name?: string; monthly?: string; product?: string; extra?: string | string[] };

export default async function NewPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const { t, lang } = await getDict();
  const fr = lang === "fr";
  const { supabase } = await getUser();
  const monthly = Number(sp.monthly);

  // Les pièces choisies dans le planificateur : "id" ou "id:quantité"
  const wanted = (sp.product || "")
    .split(",")
    .map((x) => {
      const [id, q] = x.split(":");
      return { id: Number(id), qty: Math.min(Math.max(Number(q) || 1, 1), 12) };
    })
    .filter((x) => Number.isInteger(x.id) && x.id > 0)
    .slice(0, 20);
  let products: Picked[] = [];
  if (wanted.length) {
    const { data } = await supabase.from("products").select("id, title, shop, price, image_url").in("id", wanted.map((w) => w.id));
    products = wanted
      .map((w) => {
        const p = data?.find((d) => d.id === w.id);
        return p ? { id: p.id as number, title: p.title as string, shop: p.shop as string, price: Number(p.price), image_url: p.image_url as string, qty: w.qty } : null;
      })
      .filter((x): x is Picked => !!x);
  }
  const extras = ([] as string[])
    .concat(sp.extra ?? [])
    .map(parseExtra)
    .filter((x): x is NonNullable<typeof x> => !!x)
    .slice(0, 12)
    .map(encodeExtra);
  const fromDemo = products.length > 0 || extras.length > 0;

  return (
    <div className="mx-auto max-w-3xl pt-6">
      <Link href="/dashboard" className="caps text-muted hover:text-ink">
        ← {t.myPots}
      </Link>
      <p className="caps mt-12 text-muted">{fr ? "Nouvelle cagnotte déco" : "New decor pot"}</p>
      <h1 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">
        {fromDemo ? (fr ? "Votre pièce est presque prête." : "Your room is almost ready.") : fr ? "On commence par l'essentiel." : "Let's start with the essentials."}
      </h1>
      <p className="mt-5 max-w-lg text-muted">
        {fromDemo
          ? fr
            ? "Nous avons repris votre sélection. Vérifiez, donnez un nom, et c'est parti."
            : "We kept your selection. Check it, give it a name, and you're set."
          : fr
            ? "Deux questions, moins d'une minute. Ensuite, piochez dans le catalogue ou ajoutez vos propres trouvailles."
            : "Two questions, under a minute. Then pick from the catalogue or add your own finds."}
      </p>
      <NewProjectForm
        initialName={(sp.name || "").slice(0, 80)}
        initialMonthly={Number.isFinite(monthly) && monthly > 0 ? monthly : undefined}
        initialProducts={products}
        initialExtras={extras}
        lang={lang}
      />
    </div>
  );
}
