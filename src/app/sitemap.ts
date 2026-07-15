// ═══════════════════════════════════════════════
//  Sitemap — Single clean sitemap.xml
//  Organized by content type with clear structure
//  Car pages include image tags for Google Images
// ═══════════════════════════════════════════════

import type { MetadataRoute } from "next";
import { getAllCars, getAllBrands, getAllTypes } from "@/lib/cars";
import { getEmirateSlugs } from "@/lib/emirates";
import { getCarImages } from "@/lib/images";

const BASE_URL = "https://vipluxurycarrental.com";
const BUILD_DATE = new Date("2026-07-08");
const WEEKLY = "weekly" as const;
const MONTHLY = "monthly" as const;

const BRAND_SLUG_MAP: Record<string, string> = {
  Lamborghini: "rent-lamborghini-in-dubai",
  Ferrari: "rent-ferrari-in-dubai",
  "Rolls Royce": "rent-rolls-royce-in-dubai",
  Bentley: "rent-bentley-in-dubai",
  Porsche: "rent-porsche-in-dubai",
  Mercedes: "rent-mercedes-in-dubai",
  BMW: "rent-bmw-in-dubai",
  Audi: "rent-audi-in-dubai",
  "Range Rover": "rent-range-rover-in-dubai",
  Nissan: "rent-nissan-in-dubai",
  Chevrolet: "rent-chevrolet-in-dubai",
  McLaren: "rent-mclaren-in-dubai",
  Cadillac: "rent-cadillac-in-dubai",
  GMC: "rent-gmc-in-dubai",
  Toyota: "rent-toyota-in-dubai",
  Volkswagen: "rent-volkswagen-in-dubai",
  "Mini Cooper": "rent-mini-cooper-in-dubai",
};

const TYPE_SLUG_MAP: Record<string, string> = {
  Sports: "sports-car-rental-in-dubai",
  Luxury: "luxury-car-rental-in-dubai",
  SUV: "suv-car-rental-in-dubai",
};

function languages(path: string) {
  const en = `${BASE_URL}${path}`;
  const ar = `${BASE_URL}/ar${path}`;
  return { en, ar, "x-default": en };
}

function entry(
  path: string,
  priority: number,
  freq: string,
  images?: string[]
) {
  return {
    url: `${BASE_URL}${path}`,
    lastModified: BUILD_DATE,
    changeFrequency: freq as any,
    priority,
    alternates: { languages: languages(path) },
    images: images && images.length > 0 ? images : undefined,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const cars = getAllCars();
  const allBrands = getAllBrands();
  const allTypes = getAllTypes().filter(Boolean) as string[];
  const emirates = getEmirateSlugs();

  return [
    // ═══ CORE PAGES ═══ (priority 1.0 - 0.9)
    entry("/", 1.0, WEEKLY),
    entry("/all-cars/", 0.9, "daily"),

    // ═══ CAR PAGES ═══ (priority 0.8, with images)
    ...cars.filter((c) => c.slug).map((car) => {
      const ci = getCarImages(car.id);
      const urls: string[] = [];
      if (ci.thumbnail) urls.push(`${BASE_URL}${ci.thumbnail}`);
      for (const g of ci.gallery) {
        const f = `${BASE_URL}${g}`;
        if (g && !urls.includes(f)) urls.push(f);
      }
      return entry(`/car/${car.slug}/`, 0.8, WEEKLY, urls.slice(0, 10));
    }),

    // ═══ EMIRATES ═══ (priority 0.8)
    ...emirates.map((e) => entry(`/location/${e}/`, 0.8, WEEKLY)),

    // ═══ BRAND LANDING PAGES ═══ (priority 0.7)
    ...allBrands
      .map((b) => BRAND_SLUG_MAP[b])
      .filter(Boolean)
      .map((slug) => entry(`/${slug}/`, 0.7, WEEKLY)),

    // ═══ CATEGORY PAGES ═══ (priority 0.7)
    ...allTypes
      .map((t) => TYPE_SLUG_MAP[t])
      .filter(Boolean)
      .map((slug) => entry(`/${slug}/`, 0.7, WEEKLY)),

    // ═══ BRAND PAGE + STATIC ═══ (priority 0.6 - 0.5)
    entry("/brand/", 0.6, WEEKLY),
    ...["about", "contact", "faq"].map((p) => entry(`/${p}/`, 0.5, MONTHLY)),

    // ═══ LOCATION SUB-PAGES ═══ (priority 0.5)
    ...emirates.flatMap((emirate) => [
      ...allBrands.map((brand) =>
        entry(
          `/location/${emirate}/rent-${brand.toLowerCase().replace(/\s+/g, "-")}/`,
          0.5, WEEKLY
        )
      ),
      ...allTypes.map((type) =>
        entry(`/location/${emirate}/${type.toLowerCase()}-car-rental/`, 0.5, WEEKLY)
      ),
    ]),
  ];
}
