// ═══════════════════════════════════════════════
//  LanguageSwitcher — Toggle between En/Ar
//  Uses next-intl routing for locale switching
//  Features: click-outside-close, keyboard nav,
//  robust routing with fallback
// ═══════════════════════════════════════════════

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";

interface Lang {
  code: string;
  label: string;
  native: string;
  flag: string;
  dir: string;
}

const LANGUAGES: Lang[] = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ar", label: "Arabic", native: "العربية", flag: "🇦🇪", dir: "rtl" },
];

const LANG_LABELS: Record<string, string> = {
  en: "English",
  ar: "العربية",
};

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();

  const current = LANGUAGES.find((l) => l.code === currentLocale) || LANGUAGES[0];

  // ─── Click outside to close ────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // ─── Escape key to close ───────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // ─── Switch language (robust) ──────────────────
  const switchLanguage = useCallback(
    (e: React.MouseEvent, locale: string) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);

      // Use next-intl router for client-side navigation
      // With localePrefix: "as-needed", pathname is without locale
      router.replace(pathname, { locale });
    },
    [pathname, router]
  );

  return (
    <div className="relative" ref={ref}>
      {/* Toggle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="group flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 
                   hover:text-gold border border-white/10 rounded-lg 
                   hover:border-gold/30 transition-all duration-200"
        aria-label="Switch language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden md:inline text-xs font-medium tracking-wide">
          {LANG_LABELS[currentLocale] || current.code.toUpperCase()}
        </span>
        <svg
          className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-44 p-1.5 rounded-xl 
                       bg-dark-card/95 border border-white/10 backdrop-blur-xl 
                       shadow-2xl shadow-black/50 z-50"
            role="listbox"
            aria-label="Select language"
          >
            {LANGUAGES.map((lang, i) => {
              const isActive = currentLocale === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={(e) => switchLanguage(e, lang.code)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      switchLanguage(e as any, lang.code);
                    }
                  }}
                  role="option"
                  aria-selected={isActive}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150
                    ${
                      isActive
                        ? "bg-gold/10 text-gold"
                        : "text-gray-300 hover:text-white hover:bg-white/[0.06]"
                    }
                    ${i > 0 ? "mt-0.5" : ""}
                  `}
                >
                  {/* Flag */}
                  <span className="text-lg leading-none shrink-0">{lang.flag}</span>

                  {/* Language names */}
                  <div className="flex flex-col items-start leading-tight min-w-0">
                    <span
                      className={`font-medium ${
                        isActive ? "text-gold" : "text-gray-200"
                      }`}
                    >
                      {lang.native}
                    </span>
                    <span className="text-[11px] text-gray-500">{lang.label}</span>
                  </div>

                  {/* Direction badge */}
                  <span
                    className={`ml-auto text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded
                      ${
                        isActive
                          ? "text-gold/60 bg-gold/5"
                          : "text-gray-600 bg-white/[0.03]"
                      }
                    `}
                  >
                    {lang.dir}
                  </span>

                  {/* Active checkmark */}
                  {isActive && (
                    <svg
                      className="w-4 h-4 shrink-0 text-gold"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
