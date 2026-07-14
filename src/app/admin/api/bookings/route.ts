// ═══════════════════════════════════════════════
//  GET/PATCH /admin/api/bookings — Manage bookings
// ═══════════════════════════════════════════════

import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/admin/auth";

const BOOKINGS_FILE = path.join(process.cwd(), "data", "bookings", "bookings.json");

async function getBookings(): Promise<any[]> {
  try {
    const raw = await readFile(BOOKINGS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveBookings(bookings: any[]): Promise<void> {
  await mkdir(path.dirname(BOOKINGS_FILE), { recursive: true });
  await writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
}

// GET /admin/api/bookings?status=pending&limit=10
export async function GET(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "100");

    let bookings = await getBookings();

    if (status) {
      bookings = bookings.filter((b) => b.status === status);
    }

    // Sort by newest first
    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      bookings: bookings.slice(0, limit),
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    });
  } catch (err) {
    console.error("Failed to fetch bookings:", err);
    return NextResponse.json({ bookings: [], total: 0 }, { status: 500 });
  }
}

// PATCH /admin/api/bookings — Update booking status
export async function PATCH(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ message: "Booking ID and status are required." }, { status: 400 });
    }

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
    }

    const bookings = await getBookings();
    const index = bookings.findIndex((b) => b.id === id);

    if (index === -1) {
      return NextResponse.json({ message: "Booking not found." }, { status: 404 });
    }

    bookings[index].status = status;
    bookings[index].updatedAt = new Date().toISOString();
    await saveBookings(bookings);

    return NextResponse.json({ success: true, booking: bookings[index] });
  } catch (err) {
    console.error("Failed to update booking:", err);
    return NextResponse.json({ message: "Failed to update booking." }, { status: 500 });
  }
}
