// ═══════════════════════════════════════════════
//  Header — Main Navigation + Currency/Language
// ═══════════════════════════════════════════════

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import SiteLogo from "@/components/SiteLogo";
import BrandsDropdown from "@/components/BrandsDropdown";
import LocationsDropdown from "@/components/LocationsDropdown";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CurrencySelector from "@/components/CurrencySelector";
import { EMIRATES } from "@/lib/emirates";
import { APP_CONFIG } from "@/lib/config";

export default function Header() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const NAV_ITEMS = [
    { key: "home", label: t("home"), href: "/" },
    { key: "allCars", label: t("allCars"), href: "/all-cars" },
    { key: "brands", label: t("brands"), href: "/brand" },
    { key: "locations", label: t("locations"), href: "/location/abu-dhabi/" },
    { key: "about", label: t("about"), href: "/about" },
  ];

  // Check if a nav item is currently active
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/brand") return pathname.startsWith("/rent-") || pathname === "/brand";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <SiteLogo showTagline={false} link={false} size="md" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) =>
              item.key === "brands" ? (
                <BrandsDropdown key={item.href} isActive={isActive(item.href)} />
              ) : item.key === "locations" ? (
                <LocationsDropdown key={item.href} isActive={pathname.startsWith("/location/")} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-gold bg-white/5"
                      : "text-gray-300 hover:text-gold hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right Side — Language + Currency + Contact */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Currency Selector */}
            <CurrencySelector />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg 
                         border border-white/10 text-white hover:border-gold/50 transition-all"
            >
              <span className="text-lg">{mobileOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-1">
              {NAV_ITEMS.map((item) =>
                item.key === "locations" ? (
                  <div key={item.href}>
                    <div className="px-4 py-2 text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                      {t("locations")}
                    </div>
                    {EMIRATES.map((emirate) => (
                      <Link
                        key={emirate.slug}
                        href={`/location/${emirate.slug}/`}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all text-gray-300 hover:text-gold hover:bg-white/5"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 shrink-0">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                        {emirate.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 text-sm rounded-xl transition-all ${
                      isActive(item.href)
                        ? "text-gold bg-white/5"
                        : "text-gray-300 hover:text-gold hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
              <hr className="border-white/10 my-2" />
              <a
                href={`tel:${APP_CONFIG.PHONE.replace(/\+/g, "")}`}
                className="flex items-center gap-2 px-4 py-3 text-sm text-gold"
              >
                📞 {APP_CONFIG.PHONE}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
