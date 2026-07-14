// ═══════════════════════════════════════════════
//  All Cars Page — Server wrapper with metadata
// ═══════════════════════════════════════════════

import type { Metadata } from "next";
import AllCarsPageClient from "./AllCarsPageClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr
      ? "جميع السيارات الفاخرة للإيجار في دبي"
      : "All Luxury Cars for Rent in Dubai",
    description: isAr
      ? "تصفح أكثر من 350 سيارة فاخرة ورياضية وغريبة للإيجار في دبي. تصفية حسب العلامة التجارية أو النوع أو الميزانية. توصيل مجاني في جميع أنحاء الإمارات. احجز سيارة أحلامك اليوم!"
      : "Browse 350+ luxury, sports, and exotic cars for rent in Dubai. Filter by brand, type, or budget. Free delivery across the UAE. Book your dream car today!",
    alternates: {
      canonical: `https://vipluxurycarrental.com/${locale === "en" ? "" : "ar/"}all-cars/`,
      languages: {
        en: "https://vipluxurycarrental.com/all-cars/",
        ar: "https://vipluxurycarrental.com/ar/all-cars/",
        "x-default": "https://vipluxurycarrental.com/all-cars/",
      },
    },
    openGraph: {
      title: isAr ? "جميع السيارات الفاخرة للإيجار في دبي" : "All Luxury Cars for Rent in Dubai",
      description: isAr
        ? "تصفح أكثر من 350 سيارة فاخرة ورياضية وغريبة للإيجار في دبي."
        : "Browse 350+ luxury, sports, and exotic cars for rent in Dubai.",
      url: `https://vipluxurycarrental.com/${locale === "en" ? "" : "ar/"}all-cars/`,
      siteName: "VIP Luxury Car Rental Dubai",
      locale: isAr ? "ar_AE" : "en_US",
      type: "website",
    },
  };
}

export default function AllCarsPage() {
  return <AllCarsPageClient />;
}
