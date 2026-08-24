import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  turbopack: {
    resolveAlias: {
      "cloudflare:workers": "./vercel-cloudflare-stub.ts",
    },
  },
};
export default nextConfig;
