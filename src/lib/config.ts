// ═══════════════════════════════════════════════
//  App Config — Centralized constants
//  Single source of truth for site-wide config
// ═══════════════════════════════════════════════

export const APP_CONFIG = {
  // WhatsApp
  WA_PHONE: process.env.NEXT_PUBLIC_WA_PHONE || "971501564849",
  WA_URL: "https://wa.me",

  // Site
  SITE_NAME: "VIP Luxury Car Rental Dubai",
  BASE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://vipluxurycarrental.com",

  // Business
  EMAIL: "booking@vipluxurycarrental.com",
  PHONE: "+971501564849",
} as const;
