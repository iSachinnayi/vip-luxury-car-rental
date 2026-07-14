// ═══════════════════════════════════════════════
//  GET/PUT/DELETE /admin/api/cars/[slug]
//  Single car CRUD — images resolved from map
// ═══════════════════════════════════════════════

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getCarBySlugAdmin, updateCar, deleteCar } from "@/lib/admin/carData";
import { getCarImages } from "@/lib/images";

// GET /admin/api/cars/[slug] — Get single car with resolved images
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { slug } = await params;
    const car = await getCarBySlugAdmin(slug);
    if (!car) {
      return NextResponse.json({ message: "Car not found." }, { status: 404 });
    }

    // Resolve images from the image map (like frontend does)
    const resolved = getCarImages(car.id);
    const enrichedCar = {
      ...car,
      images: resolved.gallery.length > 0 ? resolved.gallery : (car.images || []),
      thumbnail: resolved.thumbnail || car.images?.[0] || "",
    };

    return NextResponse.json(enrichedCar);
  } catch (err) {
    console.error("Failed to fetch car:", err);
    return NextResponse.json({ message: "Failed to fetch car." }, { status: 500 });
  }
}

// PUT /admin/api/cars/[slug] — Update a car
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { slug } = await params;
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    const updated = await updateCar(slug, body);
    if (!updated) {
      return NextResponse.json({ message: "Car not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, car: updated });
  } catch (err) {
    console.error("Failed to update car:", err);
    return NextResponse.json({ message: "Failed to update car." }, { status: 500 });
  }
}

// DELETE /admin/api/cars/[slug] — Delete a car
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { slug } = await params;
    const deleted = await deleteCar(slug);
    if (!deleted) {
      return NextResponse.json({ message: "Car not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Car deleted." });
  } catch (err) {
    console.error("Failed to delete car:", err);
    return NextResponse.json({ message: "Failed to delete car." }, { status: 500 });
  }
}
