import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wishpot — la cagnotte à plusieurs",
    short_name: "Wishpot",
    description: "Une cagnotte à plusieurs pour meubler un appartement ou partir en voyage.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#EFEAE2",
    theme_color: "#15120F",
    lang: "fr",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    // « Partager vers Wishpot » depuis une autre appli (Android)
    share_target: {
      action: "/share",
      method: "GET",
      params: { title: "title", text: "text", url: "url" },
    },
  } as MetadataRoute.Manifest;
}
