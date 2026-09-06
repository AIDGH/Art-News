import type { NextConfig } from "next";
import path from "node:path";

const internalApiBaseUrl = (
  process.env.API_BASE_URL ?? "http://localhost:4001/api/v1"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd(), "../.."),
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${internalApiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
