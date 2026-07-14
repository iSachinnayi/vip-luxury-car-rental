// ═══════════════════════════════════════════════
//  GET/POST /admin/api/cars — Cars CRUD for admin
//  Images resolved via getCarImages() like frontend
// ═══════════════════════════════════════════════

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import {
  getAllCarsAdmin,
  createCar,
  getBrandsAndTypes,
} from "@/lib/admin/carData";
import { getCarImages } from "@/lib/images";
import type { AdminCarData } from "@/lib/admin/carData";

// GET /admin/api/cars — List all cars with resolved images
export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const cars = await getAllCarsAdmin();
    const { brands, types } = getBrandsAndTypes();

    return NextResponse.json({
      cars: cars.map((c) => {
        const resolved = getCarImages(c.id);
        return {
          id: c.id,
          title: c.title,
          slug: c.slug,
          brand: c.brand,
          car_type: c.car_type,
          pricing: c.pricing,
          thumbnail: resolved.thumbnail || c.images?.[0] || "",
          images: resolved.gallery.length > 0 ? resolved.gallery : (c.images || []),
        };
      }),
      brands,
      types,
      total: cars.length,
    });
  } catch (err) {
    console.error("Failed to fetch cars for admin:", err);
    return NextResponse.json({ cars: [], brands: [], types: [], total: 0 }, { status: 500 });
  }
}

// POST /admin/api/cars — Create new car
export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body || !body.title) {
      return NextResponse.json({ message: "Car title is required." }, { status: 400 });
    }

    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newCar: AdminCarData = {
      id: 0, // will be assigned by createCar
      title: body.title,
      slug,
      excerpt: body.excerpt || "",
      description_short: body.description_short || "",
      description_full: body.description_full || "",
      pricing: {
        per_day: body.pricing?.per_day || "0",
        per_hour: body.pricing?.per_hour || "0",
        per_week: body.pricing?.per_week || "0",
        per_month: body.pricing?.per_month || "0",
      },
      specs: {
        model_year: body.specs?.model_year || "",
      },
      km_limits: {
        per_day: body.km_limits?.per_day || "0",
        per_week: body.km_limits?.per_week || "0",
        per_month: body.km_limits?.per_month || "0",
        extra_km: body.km_limits?.extra_km || "0",
      },
      deposit: {
        no_deposit_fee: body.deposit?.no_deposit_fee || "",
        security: body.deposit?.security || "",
      },
      brand: body.brand || "Unknown",
      car_type: body.car_type || "Luxury",
      categories: body.categories || [],
      images: body.images || [],
      thumbnail: body.thumbnail || "",
      old_url: "",
    };

    const created = await createCar(newCar);
    return NextResponse.json({ success: true, car: created }, { status: 201 });
  } catch (err) {
    console.error("Failed to create car:", err);
    return NextResponse.json({ message: "Failed to create car." }, { status: 500 });
  }
}
