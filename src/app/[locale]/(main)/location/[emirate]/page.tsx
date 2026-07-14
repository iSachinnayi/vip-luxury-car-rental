// ═══════════════════════════════════════════════
//  Location Archive — Emirate Landing Page
//  All cars available for delivery to this emirate
// ═══════════════════════════════════════════════

import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { getAllCars, getAllBrands } from "@/lib/cars";
import { getEmirate, getEmirateSlugs } from "@/lib/emirates";
import { generateEmirateMeta } from "@/lib/seo";
import { generateEmirateMetaAr } from "@/lib/seo-ar";
import { breadcrumbSchema } from "@/lib/schema";
import EmirateContentSection from "@/components/EmirateContentSection";
import EmirateCarGrid from "@/components/EmirateCarGrid";
import CategoryQuickLinks from "@/components/CategoryQuickLinks";
import LocationSwitcher from "@/components/LocationSwitcher";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vipluxurycarrental.com";

export function generateStaticParams() {
  return getEmirateSlugs().map((slug) => ({ emirate: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ emirate: string; locale: string }> }): Promise<Metadata> {
  const { emirate: slug, locale } = await params;
  const emirate = getEmirate(slug);
  if (!emirate) return { title: "VIP Luxury Car Rental Dubai" };

  const isAr = locale === "ar";
  const meta = isAr ? generateEmirateMetaAr(emirate) : generateEmirateMeta(emirate);
  const prefix = isAr ? "/ar" : "";
  const canonical = `${BASE_URL}${prefix}/location/${slug}/`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      images: [{ url: `${BASE_URL}/opengraph-image`, width: 1200, height: 630, alt: `Luxury Car Rental ${emirate.name}` }],
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
  };
}

export default async function EmirateLandingPage({ params }: { params: Promise<{ emirate: string }> }) {
  const { emirate: slug } = await params;
  const t = await getTranslations("location");
  const locale = await getLocale();
  const emirate = getEmirate(slug);
  if (!emirate) return notFound();

  const allCars = getAllCars();
  const allBrands = getAllBrands();
  const emirateName = locale === "ar" ? (emirate.nameAr || emirate.name) : emirate.name;

  // Compute car counts per category for this emirate
  const catCounts = {
    Sports: allCars.filter((c) => c.car_type === "Sports").length,
    Luxury: allCars.filter((c) => c.car_type === "Luxury").length,
    SUV: allCars.filter((c) => c.car_type === "SUV").length,
  };

  // Count cars per brand
  const brandCounts: Record<string, number> = {};
  allCars.forEach((c) => {
    brandCounts[c.brand] = (brandCounts[c.brand] || 0) + 1;
  });

  const jsonLd = breadcrumbSchema([
    { name: t("home"), url: BASE_URL + "/" },
    { name: emirateName, url: `${BASE_URL}/location/${slug}/` },
  ]);

  return (
    <>
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Page Header */}
      <div className="relative pt-28 sm:pt-32 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
            <a href="/" className="hover:text-gold transition-colors">{t("home")}</a>
            <span>/</span>
            <span className="text-gray-400">{emirateName}</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white font-bold">
            {t("luxuryCarRentalIn", { name: emirateName })}
          </h1>
          <p className="text-gray-400 mt-2 sm:mt-3 text-sm sm:text-base max-w-3xl leading-relaxed">
            {locale === "ar" ? emirate.descriptionAr || emirate.description : emirate.description}
          </p>
        </div>
      </div>

      {/* ── Category Quick Links ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <CategoryQuickLinks emirateSlug={slug} />
      </div>

      {/* ── Popular Brands Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-widest mr-1 shrink-0">{t("popularBrands")}</span>
          {allBrands.map((brand) => {
            const brandSlug = `rent-${brand.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <Link
                key={brand}
                href={`/location/${slug}/${brandSlug}/`}
                className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-dark-card border border-dark-border/50 text-gray-400 hover:text-gold hover:border-gold/30 transition-all"
              >
                {brand}
              </Link>
            );
          })}
          <Link
            href="/brand/"
            className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-dark-card border border-dark-border/50 text-gray-500 hover:text-gold hover:border-gold/30 transition-all"
          >
            {t("allBrands")}
          </Link>
        </div>
      </div>

      {/* ── Location Switcher ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <LocationSwitcher currentSlug={slug} />
      </div>

      {/* Car Grid */}
      <EmirateCarGrid emirateSlug={slug} />

      {/* Auto-generated Content */}
      <EmirateContentSection emirateSlug={slug} />
    </>
  );
}
