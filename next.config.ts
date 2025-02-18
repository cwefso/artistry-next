import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rntkgmywnobayfzfandi.supabase.co", // Your Supabase storage
      },
      {
        protocol: "https",
        hostname: "clerk.accounts.dev", // Clerk authentication images
      },
      {
        protocol: "https",
        hostname: "paintings.wefsocodes.com", // Your main domain
      },
      {
        protocol: "https",
        hostname: "wefsocodes.com", // Root domain
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org", // Wikipedia images for artists
      },
      // Add other domains you need here
    ],
    // Optional: Add image quality optimization
    formats: ["image/avif", "image/webp"],
    // Optional: Add device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  // Add security headers (recommended)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `default-src 'self' *.wefsocodes.com *.supabase.co clerk.accounts.dev; img-src 'self' data: https:`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
