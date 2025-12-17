import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  reactCompiler: true,
  experimental: {
    cssChunking: true,
  },
};

export default nextConfig;
