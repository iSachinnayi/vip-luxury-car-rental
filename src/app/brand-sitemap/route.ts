// Brand Sitemap — Brand landing + category pages
import { NextResponse } from "next/server";
import { getAllBrands, getAllTypes } from "@/lib/cars";

const BASE = "https://vipluxurycarrental.com";
const DATE = "2026-07-08";

function esc(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

const BRAND_SLUG: Record<string, string> = {
  Lamborghini: "rent-lamborghini-in-dubai",
  Ferrari: "rent-ferrari-in-dubai",
  "Rolls Royce": "rent-rolls-royce-in-dubai",
  Bentley: "rent-bentley-in-dubai",
  Porsche: "rent-porsche-in-dubai",
  Mercedes: "rent-mercedes-in-dubai",
  BMW: "rent-bmw-in-dubai",
  Audi: "rent-audi-in-dubai",
  "Range Rover": "rent-range-rover-in-dubai",
  Nissan: "rent-nissan-in-dubai",
  Chevrolet: "rent-chevrolet-in-dubai",
  McLaren: "rent-mclaren-in-dubai",
  Cadillac: "rent-cadillac-in-dubai",
  GMC: "rent-gmc-in-dubai",
  Toyota: "rent-toyota-in-dubai",
  Volkswagen: "rent-volkswagen-in-dubai",
  "Mini Cooper": "rent-mini-cooper-in-dubai",
};

const TYPE_SLUG: Record<string, string> = {
  Sports: "sports-car-rental-in-dubai",
  Luxury: "luxury-car-rental-in-dubai",
  SUV: "suv-car-rental-in-dubai",
};

export async function GET() {
  const allBrands = getAllBrands();
  const allTypes = getAllTypes().filter(Boolean) as string[];
  let urls = "";

  // Brand landing pages
  for (const brand of allBrands) {
    const slug = BRAND_SLUG[brand];
    if (!slug) continue;
    const enUrl = `${BASE}/${slug}/`;
    const arUrl = `${BASE}/ar/${slug}/`;
    urls += `  <url>
    <loc>${esc(enUrl)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${esc(enUrl)}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${esc(arUrl)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(enUrl)}"/>
    <lastmod>${DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  // Category pages
  for (const type of allTypes) {
    const slug = TYPE_SLUG[type];
    if (!slug) continue;
    const enUrl = `${BASE}/${slug}/`;
    const arUrl = `${BASE}/ar/${slug}/`;
    urls += `  <url>
    <loc>${esc(enUrl)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${esc(enUrl)}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${esc(arUrl)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(enUrl)}"/>
    <lastmod>${DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
