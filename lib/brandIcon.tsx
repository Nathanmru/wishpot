import { ImageResponse } from "next/og";

/** Logo carré d'Atelier Nama : « ATELIER » en capitales espacées au-dessus de « NAMA » en Bodoni, sur le beige du site. */
const PAPER = "#EFEAE2";
const INK = "#1A1714";

const fonts: Record<string, Promise<ArrayBuffer | null>> = {};
function font(family: string, weight: number) {
  const k = `${family}:${weight}`;
  fonts[k] ??= (async () => {
    try {
      const css = await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`).then((r) => r.text());
      const src = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
      return src ? await fetch(src).then((r) => r.arrayBuffer()) : null;
    } catch {
      return null;
    }
  })();
  return fonts[k];
}

export async function brandIcon(px: number) {
  const [bodoni, jost] = await Promise.all([font("Bodoni Moda", 500), font("Jost", 400)]);
  const k = px / 1024;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: PAPER, color: INK }}>
        <div style={{ display: "flex", fontFamily: "Jost", fontSize: 56 * k, letterSpacing: 34 * k, paddingLeft: 34 * k, lineHeight: 1 }}>ATELIER</div>
        <div style={{ display: "flex", fontFamily: "Bodoni", fontSize: 215 * k, letterSpacing: 12 * k, paddingLeft: 12 * k, lineHeight: 1, marginTop: 18 * k }}>NAMA</div>
      </div>
    ),
    {
      width: px,
      height: px,
      fonts: [
        ...(bodoni ? [{ name: "Bodoni", data: bodoni, weight: 500 as const, style: "normal" as const }] : []),
        ...(jost ? [{ name: "Jost", data: jost, weight: 400 as const, style: "normal" as const }] : []),
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" },
    },
  );
}
