// ═══════════════════════════════════════════════
//  Data Service — Loads real car data from JSON
// ═══════════════════════════════════════════════

import type { CarCardData, CarData } from "@/types/car";
import { getCarImages } from "./images";
import fs from "fs";
import path from "path";

// ─── CONFIG ────────────────────────────────────
// Discount strategy for deal psychology
const DISCOUNT_CONFIG = {
  day: { multiplier: 2.2, label: "55% OFF" },
  week: { multiplier: 2.0, label: "50% OFF" },
  month: { multiplier: 1.8, label: "45% OFF" },
  km_upgrade: 1.2, // 20% more KM than standard
};

// ─── LOAD REAL DATA ────────────────────────────
let cachedCars: CarCardData[] | null = null;

export function getAllCars(): CarCardData[] {
  if (cachedCars) return cachedCars;

  try {
    // Try loading from source JSON in development
    const dataPath = path.join(process.cwd(), "..", "server_data", "structured_data", "all_cars.json");
    
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, "utf-8");
      const cars: CarData[] = JSON.parse(raw);
      cachedCars = cars.map(enhanceCarWithDealPsychology);
      return cachedCars!;
    }
  } catch (err) {
    console.error("Failed to load car data:", err);
  }

  // Fallback: return empty (will be populated from API later)
  return [];
}

export function getCarBySlug(slug: string): CarCardData | undefined {
  return getAllCars().find((c) => c.slug === slug);
}

export function getCarsByBrand(brand: string): CarCardData[] {
  return getAllCars().filter(
    (c) => c.brand.toLowerCase() === brand.toLowerCase()
  );
}

export function getCarsByType(type: string): CarCardData[] {
  return getAllCars().filter(
    (c) => c.car_type.toLowerCase() === type.toLowerCase()
  );
}

export function getAllBrands(): string[] {
  return [...new Set(getAllCars().map((c) => c.brand))].sort();
}

export function getAllTypes(): string[] {
  return [...new Set(getAllCars().map((c) => c.car_type))].sort();
}

// ─── ENHANCE WITH DEAL PSYCHOLOGY ──────────────
function enhanceCarWithDealPsychology(car: CarData): CarCardData {
  const dayPrice = parseInt(car.pricing?.per_day || "0");
  const weekPrice = parseInt(car.pricing?.per_week || "0");
  const monthPrice = parseInt(car.pricing?.per_month || "0");

  // Load real images from the image map
  const carImages = getCarImages(car.id);

  return {
    id: car.id,
    title: car.title,
    slug: car.slug,
    pricing: {
      per_day: car.pricing.per_day,
      per_hour: car.pricing.per_hour || "",
      per_week: car.pricing.per_week,
      per_month: car.pricing.per_month,
      original_per_day: dayPrice ? String(Math.round(dayPrice * DISCOUNT_CONFIG.day.multiplier)) : undefined,
      original_per_week: weekPrice ? String(Math.round(weekPrice * DISCOUNT_CONFIG.week.multiplier)) : undefined,
      original_per_month: monthPrice ? String(Math.round(monthPrice * DISCOUNT_CONFIG.month.multiplier)) : undefined,
      discount_day: DISCOUNT_CONFIG.day.label,
      discount_week: DISCOUNT_CONFIG.week.label,
      discount_month: DISCOUNT_CONFIG.month.label,
    },
    specs: car.specs || {},
    km_limits: {
      per_day: car.km_limits?.per_day || "",
      per_week: car.km_limits?.per_week || "",
      per_month: car.km_limits?.per_month || "",
      extra_km: car.km_limits?.extra_km || "",
      original_per_day: car.km_limits?.per_day ? String(Math.round(parseInt(car.km_limits.per_day) / DISCOUNT_CONFIG.km_upgrade)) : undefined,
      original_per_week: car.km_limits?.per_week ? String(Math.round(parseInt(car.km_limits.per_week) / DISCOUNT_CONFIG.km_upgrade)) : undefined,
      original_per_month: car.km_limits?.per_month ? String(Math.round(parseInt(car.km_limits.per_month) / DISCOUNT_CONFIG.km_upgrade)) : undefined,
    },
    deposit: {
      no_deposit_fee: car.deposit?.no_deposit_fee || "",
      security: car.deposit?.security_deposit || car.deposit?.security || "5000",
    },
    brand: car.brand || "",
    car_type: car.car_type || "",
    categories: car.categories || [],
    images: carImages.gallery,
    thumbnail: carImages.thumbnail || car.images?.[0] || "",
    excerpt: car.excerpt || "",
  };
}
