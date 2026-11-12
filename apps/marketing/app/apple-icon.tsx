import { ImageResponse } from "next/og";
import { brandMarkDataUri } from "@/components/seo/brandMark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#C2410C" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
        <img src={brandMarkDataUri} width={180} height={180} alt="" />
      </div>
    ),
    size,
  );
}
