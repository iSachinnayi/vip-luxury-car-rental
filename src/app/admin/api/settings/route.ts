// ═══════════════════════════════════════════════
//  GET/PUT /admin/api/settings — Site settings
// ═══════════════════════════════════════════════

import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/admin/auth";

const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json");

// ─── Whitelist of allowed settings fields ──────
const ALLOWED_TOP_LEVEL = new Set([
  "siteName", "siteEmail", "sitePhone", "whatsappNumber",
  "address", "currency", "taxRate", "depositFee", "bookingPrefix",
]);

const ALLOWED_SOCIAL = new Set(["instagram", "facebook", "twitter", "youtube", "tiktok"]);
const ALLOWED_SEO = new Set(["defaultTitle", "defaultDescription", "googleAnalyticsId", "facebookPixelId"]);

const DEFAULT_SETTINGS = {
  siteName: "VIP Luxury Car Rental Dubai",
  siteEmail: "info@vipluxurycarrental.com",
  sitePhone: "+971-50-123-4567",
  whatsappNumber: "+971501234567",
  address: "Dubai Marina, Dubai, UAE",
  currency: "AED",
  taxRate: 5,
  depositFee: 0,
  bookingPrefix: "VIP",
  social: {
    instagram: "",
    facebook: "",
    twitter: "",
    youtube: "",
    tiktok: "",
  },
  seo: {
    defaultTitle: "VIP Luxury Car Rental Dubai | Premium Sports & Exotic Cars",
    defaultDescription: "Experience Dubai in style with VIP Luxury Car Rental. Choose from our exclusive fleet of 350+ premium sports cars, luxury SUVs, and exotic vehicles.",
    googleAnalyticsId: "",
    facebookPixelId: "",
  },
  updatedAt: new Date().toISOString(),
};

// ─── Sanitize — only allow known fields ─────────
function sanitizeSettings(input: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};

  // Top-level fields
  for (const key of ALLOWED_TOP_LEVEL) {
    if (key in input) clean[key] = input[key];
  }

  // Social sub-object
  if (input.social && typeof input.social === "object" && !Array.isArray(input.social)) {
    const social: Record<string, string> = {};
    for (const key of ALLOWED_SOCIAL) {
      if (key in (input.social as Record<string, unknown>)) {
        social[key] = String((input.social as Record<string, unknown>)[key] ?? "");
      }
    }
    clean.social = social;
  }

  // SEO sub-object
  if (input.seo && typeof input.seo === "object" && !Array.isArray(input.seo)) {
    const seo: Record<string, string> = {};
    for (const key of ALLOWED_SEO) {
      if (key in (input.seo as Record<string, unknown>)) {
        seo[key] = String((input.seo as Record<string, unknown>)[key] ?? "");
      }
    }
    clean.seo = seo;
  }

  return clean;
}

async function getSettings(): Promise<any> {
  try {
    const raw = await readFile(SETTINGS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read settings file:", err);
    return { ...DEFAULT_SETTINGS };
  }
}

async function saveSettings(settings: any): Promise<void> {
  await mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
  await writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error("Failed to load settings:", err);
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function PUT(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const raw = await request.json();
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    const sanitized = sanitizeSettings(raw);
    if (Object.keys(sanitized).length === 0 && !raw.social && !raw.seo) {
      return NextResponse.json({ message: "No valid settings fields provided." }, { status: 400 });
    }

    const current = await getSettings();
    const updated = {
      ...current,
      ...sanitized,
      social: { ...current.social, ...(sanitized.social || {}) },
      seo: { ...current.seo, ...(sanitized.seo || {}) },
      updatedAt: new Date().toISOString(),
    };
    await saveSettings(updated);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    console.error("Failed to save settings:", err);
    return NextResponse.json({ message: "Failed to save settings." }, { status: 500 });
  }
}
