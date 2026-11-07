import { ImageResponse } from "next/og";
import { getDeck, type Slide } from "@/lib/carousel";

/** Une slide de carrousel Instagram (1080×1350) : /carrousel/<deck>/<n>. Sert au studio (page non référencée). */
export const revalidate = 3600;

const BG = "#EFEAE2";
const INK = "#1A1714";
const MUTED = "#8A7F72";
const WALNUT = "#6E4A30";

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

const eur = (v: number) => `${(v % 1 && v < 100 ? v.toFixed(2).replace(".", ",") : Math.round(v).toLocaleString("fr-FR"))} €`;
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trim()}…` : s);

function Brand() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
      <div style={{ fontFamily: "Bodoni", fontSize: 34, letterSpacing: 7, color: INK }}>ATELIER NAMA</div>
      <div style={{ fontFamily: "Jost", fontSize: 26, color: MUTED }}>@atelier_nama</div>
    </div>
  );
}

async function render(s: Slide) {
  if (s.kind === "cover") {
    const pics = (await Promise.all(s.photos.map(asDataUri))).filter((x): x is string => !!x).slice(0, 4);
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: BG, padding: 64 }}>
        {pics.length >= 2 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, width: 952 }}>
            {pics.slice(0, pics.length >= 4 ? 4 : 2).map((src, i) => (
              <div key={i} style={{ width: 468, height: pics.length >= 4 ? 300 : 460, display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" width={420} height={pics.length >= 4 ? 268 : 420} style={{ objectFit: "contain" }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", width: 120, height: 120, marginTop: 120, marginLeft: 20, background: WALNUT, transform: "rotate(45deg)" }} />
        )}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 56, flex: 1 }}>
          <div style={{ fontFamily: "Jost", fontSize: 28, letterSpacing: 9, color: MUTED, textTransform: "uppercase" }}>{s.kicker}</div>
          <div style={{ fontFamily: "Bodoni", fontSize: s.title.length > 30 ? 84 : 110, lineHeight: 1.0, color: INK, marginTop: 20 }}>{s.title}</div>
          <div style={{ fontFamily: "Bodoni", fontSize: 54, color: WALNUT, marginTop: 24 }}>{s.sub}</div>
          <div style={{ display: "flex", marginTop: "auto", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "Bodoni", fontSize: 34, letterSpacing: 7, color: INK }}>ATELIER NAMA</div>
            <div style={{ fontFamily: "Jost", fontSize: 28, letterSpacing: 4, color: INK }}>FAITES DÉFILER  ›</div>
          </div>
        </div>
      </div>
    );
  }
  if (s.kind === "piece") {
    const src = await asDataUri(s.piece.image_url);
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: BG, padding: 64 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Jost", fontSize: 26, letterSpacing: 8, color: MUTED, textTransform: "uppercase" }}>
          <div>{s.label}</div>
          <div>{`${s.index} / ${s.count}`}</div>
        </div>
        <div style={{ width: 952, height: 820, marginTop: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF" }}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" width={860} height={740} style={{ objectFit: "contain" }} />
          ) : (
            <div style={{ width: 80, height: 80, background: MUTED, transform: "rotate(45deg)" }} />
          )}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 36 }}>
          <div style={{ display: "flex", flexDirection: "column", width: 640 }}>
            <div style={{ fontFamily: "Jost", fontSize: 26, letterSpacing: 6, color: MUTED, textTransform: "uppercase" }}>
              {s.piece.shop === "Selency" ? "Seconde main · Selency" : s.piece.shop}
            </div>
            <div style={{ fontFamily: "Bodoni", fontSize: 50, lineHeight: 1.08, color: INK, marginTop: 10 }}>{clip(s.piece.title, 60)}</div>
          </div>
          <div style={{ fontFamily: "Bodoni", fontSize: 72, color: WALNUT }}>{eur(s.piece.price)}</div>
        </div>
      </div>
    );
  }
  if (s.kind === "total") {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: INK, padding: 72, color: BG }}>
        <div style={{ fontFamily: "Jost", fontSize: 28, letterSpacing: 9, color: "#B8AC9C", textTransform: "uppercase" }}>{`Le total · ${s.title}`}</div>
        <div style={{ fontFamily: "Bodoni", fontSize: 170, lineHeight: 1, marginTop: 30 }}>{eur(s.total)}</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 56, borderTop: "1px solid #4A433C" }}>
          {s.pieces.slice(0, 8).map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid #4A433C", fontFamily: "Jost", fontSize: 30 }}>
              <div style={{ width: 720 }}>{clip(p.title, 42)}</div>
              <div>{eur(p.price)}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", marginTop: "auto", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "Bodoni", fontSize: 34, letterSpacing: 7 }}>ATELIER NAMA</div>
          <div style={{ fontFamily: "Jost", fontSize: 28, color: "#B8AC9C" }}>ou en cagnotte, à votre rythme</div>
        </div>
      </div>
    );
  }
  if (s.kind === "tip") {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: BG, padding: 80 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Jost", fontSize: 26, letterSpacing: 8, color: MUTED, textTransform: "uppercase" }}>
          <div>Règle déco</div>
          <div>{`${s.index} / ${s.count}`}</div>
        </div>
        <div style={{ fontFamily: "Bodoni", fontSize: 300, lineHeight: 1, color: WALNUT, marginTop: 70 }}>{String(s.index).padStart(2, "0")}</div>
        <div style={{ fontFamily: "Bodoni", fontSize: 80, lineHeight: 1.05, color: INK, marginTop: 40 }}>{s.rule}</div>
        <div style={{ fontFamily: "Jost", fontSize: 36, lineHeight: 1.4, color: MUTED, marginTop: 36 }}>{s.why}</div>
        <div style={{ display: "flex", marginTop: "auto" }}>
          <Brand />
        </div>
      </div>
    );
  }
  if (s.kind === "icon") {
    const i = s.icon;
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: INK, padding: 80, color: BG }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Jost", fontSize: 26, letterSpacing: 9, color: "#B8AC9C" }}>
          <div>LUXE VS BONNE AFFAIRE</div>
          <div>L&apos;ICÔNE</div>
        </div>
        <div style={{ fontFamily: "Bodoni", fontSize: i.name.length > 20 ? 104 : 124, lineHeight: 1.0, marginTop: 120 }}>{i.name}</div>
        <div style={{ fontFamily: "Jost", fontSize: 34, color: "#B8AC9C", marginTop: 30, lineHeight: 1.35 }}>{i.credit}</div>
        <div style={{ display: "flex", alignItems: "baseline", marginTop: 90 }}>
          {i.from && <div style={{ fontFamily: "Jost", fontSize: 40, color: "#B8AC9C", marginRight: 18 }}>dès</div>}
          <div style={{ fontFamily: "Bodoni", fontSize: 190, lineHeight: 1 }}>{eur(i.price)}</div>
        </div>
        <div style={{ fontFamily: "Jost", fontSize: 24, color: "#8A7F72", marginTop: 16 }}>{`Prix constaté chez ${i.source}, novembre 2026`}</div>
        <div style={{ display: "flex", marginTop: "auto", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "Bodoni", fontSize: 34, letterSpacing: 7 }}>ATELIER NAMA</div>
          <div style={{ fontFamily: "Jost", fontSize: 30, letterSpacing: 3, color: BG }}>{`LA VERSION À ${eur(s.best)}  ›`}</div>
        </div>
      </div>
    );
  }
  if (s.kind === "pair") {
    const i = s.icon;
    const src = await asDataUri(s.piece.image_url);
    const pct = Math.round((1 - s.piece.price / i.price) * 100);
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: BG }}>
        <div style={{ display: "flex", flexDirection: "column", background: INK, color: BG, padding: "48px 64px 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Jost", fontSize: 24, letterSpacing: 8, color: "#B8AC9C" }}>
            <div>L&apos;ICÔNE</div>
            <div>{`${s.index} / ${s.count}`}</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", width: 640 }}>
              <div style={{ fontFamily: "Bodoni", fontSize: 54, lineHeight: 1.05 }}>{i.name}</div>
              <div style={{ fontFamily: "Jost", fontSize: 24, color: "#B8AC9C", marginTop: 8 }}>{clip(i.credit, 52)}</div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              {i.from && <div style={{ fontFamily: "Jost", fontSize: 26, color: "#B8AC9C", marginRight: 10 }}>dès</div>}
              <div style={{ fontFamily: "Bodoni", fontSize: 64, textDecoration: "line-through" }}>{eur(i.price)}</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "36px 64px 56px", flex: 1 }}>
          <div style={{ fontFamily: "Jost", fontSize: 24, letterSpacing: 8, color: WALNUT }}>LA BONNE AFFAIRE · MÊME ESPRIT</div>
          <div style={{ width: 952, height: 640, marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF", position: "relative" }}>
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" width={860} height={580} style={{ objectFit: "contain" }} />
            ) : (
              <div style={{ width: 80, height: 80, background: MUTED, transform: "rotate(45deg)" }} />
            )}
            <div style={{ position: "absolute", top: 24, right: 24, display: "flex", background: WALNUT, color: BG, fontFamily: "Jost", fontSize: 34, padding: "10px 22px" }}>{`−${pct} %`}</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 28 }}>
            <div style={{ display: "flex", flexDirection: "column", width: 640 }}>
              <div style={{ fontFamily: "Jost", fontSize: 24, letterSpacing: 6, color: MUTED, textTransform: "uppercase" }}>
                {s.piece.shop === "Selency" ? "Seconde main · Selency" : s.piece.shop}
              </div>
              <div style={{ fontFamily: "Bodoni", fontSize: 44, lineHeight: 1.08, color: INK, marginTop: 8 }}>{clip(s.piece.title, 56)}</div>
            </div>
            <div style={{ fontFamily: "Bodoni", fontSize: 84, color: WALNUT }}>{eur(s.piece.price)}</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: BG, padding: 90 }}>
      <div style={{ fontFamily: "Jost", fontSize: 28, letterSpacing: 10, color: MUTED }}>ATELIER</div>
      <div style={{ fontFamily: "Bodoni", fontSize: 170, letterSpacing: 18, color: INK, lineHeight: 1, marginTop: 10 }}>NAMA</div>
      <div style={{ width: 120, height: 2, background: WALNUT, marginTop: 70 }} />
      <div style={{ fontFamily: "Bodoni", fontSize: 76, color: INK, marginTop: 70, textAlign: "center", lineHeight: 1.05 }}>{s.title}</div>
      <div style={{ fontFamily: "Jost", fontSize: 36, color: MUTED, marginTop: 34, textAlign: "center", lineHeight: 1.4 }}>{s.sub}</div>
      <div style={{ fontFamily: "Jost", fontSize: 34, letterSpacing: 4, color: WALNUT, marginTop: 70 }}>ateliernama.fr</div>
    </div>
  );
}

export async function GET(_req: Request, { params }: { params: Promise<{ deck: string; n: string }> }) {
  const { deck, n } = await params;
  const d = await getDeck(deck);
  const s = d?.slides[Number(n)];
  if (!d || !s) return new Response("Not found", { status: 404 });
  const [bodoni, jost] = await Promise.all([font("Bodoni Moda", 500), font("Jost", 400)]);
  return new ImageResponse(await render(s), {
    width: 1080,
    height: 1350,
    fonts: [
      ...(bodoni ? [{ name: "Bodoni", data: bodoni, weight: 500 as const, style: "normal" as const }] : []),
      ...(jost ? [{ name: "Jost", data: jost, weight: 400 as const, style: "normal" as const }] : []),
    ],
    headers: { "Cache-Control": "public, max-age=600, s-maxage=3600" },
  });
}
