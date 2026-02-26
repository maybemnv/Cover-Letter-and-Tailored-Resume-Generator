import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "mammoth"],
  outputFileTracing: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Include resume.tex in the serverless bundle
  experimental: {
    outputFileTracingIncludes: {
      "/api/load-template": ["./resume.tex"],
    },
  },
};

export default nextConfig;
