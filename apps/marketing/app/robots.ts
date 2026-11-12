import type { MetadataRoute } from "next";
import { site } from "@/config/site";

// Served for the whole yatridesk.cloud domain, so it also keeps crawlers out
// of the product app's private areas (served by apps/web on the same domain).
const PRIVATE_PATHS = [
  "/api/",
  "/forms/",
  "/dashboard",
  "/pos",
  "/orders",
  "/kds",
  "/tables",
  "/menu",
  "/inventory",
  "/customers",
  "/reports",
  "/accounting",
  "/settings",
  "/team",
  "/platform",
  "/kiosk/",
  "/order/",
  "/customer-display",
  "/change-password",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
