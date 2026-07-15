// ═══════════════════════════════════════════════
//  Location Archive — Brand/Category × Emirate
//  Catch-all for /location/[emirate]/rent-[brand]/
//  and /location/[emirate]/[category]-car-rental/
// ═══════════════════════════════════════════════

import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { getAllBrands, getAllTypes, getAllCars } from "@/lib/cars";
import { getEmirate, getEmirateSlugs } from "@/lib/emirates";
import { generateEmirateBrandMeta, generateEmirateCategoryMeta } from "@/lib/seo";
import { generateEmirateBrandMetaAr, generateEmirateCategoryMetaAr } from "@/lib/seo-ar";
import { breadcrumbSchema } from "@/lib/schema";
import EmirateContentSection from "@/components/EmirateContentSection";
import EmirateCarGrid from "@/components/EmirateCarGrid";
import CategoryQuickLinks from "@/components/CategoryQuickLinks";
import LocationSwitcher from "@/components/LocationSwitcher";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vipluxurycarrental.com";

// ─── Slug Helpers ─────────────────────────────────

const BRAND_RENT_MAP: Record<string, string> = {};
const RENT_SLUGS: string[] = [];

// Build maps from existing brands
const ALL_BRANDS = getAllBrands();
ALL_BRANDS.forEach((brand) => {
  const slug = `rent-${brand.toLowerCase().replace(/\s+/g, "-")}`;
  BRAND_RENT_MAP[slug] = brand;
  RENT_SLUGS.push(slug);
});

const CATEGORY_SLUG_MAP: Record<string, string> = {};
const CATEGORY_SLUGS: string[] = [];

const ALL_TYPES = getAllTypes().filter(Boolean) as string[];
ALL_TYPES.forEach((type) => {
  const slug = `${type.toLowerCase()}-car-rental`;
  CATEGORY_SLUG_MAP[slug] = type;
  CATEGORY_SLUGS.push(slug);
});

function parseSlug(slugArray: string[]): { brandName?: string; categoryName?: string } | null {
  const fullSlug = slugArray.join("/");
  // Try brand first (with and without -in-dubai suffix)
  for (const [rentSlug, brand] of Object.entries(BRAND_RENT_MAP)) {
    if (fullSlug === rentSlug || fullSlug === rentSlug + "-in-dubai") return { brandName: brand };
  }
  // Try category (with and without -in-dubai suffix)
  for (const [catSlug, type] of Object.entries(CATEGORY_SLUG_MAP)) {
    if (fullSlug === catSlug || fullSlug === catSlug + "-in-dubai") return { categoryName: type };
  }
  return null;
}

export async function generateStaticParams() {
  const params: { emirate: string; slug: string[] }[] = [];
  for (const emirate of getEmirateSlugs()) {
    for (const rentSlug of RENT_SLUGS) {
      params.push({ emirate, slug: [rentSlug] });
    }
    for (const catSlug of CATEGORY_SLUGS) {
      params.push({ emirate, slug: [catSlug] });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ emirate: string; slug: string[]; locale: string }> }): Promise<Metadata> {
  const { emirate: emirateSlug, slug: slugArr, locale } = await params;
  const isAr = locale === "ar";
  const emirate = getEmirate(emirateSlug);
  if (!emirate) return { title: "VIP Luxury Car Rental Dubai" };

  const parsed = parseSlug(slugArr);
  if (!parsed) return { title: "VIP Luxury Car Rental Dubai" };

  const canonical = `${BASE_URL}/location/${emirateSlug}/${slugArr.join("/")}/`;

  if (parsed.brandName) {
    const meta = isAr ? generateEmirateBrandMetaAr(emirate.name, parsed.brandName) : generateEmirateBrandMeta(emirate.name, parsed.brandName);
    return {
      title: meta.title,
      description: meta.description,
      alternates: { canonical },
      openGraph: {
        title: meta.title,
        description: meta.description,
        url: canonical,
        images: [{ url: `${BASE_URL}/opengraph-image`, width: 1200, height: 630, alt: `Rent ${parsed.brandName} in ${emirate.name}` }],
      },
      twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
    };
  }

  if (parsed.categoryName) {
    const meta = isAr ? generateEmirateCategoryMetaAr(emirate.name, parsed.categoryName) : generateEmirateCategoryMeta(emirate.name, parsed.categoryName);
    return {
      title: meta.title,
      description: meta.description,
      alternates: { canonical },
      openGraph: {
        title: meta.title,
        description: meta.description,
        url: canonical,
        images: [{ url: `${BASE_URL}/opengraph-image`, width: 1200, height: 630, alt: `${parsed.categoryName} Car Rental ${emirate.name}` }],
      },
      twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
    };
  }

  return { title: "VIP Luxury Car Rental Dubai" };
}

