// ═══════════════════════════════════════════════
//  Sitemap — Clean, hierarchical sitemap.xml
//  Single entry per page with hreflang alternates
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

/** Build alternates languages object for hreflang */
function languages(path: string) {
  const en = `${BASE_URL}${path}`;
  const ar = `${BASE_URL}/ar${path}`;
  return { en: en, ar: ar, "x-default": en };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];
  const allBrands = getAllBrands();
  const allTypes = getAllTypes().filter(Boolean) as string[];

  // ═══════════════════════════════════════════
  //  SECTION 1: Core Pages (highest priority)
  // ═══════════════════════════════════════════

  // Homepage — #1 priority
  routes.push({
    url: `${BASE_URL}/`,
    lastModified: BUILD_DATE,
    changeFrequency: WEEKLY,
    priority: 1.0,
    alternates: { languages: languages("/") },
  });

  // All Cars — central hub
  routes.push({
    url: `${BASE_URL}/all-cars/`,
    lastModified: BUILD_DATE,
    changeFrequency: "daily",
    priority: 0.9,
    alternates: { languages: languages("/all-cars/") },
  });

  // ═══════════════════════════════════════════
  //  SECTION 2: Car Detail Pages (109)
  //  With image tags for Google Image Search
  // ═══════════════════════════════════════════

  const cars = getAllCars();
  for (const car of cars) {
    if (!car.slug) continue;

    // Resolve car images for the sitemap
    const carImages = getCarImages(car.id);
    const imgUrls: string[] = [];

    if (carImages.thumbnail) {
      imgUrls.push(`${BASE_URL}${carImages.thumbnail}`);
    }
    for (const g of carImages.gallery) {
      if (g && !imgUrls.includes(`${BASE_URL}${g}`)) {
        imgUrls.push(`${BASE_URL}${g}`);
      }
    }

    // Limit to 10 images per car (Google's limit)
    const sitemapImages = imgUrls.slice(0, 10);

    routes.push({
      url: `${BASE_URL}/car/${car.slug}/`,
      lastModified: BUILD_DATE,
      changeFrequency: WEEKLY,
      priority: 0.8,
      alternates: { languages: languages(`/car/${car.slug}/`) },
      images: sitemapImages.length > 0 ? sitemapImages : undefined,
    });
  }

  // ═══════════════════════════════════════════
  //  SECTION 3: Emirate Main Pages
  // ═══════════════════════════════════════════

  const emirates = getEmirateSlugs();
  for (const emirate of emirates) {
    routes.push({
      url: `${BASE_URL}/location/${emirate}/`,
      lastModified: BUILD_DATE,
      changeFrequency: WEEKLY,
      priority: 0.8,
      alternates: { languages: languages(`/location/${emirate}/`) },
    });
  }

  // ═══════════════════════════════════════════
  //  SECTION 4: Brand Landing Pages
  //  e.g. /rent-bentley-in-dubai/
  // ═══════════════════════════════════════════

  for (const brand of allBrands) {
    const slug = BRAND_SLUG_MAP[brand];
    if (!slug) continue;
    routes.push({
      url: `${BASE_URL}/${slug}/`,
      lastModified: BUILD_DATE,
      changeFrequency: WEEKLY,
      priority: 0.7,
      alternates: { languages: languages(`/${slug}/`) },
    });
  }

  // ═══════════════════════════════════════════
  //  SECTION 5: Category Pages
  //  e.g. /luxury-car-rental-in-dubai/
  // ═══════════════════════════════════════════

  for (const type of allTypes) {
    const slug = TYPE_SLUG_MAP[type];
    if (!slug) continue;
    routes.push({
      url: `${BASE_URL}/${slug}/`,
      lastModified: BUILD_DATE,
      changeFrequency: WEEKLY,
      priority: 0.7,
      alternates: { languages: languages(`/${slug}/`) },
    });
  }

  // ═══════════════════════════════════════════
  //  SECTION 6: Brand Page + Static
  // ═══════════════════════════════════════════

  routes.push({
    url: `${BASE_URL}/brand/`,
    lastModified: BUILD_DATE,
    changeFrequency: WEEKLY,
    priority: 0.6,
    alternates: { languages: languages("/brand/") },
  });

  // About, Contact, FAQ — lower priority
  for (const page of ["about", "contact", "faq"]) {
    routes.push({
      url: `${BASE_URL}/${page}/`,
      lastModified: BUILD_DATE,
      changeFrequency: MONTHLY,
      priority: 0.5,
      alternates: { languages: languages(`/${page}/`) },
    });
  }

  // ═══════════════════════════════════════════
  //  SECTION 7: Location Sub-Pages (lower priority)
  //  Brand + category combos per emirate
  // ═══════════════════════════════════════════

  for (const emirate of emirates) {
    // Brand sub-pages
    for (const brand of allBrands) {
      const brandSlug = `rent-${brand.toLowerCase().replace(/\s+/g, "-")}`;
      routes.push({
        url: `${BASE_URL}/location/${emirate}/${brandSlug}/`,
        lastModified: BUILD_DATE,
        changeFrequency: WEEKLY,
        priority: 0.5,
        alternates: { languages: languages(`/location/${emirate}/${brandSlug}/`) },
      });
    }
    // Category sub-pages
    for (const type of allTypes) {
      const catSlug = `${type.toLowerCase()}-car-rental`;
      routes.push({
        url: `${BASE_URL}/location/${emirate}/${catSlug}/`,
        lastModified: BUILD_DATE,
        changeFrequency: WEEKLY,
        priority: 0.5,
        alternates: { languages: languages(`/location/${emirate}/${catSlug}/`) },
      });
    }
  }

  return routes;
}
