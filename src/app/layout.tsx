// ═══════════════════════════════════════════════
//  Root Layout — HTML + Fonts + Metadata only
//  NextIntlClientProvider is in [locale]/layout.tsx
//  so messages update on client-side locale switch
// ═══════════════════════════════════════════════

import type { Metadata } from "next";
import { Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";

const arabicFont = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

const BASE_URL = "https://vipluxurycarrental.com";

export const metadata: Metadata = {
  title: {
    default: "VIP Luxury Car Rental Dubai | Premium Sports & Exotic Cars",
    template: "%s | VIP Luxury Car Rental Dubai",
  },
  description: "Experience Dubai in style with VIP Luxury Car Rental. Choose from our exclusive fleet of 350+ premium sports cars, luxury SUVs, and exotic vehicles.",
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: `${BASE_URL}/`,
    languages: {
      en: `${BASE_URL}/`,
      ar: `${BASE_URL}/ar/`,
      "x-default": `${BASE_URL}/`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_AE",
    siteName: "VIP Luxury Car Rental Dubai",
    title: "VIP Luxury Car Rental Dubai | Premium Sports & Exotic Cars",
    description: "Experience Dubai in style with VIP Luxury Car Rental. Choose from 350+ premium sports cars, luxury SUVs, and exotic vehicles.",
    url: `${BASE_URL}/`,
    images: [{
      url: `${BASE_URL}/opengraph-image`,
      width: 1200,
      height: 630,
      alt: "VIP Luxury Car Rental Dubai - Premium Car Fleet",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIP Luxury Car Rental Dubai | Premium Sports & Exotic Cars",
    description: "Rent luxury, sports, and exotic cars in Dubai. 350+ premium vehicles with free delivery.",
    images: [`${BASE_URL}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
    apple: [{ url: "/favicon.svg", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${arabicFont.variable}`} suppressHydrationWarning>
      <head>
        {/* Preload hero poster image for LCP optimization */}
        <link rel="preload" href="/api/images/2024/04/Urus-Black-With-Green-1.webp" as="image" fetchPriority="high" />

        {/* ── JSON-LD Structured Data ── */}
        {/* WebSite schema — tells Google the official site name */}
        <script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "VIP Luxury Car Rental Dubai",
              url: "https://vipluxurycarrental.com/",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://vipluxurycarrental.com/all-cars/?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* Organization + AutoRental schema — business info for rich results */}
        <script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Organization", "AutoRental"],
              name: "VIP Luxury Car Rental Dubai",
              url: "https://vipluxurycarrental.com/",
              logo: "https://vipluxurycarrental.com/images/vip-logo.png",
              description: "Premium luxury car rental service in Dubai. Rent sports cars, luxury SUVs, and exotic vehicles with free doorstep delivery.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Al Barsha, Near Mall of Emirates",
                addressLocality: "Dubai",
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
              areaServed: "Dubai, UAE",
              openingHours: "Mo-Su 00:00-23:59",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+971501564849",
                contactType: "customer service",
                availableLanguage: ["English", "Arabic"],
              },
              sameAs: ["https://wa.me/971501564849"],
            }),
          }}
        />
      </head>
      <body className="bg-dark text-white antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
