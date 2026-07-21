// ═══════════════════════════════════════════════
//  Robots.txt — Modern, AI-Supportive
//  Complies with Google guidelines + AI crawler best practices
//
//  Strategy:
//    ✅ INDEX: All public pages (home, cars, brands,
//       locations, categories, about, faq, contact)
//    🚫 NO INDEX: API routes, booking/checkout, admin
//    🤖 AI crawlers: Allowed (AI search visibility)
//    🗺️ Sitemap: Linked for complete coverage
//
//  Note: Crawl-delay is NOT used for Googlebot
//  (Google ignores it). Only applied to generic * rules.
// ═══════════════════════════════════════════════

import type { MetadataRoute } from "next";

const BASE_URL = "https://vipluxurycarrental.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Googlebot: no crawl-delay (not supported) ──
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/booking/", "/admin/", "/_next/static/"],
      },
      // ── Googlebot-Image: allow all images ──
      {
        userAgent: "Googlebot-Image",
        allow: "/api/images/",
      },
      // ── AI / search crawlers (explicitly allowed for visibility) ──
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/", "/booking/", "/admin/", "/_next/static/"],
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: ["/api/", "/booking/", "/admin/", "/_next/static/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/", "/booking/", "/admin/", "/_next/static/"],
      },
      // ── All other bots (Bing, Yandex, etc.) ──
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/booking/", "/admin/", "/_next/static/"],
        crawlDelay: 1,
      },
    ],
    sitemap: `${BASE_URL}/sitemap-index/`,
  };
}
