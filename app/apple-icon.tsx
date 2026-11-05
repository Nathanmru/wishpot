import { ImageResponse } from "next/og";
import { BRASS, NIGHT, N_PATH } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: NIGHT }}>
        <svg width="180" height="180" viewBox="0 0 512 512">
          <path fill={BRASS} d={N_PATH} />
        </svg>
      </div>
    ),
    size,
  );
}
