// ═══ OPTION 7: "Ultra Clean" — Fixed ═══
// Big image, vertical pricing, all periods

"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import type { CarCardData } from "@/types/car";
import { useCurrency } from "@/lib/CurrencyContext";
import { useCarTranslation } from "@/lib/useCarTranslation";
import { waCarInterest } from "@/lib/whatsapp";
import { APP_CONFIG } from "@/lib/config";

interface Props { car: CarCardData; index?: number }

export default function CarCardV7({ car, index = 0 }: Props) {
  const t = useTranslations("car");
  const locale = useLocale() as "en" | "ar";
  const { getTitle } = useCarTranslation();
  const carTitle = getTitle(car.slug, car.title);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [imgError, setImgError] = useState(false);
  const imgSrc = car.thumbnail || car.images?.[0] || "";
  const { symbol, fmt } = useCurrency();

  const day = parseInt(car.pricing.per_day || "0");
  const week = parseInt(car.pricing.per_week || "0");
  const month = parseInt(car.pricing.per_month || "0");
  const hour = parseInt(car.pricing.per_hour || "0");

  const oDay = car.pricing.original_per_day ? parseInt(car.pricing.original_per_day) : null;
  const oWeek = car.pricing.original_per_week ? parseInt(car.pricing.original_per_week) : null;
  const oMonth = car.pricing.original_per_month ? parseInt(car.pricing.original_per_month) : null;

  const kmDay = car.km_limits.per_day || "300";
  const kmWeek = car.km_limits.per_week || "2100";
  const kmMonth = car.km_limits.per_month || "5000";
  const oKmDay = car.km_limits.original_per_day;
  const oKmWeek = car.km_limits.original_per_week;
  const oKmMonth = car.km_limits.original_per_month;

  const rows = [
    { label: "DAY", price: day, orig: oDay, disc: car.pricing.discount_day, km: kmDay, oKm: oKmDay },
    { label: "WEEK", price: week, orig: oWeek, disc: car.pricing.discount_week, km: kmWeek, oKm: oKmWeek },
    { label: "MONTH", price: month, orig: oMonth, disc: car.pricing.discount_month, km: kmMonth, oKm: oKmMonth },
  ];

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: index * 0.05 }}>
      <div className="group/card bg-dark-card rounded-2xl overflow-hidden border border-white/[0.06] hover:border-gold/30 hover:shadow-[0_8px_40px_rgba(200,169,81,0.12)] transition-all duration-500 relative">
        
        {/* Card glow on hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 rounded-3xl opacity-0 group-hover/card:opacity-100 blur-xl transition-opacity duration-700 pointer-events-none" />

        {/* Image */}
        <Link href={`/car/${car.slug}`} className="block relative h-[200px] sm:h-[225px] overflow-hidden bg-dark">
          {imgSrc && !imgError ? (
            <Image src={imgSrc} alt={carTitle} fill className="object-cover transition-all duration-700 group-hover/card:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" onError={() => setImgError(true)} />
          ) : (<div className="w-full h-full flex items-center justify-center text-gray-500">{car.brand}</div>)}
        </Link>

        {/* Content */}
        <div className="p-3 sm:p-4">
          {/* Title + Year */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <Link href={`/car/${car.slug}`} className="max-w-[200px]">
              <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-tight truncate">{carTitle}</h3>
            </Link>
            <span className="text-[11px] font-semibold text-gold bg-gold/15 px-2 py-0.5 rounded border border-gold/20 flex-shrink-0">{car.specs.model_year || "2025"}</span>
          </div>

          {/* Divider */}
          <div className="flex justify-center mb-3">
            <div className="w-16 h-[1px] bg-gradient-to-r from-gold/0 via-gold/40 to-gold/0" />
          </div>

          {/* Pricing Rows */}
          {rows.map((r, i) => (
            <div key={r.label} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-b-0">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-gold font-bold text-sm sm:text-base">{symbol} {fmt(r.price)}</span>
                  <span className="text-gray-500 text-[11px]">/{t(r.label === 'DAY' ? 'perDay' : r.label === 'WEEK' ? 'perWeek' : 'perMonth')}</span>
                </div>
                {r.orig && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-gray-500 text-[11px] line-through">{fmt(r.orig)}</span>
                    {r.disc && <span className="text-red-400 text-[10px] font-semibold bg-red-500/10 px-1.5 py-0.5 rounded">-{r.disc.replace(/ ?OFF/i, '')}</span>}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-white text-xs sm:text-sm font-semibold">{r.km}</div>
                <div className="text-gray-500 text-[11px]">{t('km')}/{t(r.label === 'DAY' ? 'perDay' : r.label === 'WEEK' ? 'perWeek' : 'perMonth')}</div>
                {r.oKm && <div className="text-gray-500 text-[10px] line-through">{r.oKm} km</div>}
              </div>
            </div>
          ))}

          {/* Hour + Deposit */}
          <div className="flex items-center justify-between py-2.5 mt-1.5 border-t border-white/[0.04]">
            <div className="flex items-baseline gap-1.5">
              <span className="text-gold font-bold text-sm sm:text-base">{symbol} {fmt(hour)}</span>
              <span className="text-gray-500 text-[11px]">/{t('perHour')}</span>
            </div>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/15">
              {car.deposit?.no_deposit_fee ? t('noDepositAvailable') : t('depositOptions')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 divide-x divide-white/[0.04] border-t border-white/[0.04] bg-white/[0.01] relative">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

          <a href={waCarInterest({ carName: carTitle, carSlug: car.slug, locale: locale as "en" | "ar" })}
            target="_blank"
            className="flex flex-col items-center gap-1 py-3 sm:py-3.5 px-1 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all duration-300 group/btn relative">
            <motion.svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor"
              whileHover={{ scale: 1.2, rotate: 5 }} transition={{ duration: 0.2 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </motion.svg>
            <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 group-hover/btn:text-emerald-400">{t('whatsapp')}</span>
          </a>
          <a href={`tel:${APP_CONFIG.PHONE.replace(/\+/g, "")}`}
            className="flex flex-col items-center gap-1 py-3 sm:py-3.5 px-1 text-gray-400 hover:text-gold hover:bg-gold/5 transition-all duration-300 group/btn relative">
            <motion.svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </motion.svg>
            <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 group-hover/btn:text-gold">{t('call')}</span>
          </a>
          <Link href={`/car/${car.slug}`}
            className="flex flex-col items-center gap-1 py-3 sm:py-3.5 px-1 text-gray-400 hover:text-gold hover:bg-gold/5 transition-all duration-300 group/btn relative">
            <motion.svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </motion.svg>
            <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 group-hover/btn:text-gold">{t('details')}</span>
          </Link>
          <Link href={`/booking/${car.slug}`}
            className="flex flex-col items-center gap-1 py-3 sm:py-3.5 px-1 text-gray-400 hover:text-gold hover:bg-gold/5 transition-all duration-300 group/btn relative">
            <motion.svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </motion.svg>
            <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 group-hover/btn:text-gold">{t('bookNow')}</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
