import { ImageResponse } from "next/og";
import { pack } from "@/lib/packs";
import { eur, packPieces } from "@/lib/packPieces";

/** Image verticale 1000×1500 (format Pinterest) d'un look : 6 pièces, le nom du look, le prix total. */
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

/** Satori ne lit pas le WebP : on télécharge la photo et on ne garde que le JPEG / PNG (vérifié sur les octets). */
async function asDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { accept: "image/jpeg,image/png;q=0.9", "user-agent": "Mozilla/5.0 AtelierNama/1.0" }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    if (buf.byteLength > 4_000_000) return null;
    const type = buf[0] === 0xff && buf[1] === 0xd8 ? "image/jpeg" : buf[0] === 0x89 && buf[1] === 0x50 ? "image/png" : null;
    return type ? `data:${type};base64,${Buffer.from(buf).toString("base64")}` : null;
  } catch {
    return null;
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = pack(slug);
  if (!p) return new Response("Not found", { status: 404 });

  const pieces = await packPieces(p.ids);
  const total = pieces.reduce((a, x) => a + x.price, 0);
  const pics = (await Promise.all(pieces.map((x) => asDataUri(x.image_url)))).filter((x): x is string => !!x).slice(0, 6);
  const cells: (string | null)[] = [...pics, ...Array(Math.max(0, 6 - pics.length)).fill(null)].slice(0, pics.length > 4 ? 6 : 4);
  const tall = cells.length === 4 ? 434 : 284;
  const [bodoni, jost] = await Promise.all([font("Bodoni Moda", 500), font("Jost", 400)]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#EFEAE2", padding: 56 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, width: 888 }}>
          {cells.map((src, i) => (
            <div key={i} style={{ width: 434, height: tall, display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF" }}>
              {src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt="" width={400} height={tall - 34} style={{ objectFit: "contain" }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 48, flex: 1 }}>
          <div style={{ fontFamily: "Jost", fontSize: 26, letterSpacing: 8, color: "#8A7F72", textTransform: "uppercase" }}>{`Le look complet · ${p.room}`}</div>
          <div style={{ fontFamily: "Bodoni", fontSize: p.name.length > 22 ? 76 : 92, lineHeight: 1.02, color: "#1A1714", marginTop: 18 }}>{p.name}</div>
          <div style={{ display: "flex", alignItems: "baseline", marginTop: 22 }}>
            <div style={{ fontFamily: "Bodoni", fontSize: 64, color: "#6E4A30" }}>{eur(total)}</div>
            <div style={{ fontFamily: "Jost", fontSize: 28, color: "#6E4A30", marginLeft: 18 }}>{`pour ${pieces.length} pièces`}</div>
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
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
    },
  );
}
