// ═══════════════════════════════════════════════
//  SiteLogo — VIP Luxury Car Rental Dubai
//  Uses AI-generated logo image
// ═══════════════════════════════════════════════

"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";

interface SiteLogoProps {
  className?: string;
  showTagline?: boolean;
  link?: boolean;
  size?: "sm" | "md";
}

export default function SiteLogo({
  className = "",
  showTagline = true,
  link = false,
  size = "md",
}: SiteLogoProps) {
  // Logo natural ratio: 1094×371 ≈ 2.95:1
  // Container dimensions match this ratio to avoid cropping
  const [imgW, imgH] = size === "sm" ? [160, 54] : [200, 68];

  const logo = (
    <div className={`relative flex-shrink-0 overflow-hidden ${className}`}
      style={{ width: imgW, height: imgH }}>
      <Image
        src="/images/vip-logo.png"
        alt="VIP Luxury Car Rental Dubai"
        fill
        className="object-contain"
        priority
        sizes={`${imgW}px`}
      />
    </div>
  );

  if (link) {
    return <Link href="/">{logo}</Link>;
  }
  return logo;
}
