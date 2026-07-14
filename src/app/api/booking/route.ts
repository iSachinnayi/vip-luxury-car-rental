// ═══════════════════════════════════════════════
//  POST /api/booking — Save booking + email alert
// ═══════════════════════════════════════════════

import { NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";

const BOOKINGS_DIR = path.join(process.cwd(), "data", "bookings");
const BOOKINGS_FILE = path.join(BOOKINGS_DIR, "bookings.json");

interface BookingRecord {
  id: string;
  status: string;
  createdAt: string;
  car: { slug: string; title: string };
  customer: { name: string; phone: string; email: string | null; notes: string | null };
  rental: {
    pickup: { location: string; date: string; time: string };
    drop: { location: string; date: string; time: string };
    days: number;
    depositOption: string;
  };
  pricing: {
    currency: string;
    dayPrice: number;
    rentalSubtotal: number;
    taxAmount: number;
    depositFee: number;
    grandTotal: number;
  };
}

// ─── Generate unique booking ID ───
// Format: VIP-DDMM-XXX (e.g., VIP-0607-A3X)
// Includes date for easy reference, random chars for uniqueness
async function generateBookingId(): Promise<string> {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const datePart = dd + mm;

  // Generate 3 random uppercase alphanumeric chars
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I,O,0,1 to avoid confusion
  let random = "";
  for (let i = 0; i < 3; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const id = `VIP-${datePart}-${random}`;

  // Check uniqueness against existing bookings
  try {
    const raw = await readFile(BOOKINGS_FILE, "utf-8").catch(() => "[]");
    const existing: BookingRecord[] = JSON.parse(raw);
    const exists = existing.some((b: BookingRecord) => b.id === id);
    if (exists) {
      // Regenerate with different random
      return generateBookingId();
    }
  } catch {
    // File doesn't exist yet, ID is unique
  }

  return id;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      carSlug, carTitle, fullName, phone, email, notes,
      pickupLocation, dropLocation, pickupDate, pickupTime,
      returnDate, returnTime, depositOption,
      days, dayPrice, rentalSubtotal, taxAmount, depositFee,
      grandTotal, currencyCode,
    } = body;

    // Validate required fields
    if (!fullName?.trim()) {
      return NextResponse.json({ message: "Full name is required" }, { status: 400 });
    }
    if (!phone?.trim()) {
      return NextResponse.json({ message: "Phone number is required" }, { status: 400 });
    }

    // Build booking record with unique ID
    const bookingId = await generateBookingId();
    const booking = {
      id: bookingId,
      status: "pending",
      createdAt: new Date().toISOString(),
      car: { slug: carSlug, title: carTitle },
      customer: { name: fullName, phone, email: email || null, notes: notes || null },
      rental: {
        pickup: { location: pickupLocation, date: pickupDate, time: pickupTime },
        drop: { location: dropLocation, date: returnDate, time: returnTime },
        days,
        depositOption,
      },
      pricing: {
        currency: currencyCode || "AED",
        dayPrice,
        rentalSubtotal,
        taxAmount,
        depositFee,
        grandTotal,
      },
    };

    // Save to JSON file
    try {
      await mkdir(BOOKINGS_DIR, { recursive: true });
      let existing: BookingRecord[] = [];
      try {
        const raw = await readFile(BOOKINGS_FILE, "utf-8").catch(() => "[]");
        existing = JSON.parse(raw);
      } catch {
        existing = [];
      }
      existing.push(booking);
      await writeFile(BOOKINGS_FILE, JSON.stringify(existing, null, 2), "utf-8");
    } catch (fileErr) {
      console.error("Failed to save booking to file:", fileErr);
      // Don't fail the request — booking is still valid
    }

    // Send email notification (if RESEND_API_KEY is configured)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; padding: 32px;">
            <div style="max-width: 600px; margin: 0 auto; background: #111; border-radius: 16px; padding: 32px; border: 1px solid #222;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #C8A951; margin: 0;">🆕 New Booking</h1>
                <p style="color: #666; margin: 4px 0 0;">Booking ID: ${booking.id}</p>
              </div>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding: 8px 0; color: #666;">Car</td><td style="padding: 8px 0; color: #fff; font-weight: bold;">${carTitle}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Customer</td><td style="padding: 8px 0; color: #fff;">${fullName}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0; color: #fff;">${phone}</td></tr>
                ${email ? `<tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0; color: #fff;">${email}</td></tr>` : ""}
                <tr><td style="padding: 8px 0; color: #666;">Pickup</td><td style="padding: 8px 0; color: #fff;">${pickupLocation} — ${pickupDate} at ${pickupTime}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Return</td><td style="padding: 8px 0; color: #fff;">${dropLocation} — ${returnDate} at ${returnTime}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Duration</td><td style="padding: 8px 0; color: #fff;">${days} day(s)</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Deposit</td><td style="padding: 8px 0; color: #fff;">${depositOption === "noDeposit" ? "No Deposit" : "Security Deposit"}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Total</td><td style="padding: 8px 0; color: #C8A951; font-size: 18px; font-weight: bold;">AED ${grandTotal.toLocaleString()}</td></tr>
                ${notes ? `<tr><td style="padding: 8px 0; color: #666;">Notes</td><td style="padding: 8px 0; color: #fff;">${notes}</td></tr>` : ""}
              </table>
              <hr style="border: none; border-top: 1px solid #222; margin: 24px 0;" />
              <p style="color: #666; font-size: 12px; text-align: center;">VIP Luxury Car Rental Dubai — Booking System</p>
            </div>
          </body>
          </html>
        `;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "VIP Bookings <bookings@vipluxurycarrental.com>",
            to: ["hello@tradersguide.online"],
            subject: `🆕 New Booking: ${carTitle} — ${fullName}`,
            html: emailHtml,
          }),
        });
      } catch (emailErr) {
        console.error("Failed to send email notification:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      message: "Booking confirmed! We'll contact you shortly.",
    });
  } catch (err) {
    console.error("Booking API error:", err);
    return NextResponse.json(
      { message: "Internal server error. Please try WhatsApp instead." },
      { status: 500 }
    );
  }
}
