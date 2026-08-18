import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Prismic CDN — for PrismicNextImage components
      {
        protocol: "https",
        hostname: "images.prismic.io",
      },
      {
        protocol: "https",
        hostname: "**.cdn.prismic.io",
      },
      {
        protocol: "https",
        hostname: "**.prismic.io",
      },
    ],
  },
};

export default nextConfig;
