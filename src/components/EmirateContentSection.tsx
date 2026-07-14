// ═══════════════════════════════════════════════
//  Emirate Content Section
//  Auto-computes stats from live car database
//  Data-driven location pages — zero AI content
// ═══════════════════════════════════════════════

import { getTranslations, getLocale } from "next-intl/server";
import { getAllCars, getAllBrands, getAllTypes } from "@/lib/cars";
import { getEmirate } from "@/lib/emirates";
import type { Emirate } from "@/lib/emirates";

interface EmirateContentProps {
  emirateSlug: string;
  brandName?: string;
  categoryName?: string;
}

export default async function EmirateContentSection({ emirateSlug, brandName, categoryName }: EmirateContentProps) {
  const t = await getTranslations("brand");
  const locale = await getLocale();
  const emirate = getEmirate(emirateSlug);
  if (!emirate) return null;

  const emirateName = locale === "ar" ? emirate.nameAr : emirate.name;
  const emirateIntro = locale === "ar" ? emirate.introAr || emirate.intro : emirate.intro;
  const emirateAttractions = locale === "ar" ? emirate.attractionsAr || emirate.attractions : emirate.attractions;
  const allCars = getAllCars();
  const isFiltered = !!(brandName || categoryName);

  // Filter cars if brand or category specified
  const cars = brandName
    ? allCars.filter((c) => c.brand?.toLowerCase() === brandName.toLowerCase())
    : categoryName
      ? allCars.filter((c) => c.car_type?.toLowerCase() === categoryName.toLowerCase())
      : allCars;

  if (cars.length === 0) return null;

  // ─── Compute stats from live data ─────────────
  const prices = cars
    .map((c) => parseInt(c.pricing.per_day || "0"))
    .filter((p) => p > 0)
    .sort((a, b) => a - b);

  const minPrice = prices[0] || 0;
  const maxPrice = prices[prices.length - 1] || 0;
  const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;

  const brands = [...new Set(cars.map((c) => c.brand).filter(Boolean))];
  const types = [...new Set(cars.map((c) => c.car_type).filter(Boolean))];
  const years = [...new Set(cars.map((c) => c.specs?.model_year).filter(Boolean))].sort();

  const withNoDeposit = cars.filter((c) => {
    const dep = parseInt(c.deposit?.no_deposit_fee || "0");
    return dep === 0;
  }).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 lg:mt-16">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-8 sm:mb-10 lg:mb-12">
        <StatCard
          icon={<FleetIcon />}
          label={t("totalFleet")}
          value={`${cars.length} ${t("vehicles")}`}
        />
        <StatCard
          icon={<PriceIcon />}
          label={t("priceRange")}
          value={`AED ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`}
          sub={t("perDay2")}
        />
        <StatCard
          icon={<RateIcon />}
          label={t("avgDailyRate")}
          value={`AED ${avgPrice.toLocaleString()}`}
          sub={t("perDay2")}
        />
        <StatCard
          icon={<CategoryIcon />}
          label={brandName ? t("categories") : categoryName ? t("brands") : t("brands")}
          value={brandName ? (types.length ? types.join(", ") : "\u2014") : `${brands.length}+ ${t("brands").toLowerCase()}`}
        />
      </div>

      {/* Description Section */}
      <div className="relative p-6 sm:p-8 lg:p-10 rounded-2xl bg-gradient-to-b from-white/[0.04] via-white/[0.02] to-transparent border border-white/[0.08] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-gold/[0.03] before:to-transparent before:pointer-events-none">
        {/* Gold accent line */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <h2 className="relative text-xl sm:text-2xl lg:text-3xl font-serif text-white font-semibold mb-4 sm:mb-5">
          {brandName
            ? t("emiratePageTitle", { brand: brandName, emirate: emirateName })
            : categoryName
              ? t("emirateCategoryTitle", { category: categoryName, emirate: emirateName })
              : t("emirateDefaultTitle", { emirate: emirateName })}
          <span className="block text-gold/80 text-sm sm:text-base font-sans font-normal mt-1.5">
            {t("emirateVehiclesAvailable", { count: cars.length, emirate: emirateName })}
          </span>
        </h2>

        <div className="relative text-gray-400 leading-relaxed space-y-4 sm:space-y-5 text-sm sm:text-base">
          <p className="leading-relaxed">
            {emirateIntro}
          </p>

          {!isFiltered && emirate.attractions.length > 0 && (
            <>
              <div className="h-px bg-gradient-to-r from-gold/20 via-gold/10 to-transparent" />
              <div>
                <h3 className="text-white font-medium mb-3 text-sm sm:text-base">
                  {t("emiratePopular", { emirate: emirateName })}
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {emirateAttractions.map((attraction, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
                      <LocationIcon />
                      <span>{attraction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <div className="h-px bg-gradient-to-r from-gold/20 via-gold/10 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 sm:gap-y-2.5">
            <ul className="space-y-2.5 sm:space-y-3">
              <li className="flex items-start gap-2.5 text-sm sm:text-base">
                <CheckIcon />
                <span><strong className="text-white">{t("freeDeliveryLabel")}</strong> {emirate.deliveryNote.length > 60 ? t("emirateFreeDelivery", { emirate: emirateName }) : emirate.deliveryNote}</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm sm:text-base">
                <CheckIcon />
                <span><strong className="text-white">{t("insuranceLabel")}</strong> {t("insuranceDesc2").replace("Insurance: ", "")}</span>
              </li>
              {withNoDeposit > 0 && (
                <li className="flex items-start gap-2.5 text-sm sm:text-base">
                  <CheckIcon />
                  <span><strong className="text-white">{t("noDepositLabel")}</strong> {t("emirateNoDeposit", { count: withNoDeposit, total: cars.length })}</span>
                </li>
              )}
            </ul>
            <ul className="space-y-2.5 sm:space-y-3">
              <li className="flex items-start gap-2.5 text-sm sm:text-base">
                <CheckIcon />
                <span><strong className="text-white">{t("modelsLabel")}</strong> {years.length > 0 ? t("modelsDesc", { years: years.length === 1 ? years[0] : `${years[0]} - ${years[years.length - 1]}` }) : t("latestModels")}</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm sm:text-base">
                <CheckIcon />
                <span><strong className="text-white">{t("supportLabel")}</strong> {t("supportDesc").replace("24/7 Support: ", "")}</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm sm:text-base">
                <CheckIcon />
                <span><strong className="text-white">{t("flexibleRentalLabel")}</strong> {t("flexibleRentalDesc").replace("Flexible Rental: ", "")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SVG Icons ────────────────────────────────────

function FleetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
      <path d="M15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
      <path d="M5 17H3v-4l2-4h8l2 4h2a2 2 0 0 1 2 2v2h-2" />
      <path d="M10 9V5H7" />
      <path d="M3 13h12" />
    </svg>
  );
}

function PriceIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 7.5c0-1.5-1.5-3-5-3s-5 1.5-5 3 1.5 3 5 3 5 1.5 5 3-1.5 3-5 3-5-1.5-5-3" />
    </svg>
  );
}

function RateIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="12" y1="14" x2="12" y2="18" />
      <line x1="9" y1="16" x2="15" y2="16" />
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold mt-0.5 shrink-0">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold mt-0.5 shrink-0">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// ─── Stat Card ─────────────────────────────────────

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="relative bg-dark-card border border-dark-border/50 rounded-xl p-4 sm:p-5 overflow-hidden group hover:border-gold/20 transition-colors duration-300">
      {/* Subtle accent on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex items-start gap-3">
        <div className="text-gold/70 mt-0.5">{icon}</div>
        <div className="min-w-0">
          <div className="text-gray-500 text-[10px] sm:text-xs font-medium tracking-widest">{label}</div>
          <div className="text-white font-semibold text-sm sm:text-base lg:text-lg truncate">
            {value}
          </div>
          {sub && <div className="text-gray-600 text-[10px] sm:text-xs">{sub}</div>}
        </div>
      </div>
    </div>
  );
}
