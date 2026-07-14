// ═══════════════════════════════════════════════
//  BrandsDropdown — Hover/Tap popup with logo grid
// ═══════════════════════════════════════════════

"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";

interface BrandEntry {
  name: string;
  slug: string;
  count: number;
  logo: string;
}

const BRAND_SLUG_MAP: Record<string, string> = {
  Lamborghini: "rent-lamborghini-in-dubai",
  Ferrari: "rent-ferrari-in-dubai",
  "Rolls Royce": "rent-rolls-royce-in-dubai",
  Bentley: "rent-bentley-in-dubai",
  Porsche: "rent-porsche-in-dubai",
  Mercedes: "rent-mercedes-in-dubai",
  BMW: "rent-bmw-in-dubai",
  Audi: "rent-audi-in-dubai",
  "Range Rover": "rent-range-rover-in-dubai",
  Nissan: "rent-nissan-in-dubai",
  Chevrolet: "rent-chevrolet-in-dubai",
  McLaren: "rent-mclaren-in-dubai",
  Cadillac: "rent-cadillac-in-dubai",
  GMC: "rent-gmc-in-dubai",
  Toyota: "rent-toyota-in-dubai",
  Volkswagen: "rent-volkswagen-in-dubai",
  "Mini Cooper": "rent-mini-cooper-in-dubai",
};

const BRAND_LOGOS: Record<string, string> = {
  Lamborghini: "/brand-logos/lamborghini-logo.webp",
  Ferrari: "/brand-logos/ferrari-logo.webp",
  "Rolls Royce": "/brand-logos/rolls-royce-logo.webp",
  Bentley: "/brand-logos/bentley-logo.webp",
  Porsche: "/brand-logos/porsche-logo.webp",
  Mercedes: "/brand-logos/mercedes-logo.webp",
  BMW: "/brand-logos/bmw-logo.webp",
  Audi: "/brand-logos/audi-logo.webp",
  "Range Rover": "/brand-logos/land-rover-logo.svg",
  Nissan: "/brand-logos/nissan-logo.webp",
  Chevrolet: "/brand-logos/chevrolet-logo.webp",
  McLaren: "/brand-logos/mclaren-logo.webp",
  Cadillac: "/brand-logos/cadillac-logo.webp",
  GMC: "/brand-logos/gmc-logo.webp",
  Toyota: "/brand-logos/toyota-logo.webp",
  Volkswagen: "/brand-logos/volkswagen-logo.webp",
  "Mini Cooper": "/brand-logos/mini-cooper-logo.webp",
};

export default function BrandsDropdown({ isActive }: { isActive?: boolean }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [brands, setBrands] = useState<BrandEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch brand car counts
  useEffect(() => {
    fetch("/api/cars")
      .then((r) => r.json())
      .then((data) => {
        const cars = data.cars || [];
        const counts: Record<string, number> = {};
        cars.forEach((c: any) => {
          const brand = c.brand;
          counts[brand] = (counts[brand] || 0) + 1;
        });
        const brandList: BrandEntry[] = Object.entries(BRAND_SLUG_MAP)
          .map(([name, slug]) => ({
            name,
            slug,
            count: counts[name] || 0,
            logo: BRAND_LOGOS[name] || "",
          }))
          .filter((b) => b.count > 0)
          .sort((a, b) => b.count - a.count);
        setBrands(brandList);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Hover handlers with delay
  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const hide = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  // Click outside
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={show} onMouseLeave={hide}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        onFocus={() => setOpen(true)}
        className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-1.5 ${
          isActive
            ? "text-gold bg-white/5"
            : "text-gray-300 hover:text-gold hover:bg-white/5"
        }`}
      >
        {t("brands")}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-3 h-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[320px] sm:w-[400px]
                       p-4 rounded-2xl bg-dark-card/95 backdrop-blur-xl
                       border border-white/10 shadow-2xl shadow-black/50 z-50"
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/[0.06]">
              <div className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                </svg>
              </div>
              <span className="text-sm font-bold text-white">{t("ourBrands")}</span>
              <span className="text-[10px] text-gray-500 ml-auto">{t("brandsCount", { count: brands.length })}</span>
            </div>

            {/* Brand Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5 max-h-[320px] overflow-y-auto scrollbar-thin">
                {brands.map((brand, i) => (
                  <motion.div
                    key={brand.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                  >
                    <Link
                      href={`/${brand.slug}`}
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-2.5 p-2 rounded-xl
                                 hover:bg-gold/5 hover:border hover:border-gold/20
                                 transition-all duration-200"
                    >
                      {/* Logo */}
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-white/5 border border-white/10
                                      flex items-center justify-center overflow-hidden p-1.5
                                      group-hover:border-gold/30 group-hover:bg-white/10 transition-all duration-200"
                      >
                        {brand.logo ? (
                          <img src={brand.logo} alt={brand.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                            }}
                          />
                        ) : null}
                        <span className="hidden text-[10px] font-bold text-gray-500">{brand.name[0]}</span>
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white group-hover:text-gold transition-colors truncate">
                          {brand.name}
                        </div>
                        <div className="text-[10px] text-gray-500">{t("carCount", { count: brand.count })}</div>
                      </div>
                      {/* Arrow */}
                      <svg className="w-3 h-3 text-gray-600 group-hover:text-gold transition-colors flex-shrink-0"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* View All */}
            <Link
              href="/brand"
              onClick={() => setOpen(false)}
              className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between
                         text-xs text-gold hover:text-gold/80 transition-colors group"
            >
              <span>{t("viewAllBrands")}</span>
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="inline-block"
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
