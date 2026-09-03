import type { NextConfig } from "next";
import { existsSync } from "node:fs";

const nextConfig: NextConfig = {
  output: "standalone",
  // Bundle the build-time-generated Z.ai SDK config into serverless functions
  // (ephemeral hosts have no writable /etc or $HOME at runtime).
  ...(existsSync(".z-ai-config")
    ? {
        outputFileTracingIncludes: {
          "/api/**/*": ["./.z-ai-config"],
        },
      }
    : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
