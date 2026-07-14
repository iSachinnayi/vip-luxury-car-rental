// ═══════════════════════════════════════════════
//  Robots.txt — Modern, AI-Supportive
//  Strategy:
//    ✅ INDEX: All public pages (home, cars, brands,
//       categories, contact, privacy, terms)
//    🚫 NO INDEX: API routes, booking/checkout pages
//    🤖 AI bots: Explicitly allowed (AI search,
//       training, and indexing)
//    🗺️ Sitemap: Linked for complete coverage
// ═══════════════════════════════════════════════

import type { MetadataRoute } from "next";

const BASE_URL = "https://vipluxurycarrental.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // ── All bots: search engines, AI crawlers, aggregators ──
        // Allow full site access except API and booking pages
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",      // API endpoints — no SEO value
          "/booking/",  // Booking/checkout — transactional, not content
        ],
        // Polite crawl delay — be nice to servers
        crawlDelay: 1,
      },
    ],
    // Point to the comprehensive sitemap with all 200+ URLs
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
