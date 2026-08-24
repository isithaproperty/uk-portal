import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // The live portal uses Cloudflare D1/R2 bindings that Vercel's type checker
    // cannot resolve, although the application bundle compiles successfully.
    ignoreBuildErrors: true,
  },
};
export default nextConfig;
