// ═══════════════════════════════════════════════
//  Admin Car Data Service — Read/Write/Override
//  Overrides store in data/cars/overrides.json
//  Never modifies original source data
// ═══════════════════════════════════════════════

import { readFile, writeFile, mkdir } from "fs/promises";
import fs from "fs";
import path from "path";

const SOURCE_PATH = path.join(process.cwd(), "..", "server_data", "structured_data", "all_cars.json");
const OVERRIDES_PATH = path.join(process.cwd(), "data", "cars", "overrides.json");
const IMAGE_MAP_PATH = path.join(process.cwd(), "..", "server_data", "structured_data", "car_image_map.json");

// ─── Types ─────────────────────────────────────

export interface AdminCarData {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  description_short: string;
  description_full: string;
  pricing: {
    per_day: string;
    per_hour: string;
    per_week: string;
    per_month: string;
  };
  specs: {
    model_year: string;
    engine?: string;
    horsepower?: string;
    top_speed?: string;
    acceleration?: string;
    fuel_type?: string;
    transmission?: string;
    seating?: string;
    doors?: string;
  };
  km_limits: {
    per_day: string;
    per_week: string;
    per_month: string;
    extra_km: string;
  };
  deposit: {
    no_deposit_fee: string;
    security: string;
    security_deposit?: string;
  };
  brand: string;
  car_type: string;
  categories: { id: string; name: string; slug: string; taxonomy: string; count: string }[];
  seo?: {
    title: string;
    description: string;
    focus_keyword: string;
  };
  images: string[];
  thumbnail: string;
  old_url: string;
  created_date?: string;
}

// ─── Load raw source data ──────────────────────

function loadRawCars(): AdminCarData[] {
  try {
    if (fs.existsSync(SOURCE_PATH)) {
      return JSON.parse(fs.readFileSync(SOURCE_PATH, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to load source cars:", err);
  }
  return [];
}

// ─── Load overrides ────────────────────────────

export async function getCarOverrides(): Promise<Map<number, Partial<AdminCarData>>> {
  try {
    const raw = await readFile(OVERRIDES_PATH, "utf-8");
    const arr: any[] = JSON.parse(raw);
    const map = new Map<number, Partial<AdminCarData>>();
    for (const item of arr) {
      if (item.id) map.set(item.id, item);
    }
    return map;
  } catch {
    return new Map();
  }
}

// ─── Save overrides ────────────────────────────

export async function saveCarOverrides(overrides: Map<number, Partial<AdminCarData>>): Promise<void> {
  const dir = path.dirname(OVERRIDES_PATH);
  await mkdir(dir, { recursive: true });
  const arr = Array.from(overrides.values());
  await writeFile(OVERRIDES_PATH, JSON.stringify(arr, null, 2), "utf-8");
}

// ─── Get single car (merged with override) ─────

export async function getCarBySlugAdmin(slug: string): Promise<AdminCarData | null> {
  const cars = loadRawCars();
  const car = cars.find((c) => c.slug === slug);
  if (!car) return null;

  const overrides = await getCarOverrides();
  const override = overrides.get(car.id);
  if (!override) return car;

  return deepMerge(car, override);
}

// ─── Get all cars (merged with overrides) ──────

export async function getAllCarsAdmin(): Promise<AdminCarData[]> {
  const cars = loadRawCars();
  const overrides = await getCarOverrides();

  return cars.map((car) => {
    const override = overrides.get(car.id);
    if (!override) return car;
    return deepMerge(car, override);
  });
}

// ─── Update a car ──────────────────────────────

export async function updateCar(slug: string, updates: Partial<AdminCarData>): Promise<AdminCarData | null> {
  const cars = loadRawCars();
  const car = cars.find((c) => c.slug === slug);
  if (!car) return null;

  const overrides = await getCarOverrides();
  const existing = overrides.get(car.id) || {};
  
  // Only store fields that actually changed from source
  const changed: Record<string, any> = { id: car.id };
  for (const [key, value] of Object.entries(updates)) {
    if (key === "id") continue;
    if (JSON.stringify(value) !== JSON.stringify((car as any)[key])) {
      (changed as any)[key] = value;
    }
  }

  overrides.set(car.id, { ...existing, ...updates, id: car.id } as Partial<AdminCarData>);
  await saveCarOverrides(overrides);
  return getCarBySlugAdmin(slug);
}

// ─── Create a new car ──────────────────────────

export async function createCar(data: AdminCarData): Promise<AdminCarData> {
  const cars = loadRawCars();
  const maxId = cars.reduce((max, c) => Math.max(max, c.id), 0);
  const newId = maxId + 1;

  const newCar: AdminCarData = {
    ...data,
    id: newId,
    old_url: "",
    created_date: new Date().toISOString(),
  };

  // Save as override
  const overrides = await getCarOverrides();
  overrides.set(newId, newCar);
  await saveCarOverrides(overrides);

  return newCar;
}

// ─── Delete a car ──────────────────────────────

export async function deleteCar(slug: string): Promise<boolean> {
  const cars = loadRawCars();
  const car = cars.find((c) => c.slug === slug);
  if (!car) return false;

  const overrides = await getCarOverrides();
  overrides.delete(car.id);
  await saveCarOverrides(overrides);
  return true;
}

// ─── Get available brands / types ──────────────

export function getBrandsAndTypes(): { brands: string[]; types: string[] } {
  const cars = loadRawCars();
  return {
    brands: [...new Set(cars.map((c) => c.brand))].sort(),
    types: [...new Set(cars.map((c) => c.car_type))].sort(),
  };
}

// ─── Deep merge helper ─────────────────────────

function deepMerge(base: any, override: any): any {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (key === "id") continue;
    if (
      result[key] && typeof result[key] === "object" && !Array.isArray(result[key]) &&
      override[key] && typeof override[key] === "object" && !Array.isArray(override[key])
    ) {
      result[key] = { ...result[key], ...override[key] };
    } else {
      result[key] = override[key];
    }
  }
  return result;
}
