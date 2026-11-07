import { ImageResponse } from "next/og";
import { getPiece, pieceId } from "@/lib/piece";

/** Image verticale 1000×1500 (format Pinterest) d'une pièce : grande photo, nom, prix, boutique. */
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
    const res = await fetch(url, { headers: { accept: "image/jpeg,image/png;q=0.9", "user-agent": "Mozilla/5.0 AtelierNama/1.0" }, signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    if (buf.byteLength > 6_000_000) return null;
    const type = buf[0] === 0xff && buf[1] === 0xd8 ? "image/jpeg" : buf[0] === 0x89 && buf[1] === 0x50 ? "image/png" : null;
    return type ? `data:${type};base64,${Buffer.from(buf).toString("base64")}` : null;
  } catch {
    return null;
  }
}

const eur = (v: number) => `${(v % 1 ? v.toFixed(2).replace(".", ",") : Math.round(v).toLocaleString("fr-FR"))} €`;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = pieceId((await params).id);
  const p = id ? await getPiece(id) : null;
  if (!p) return new Response("Not found", { status: 404 });
  const [img, bodoni, jost] = await Promise.all([asDataUri(p.image_url), font("Bodoni Moda", 500), font("Jost", 400)]);
  if (!img) return new Response("No image", { status: 404 });
  const title = p.title.length > 70 ? `${p.title.slice(0, 68).trim()}…` : p.title;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#EFEAE2", padding: 56 }}>
        <div style={{ width: 888, height: 960, display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt="" width={800} height={860} style={{ objectFit: "contain" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 40, flex: 1 }}>
          <div style={{ fontFamily: "Jost", fontSize: 26, letterSpacing: 8, color: "#8A7F72", textTransform: "uppercase" }}>
            {p.shop === "Selency" ? "Pépite seconde main · Selency" : `Trouvé chez ${p.shop}`}
          </div>
          <div style={{ fontFamily: "Bodoni", fontSize: title.length > 40 ? 52 : 64, lineHeight: 1.05, color: "#1A1714", marginTop: 16 }}>{title}</div>
          <div style={{ display: "flex", marginTop: "auto", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "Bodoni", fontSize: 60, color: "#6E4A30" }}>{eur(p.price)}</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <div style={{ fontFamily: "Bodoni", fontSize: 34, letterSpacing: 6, color: "#1A1714" }}>ATELIER NAMA</div>
              <div style={{ fontFamily: "Jost", fontSize: 24, color: "#8A7F72", marginTop: 4 }}>ateliernama.fr</div>
            </div>
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
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=604800" },
    },
  );
}
