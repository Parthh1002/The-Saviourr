import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SSR mode — optimized for Vercel deployment
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
