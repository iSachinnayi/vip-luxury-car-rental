// ═══════════════════════════════════════════════
//  SEO Utils — Auto-generate meta from data
//  Layout template adds: " | VIP Luxury Car Rental Dubai"
//  So titles here should NOT repeat the brand suffix
// ═══════════════════════════════════════════════

export function generateCarMeta(car: {
  title: string;
  brand: string;
  car_type: string;
  pricing: { per_day: string };
  excerpt?: string;
}) {
  const title = `Rent ${car.title} in Dubai`;
  const dayPrice = parseInt(car.pricing.per_day || "0").toLocaleString();
  
  // Exactly ~155 chars for Google rich snippets
  const description =
    car.excerpt && car.excerpt.length > 80
      ? car.excerpt.substring(0, 152) + "..."
      : `Rent a ${car.title} in Dubai from AED ${dayPrice}/day. Premium ${car.brand} with free delivery, full insurance, and 24/7 support. Book online today!`;

  return { title, description };
}

export function generateBrandMeta(brand: string) {
  const title = `Rent ${brand} in Dubai`;
  // ~155 chars
  const description = `Rent a ${brand} in Dubai from our premium fleet with free delivery, full insurance, and competitive rates. Choose from the latest models with flexible terms. Book online today!`;

  return { title, description };
}

export function generateCategoryMeta(category: string) {
  const title = `${category} Car Rental in Dubai`;
  // ~155 chars
  const description = `Rent premium ${category.toLowerCase()} cars in Dubai. 350+ vehicles, free delivery, full insurance, and 24/7 support. Competitive daily, weekly, and monthly rates. Book online today!`;

  return { title, description };
}

export function generateEmirateMeta(emirate: { name: string; metaDesc: string }) {
  const title = `Luxury Car Rental in ${emirate.name}`;
  return { title, description: emirate.metaDesc };
}

export function generateEmirateBrandMeta(emirateName: string, brand: string) {
  const title = `Rent ${brand} in ${emirateName}`;
  const description = `Rent a ${brand} in ${emirateName} from our premium fleet with free delivery, full insurance, and competitive rates. Choose from the latest models with flexible terms. Book online today!`;
  return { title, description };
}

export function generateEmirateCategoryMeta(emirateName: string, category: string) {
  const title = `${category} Car Rental in ${emirateName}`;
  const description = `Rent premium ${category.toLowerCase()} cars in ${emirateName}. 350+ vehicles, free delivery, full insurance, and 24/7 support. Competitive daily, weekly, and monthly rates. Book online today!`;
  return { title, description };
}

export function generatePageMeta(
  title: string,
  description?: string
) {
  return {
    title,
    description:
      description ||
      `VIP Luxury Car Rental Dubai - Premium car rental service. Rent luxury, sports, and exotic cars in Dubai with free delivery across the UAE. 350+ vehicles available.`,
  };
}

export function defaultMeta() {
  return {
    title: "VIP Luxury Car Rental Dubai | Premium Car Rental",
    description:
      "Rent luxury, sports, and exotic cars in Dubai. VIP Luxury Car Rental offers 350+ premium vehicles with free doorstep delivery across the UAE. Book your dream car with zero deposit options available.",
  };
}
