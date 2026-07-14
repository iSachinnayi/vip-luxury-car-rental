"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const CURRENCY_MAP: Record<string, { symbol: string; flag: string; rate: number }> = {
  AED: { symbol: "AED", flag: "🇦🇪", rate: 1 },
  USD: { symbol: "$", flag: "🇺🇸", rate: 0.27 },
  EUR: { symbol: "€", flag: "🇪🇺", rate: 0.25 },
  GBP: { symbol: "£", flag: "🇬🇧", rate: 0.21 },
  RUB: { symbol: "₽", flag: "🇷🇺", rate: 24.5 },
  INR: { symbol: "₹", flag: "🇮🇳", rate: 22.5 },
  SAR: { symbol: "SAR", flag: "🇸🇦", rate: 1.02 },
};

interface CurrencyCtx {
  code: string;
  symbol: string;
  rate: number;
  setCurrency: (code: string) => void;
  allCurrencies: typeof CURRENCY_MAP;
  fmt: (v: number) => string;
}

const CurrencyContext = createContext<CurrencyCtx>({
  code: "AED", symbol: "AED", rate: 1,
  setCurrency: () => {},
  allCurrencies: CURRENCY_MAP,
  fmt: (v) => v.toFixed(2),
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState("AED");

  useEffect(() => {
    const saved = localStorage.getItem("vip_currency");
    if (saved && CURRENCY_MAP[saved]) setCode(saved);
  }, []);

  const setCurrency = (c: string) => {
    if (!CURRENCY_MAP[c]) return;
    setCode(c);
    localStorage.setItem("vip_currency", c);
  };

  const c = CURRENCY_MAP[code] || CURRENCY_MAP.AED;
  const fmt = (v: number) => (v * c.rate).toFixed(2);

  return (
    <CurrencyContext.Provider value={{ code, symbol: c.symbol, rate: c.rate, setCurrency, allCurrencies: CURRENCY_MAP, fmt }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

// ─── Currency Symbol Component ──────────────
// Renders official SVG for AED, text symbol for others
export function CurrencySymbol({ size = 12, className }: { size?: number; className?: string }) {
  const { symbol } = useCurrency();
  return <span className={className} style={{ display: "inline-block", verticalAlign: "middle", fontWeight: 600 }}>{symbol}</span>;
}
