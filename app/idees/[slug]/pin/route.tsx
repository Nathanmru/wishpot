import { ImageResponse } from "next/og";
import { landing } from "@/lib/landings";
import { fetchPieces } from "@/lib/landingPieces";

/** Image verticale 1000×1500 (format Pinterest) d'une page « idées » : 4 pièces, le titre, la marque. */
export const revalidate = 86400;

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

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = landing(slug);
  if (!l) return new Response("Not found", { status: 404 });

  const pieces = await fetchPieces(l.filter);
  // Satori ne lit pas le WebP : on garde les photos en JPEG / PNG
  const pics = pieces.filter((p) => /\.(jpe?g|png)(\?|$)/i.test(p.image_url) || /format=(jpg|pjpg|png)/i.test(p.image_url)).slice(0, 4);
  const [bodoni, jost] = await Promise.all([font("Bodoni Moda", 500), font("Jost", 400)]);
  const title = l.h1.split(" : ")[0];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#EFEAE2", padding: 56 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, width: 888 }}>
          {(pics.length ? pics : [null, null, null, null]).map((p, i) => (
            <div key={i} style={{ width: 434, height: 434, display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF" }}>
              {p && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image_url} alt="" width={390} height={390} style={{ objectFit: "contain" }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 56, flex: 1 }}>
          <div style={{ fontFamily: "Jost", fontSize: 26, letterSpacing: 8, color: "#8A7F72", textTransform: "uppercase" }}>Atelier Nama · Idées déco</div>
          <div style={{ fontFamily: "Bodoni", fontSize: title.length > 22 ? 78 : 96, lineHeight: 1.02, color: "#1A1714", marginTop: 22 }}>{title}</div>
          <div style={{ fontFamily: "Jost", fontSize: 30, color: "#6E4A30", marginTop: 26 }}>
            {`${pieces.length} pièces chinées & design, à shopper ou à mettre en cagnotte`}
          </div>
          <div style={{ display: "flex", marginTop: "auto", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "Bodoni", fontSize: 40, letterSpacing: 6, color: "#1A1714" }}>ATELIER NAMA</div>
            <div style={{ fontFamily: "Jost", fontSize: 26, color: "#8A7F72" }}>ateliernama.fr</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1000,
      height: 1500,
      fonts: [
        ...(bodoni ? [{ name: "Bodoni", data: bodoni, weight: 500 as const, style: "normal" as const }] : []),
        ...(jost ? [{ name: "Jost", data: jost, weight: 400 as const, style: "normal" as const }] : []),
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" },
    },
  );
}
