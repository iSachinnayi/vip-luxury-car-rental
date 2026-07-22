// ═══════════════════════════════════════════════
//  Homepage — Server wrapper with metadata
// ═══════════════════════════════════════════════

import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr
      ? "أفضل السيارات الفاخرة والرياضية"
      : "Premium Sports & Exotic Car Fleet",
    description: isAr
      ? "احجز أفضل السيارات الفاخرة والرياضية في دبي. أسعار تنافسية، توصيل مجاني في جميع أنحاء الإمارات، وفريق دعم على مدار الساعة."
      : "Book the finest luxury, sports, and exotic cars in Dubai. Competitive rates, free delivery across the UAE, and 24/7 support team.",
    alternates: {
      canonical: `https://vipluxurycarrental.com/${locale === "en" ? "" : "ar/"}`,
      languages: {
        en: "https://vipluxurycarrental.com/",
        ar: "https://vipluxurycarrental.com/ar/",
        "x-default": "https://vipluxurycarrental.com/",
      },
    },
    openGraph: {
      title: isAr ? "أفضل السيارات الفاخرة والرياضية" : "Premium Sports & Exotic Car Fleet",
      description: isAr
        ? "احجز أفضل السيارات الفاخرة والرياضية في دبي."
        : "Book the finest luxury, sports, and exotic cars in Dubai.",
      url: `https://vipluxurycarrental.com/${locale === "en" ? "" : "ar/"}`,
      siteName: "VIP Luxury Car Rental Dubai",
      locale: isAr ? "ar_AE" : "en_US",
      type: "website",
    },
  };
}

export default function HomePage() {
  return <HomePageClient />;
}
