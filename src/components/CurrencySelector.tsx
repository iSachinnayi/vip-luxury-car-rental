// ═══════════════════════════════════════════════
//  CurrencySelector — Switch between 7 currencies
//  Features: click-outside-close, keyboard nav,
//  grouped by region, persistent via localStorage
// ═══════════════════════════════════════════════

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/lib/CurrencyContext";

// ─── Currency groups for visual hierarchy ─────
const CURRENCY_GROUPS = [
  {
    label: "Major",
    codes: ["AED", "USD", "EUR", "GBP"],
  },
  {
    label: "Other",
    codes: ["RUB", "INR", "SAR"],
  },
];

export default function CurrencySelector() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const {
    code: selectedCode,
    setCurrency: handleCurrencyChange,
    allCurrencies,
  } = useCurrency();

  const currencies = allCurrencies as Record<
    string,
    { symbol: string; flag: string; rate: number }
  >;
  const selected = currencies[selectedCode];

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

  // ─── Select currency ──────────────────────────
  const selectCurrency = useCallback(
    (e: React.MouseEvent, code: string) => {
      e.preventDefault();
      e.stopPropagation();
      handleCurrencyChange(code);
      setOpen(false);
    },
    [handleCurrencyChange]
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
        aria-label="Select currency"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-base leading-none">{selected?.flag || "🇦🇪"}</span>
        <span className="hidden sm:inline text-xs font-medium tracking-wide">
          {selected?.symbol || "AED"}
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
            className="absolute right-0 top-full mt-2 w-48 p-1.5 rounded-xl 
                       bg-dark-card/95 border border-white/10 backdrop-blur-xl 
                       shadow-2xl shadow-black/50 z-50"
            role="listbox"
            aria-label="Select currency"
          >
            {CURRENCY_GROUPS.map((group) => (
              <div key={group.label}>
                {/* Group label */}
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
                  {group.label}
                </div>

                {group.codes.map((code, i) => {
                  const c = currencies[code];
                  if (!c) return null;
                  const isActive = selectedCode === code;

                  return (
                    <button
                      key={code}
                      onClick={(e) => selectCurrency(e, code)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          selectCurrency(e as any, code);
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
                      `}
                    >
                      {/* Flag */}
                      <span className="text-lg leading-none shrink-0">{c.flag}</span>

                      {/* Code + Name */}
                      <div className="flex flex-col items-start leading-tight min-w-0">
                        <span
                          className={`font-medium ${
                            isActive ? "text-gold" : "text-gray-200"
                          }`}
                        >
                          {code}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {code === "AED"
                            ? "UAE Dirham"
                            : code === "USD"
                            ? "US Dollar"
                            : code === "EUR"
                            ? "Euro"
                            : code === "GBP"
                            ? "British Pound"
                            : code === "RUB"
                            ? "Russian Ruble"
                            : code === "INR"
                            ? "Indian Rupee"
                            : code === "SAR"
                            ? "Saudi Riyal"
                            : c.symbol}
                        </span>
                      </div>

                      {/* Symbol */}
                      <span
                        className={`ml-auto text-xs font-mono
                          ${isActive ? "text-gold/70" : "text-gray-500"}
                        `}
                      >
                        {c.symbol}
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

                {/* Separator between groups */}
                {group.label === "Major" && (
                  <div className="my-1 mx-3 border-t border-white/5" />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
