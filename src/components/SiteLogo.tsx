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
  const [imgW, imgH] = size === "sm" ? [180, 36] : [220, 48];
  const crop = size === "sm" ? '50%' : '50%';

  const logo = (
    <div className={`relative flex-shrink-0 overflow-hidden ${className}`}
      style={{ width: imgW, height: imgH }}>
      <Image
        src="/images/vip-logo.png"
        alt="VIP Luxury Car Rental Dubai"
        fill
        className="object-cover"
        style={{ objectPosition: crop }}
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
