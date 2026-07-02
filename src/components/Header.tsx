// ═══════════════════════════════════════════════
//  Header — Main Navigation + Currency/Language
// ═══════════════════════════════════════════════

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "All Cars", href: "/all-cars" },
  { label: "Brands", href: "/brand" },
  { label: "Luxury", href: "/luxury-car-rental-in-dubai" },
  { label: "Sports", href: "/sports-car-rental-in-dubai" },
  { label: "SUV", href: "/suv-car-rental-in-dubai" },
];

const CURRENCIES = [
  { code: "AED", symbol: "د.إ", flag: "🇦🇪" },
  { code: "USD", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", flag: "🇬🇧" },
  { code: "RUB", symbol: "₽", flag: "🇷🇺" },
  { code: "INR", symbol: "₹", flag: "🇮🇳" },
  { code: "SAR", symbol: "ر.س", flag: "🇸🇦" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("AED");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-xl md:text-2xl font-bold text-white tracking-wide">
              VIP
            </span>
            <span className="hidden md:block text-xs text-gray-400 uppercase tracking-widest border-l border-white/20 pl-3">
              Luxury Car Rental
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-gray-300 hover:text-gold transition-colors rounded-lg hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side — Currency + Lang + Contact */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 
                           hover:text-gold border border-white/10 rounded-lg 
                           hover:border-gold/30 transition-all"
              >
                <span>{CURRENCIES.find((c) => c.code === selectedCurrency)?.flag}</span>
                <span className="hidden sm:inline">{selectedCurrency}</span>
              </button>

              <AnimatePresence>
                {currencyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 w-40 p-1 rounded-xl 
                               bg-dark-card border border-white/10 backdrop-blur-xl shadow-2xl"
                  >
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setSelectedCurrency(c.code);
                          setCurrencyOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                          ${selectedCurrency === c.code
                            ? "bg-gold/10 text-gold"
                            : "text-gray-300 hover:bg-white/5"
                          }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.code}</span>
                        <span className="text-gray-500 ml-auto">{c.symbol}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Phone */}
            <a
              href="tel:+971501564849"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 
                         hover:text-gold border border-white/10 rounded-lg hover:border-gold/30 transition-all"
            >
              📞 +971 50 156 4849
            </a>

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
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm text-gray-300 hover:text-gold 
                             hover:bg-white/5 rounded-xl transition-all"
                >
                  {item.label}
                </Link>
              ))}
              <hr className="border-white/10 my-2" />
              <a
                href="tel:+971501564849"
                className="flex items-center gap-2 px-4 py-3 text-sm text-gold"
              >
                📞 +971 50 156 4849
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
