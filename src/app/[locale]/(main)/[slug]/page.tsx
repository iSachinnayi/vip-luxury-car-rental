// ═══════════════════════════════════════════════
//  Brand/Category Page — Content + Cars
// ═══════════════════════════════════════════════

import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllCars } from "@/lib/cars";
import { generateBrandMeta, generateCategoryMeta } from "@/lib/seo";
import { generateBrandMetaAr, generateCategoryMetaAr } from "@/lib/seo-ar";
import { breadcrumbSchema } from "@/lib/schema";
import BrandCategoryClient from "@/components/BrandCategoryClient";
import BrandContentSection from "@/components/BrandContentSection";

const BRAND_SLUGS = [
  "rent-lamborghini-in-dubai", "rent-ferrari-in-dubai", "rent-rolls-royce-in-dubai",
  "rent-bentley-in-dubai", "rent-porsche-in-dubai", "rent-mercedes-in-dubai",
  "rent-bmw-in-dubai", "rent-audi-in-dubai", "rent-range-rover-in-dubai",
  "rent-nissan-in-dubai", "rent-chevrolet-in-dubai", "rent-mclaren-in-dubai",
  "rent-cadillac-in-dubai", "rent-gmc-in-dubai", "rent-toyota-in-dubai",
  "rent-volkswagen-in-dubai", "rent-mini-cooper-in-dubai", "rent-ford-in-dubai",
];

const CATEGORY_MAP: Record<string, string> = {
  "sports-car-rental-in-dubai": "Sports",
  "luxury-car-rental-in-dubai": "Luxury",
  "suv-car-rental-in-dubai": "SUV",
};

function getBrandName(slug: string): string {
  return slug.replace("rent-", "").replace("-in-dubai", "").split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function generateStaticParams() {
  return [...BRAND_SLUGS, ...Object.keys(CATEGORY_MAP)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const isAr = locale === "ar";
  const ogImage = `${process.env.NEXT_PUBLIC_SITE_URL || "https://vipluxurycarrental.com"}/opengraph-image`;
  const prefix = isAr ? "/ar" : "";

  if (BRAND_SLUGS.includes(slug)) {
    const brandName = getBrandName(slug);
    const meta = isAr ? generateBrandMetaAr(brandName) : generateBrandMeta(brandName);
    return {
      title: meta.title,
      description: meta.description,
      alternates: { canonical: `${prefix}/${slug}/` },
      openGraph: {
        title: meta.title,
        description: meta.description,
        url: `${prefix}/${slug}/`,
        images: [{ url: ogImage, width: 1200, height: 630, alt: brandName }],
      },
      twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: [ogImage] },
    };
  }
  if (slug in CATEGORY_MAP) {
    const categoryName = CATEGORY_MAP[slug];
    const meta = isAr ? generateCategoryMetaAr(categoryName) : generateCategoryMeta(categoryName);
    return {
      title: meta.title,
      description: meta.description,
      alternates: { canonical: `${prefix}/${slug}/` },
      openGraph: {
        title: meta.title,
        description: meta.description,
        url: `${prefix}/${slug}/`,
        images: [{ url: ogImage, width: 1200, height: 630, alt: categoryName }],
      },
      twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: [ogImage] },
    };
  }
  return { title: "VIP Luxury Car Rental Dubai" };
}

export default async function BrandCategoryPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params;
  const t = await getTranslations("brand");
  const isBrand = BRAND_SLUGS.includes(slug);
  const isCategory = slug in CATEGORY_MAP;
  if (!isBrand && !isCategory) return notFound();

  const pageTitle = isBrand
    ? t("pageTitle", { brand: getBrandName(slug) })
    : t("categoryTitle", { category: CATEGORY_MAP[slug] });

  // Breadcrumb schema
  const bcItems = [{ name: t("home"), url: "/" }];
  if (isBrand) {
    bcItems.push({ name: t("breadcrumbBrands"), url: "/brand" });
    bcItems.push({ name: getBrandName(slug), url: "/" + slug });
  } else if (isCategory) {
    bcItems.push({ name: t("breadcrumbCategory", { category: CATEGORY_MAP[slug] }), url: "/" + slug });
  }
  const breadcrumb = breadcrumbSchema(bcItems);

  return (
    <main className="min-h-screen bg-dark pt-8 md:pt-12 pb-16">
      <script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* Client Component — Interactive filters, pagination, grid */}
      <BrandCategoryClient slug={slug} isBrand={isBrand} pageTitle={pageTitle} />

      {/* Auto-updating brand/category content — computed from live car data */}
      <BrandContentSection
        slug={slug}
        isBrand={isBrand}
        brandName={isBrand ? getBrandName(slug) : undefined}
        categoryName={isCategory ? CATEGORY_MAP[slug] : undefined}
      />
    </main>
  );
}
