import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config";
import { CATALOG_ROOMS, COLORS, STYLES } from "@/lib/catalog";
import { LANDINGS } from "@/lib/landings";
import { PACKS } from "@/lib/packs";
import { BRANDS } from "@/lib/brands";
import { ICONS } from "@/lib/dupes";
import { GUIDES } from "@/lib/guides";
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
    page("/vintage", 0.9, "daily"),
    page("/idees", 0.9),
    page("/aide-deco", 0.8, "monthly"),
    page("/composer", 0.6, "monthly"),
    page("/a-propos", 0.4, "monthly"),
    page("/inspiration/maison", 0.5, "monthly"),
    ...LANDINGS.map((l) => page(`/idees/${l.slug}`, l.group === "projets" ? 0.7 : 0.8)),
    page("/guides", 0.8),
    ...GUIDES.map((g) => page(`/guides/${g.slug}`, 0.8, "monthly")),
    page("/looks", 0.8),
    ...PACKS.map((p) => page(`/looks/${p.slug}`, 0.7)),
    page("/marques", 0.6),
    ...BRANDS.map((b) => page(`/marques/${b.slug}`, 0.6)),
    page("/alternative", 0.7),
    ...ICONS.map((i) => page(`/alternative/${i.slug}`, 0.7)),
    ...CATALOG_ROOMS.map((r) => page(`/catalogue?piece=${r.id}`, 0.7, "daily")),
    ...STYLES.map((s) => page(`/catalogue?style=${s.id}`, 0.6, "daily")),
    ...COLORS.map((c) => page(`/catalogue?couleur=${c.id}`, 0.5, "daily")),
    ...shops.map((s) => page(`/catalogue?marque=${encodeURIComponent(s)}`, 0.5, "daily")),
  ];
}
