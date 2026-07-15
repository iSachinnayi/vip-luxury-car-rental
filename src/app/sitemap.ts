// ═══════════════════════════════════════════════
//  Sitemap — Multi-sitemap with index (like RankMath)
//  Split by content type for clean organization:
//    0.xml → Core pages (home, all-cars, static)
//    1.xml → Car detail pages (109, with images)
//    2.xml → Location pages (emirates + sub-pages)
//    3.xml → Brand landing + category pages
//  Access: /sitemap.xml (index) → /sitemap/0.xml etc.
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

function pageEntry(
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

// ── Sitemap IDs: 0=core, 1=cars, 2=locations, 3=brands+categories ──
export async function generateSitemaps() {
  return [{ id: "0" }, { id: "1" }, { id: "2" }, { id: "3" }];
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const resolvedId = await id;
  const allBrands = getAllBrands();
  const allTypes = getAllTypes().filter(Boolean) as string[];
  const emirates = getEmirateSlugs();

  // ── Sitemap 0: Core Pages ──
  if (resolvedId === "0") {
    return [
      pageEntry("/", 1.0, WEEKLY),
      pageEntry("/all-cars/", 0.9, "daily"),
      pageEntry("/brand/", 0.6, WEEKLY),
      pageEntry("/about/", 0.5, MONTHLY),
      pageEntry("/contact/", 0.5, MONTHLY),
      pageEntry("/faq/", 0.5, MONTHLY),
    ];
  }

  // ── Sitemap 1: Car Detail Pages (with images) ──
  if (resolvedId === "1") {
    const cars = getAllCars();
    return cars
      .filter((c) => c.slug)
      .map((car) => {
        const carImages = getCarImages(car.id);
        const imgUrls: string[] = [];
        if (carImages.thumbnail) imgUrls.push(`${BASE_URL}${carImages.thumbnail}`);
        for (const g of carImages.gallery) {
          const full = `${BASE_URL}${g}`;
          if (g && !imgUrls.includes(full)) imgUrls.push(full);
        }
        return pageEntry(`/car/${car.slug}/`, 0.8, WEEKLY, imgUrls.slice(0, 10));
      });
  }

  // ── Sitemap 2: Location Pages ──
  if (resolvedId === "2") {
    const entries: MetadataRoute.Sitemap = [];

    // Emirate main pages
    for (const emirate of emirates) {
      entries.push(pageEntry(`/location/${emirate}/`, 0.8, WEEKLY));
    }

    // Brand + category sub-pages per emirate
    for (const emirate of emirates) {
      for (const brand of allBrands) {
        const slug = `rent-${brand.toLowerCase().replace(/\s+/g, "-")}`;
        entries.push(pageEntry(`/location/${emirate}/${slug}/`, 0.5, WEEKLY));
      }
      for (const type of allTypes) {
        const slug = `${type.toLowerCase()}-car-rental`;
        entries.push(pageEntry(`/location/${emirate}/${slug}/`, 0.5, WEEKLY));
      }
    }

    return entries;
  }

  // ── Sitemap 3: Brand Landing + Category Pages ──
  if (resolvedId === "3") {
    const entries: MetadataRoute.Sitemap = [];

    for (const brand of allBrands) {
      const slug = BRAND_SLUG_MAP[brand];
      if (slug) entries.push(pageEntry(`/${slug}/`, 0.7, WEEKLY));
    }
    for (const type of allTypes) {
      const slug = TYPE_SLUG_MAP[type];
      if (slug) entries.push(pageEntry(`/${slug}/`, 0.7, WEEKLY));
    }

    return entries;
  }

  return [];
}
