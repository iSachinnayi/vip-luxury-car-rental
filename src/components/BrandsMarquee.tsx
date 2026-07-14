// ═══════════════════════════════════════════════
//  BrandsMarquee — Cinematic Gold Carousel
//  SEO optimized, mobile touch, semantic HTML
// ═══════════════════════════════════════════════

"use client";

import { useRef, useCallback, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { getBrandLogoUrl } from "@/lib/brandLogos";

const BRANDS = [
  "Lamborghini", "Ferrari", "Rolls Royce", "Bentley", "Porsche",
  "Mercedes", "BMW", "Audi", "Range Rover", "McLaren",
  "Nissan", "Chevrolet", "Cadillac", "GMC", "Toyota",
];

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

/* ─── Breathing glow ─── */
const pulseGlow = { scale: [1, 1.06, 1], opacity: [0.3, 0.6, 0.3] };

function GoldPulse() {
  return (
    <motion.div
      className="absolute inset-0 rounded-3xl pointer-events-none"
      style={{ background: "radial-gradient(ellipse at center, rgba(200,169,81,0.15) 0%, transparent 70%)" }}
      animate={pulseGlow}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    />
  );
}

function BrandCard({ brand, isHeading, locale }: { brand: string; isHeading: boolean; locale: string }) {
  const logoUrl = getBrandLogoUrl(brand);
  const slug = brand.toLowerCase().replace(/\s+/g, "-");
  const altText = locale === "ar" ? `${brand} - شعار سيارة فاخرة في دبي` : `${brand} car logo - luxury vehicle manufacturer Dubai`;

  return (
    <Link
      href={`/rent-${slug}-in-dubai`}
      className="group block flex-shrink-0"
      aria-label={`${brand} luxury car rental in Dubai - view ${brand} fleet`}
    >
      <div className="relative w-[140px] h-[170px]">
        <GoldPulse />

        <motion.div
          className="relative w-full h-full rounded-2xl overflow-hidden
                     bg-gradient-to-b from-white/[0.04] to-white/[0.01]
                     border border-white/[0.08]
                     group-hover:border-gold/40
                     group-hover:shadow-[0_0_40px_rgba(200,169,81,0.2)]
                     transition-all duration-700
                     backdrop-blur-xl flex flex-col items-center justify-center gap-3 p-5"
          whileHover={{ scale: 1.04, y: -5 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Gold light sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
            style={{
              background: "linear-gradient(105deg, transparent 30%, rgba(200,169,81,0.08) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["200% 0%", "-100% 0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            aria-hidden="true"
          />

          {/* Corner gold accents */}
          <div className="absolute top-3 left-3 w-4 h-[1px] bg-gold/30 group-hover:bg-gold/60 transition-colors duration-700" aria-hidden="true" />
          <div className="absolute top-3 left-3 w-[1px] h-4 bg-gold/30 group-hover:bg-gold/60 transition-colors duration-700" aria-hidden="true" />
          <div className="absolute bottom-3 right-3 w-4 h-[1px] bg-gold/30 group-hover:bg-gold/60 transition-colors duration-700" aria-hidden="true" />
          <div className="absolute bottom-3 right-3 w-[1px] h-4 bg-gold/30 group-hover:bg-gold/60 transition-colors duration-700" aria-hidden="true" />

          {/* Logo */}
          <div className="relative z-10 w-[120px] h-[78px] flex items-center justify-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={altText}
                loading="lazy"
                decoding="async"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                className="max-w-[112px] max-h-[68px] w-auto h-auto object-contain
                           transition-all duration-1000 ease-out group-hover:scale-110"
              />
            ) : (
              <span className="font-semibold text-gray-400 text-xs">{brand}</span>
            )}
          </div>

          {/* Gold divider */}
          <div className="relative z-10 w-10 h-[2px] bg-gradient-to-r from-gold/0 via-gold/50 to-gold/0 rounded-full
                          group-hover:w-14 transition-all duration-700" aria-hidden="true" />

          {/* Brand name as heading for SEO */}
          {isHeading ? (
            <h3 className="relative z-10 text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em]
                           group-hover:text-gold/80 transition-colors duration-500">
              {brand}
            </h3>
          ) : (
            <span className="relative z-10 text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em]
                           group-hover:text-gold/80 transition-colors duration-500">
              {brand}
            </span>
          )}
        </motion.div>
      </div>
    </Link>
  );
}

export default function BrandsMarquee() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isAr = locale === "ar";
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isPaused, setIsPaused] = useState(false);

  const items = [...BRANDS, ...BRANDS, ...BRANDS];

  const handleInteractionStart = useCallback(() => setIsPaused(true), []);
  const handleInteractionEnd = useCallback(() => setIsPaused(false), []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-20 bg-dark overflow-hidden border-t border-white/[0.03]"
      aria-label="Premium car manufacturers and brands available for rental"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="numberOfItems" content={String(BRANDS.length)} />
      <meta itemProp="itemListOrder" content="http://schema.org/ItemListOrderDescending" />

      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] 
                      bg-gradient-to-r from-transparent via-gold/20 to-transparent" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1.5px] bg-gold/50 rounded-full" aria-hidden="true" />
            <h2 className="text-gold text-[11px] md:text-xs uppercase tracking-[0.2em] font-semibold">
              {t("premiumManufacturers")}
            </h2>
            <div className="w-8 h-[1.5px] bg-gold/50 rounded-full" aria-hidden="true" />
          </div>
          <Link href="/brand"
            className="text-[11px] text-gray-500 hover:text-gold transition-colors tracking-wider uppercase
                       flex items-center gap-1.5 group"
            aria-label="View all car brands">
            {t("viewAll")}
            <span className="group-hover:translate-x-0.5 transition-transform inline-block" aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>

      {/* ─── Marquee ─── */}
      <div className="relative">
        {/* Gradient edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-56 bg-gradient-to-r from-dark via-dark/90 to-transparent z-10 pointer-events-none" aria-hidden="true" />
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-56 bg-gradient-to-l from-dark via-dark/90 to-transparent z-10 pointer-events-none" aria-hidden="true" />

        <style>{`
          @keyframes brand-scroll-ltr {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
          @keyframes brand-scroll-rtl {
            0% { transform: translateX(0); }
            100% { transform: translateX(33.333%); }
          }
          .marquee-track {
            animation: brand-scroll-ltr 90s linear infinite;
            will-change: transform;
          }
          [dir="rtl"] .marquee-track {
            animation: brand-scroll-rtl 90s linear infinite;
          }
          /* Desktop hover pause */
          @media (hover: hover) {
            .marquee-track:hover {
              animation-play-state: paused;
            }
          }
        `}</style>

        <div
          className="marquee-track flex gap-5 md:gap-7 items-center"
          style={{
            width: "max-content",
            animationPlayState: isPaused ? "paused" : "running",
          }}
          // Mobile touch support
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
          // Mouse enter/leave for desktop
          onMouseEnter={handleInteractionStart}
          onMouseLeave={handleInteractionEnd}
          role="list"
          aria-label={`${BRANDS.length} premium car brands scrolling carousel`}
          aria-live="off"
        >
          {isInView && items.map((brand, i) => {
            // Only mark first occurrence as heading for SEO
            const isHeading = i < BRANDS.length;
            return (
              <motion.div
                key={`${brand}-${i}`}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % BRANDS.length) * 0.03, duration: 0.5, ease: easeOut }}
                role="listitem"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={String((i % BRANDS.length) + 1)} />
                <BrandCard brand={brand} isHeading={isHeading} locale={locale} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] 
                      bg-gradient-to-r from-transparent via-gold/10 to-transparent" aria-hidden="true" />
    </section>
  );
}
