// ═══════════════════════════════════════════════
//  SchemaOrg — Global JSON-LD Structured Data
//  Organization + LocalBusiness + WebSite
//  Injected in main layout — locale-aware
// ═══════════════════════════════════════════════

const BASE_URL = "https://vipluxurycarrental.com";

export default function SchemaOrg({ locale = "en" }: { locale?: string }) {
  const isAr = locale === "ar";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "AutoRental"],
    name: isAr ? "VIP Luxury Car Rental Dubai | تأجير سيارات فاخرة في دبي" : "VIP Luxury Car Rental Dubai",
    url: isAr ? `${BASE_URL}/ar/` : `${BASE_URL}/`,
    logo: `${BASE_URL}/og-image.jpg`,
    image: `${BASE_URL}/og-image.jpg`,
    description: isAr
      ? "خدمة تأجير سيارات فاخرة في دبي. استأجر سيارات رياضية وسيارات دفع رباعي فاخرة ومركبات غريبة مع توصيل مجاني إلى باب منزلك."
      : "Premium luxury car rental service in Dubai. Rent sports cars, luxury SUVs, and exotic vehicles with free doorstep delivery.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Al Barsha, Near Mall of Emirates",
      addressLocality: isAr ? "دبي" : "Dubai",
      addressCountry: "AE",
    },
    telephone: "+971501564849",
    email: "booking@vipluxurycarrental.com",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      ratingCount: "200",
      reviewCount: "200",
    },
    priceRange: "$$$",
    areaServed: isAr ? "دبي، الإمارات العربية المتحدة" : "Dubai, UAE",
    openingHours: "Mo-Su 00:00-23:59",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+971501564849",
      contactType: "customer service",
      availableLanguage: ["English", "Arabic"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    },
    sameAs: [
      `https://wa.me/971501564849`,
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: isAr ? "VIP Luxury Car Rental Dubai | تأجير سيارات فاخرة في دبي" : "VIP Luxury Car Rental Dubai",
    url: isAr ? `${BASE_URL}/ar/` : `${BASE_URL}/`,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/all-cars/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
