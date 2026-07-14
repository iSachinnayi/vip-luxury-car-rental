// ═══════════════════════════════════════════════
//  Contact Page — Server wrapper with metadata
// ═══════════════════════════════════════════════

import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr
      ? "اتصل بنا"
      : "Contact Us",
    description: isAr
      ? "تواصل مع VIP Luxury Car Rental Dubai عبر واتساب أو الهاتف أو البريد الإلكتروني. فريقنا متاح على مدار الساعة لمساعدتك في حجز سيارة أحلامك."
      : "Get in touch with VIP Luxury Car Rental Dubai via WhatsApp, phone, or email. Our team is available 24/7 to help you book your dream luxury car.",
    alternates: {
      canonical: `https://vipluxurycarrental.com/${locale === "en" ? "" : "ar/"}contact/`,
      languages: {
        en: "https://vipluxurycarrental.com/contact/",
        ar: "https://vipluxurycarrental.com/ar/contact/",
        "x-default": "https://vipluxurycarrental.com/contact/",
      },
    },
    openGraph: {
      title: isAr ? "اتصل بنا | VIP Luxury Car Rental Dubai" : "Contact Us | VIP Luxury Car Rental Dubai",
      description: isAr
        ? "تواصل مع VIP Luxury Car Rental Dubai عبر واتساب أو الهاتف أو البريد الإلكتروني."
        : "Get in touch with VIP Luxury Car Rental Dubai via WhatsApp, phone, or email.",
      url: `https://vipluxurycarrental.com/${locale === "en" ? "" : "ar/"}contact/`,
      siteName: "VIP Luxury Car Rental Dubai",
      locale: isAr ? "ar_AE" : "en_US",
      type: "website",
    },
  };
}

export default function ContactPage() {
  return <ContactPageClient />;
}
