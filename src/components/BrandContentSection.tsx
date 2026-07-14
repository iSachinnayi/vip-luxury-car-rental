// ═══════════════════════════════════════════════
//  Brand/Category Content Section
//  Auto-computes stats from live car database
//  Updates automatically when fleet changes
//  Zero AI content — pure data-driven facts
// ═══════════════════════════════════════════════

import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getAllCars } from "@/lib/cars";
import { EMIRATES } from "@/lib/emirates";

interface BrandContentProps {
  slug: string;
  isBrand: boolean;
  brandName?: string;
  categoryName?: string;
}

export default async function BrandContentSection({ slug, isBrand, brandName, categoryName }: BrandContentProps) {
  const t = await getTranslations("brand");
  const locale = await getLocale();
  const allCars = getAllCars();

  // Filter cars by brand or category
  const filterValue = (isBrand ? brandName : categoryName) || "";
  const cars = allCars.filter((c) => {
    const val = isBrand ? c.brand : c.car_type;
    return val.toLowerCase() === filterValue.toLowerCase();
  });

  if (cars.length === 0) return null;

  // ─── Compute stats from live data ─────────────
  const prices = cars
    .map((c) => parseInt(c.pricing.per_day || "0"))
    .filter((p) => p > 0)
    .sort((a, b) => a - b);

  const minPrice = prices[0] || 0;
  const maxPrice = prices[prices.length - 1] || 0;
  const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;

  const types = [...new Set(cars.map((c) => c.car_type).filter(Boolean))];
  const years = [...new Set(cars.map((c) => c.specs?.model_year).filter(Boolean))].sort();

  const withNoDeposit = cars.filter((c) => {
    const dep = parseInt(c.deposit?.no_deposit_fee || "0");
    return dep === 0;
  }).length;

  // Emirate links data
  const emirateLinks = EMIRATES.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 lg:mt-16">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-8 sm:mb-10 lg:mb-12">
        <StatCard
          icon={<FleetIcon />}
          label={t("totalFleet")}
          value={`${cars.length} ${t("vehicleCount", { count: cars.length })}`}
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
          label={isBrand ? t("categories") : t("brands")}
          value={isBrand ? (types.length ? types.join(", ") : "—") : `${cars.length}+ ${t("vehicles")}`}
        />
      </div>

      {/* Description Section */}
      <div className="relative p-6 sm:p-8 lg:p-10 rounded-2xl bg-gradient-to-b from-white/[0.04] via-white/[0.02] to-transparent border border-white/[0.08] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-gold/[0.03] before:to-transparent before:pointer-events-none">
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <h2 className="relative text-xl sm:text-2xl lg:text-3xl font-serif text-white font-semibold mb-4 sm:mb-5">
          {isBrand ? t("pageTitle", { brand: brandName || "" }) : t("categoryTitle2", { category: categoryName || "" })}
          <span className="block text-gold/80 text-sm sm:text-base font-sans font-normal mt-1.5">
            {t("fleetOverview", { count: cars.length, name: isBrand ? (brandName || "") : (categoryName || "") })}
          </span>
        </h2>

        <div className="relative text-gray-400 leading-relaxed space-y-4 sm:space-y-5 text-sm sm:text-base">
          <p className="leading-relaxed">
            {isBrand
              ? t("brandDescription", { count: cars.length, brand: brandName || "", types: types.join(", ") || "", price: minPrice.toLocaleString() })
              : t("categoryDescription", { count: cars.length, category: categoryName || "", price: minPrice.toLocaleString() })}
          </p>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-gold/20 via-gold/10 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 sm:gap-y-2.5">
            <ul className="space-y-2.5 sm:space-y-3">
              <li className="flex items-start gap-2.5 text-sm sm:text-base">
                <CheckIcon />
                <span>{t("freeDeliveryDesc")}</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm sm:text-base">
                <CheckIcon />
                <span>{t("insuranceDesc2")}</span>
              </li>
              {withNoDeposit > 0 && (
                <li className="flex items-start gap-2.5 text-sm sm:text-base">
                  <CheckIcon />
                  <span>{t("noDepositDesc2", { count: withNoDeposit, total: cars.length })}</span>
                </li>
              )}
            </ul>
            <ul className="space-y-2.5 sm:space-y-3">
              <li className="flex items-start gap-2.5 text-sm sm:text-base">
                <CheckIcon />
                <span>{t("modelsDesc", { years: years.length > 0 ? (years.length === 1 ? years[0] : `${years[0]} - ${years[years.length - 1]}`) : t("latestModels") })}</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm sm:text-base">
                <CheckIcon />
                <span>{t("supportDesc")}</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm sm:text-base">
                <CheckIcon />
                <span>{t("flexibleRentalDesc")}</span>
              </li>
            </ul>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-gold/20 via-gold/10 to-transparent" />

          {/* Also Available In — Emirate Links */}
          <div>
            <h3 className="text-white font-medium text-sm sm:text-base mb-3">
              {t("alsoAvailableIn")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {emirateLinks.map((emirate) => (
                <Link
                  key={emirate.slug}
                  href={"/location/" + emirate.slug + "/" + slug + "/"}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-lg 
                             bg-dark-card border border-dark-border/50 text-gray-400 
                             hover:text-gold hover:border-gold/30 transition-all"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {locale === "ar" ? emirate.nameAr : emirate.name}
                </Link>
              ))}
            </div>
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

// ─── Helpers ──────────────────────────────────────

function pluralize(word: string, count: number): string {
  return count === 1 ? word : `${word}s`;
}

// ─── Stat Card ─────────────────────────────────────

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="group relative p-4 sm:p-5 rounded-xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] hover:border-gold/20 hover:from-gold/[0.04] hover:to-transparent transition-all duration-500">
      {/* Top gold accent on hover */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gold/0 to-transparent group-hover:via-gold/30 transition-all duration-500" />

      <div className="flex items-center gap-2.5 mb-2">
        <span className="text-gold/70 group-hover:text-gold transition-colors duration-300">{icon}</span>
        <span className="text-[10px] sm:text-[11px] text-gray-500 uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-white font-semibold text-sm sm:text-base lg:text-lg leading-tight">{value}</p>
      {sub && <p className="text-[10px] sm:text-[11px] text-gray-600 mt-0.5">{sub}</p>}
    </div>
  );
}
