import { brandIcon } from "@/lib/brandIcon";

/** Icônes PNG du site (manifest, Google, favicon) : /pwa-icon/48, /pwa-icon/96, /pwa-icon/180, /pwa-icon/192, /pwa-icon/512, /pwa-icon/1024 */
export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const px = ({ "48": 48, "96": 96, "180": 180, "192": 192, "1024": 1024 } as Record<string, number>)[size] ?? 512;
  return brandIcon(px);
}
