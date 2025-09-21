import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable typed routes for type-safe navigation
  experimental: {
    typedRoutes: true,
  },
  images: {
    formats: ['image/webp'],
  },
};

export default nextConfig;
