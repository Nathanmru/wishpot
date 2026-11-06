import { brandIcon } from "@/lib/brandIcon";

/** Icône de l'onglet : le logo ATELIER NAMA sur le beige du site. */
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function Icon() {
  return brandIcon(512);
}
