import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Workers optimalizációk
  experimental: {
    // PPR támogatás (ha később szükség lesz rá)
    // ppr: true,
  },
};

export default nextConfig;

// Cloudflare bindings inicializálása lokális fejlesztéshez
// Ez teszi elérhetővé a D1 adatbázist next dev során
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
