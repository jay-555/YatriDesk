import { ImageResponse } from "next/og";
import { brandMarkDataUri } from "@/components/seo/brandMark";
import { site } from "@/config/site";

export const alt = `${site.name} — Run your restaurant, not your paperwork`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const chips = ["GST billing", "KOT & kitchen display", "Inventory", "Works offline"];
const [, lead = site.name, tail = ""] = /^(.+?)([A-Z][a-z]+)$/.exec(site.name) ?? [];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: site.colors.ink,
          backgroundImage: "radial-gradient(circle at 85% 15%, rgba(234,88,12,0.35), transparent 55%)",
          color: site.colors.cream,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
          <img src={brandMarkDataUri} width={72} height={72} alt="" />
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>
            {lead}
            <span style={{ color: site.colors.saffron }}>{tail}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* PLACEHOLDER: OG tagline */}
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>
            Run your restaurant, not your paperwork.
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "rgba(251,246,238,0.75)" }}>
            Restaurant POS & operations for India
          </div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {chips.map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                border: "2px solid rgba(251,246,238,0.25)",
                fontSize: 24,
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
