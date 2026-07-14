// ═══════════════════════════════════════════════
//  LocationSwitcher — "Also Serving" bar
//  Reusable on emirate pages, brand pages, car pages
// ═══════════════════════════════════════════════

"use client";

import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { EMIRATES } from "@/lib/emirates";

interface LocationSwitcherProps {
  currentSlug?: string;
  showDubai?: boolean;
  label?: string;
}

export default function LocationSwitcher({
  currentSlug,
  showDubai = true,
  label,
}: LocationSwitcherProps) {
  const t = useTranslations("allCars");
  const locale = useLocale();
  const others = EMIRATES.filter((e) => e.slug !== currentSlug);
  const displayLabel = label || t("alsoServing");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-500 uppercase tracking-widest mr-1 shrink-0">
        {displayLabel}:
      </span>
      {others.map((e) => (
        <Link
          key={e.slug}
          href={`/location/${e.slug}/`}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-dark-card border border-dark-border/50 text-gray-400 hover:text-gold hover:border-gold/30 transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {locale === "ar" ? e.nameAr : e.name}
        </Link>
      ))}
      {showDubai && (
        <Link
          href="/all-cars/"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-dark-card border border-dark-border/50 text-gray-500 hover:text-gold hover:border-gold/30 transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {t("dubaiMain")}
        </Link>
      )}
    </div>
  );
}
