// ═══════════════════════════════════════════════
//  FAQ Page — Server wrapper with metadata
// ═══════════════════════════════════════════════

import type { Metadata } from "next";
import FAQPageClient from "./FAQPageClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr
      ? "الأسئلة الشائعة"
      : "Frequently Asked Questions",
    description: isAr
      ? "اعثر على إجابات للأسئلة الشائعة حول تأجير السيارات الفاخرة في دبي. تعرف على المتطلبات والتأمين والودائع والتوصيل والمزيد."
      : "Find answers to common questions about luxury car rental in Dubai. Learn about requirements, insurance, deposits, delivery, and more.",
    alternates: {
      canonical: `https://vipluxurycarrental.com/${locale === "en" ? "" : "ar/"}faq/`,
      languages: {
        en: "https://vipluxurycarrental.com/faq/",
        ar: "https://vipluxurycarrental.com/ar/faq/",
        "x-default": "https://vipluxurycarrental.com/faq/",
      },
    },
    openGraph: {
      title: isAr ? "الأسئلة الشائعة | VIP Luxury Car Rental Dubai" : "Frequently Asked Questions | VIP Luxury Car Rental Dubai",
      description: isAr
        ? "اعثر على إجابات للأسئلة الشائعة حول تأجير السيارات الفاخرة في دبي."
        : "Find answers to common questions about luxury car rental in Dubai.",
      siteName: "VIP Luxury Car Rental Dubai",
      locale: isAr ? "ar_AE" : "en_US",
      type: "website",
    },
  };
}

export default function FAQPage() {
  return <FAQPageClient />;
}
