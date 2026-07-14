// ═══════════════════════════════════════════════
//  API Route: /api/contact — Contact Form Handler
//  Stores inquiry + sends WhatsApp notification
// ═══════════════════════════════════════════════

import { NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";
import { APP_CONFIG } from "@/lib/config";

const MESSAGES_FILE = path.join(process.cwd(), "data", "messages.json");

interface ContactBody {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface StoredMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export async function POST(request: Request) {
  try {
    const body: ContactBody = await request.json();
    const { name, phone, email, message } = body;

    // ── Validation ──
    if (!name || !phone || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // ── Format WhatsApp message ──
    const whatsappMsg = encodeURIComponent(
      `📩 *New Contact Inquiry*\n\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Email:* ${email}\n` +
      `*Message:* ${message}\n\n` +
      `_From vipluxurycarrental.com_`
    );

    // ── Send WhatsApp notification ──
    const waUrl = `https://wa.me/${APP_CONFIG.WA_PHONE}?text=${whatsappMsg}`;

    // ── Store inquiry for admin panel ──
    try {
      await mkdir(path.dirname(MESSAGES_FILE), { recursive: true });
      let existing: StoredMessage[] = [];
      try {
        const raw = await readFile(MESSAGES_FILE, "utf-8");
        existing = JSON.parse(raw);
      } catch { /* file doesn't exist yet */ }
      existing.push({
        id: `MSG-${Date.now()}`,
        name,
        email,
        phone,
        message,
        read: false,
        createdAt: new Date().toISOString(),
      });
      await writeFile(MESSAGES_FILE, JSON.stringify(existing, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to save message:", err);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! We will get back to you shortly.",
      whatsappUrl: waUrl,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
