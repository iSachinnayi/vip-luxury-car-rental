// ═══════════════════════════════════════════════
//  Currency — Shared currency config
// ═══════════════════════════════════════════════

export const CURRENCIES: Record<string, { symbol: string; flag: string; rate: number }> = {
  AED: { symbol: "AED", flag: "🇦🇪", rate: 1 },
  USD: { symbol: "$", flag: "🇺🇸", rate: 0.27 },
  EUR: { symbol: "€", flag: "🇪🇺", rate: 0.25 },
  GBP: { symbol: "£", flag: "🇬🇧", rate: 0.21 },
  RUB: { symbol: "₽", flag: "🇷🇺", rate: 24.5 },
  INR: { symbol: "₹", flag: "🇮🇳", rate: 22.5 },
  SAR: { symbol: "SAR", flag: "🇸🇦", rate: 1.02 },
};

export function getCurrencyCode(): string {
  if (typeof window === "undefined") return "AED";
  return localStorage.getItem("vip_currency") || "AED";
}

export function getCurrencySymbol(): string {
  return CURRENCIES[getCurrencyCode()]?.symbol || "د.إ";
}

export function getCurrencyRate(): number {
  return CURRENCIES[getCurrencyCode()]?.rate || 1;
}

export function formatPrice(priceAED: number): string {
  const rate = getCurrencyRate();
  const symbol = getCurrencySymbol();
  const converted = Math.round(priceAED * rate);
  return `${symbol}${converted.toLocaleString()}`;
}
