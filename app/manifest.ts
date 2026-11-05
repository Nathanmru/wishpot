import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Atelier Nama — la cagnotte déco",
    short_name: "Nama",
    description: "La cagnotte à plusieurs pour meubler et décorer votre appartement ou votre maison.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#EFEAE2",
    theme_color: "#15120F",
    lang: "fr",
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    // « Partager vers Atelier Nama » depuis une autre appli (Android)
    share_target: {
      action: "/share",
      method: "GET",
      params: { title: "title", text: "text", url: "url" },
    },
  } as MetadataRoute.Manifest;
}
