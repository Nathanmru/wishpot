import { getDict } from "@/lib/i18n";
import RoomPlanner from "@/components/RoomPlanner";

export const metadata = {
  title: "Composer une pièce",
  description: "Choisissez une pièce et un budget : Atelier Nama compose une sélection complète de vraies pièces déco, à ajuster d'un geste.",
};

export default async function ComposerPage() {
  const { lang } = await getDict();
  return (
    <div className="-mt-10">
      <RoomPlanner lang={lang} />
    </div>
  );
}
