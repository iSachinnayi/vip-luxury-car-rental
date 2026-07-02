// ═══════════════════════════════════════════════
//  API Route: /api/cars — Serve all car data
// ═══════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getAllCars } from "@/lib/cars";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const brand = searchParams.get("brand");
  const type = searchParams.get("type");

  let cars = getAllCars();

  if (slug) {
    const car = cars.find((c) => c.slug === slug);
    return NextResponse.json(car || { error: "Not found" }, { status: car ? 200 : 404 });
  }

  if (brand) {
    cars = cars.filter((c) => c.brand.toLowerCase() === brand.toLowerCase());
  }

  if (type) {
    cars = cars.filter((c) => c.car_type.toLowerCase() === type.toLowerCase());
  }

  return NextResponse.json({
    cars,
    total: cars.length,
    brands: [...new Set(cars.map((c) => c.brand))].sort(),
    types: [...new Set(cars.map((c) => c.car_type))].sort(),
  });
}
