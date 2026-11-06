/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // Les anciennes icônes (arche Wishpot) sont remplacées par le N laiton, même aux anciennes adresses
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/favicon.ico", destination: "/pwa-icon/48" },
        { source: "/favicon-32.png", destination: "/pwa-icon/48" },
        { source: "/apple-touch-icon.png", destination: "/pwa-icon/180" },
        { source: "/icon-192.png", destination: "/pwa-icon/192" },
        { source: "/icon-512.png", destination: "/pwa-icon/512" },
        { source: "/icon-maskable-512.png", destination: "/pwa-icon/512" },
      ],
    };
  },
};

export default nextConfig;
