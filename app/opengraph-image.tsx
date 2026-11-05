import { ImageResponse } from "next/og";

export const alt = "Atelier Nama : déco vintage, pièces chinées et cagnotte pour votre intérieur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** L'image affichée quand on partage le site (Google, réseaux, messageries). */
export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#ECE3D4", color: "#2B211A", fontFamily: "serif" }}>
        <div style={{ fontSize: 26, letterSpacing: 8, textTransform: "uppercase", color: "#7A6650" }}>La cagnotte déco, pièce à pièce</div>
        <div style={{ fontSize: 150, marginTop: 20, display: "flex" }}>
          <span>Atelier&nbsp;</span>
          <span style={{ fontStyle: "italic" }}>Nama</span>
        </div>
        <div style={{ display: "flex", marginTop: 40, gap: 18 }}>
          {["#8A5530", "#B8623E", "#8C9A76", "#E3D7C3", "#B8954F"].map((c) => (
            <div key={c} style={{ width: 54, height: 54, borderRadius: 27, background: c }} />
          ))}
        </div>
        <div style={{ fontSize: 30, marginTop: 40, color: "#5C4A3A" }}>Pièces chinées · Design · Petites maisons</div>
      </div>
    ),
    size,
  );
}
