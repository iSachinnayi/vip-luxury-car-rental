// ═══════════════════════════════════════════════
//  API Route: /api/types — List all car type slugs
// ═══════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getAllTypes } from "@/lib/cars";

const TYPE_SLUG_MAP: Record<string, string> = {
  Sports: "sports-car-rental-in-dubai",
  Luxury: "luxury-car-rental-in-dubai",
  SUV: "suv-car-rental-in-dubai",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slugsOnly = searchParams.get("slugs") === "true";

  const types = getAllTypes().filter(Boolean); // remove empty strings

  if (slugsOnly) {
    const slugs = types
      .map((t) => TYPE_SLUG_MAP[t] || "")
      .filter(Boolean);
    return NextResponse.json(slugs);
  }

  return NextResponse.json({
    types,
    total: types.length,
  });
}
