// ═══════════════════════════════════════════════
//  Default OG Image — /opengraph-image.tsx
//  Simple text-based image, no external fonts
// ═══════════════════════════════════════════════

import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)",
          fontSize: 64,
          fontWeight: 700,
          color: "#C8A951",
          letterSpacing: "0.05em",
        }}
      >
        VIP Luxury Car Rental
        <div
          style={{
            fontSize: 28,
            color: "#999",
            letterSpacing: "0.15em",
            marginTop: 16,
            fontWeight: 400,
          }}
        >
          Dubai · Premium · Exotic
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
