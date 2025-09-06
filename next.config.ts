import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    reactCompiler: true,
    cssChunking: true,
  },
};

export default nextConfig;
