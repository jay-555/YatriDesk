import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari, Sora } from "next/font/google";
import { Providers } from "@/components/Providers";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { JsonLd, softwareApplicationLd } from "@/components/seo/JsonLd";
import { site } from "@/config/site";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap", weight: ["600", "700", "800"] });
// Only downloaded when Devanagari glyphs are on screen (Hindi toggle).
const deva = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-deva",
  display: "swap",
  preload: false,
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Restaurant POS & billing software for India`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "restaurant POS",
    "restaurant billing software",
    "GST billing",
    "KOT software",
    "kitchen display system",
    "cafe POS India",
    "cloud kitchen software",
    "restaurant inventory",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
    title: `${site.name} — Run your restaurant, not your paperwork`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Run your restaurant, not your paperwork`,
    description: site.description,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: site.colors.cream },
    { media: "(prefers-color-scheme: dark)", color: "#0F1114" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${sora.variable} ${deva.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh pb-20 md:pb-0">
        <JsonLd data={softwareApplicationLd()} />
        <a
          href="#main"
          className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-full bg-brand px-5 py-3 font-semibold text-brand-fg transition-transform focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <Providers>
          <Navbar />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <FloatingCta />
          <CookieBanner />
          <RevealObserver />
        </Providers>
      </body>
    </html>
  );
}
