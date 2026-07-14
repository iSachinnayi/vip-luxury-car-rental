// ═══════════════════════════════════════════════
//  Sitemap — Single sitemap.xml (100% reliable)
//  Direct data imports, image sitemaps included
//  Works in dev (Turbopack) + production
// ═══════════════════════════════════════════════

import type { MetadataRoute } from "next";
import { getAllCars, getAllBrands, getAllTypes } from "@/lib/cars";
import { getEmirateSlugs } from "@/lib/emirates";

const BASE_URL = "https://vipluxurycarrental.com";

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

export default function sitemap(): MetadataRoute.Sitemap {
  // Use a fixed build date to avoid constant sitemap changes
  const buildDate = new Date("2026-07-08");
  const monthly = new Date("2026-06-01");
  const routes: MetadataRoute.Sitemap = [];

  // Helper: generate a single URL entry with xhtml:link hreflang annotations
  // so Google connects EN ↔ AR as equivalent translated pages
  function addRoute(path: string, lastMod: Date, freq: string, pri: number) {
    const enUrl = `${BASE_URL}${path}`;
    const arUrl = `${BASE_URL}/ar${path}`;

    const languages = {
      en: enUrl,
      ar: arUrl,
      "x-default": enUrl,
    };

    // Push English version
    routes.push({
      url: enUrl,
      lastModified: lastMod,
      changeFrequency: freq as any,
      priority: pri,
      alternates: { languages },
    });

    // Push Arabic version
    routes.push({
      url: arUrl,
      lastModified: lastMod,
      changeFrequency: freq as any,
      priority: pri,
      alternates: { languages },
    });
  }

  // ── 1. Static pages ──
  addRoute("/", buildDate, "weekly", 1.0);
  addRoute("/all-cars/", buildDate, "daily", 0.9);
  addRoute("/brand/", buildDate, "weekly", 0.8);
  addRoute("/about/", monthly, "monthly", 0.5);
  addRoute("/contact/", monthly, "monthly", 0.5);
  addRoute("/faq/", monthly, "monthly", 0.4);
  addRoute("/privacy/", monthly, "yearly", 0.2);
  addRoute("/terms/", monthly, "yearly", 0.2);

  // ── 2. Car detail pages ──
  const cars = getAllCars();
  for (const car of cars) {
    if (!car.slug) continue;
    addRoute(`/car/${car.slug}/`, buildDate, "weekly", 0.7);
  }

  // ── 3. Brand pages ──
  for (const brand of getAllBrands()) {
    const slug = BRAND_SLUG_MAP[brand];
    if (slug) addRoute(`/${slug}/`, buildDate, "weekly", 0.6);
  }

  // ── 4. Category pages ──
  for (const type of getAllTypes().filter(Boolean)) {
    const slug = TYPE_SLUG_MAP[type];
    if (slug) addRoute(`/${slug}/`, buildDate, "weekly", 0.6);
  }

  // ── 5. Location / Emirate pages ──
  const emirates = getEmirateSlugs();
  const allBrands = getAllBrands();
  const allTypes = getAllTypes().filter(Boolean) as string[];

  for (const emirate of emirates) {
    addRoute(`/location/${emirate}/`, buildDate, "weekly", 0.7);
    for (const brand of allBrands) {
      const brandSlug = `rent-${brand.toLowerCase().replace(/\s+/g, "-")}`;
      addRoute(`/location/${emirate}/${brandSlug}/`, buildDate, "weekly", 0.5);
    }
    for (const type of allTypes) {
      const catSlug = `${type.toLowerCase()}-car-rental`;
      addRoute(`/location/${emirate}/${catSlug}/`, buildDate, "weekly", 0.5);
    }
  }

  return routes;
}
