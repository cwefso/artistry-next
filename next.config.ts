import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rntkgmywnobayfzfandi.supabase.co",
      },
      {
        protocol: "https",
        hostname: "clerk.accounts.dev",
      },
      {
        protocol: "https",
        hostname: "artistry.wefsocodes.com", // Updated subdomain
      },
      {
        protocol: "https",
        hostname: "wefsocodes.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `default-src 'self' artistry.wefsocodes.com *.supabase.co clerk.accounts.dev; img-src 'self' data: https:`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
