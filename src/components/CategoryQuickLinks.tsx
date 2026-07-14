// ═══════════════════════════════════════════════
//  CategoryQuickLinks — Sports / Luxury / SUV cards
//  Reusable on emirate pages
// ═══════════════════════════════════════════════

import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { getAllCars } from "@/lib/cars";

interface CategoryQuickLinksProps {
  emirateSlug: string;
}

const CATEGORIES = ["Sports", "Luxury", "SUV"] as const;

const CATEGORY_AR: Record<string, string> = {
  Sports: "رياضية",
  Luxury: "فاخرة",
  SUV: "SUV",
};

const ICONS: Record<string, React.ReactNode> = {
  Sports: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Luxury: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  SUV: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17v2a1 1 0 001 1h2a1 1 0 001-1v-2M17 17v2a1 1 0 001 1h2a1 1 0 001-1v-2"/>
    </svg>
  ),
};

export default async function CategoryQuickLinks({ emirateSlug }: CategoryQuickLinksProps) {
  const t = await getTranslations("allCars");
  const allCars = getAllCars();
  const catCounts = {
    Sports: allCars.filter((c) => c.car_type === "Sports").length,
    Luxury: allCars.filter((c) => c.car_type === "Luxury").length,
    SUV: allCars.filter((c) => c.car_type === "SUV").length,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {CATEGORIES.map((cat) => {
        const catSlug = `${cat.toLowerCase()}-car-rental`;
        return (
          <Link
            key={cat}
            href={`/location/${emirateSlug}/${catSlug}/`}
            className="group relative bg-dark-card border border-dark-border/50 rounded-xl p-4 sm:p-5 hover:border-gold/30 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0 group-hover:bg-gold/15 transition-colors">
                {ICONS[cat]}
              </div>
              <div className="min-w-0">
                <div className="text-white font-semibold text-sm sm:text-base group-hover:text-gold transition-colors">
                  {t("categoryCarType", { type: CATEGORY_AR[cat] || cat })}
                </div>
                <div className="text-gray-500 text-xs sm:text-sm">
                  {t("vehiclesAvailable", { count: catCounts[cat] })}
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-600 group-hover:text-gold ml-auto shrink-0 transition-colors">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
