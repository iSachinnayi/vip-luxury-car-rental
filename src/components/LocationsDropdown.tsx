// ═══════════════════════════════════════════════
//  LocationsDropdown — Hover/Tap popup
//  Links to UAE emirate archive pages
// ═══════════════════════════════════════════════

"use client";

import { useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { EMIRATES } from "@/lib/emirates";

export default function LocationsDropdown({ isActive }: { isActive?: boolean }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hover handlers with delay
  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const hide = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-1 ${
          isActive
            ? "text-gold bg-white/5"
            : "text-gray-300 hover:text-gold hover:bg-white/5"
        }`}
      >
        {t("locations")}
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 w-56 p-2 rounded-xl
                       bg-dark-card border border-white/10 backdrop-blur-xl shadow-2xl z-50"
            onMouseEnter={show}
            onMouseLeave={hide}
          >
            <div className="text-[10px] text-gray-600 uppercase tracking-widest px-3 py-1.5 font-medium">
              {t("uaeEmirates")}
            </div>

            {EMIRATES.map((emirate) => (
              <Link
                key={emirate.slug}
                href={`/location/${emirate.slug}/`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                           text-gray-300 hover:text-gold hover:bg-white/5 transition-all group"
              >
                {/* Map pin icon */}
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  className="text-gray-600 group-hover:text-gold/60 shrink-0"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{locale === "ar" ? emirate.nameAr : emirate.name}</span>
              </Link>
            ))}

            <div className="border-t border-white/5 mt-1 pt-1">
              <Link
                href="/all-cars/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                           text-gray-500 hover:text-gold hover:bg-white/5 transition-all group"
              >
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  className="text-gray-600 group-hover:text-gold/60 shrink-0"
                >
                  <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17v2a1 1 0 001 1h2a1 1 0 001-1v-2M17 17v2a1 1 0 001 1h2a1 1 0 001-1v-2" />
                </svg>
                <span>{t("allCarsIn")}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
