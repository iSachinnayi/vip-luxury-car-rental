// ═══════════════════════════════════════════════
//  BrandLogo — User's custom WebP logos
// ═══════════════════════════════════════════════

"use client";

import { useState } from "react";
import { getBrandLogoUrl } from "@/lib/brandLogos";

export default function BrandLogo({ brand, className = "" }: {
  brand: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const logoUrl = getBrandLogoUrl(brand);
  const hClass = "h-12";

  if (failed || !logoUrl) {
    return <span className={`font-semibold text-gray-400 text-xs ${className}`}>{brand}</span>;
  }

  return (
    <img
      src={logoUrl}
      alt={`${brand} - premium car rental Dubai`}
      loading="lazy"
      decoding="async"
      className={`${hClass} w-auto max-w-[130px] object-contain transition-all duration-300 ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
