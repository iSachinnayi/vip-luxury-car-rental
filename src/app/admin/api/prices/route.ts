// ═══════════════════════════════════════════════
//  API: /admin/api/prices — Bulk price management
//  GET: List all cars with current prices
//  PUT: Update single car prices
//  POST: Bulk update prices (by filter or selection)
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import fs from "fs";
import path from "path";
import { getCarImages } from "@/lib/images";

const SOURCE_PATH = path.join(process.cwd(), "..", "server_data", "structured_data", "all_cars.json");
const OVERRIDES_PATH = path.join(process.cwd(), "data", "cars", "overrides.json");

interface CarPriceData {
  id: number;
  title: string;
  slug: string;
  brand: string;
  car_type: string;
  pricing: {
    per_day: string;
    per_hour: string;
    per_week: string;
    per_month: string;
  };
  km_limits: {
    per_day: string;
    per_week: string;
    per_month: string;
    extra_km_charge: string;
  };
  deposit: {
    no_deposit_fee: string;
    security_deposit: string;
  };
  specs: {
    model_year: string;
    engine?: string;
    transmission?: string;
  };
  thumbnail: string;
}

// ─── GET: List all cars with prices ──────────────

export async function GET() {
  try {
    const raw = JSON.parse(fs.readFileSync(SOURCE_PATH, "utf-8"));
    const cars: CarPriceData[] = raw.map((c: any) => {
      const carImages = getCarImages(c.id);
      return {
        id: c.id,
        title: c.title,
        slug: c.slug,
        brand: c.brand || "",
        car_type: c.car_type || "",
        pricing: {
          per_day: c.pricing?.per_day || "0",
          per_hour: c.pricing?.per_hour || "0",
          per_week: c.pricing?.per_week || "0",
          per_month: c.pricing?.per_month || "0",
        },
        km_limits: {
          per_day: c.km_limits?.per_day || "0",
          per_week: c.km_limits?.per_week || "0",
          per_month: c.km_limits?.per_month || "0",
          extra_km_charge: c.km_limits?.extra_km_charge || "0",
        },
        deposit: {
          no_deposit_fee: c.deposit?.no_deposit_fee || "",
          security_deposit: c.deposit?.security_deposit || "",
        },
        specs: {
          model_year: c.specs?.model_year || "",
          engine: c.specs?.engine || "",
          transmission: c.specs?.transmission || "",
        },
        thumbnail: carImages.thumbnail || "",
      };
    });

    // Apply overrides
    try {
      if (fs.existsSync(OVERRIDES_PATH)) {
        const overrides: any[] = JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf-8"));
        const overrideMap = new Map<number, any>(overrides.map((o: any) => [o.id, o]));
        cars.forEach((car) => {
          const ov = overrideMap.get(car.id);
          if (ov?.pricing) Object.assign(car.pricing, ov.pricing);
          if (ov?.km_limits) Object.assign(car.km_limits, ov.km_limits);
          if (ov?.deposit) Object.assign(car.deposit, ov.deposit);
        });
      }
    } catch {}

    return NextResponse.json({ cars });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load cars" }, { status: 500 });
  }
}

// ─── PUT: Update single car prices ───────────────

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { carId, pricing, km_limits, deposit } = body;
    if (!carId) {
      return NextResponse.json({ error: "carId required" }, { status: 400 });
    }

    let overrides: any[] = [];
    if (fs.existsSync(OVERRIDES_PATH)) {
      overrides = JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf-8"));
    }

    const existing = overrides.findIndex((o) => o.id === carId);
    const override: any = { id: carId };

    // Only include provided sections
    const sourceRaw = JSON.parse(fs.readFileSync(SOURCE_PATH, "utf-8"));
    const source = sourceRaw.find((c: any) => c.id === carId);
    const existingOv = existing >= 0 ? overrides[existing] : {};

    override.pricing = { ...(source?.pricing || {}), ...(existingOv?.pricing || {}), ...(pricing || {}) };
    override.km_limits = { ...(source?.km_limits || {}), ...(existingOv?.km_limits || {}), ...(km_limits || {}) };
    override.deposit = { ...(source?.deposit || {}), ...(existingOv?.deposit || {}), ...(deposit || {}) };

    if (existing >= 0) {
      overrides[existing] = { ...overrides[existing], ...override };
    } else {
      overrides.push(override);
    }

    const dir = path.dirname(OVERRIDES_PATH);
    await mkdir(dir, { recursive: true });
    await writeFile(OVERRIDES_PATH, JSON.stringify(overrides, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ─── POST: Bulk update prices ────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { carIds, operation, value, section, field } = body;

    if (!carIds || !operation || value === undefined || !section) {
      return NextResponse.json({ error: "carIds, operation, value, and section required" }, { status: 400 });
    }

    const raw = JSON.parse(fs.readFileSync(SOURCE_PATH, "utf-8"));
    const sourceMap = new Map<number, any>(raw.map((c: any) => [c.id, c]));
    let overrides: any[] = [];
    if (fs.existsSync(OVERRIDES_PATH)) {
      overrides = JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf-8"));
    }
    const overrideMap = new Map<number, any>(overrides.map((o: any) => [o.id, o]));

    // Define which fields belong to each section
    const SECTION_FIELDS: Record<string, string[]> = {
      pricing: ["per_hour", "per_day", "per_week", "per_month"],
      km_limits: ["per_day", "per_week", "per_month", "extra_km_charge"],
      deposit: ["no_deposit_fee", "security_deposit"],
    };

    const fields = field ? [field] : (SECTION_FIELDS[section] || []);

    for (const id of carIds) {
      const source = sourceMap.get(id);
      if (!source) continue;

      let override: any = overrideMap.get(id) || { id };
      if (!override.pricing) override.pricing = { ...source.pricing };
      if (!override.km_limits) override.km_limits = { ...source.km_limits };
      if (!override.deposit) override.deposit = { ...source.deposit };

      const targetSection = override[section];
      const sourceSection = source[section] || {};

      for (const f of fields) {
        const currentVal = parseFloat(targetSection?.[f] ?? sourceSection[f] ?? "0") || 0;
        let newVal = currentVal;
        switch (operation) {
          case "set": newVal = value; break;
          case "add": newVal = currentVal + value; break;
          case "subtract": newVal = Math.max(0, currentVal - value); break;
          case "percent_add": newVal = currentVal + (currentVal * value) / 100; break;
          case "percent_subtract": newVal = currentVal - (currentVal * value) / 100; break;
        }
        if (!override[section]) override[section] = {};
        override[section][f] = String(Math.round(newVal));
      }
      overrideMap.set(id, override);
    }

    const dir = path.dirname(OVERRIDES_PATH);
    await mkdir(dir, { recursive: true });
    await writeFile(OVERRIDES_PATH, JSON.stringify(Array.from(overrideMap.values()), null, 2));

    return NextResponse.json({ success: true, updatedCount: carIds.length });
  } catch (err) {
    return NextResponse.json({ error: "Bulk update failed" }, { status: 500 });
  }
}
