// ═══════════════════════════════════════════════
//  Schema Helpers — Dynamic JSON-LD generators
//  For car pages, brand pages, category pages
// ═══════════════════════════════════════════════

const BASE_URL = "https://vipluxurycarrental.com";

/* ─── BreadcrumbList Schema ─── */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  const withSlash = (u: string) => (u.endsWith("/") ? u : `${u}/`);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${withSlash(item.url)}`,
    })),
  };
}

/* ─── Product + Vehicle Schema for Car Pages ─── */
export function carSchema(car: {
  title: string;
  brand: string;
  model?: string;
  slug: string;
  pricing: { per_day: string; per_week?: string; per_month?: string };
  specs?: { model_year?: string; mileage?: string; fuel_type?: string; transmission?: string };
  excerpt?: string;
  images?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["Product", "Vehicle"],
    name: car.title,
    brand: {
      "@type": "Brand",
      name: car.brand,
    },
    model: car.model || car.title,
    description: car.excerpt || `Rent ${car.title} in Dubai. Luxury car rental service.`,
    url: `${BASE_URL}/car/${car.slug}/`,
    image: car.images?.[0] || `${BASE_URL}/og-image.jpg`,
    mpn: car.slug,
    vehicleModelDate: car.specs?.model_year,
    vehicleEngine: car.specs?.fuel_type ? { name: car.specs.fuel_type } : undefined,
    vehicleTransmission: car.specs?.transmission,
    mileageFromOdometer: car.specs?.mileage ? `${car.specs.mileage} km` : undefined,
    offers: {
      "@type": "Offer",
      price: car.pricing.per_day,
      priceCurrency: "AED",
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/car/${car.slug}/`,
    },
  };
}

/* ─── Brand Page Schema ─── */
export function brandSchema(brand: string, carsCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": ["AutoRental", "CollectionPage"],
    name: `Rent ${brand} in Dubai`,
    description: `Browse our fleet of ${brand} cars for rent in Dubai. ${carsCount}+ vehicles available.`,
    url: `${BASE_URL}/rent-${brand.toLowerCase().replace(/\s+/g, "-")}-in-dubai/`,
    brand: {
      "@type": "Brand",
      name: brand,
    },
  };
}

/* ─── Category Page Schema ─── */
export function categorySchema(category: string, carsCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": ["AutoRental", "CollectionPage"],
    name: `${category} Car Rental in Dubai`,
    description: `Rent ${category.toLowerCase()} cars in Dubai. ${carsCount}+ premium vehicles available.`,
    url: `${BASE_URL}/${category.toLowerCase().replace(/\s+/g, "-")}-car-rental-in-dubai/`,
  };
}

/* ─── FAQPage Schema ─── */
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}
