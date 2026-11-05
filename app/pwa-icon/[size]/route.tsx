import { ImageResponse } from "next/og";
import { BRASS, NIGHT, N_PATH } from "@/lib/brand";

/** Icônes PNG de l'appli (manifest) : /pwa-icon/192, /pwa-icon/512 */
export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const px = size === "192" ? 192 : 512;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: NIGHT }}>
        <svg width={px} height={px} viewBox="0 0 512 512">
          <path fill={BRASS} d={N_PATH} />
        </svg>
      </div>
    ),
    { width: px, height: px, headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
  );
}
