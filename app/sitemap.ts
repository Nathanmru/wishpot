import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config";
import { CATALOG_ROOMS, COLORS, STYLES } from "@/lib/catalog";
import { LANDINGS } from "@/lib/landings";
import { publicClient } from "@/lib/supabase/public";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly" = "weekly") => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  // Les maisons présentes dans le catalogue
  let shops: string[] = [];
  try {
    const { data } = await publicClient().rpc("catalog_facets", { p_room: null });
    shops = Object.keys((data as { shops?: Record<string, number> } | null)?.shops ?? {});
  } catch {}

  return [
    page("/", 1, "daily"),
    page("/catalogue", 0.9, "daily"),
    page("/idees", 0.9),
    page("/aide-deco", 0.8, "monthly"),
    page("/composer", 0.6, "monthly"),
    page("/a-propos", 0.4, "yearly"),
    page("/inspiration/maison", 0.5, "monthly"),
    ...LANDINGS.map((l) => page(`/idees/${l.slug}`, l.group === "projets" ? 0.7 : 0.8)),
    ...CATALOG_ROOMS.map((r) => page(`/catalogue?piece=${r.id}`, 0.7, "daily")),
    ...STYLES.map((s) => page(`/catalogue?style=${s.id}`, 0.6, "daily")),
    ...COLORS.map((c) => page(`/catalogue?couleur=${c.id}`, 0.5, "daily")),
    ...shops.map((s) => page(`/catalogue?marque=${encodeURIComponent(s)}`, 0.5, "daily")),
  ];
}
