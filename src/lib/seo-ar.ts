// ═══════════════════════════════════════════════
//  SEO Utils (AR) — Arabic Meta Generators
//  Generates Arabic titles & descriptions for AR pages
//  Layout template adds: " | VIP Luxury Car Rental Dubai"
// ═══════════════════════════════════════════════

export function generateCarMetaAr(car: {
  title: string;
  brand: string;
  car_type: string;
  pricing: { per_day: string };
  excerpt?: string;
}) {
  const title = `استئجار ${car.title} في دبي`;
  const dayPrice = parseInt(car.pricing.per_day || "0").toLocaleString("ar-AE");

  const description =
    car.excerpt && car.excerpt.length > 60
      ? `استأجر ${car.title} في دبي. ${car.excerpt.substring(0, 140)}`
      : `استأجر ${car.title} في دبي من AED ${dayPrice}/يوم. سيارة ${car.brand} فاخرة مع توصيل مجاني وتأمين شامل ودعم على مدار الساعة. احجز أونلاين اليوم!`;

  return { title, description };
}

export function generateBrandMetaAr(brand: string) {
  const title = `استئجار ${brand} في دبي`;
  const description = `استأجر سيارة ${brand} في دبي من أسطولنا المتميز مع توصيل مجاني وتأمين شامل وأسعار تنافسية. اختر من أحدث الموديلات بشروط مرنة. احجز أونلاين اليوم!`;

  return { title, description };
}

export function generateCategoryMetaAr(category: string) {
  const categoryMap: Record<string, string> = {
    Sports: "رياضية",
    Luxury: "فاخرة",
    SUV: "دفع رباعي",
  };
  const catAr = categoryMap[category] || category;

  const title = `استئجار سيارات ${catAr} في دبي`;
  const description = `استأجر سيارات ${catAr} في دبي. أكثر من 350 مركبة، توصيل مجاني، تأمين شامل، ودعم على مدار الساعة. أسعار تنافسية يومية وأسبوعية وشهرية. احجز أونلاين اليوم!`;

  return { title, description };
}

export function generateEmirateMetaAr(emirate: { name: string; metaDescAr?: string }) {
  const title = `تأجير سيارات فاخرة في ${emirate.name}`;
  return {
    title,
    description: emirate.metaDescAr || `استأجر سيارة فاخرة في ${emirate.name} من أسطولنا المتميز. توصيل مجاني، تأمين شامل، وأسعار تنافسية. احجز أونلاين اليوم!`,
  };
}

export function generateEmirateBrandMetaAr(emirateName: string, brand: string) {
  const title = `استئجار ${brand} في ${emirateName}`;
  const description = `استأجر سيارة ${brand} في ${emirateName} من أسطولنا المتميز مع توصيل مجاني وتأمين شامل وأسعار تنافسية. اختر من أحدث الموديلات بشروط مرنة. احجز أونلاين اليوم!`;

  return { title, description };
}

export function generateEmirateCategoryMetaAr(emirateName: string, category: string) {
  const categoryMap: Record<string, string> = {
    Sports: "رياضية",
    Luxury: "فاخرة",
    SUV: "دفع رباعي",
  };
  const catAr = categoryMap[category] || category;

  const title = `تأجير سيارات ${catAr} في ${emirateName}`;
  const description = `استأجر سيارات ${catAr} في ${emirateName}. أكثر من 350 مركبة، توصيل مجاني، تأمين شامل، ودعم على مدار الساعة. أسعار تنافسية. احجز أونلاين اليوم!`;

  return { title, description };
}

export function generatePageMetaAr(
  title: string,
  description?: string
) {
  return {
    title,
    description:
      description ||
      `VIP Luxury Car Rental Dubai - خدمة تأجير سيارات فاخرة في دبي. استأجر سيارات رياضية وفاخرة ودفع رباعي مع توصيل مجاني في جميع أنحاء الإمارات. أكثر من 350 مركبة متاحة.`,
  };
}

export function defaultMetaAr() {
  return {
    title: "VIP Luxury Car Rental Dubai | تأجير سيارات فاخرة في دبي",
    description:
      "استأجر سيارات فاخرة ورياضية في دبي. VIP Luxury Car Rental يقدم أكثر من 350 مركبة متميزة مع توصيل مجاني إلى أي مكان في الإمارات. احجز سيارة أحلامك بدون دفعة تأمين.",
  };
}
