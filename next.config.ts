import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Keep an explicit turbopack config empty so custom webpack config is allowed
  turbopack: {},
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Replace the unenv timers polyfill with a no-op shim for Cloudflare Workers
      "unenv/dist/runtime/polyfill/timers.mjs": path.resolve(__dirname, "scripts/noop-timers.js"),
    };
    return config;
  },
};

export default nextConfig;

// Cloudflare bindings inicializálása lokális fejlesztéshez
// Ez teszi elérhetővé a D1 adatbázist next dev során
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
