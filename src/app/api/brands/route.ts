// ═══════════════════════════════════════════════
//  API Route: /api/brands — List all brand slugs
// ═══════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getAllBrands } from "@/lib/cars";

const BRAND_SLUG_MAP: Record<string, string> = {
  Lamborghini: "rent-lamborghini-in-dubai",
  Ferrari: "rent-ferrari-in-dubai",
  "Rolls Royce": "rent-rolls-royce-in-dubai",
  Bentley: "rent-bentley-in-dubai",
  Porsche: "rent-porsche-in-dubai",
  Mercedes: "rent-mercedes-in-dubai",
  BMW: "rent-bmw-in-dubai",
  Audi: "rent-audi-in-dubai",
  "Range Rover": "rent-range-rover-in-dubai",
  Nissan: "rent-nissan-in-dubai",
  Chevrolet: "rent-chevrolet-in-dubai",
  McLaren: "rent-mclaren-in-dubai",
  Cadillac: "rent-cadillac-in-dubai",
  GMC: "rent-gmc-in-dubai",
  Toyota: "rent-toyota-in-dubai",
  Volkswagen: "rent-volkswagen-in-dubai",
  "Mini Cooper": "rent-mini-cooper-in-dubai",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slugsOnly = searchParams.get("slugs") === "true";

  const brands = getAllBrands();

  if (slugsOnly) {
    const slugs = brands
      .map((b) => BRAND_SLUG_MAP[b] || "")
      .filter(Boolean);
    return NextResponse.json(slugs);
  }

  return NextResponse.json({
    brands,
    total: brands.length,
  });
}
