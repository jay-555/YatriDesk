import { NextResponse, type NextRequest } from "next/server";

/**
 * Public marketing site (apps/marketing) as a separate Next.js "zone" on the
 * same domain. When MARKETING_URL is set (read at RUNTIME, so the published
 * image works either way), the marketing pages, that site's form endpoints,
 * metadata files and its own assets (under /mkt-static, its assetPrefix) are
 * forwarded to it. Every other path (/login, /order/..., /api/...) stays here.
 * Unset, as on every self-hosted install, this app keeps its own "/" landing.
 */
export function proxy(request: NextRequest) {
  const target = process.env.MARKETING_URL?.replace(/\/$/, "");
  if (!target) return NextResponse.next();
  const { pathname, search } = request.nextUrl;
  return NextResponse.rewrite(new URL(`${pathname}${search}`, target));
}

// Constants only (statically analysed). Keep "/mkt-static" in sync with
// assetPrefix in apps/marketing/next.config.ts.
export const config = {
  matcher: [
    "/",
    "/pricing",
    "/contact",
    "/privacy",
    "/terms",
    "/forms/:path+",
    "/icon.svg",
    "/apple-icon",
    "/opengraph-image",
    "/manifest.webmanifest",
    "/robots.txt",
    "/sitemap.xml",
    "/mkt-static/:path+",
  ],
};