export default async function EmirateSubPage({ params }: { params: Promise<{ emirate: string; slug: string[] }> }) {
  const { emirate: emirateSlug, slug: slugArr } = await params;
  const t = await getTranslations("location");
  const locale = await getLocale();
  const emirate = getEmirate(emirateSlug);
  if (!emirate) return notFound();

  const parsed = parseSlug(slugArr);
  if (!parsed) return notFound();
  const emirateName = locale === "ar" ? (emirate.nameAr || emirate.name) : emirate.name;

  const pageTitle = parsed.brandName
    ? t("rentBrandIn", { brand: parsed.brandName, emirate: emirateName })
    : t("categoryRentalIn", { category: parsed.categoryName || "", emirate: emirateName });

  const allCars = getAllCars();
  const allBrands = getAllBrands();
  const brandCounts: Record<string, number> = {};
  allCars.forEach((c) => { brandCounts[c.brand] = (brandCounts[c.brand] || 0) + 1; });

  const jsonLd = breadcrumbSchema([
    { name: t("home"), url: BASE_URL + "/" },
    { name: emirateName, url: `${BASE_URL}/location/${emirateSlug}/` },
    { name: pageTitle, url: `${BASE_URL}/location/${emirateSlug}/${slugArr.join("/")}/` },
  ]);

  return (
    <>
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Page Header */}
      <div className="relative pt-28 sm:pt-32 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-gold transition-colors">{t("home")}</Link>
            <span>/</span>
            <Link href={"/location/" + emirateSlug + "/"} className="hover:text-gold transition-colors">{emirateName}</Link>
            <span>/</span>
            <span className="text-gray-400">{parsed.brandName || parsed.categoryName}</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white font-bold">
            {pageTitle}
          </h1>
          <p className="text-gray-400 mt-2 sm:mt-3 text-sm sm:text-base max-w-3xl leading-relaxed">
            {parsed.brandName
              ? t("premiumBrandDesc", { brand: parsed.brandName, emirate: emirateName })
              : t("categoryDesc", { category: (parsed.categoryName || "").toLowerCase(), emirate: emirateName })}
          </p>
        </div>
      </div>

      {/* ── Category Quick Links (only on category pages, hide on brand pages) ── */}
      {!parsed.brandName && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
          <CategoryQuickLinks emirateSlug={emirateSlug} />
        </div>
      )}

      {/* ── Popular Brands (only on brand pages, hide on category pages) ── */}
      {!parsed.categoryName && parsed.brandName && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-widest mr-1 shrink-0">{t("alsoExplore")}</span>
            {allBrands.filter((b) => b !== parsed.brandName).map((brand) => {
              const brandSlug = `rent-${brand.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <Link
                  key={brand}
                  href={`/location/${emirateSlug}/${brandSlug}/`}
                  className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-dark-card border border-dark-border/50 text-gray-400 hover:text-gold hover:border-gold/30 transition-all"
                >
                  {brand} ({brandCounts[brand] || 0})
                </Link>
              );
            })}
            <Link
              href={`/location/${emirateSlug}/`}
              className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-dark-card border border-dark-border/50 text-gray-500 hover:text-gold hover:border-gold/30 transition-all"
            >
              {t("allBrandLabel", { brand: parsed.brandName || "" })}
            </Link>
          </div>
        </div>
      )}

      {/* ── Location Switcher ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <LocationSwitcher currentSlug={emirateSlug} />
      </div>

      {/* Car Grid - filtered by brand or category */}
      <EmirateCarGrid
        emirateSlug={emirateSlug}
        brandName={parsed.brandName}
        categoryName={parsed.categoryName}
        pageTitle={pageTitle}
      />

      {/* Auto-generated Content */}
      <EmirateContentSection
        emirateSlug={emirateSlug}
        brandName={parsed.brandName}
        categoryName={parsed.categoryName}
      />
    </>
  );
}
