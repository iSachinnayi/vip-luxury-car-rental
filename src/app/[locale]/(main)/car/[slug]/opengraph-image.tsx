// ═══════════════════════════════════════════════
//  Dynamic OG Image — /car/[slug]/opengraph-image.tsx
//  Generates unique OG image per car
// ═══════════════════════════════════════════════

import { ImageResponse } from "next/og";
import { getCarBySlug } from "@/lib/cars";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const car = getCarBySlug(slug);

  const title = car?.title || "Luxury Car Rental Dubai";
  const brand = car?.brand || "";
  const price = car?.pricing?.per_day || "";

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
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gold top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, transparent, #C8A951, transparent)",
          }}
        />

        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,169,81,0.1) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Brand name */}
        {brand && (
          <div
            style={{
              fontFamily: '"Inter"',
              fontSize: 16,
              color: "#C8A951",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            {brand}
          </div>
        )}

        {/* Car title */}
        <div
          style={{
            fontFamily: '"Playfair Display"',
            fontSize: 52,
            color: "#FFFFFF",
            fontWeight: 700,
            textAlign: "center",
            marginTop: brand ? 12 : 0,
            padding: "0 40px",
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>

        {/* Price */}
        {price && (
          <div
            style={{
              fontFamily: '"Inter"',
              fontSize: 24,
              color: "#C8A951",
              fontWeight: 600,
              marginTop: 16,
            }}
          >
            From AED {price}/day
          </div>
        )}

        {/* Divider */}
        <div
          style={{
            width: 160,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(200,169,81,0.5), transparent)",
            marginTop: 20,
          }}
        />

        {/* Site name */}
        <div
          style={{
            fontFamily: '"Inter"',
            fontSize: 14,
            color: "#666",
            marginTop: 16,
            letterSpacing: "0.1em",
          }}
        >
          VIP Luxury Car Rental Dubai
        </div>

        {/* Bottom gold bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, transparent, #C8A951, transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
