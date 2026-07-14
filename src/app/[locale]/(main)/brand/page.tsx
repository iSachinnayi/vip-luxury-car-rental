// ═══════════════════════════════════════════════
//  Brand Listing — Redesigned
//  Glass card header · Animated brand grid · Categories
// ═══════════════════════════════════════════════

import { Link } from "@/i18n/routing";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllBrands, getAllCars } from "@/lib/cars";
import { generatePageMeta } from "@/lib/seo";
import BrandLogo from "@/components/BrandLogo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale === "ar") {
    return {
      title: "علاماتنا التجارية",
      description: "تصفح مجموعتنا المتميزة من ماركات السيارات الفاخرة المتاحة للإيجار في دبي. لامبورغيني، فيراري، رولز رويس، بنتلي والمزيد.",
    };
  }
  return {
    title: "Our Brands",
    description: "Browse our premium collection of luxury car brands available for rent in Dubai. Lamborghini, Ferrari, Rolls Royce, Bentley and more.",
  };
}

const CATEGORIES = [
  { slug: "/sports-car-rental-in-dubai" },
  { slug: "/luxury-car-rental-in-dubai" },
  { slug: "/suv-car-rental-in-dubai" },
];

function getBrandSlug(brand: string): string {
  return `rent-${brand.toLowerCase().replace(/\s+/g, "-")}-in-dubai`;
}

export default async function BrandPage() {
  const t = await getTranslations("brand");
  const brands = getAllBrands();
  const allCars = getAllCars();

  const CATEGORY_DATA = [
    { name: t("sportsCars"), slug: "/sports-car-rental-in-dubai", desc: t("sportsCarsDesc") },
    { name: t("luxuryCars"), slug: "/luxury-car-rental-in-dubai", desc: t("luxuryCarsDesc") },
    { name: t("suv"), slug: "/suv-car-rental-in-dubai", desc: t("suvDesc") },
  ];

  // Brand data with counts
  const brandData = brands.map((brand) => ({
    name: brand,
    slug: getBrandSlug(brand),
    count: allCars.filter((c) => c.brand.toLowerCase() === brand.toLowerCase()).length,
  })).filter((b) => b.count > 0).sort((a, b) => b.count - a.count);

  // Category counts
  const categoryCounts = CATEGORY_DATA.map((cat) => {
    // Determine car_type from slug (locale-independent)
    let type = "Luxury";
    if (cat.slug.includes("sports")) type = "Sports";
    else if (cat.slug.includes("suv")) type = "SUV";
    const count = allCars.filter((c) => c.car_type === type).length;
    return { ...cat, count };
  });

  const totalBrands = brandData.length;
  const totalCars = allCars.length;

  return (
    <main className="min-h-screen bg-dark pt-8 md:pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ════════ Glass Card Header ════════ */}
        <div className="mb-8 p-6 md:p-8 rounded-3xl
                     bg-gradient-to-b from-white/[0.04] via-white/[0.02] to-transparent
                     border border-white/[0.06] backdrop-blur-xl">
          {/* Title */}
          <div>
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gold transition-colors mb-3">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              {t("home")}
            </Link>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-white">{t("title")}</h1>
            <p className="text-gray-500 text-sm mt-1.5">
              {t("subtitle", { count: totalBrands, total: totalCars })}
            </p>
          </div>

          {/* Gold Divider */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent my-5" />

          {/* Category Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {categoryCounts.map((cat) => (
              <Link key={cat.slug} href={cat.slug}
                className="group p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]
                           hover:border-gold/30 hover:bg-gold/[0.03] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-gold transition-colors">{cat.name}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{cat.desc}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gold">{cat.count}</div>
                    <div className="text-[10px] text-gray-600">{t("carsLabel")}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ════════ Brand Grid ════════ */}
        <div className="grid grid-auto-brands gap-3 md:gap-4">
          {brandData.map((brand, i) => (
            <Link key={brand.name} href={`/${brand.slug}`}
              className="group relative p-3 md:p-4 rounded-xl
                         bg-gradient-to-b from-white/[0.04] to-white/[0.01]
                         border border-white/[0.08] hover:border-gold/30
                         transition-all duration-300 text-center
                         flex flex-col items-center justify-center gap-2
                         min-h-[90px] md:min-h-[110px] overflow-hidden
                         hover:shadow-[0_4px_20px_rgba(200,169,81,0.08)]
                         hover:-translate-y-0.5"
              style={{ animation: `fadeSlideUp 0.4s ease-out ${i * 0.03}s both` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Logo */}
              <div className="relative z-10 w-full flex items-center justify-center h-8 md:h-10">
                <BrandLogo brand={brand.name} size="md" />
              </div>

              {/* Brand name */}
              <div className="relative z-10">
                <p className="text-xs md:text-sm font-medium text-white group-hover:text-gold transition-colors leading-tight">
                  {brand.name}
                </p>
                <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">
                  {t("brandCarCount", { count: brand.count })}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Keyframes for entrance animation */}
        <style>{`
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </main>
  );
}
