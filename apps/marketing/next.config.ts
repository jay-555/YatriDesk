import type { NextConfig } from "next";

// A Content-Security-Policy is not set here: a strict script-src needs a
// per-request nonce (proxy) or it stops Next.js hydrating in production.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // This site is a "zone" on yatridesk.cloud: the product app (apps/web)
  // forwards the marketing paths here, so this app's JS/CSS must live under
  // its own prefix instead of colliding with the product app's /_next/.
  // Keep in sync with MARKETING_ASSET_PREFIX in apps/web/next.config.ts.
  assetPrefix: "/mkt-static",
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
