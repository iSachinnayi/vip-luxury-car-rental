// Brand Sitemap — Brand landing + category pages
import { NextRequest, NextResponse } from "next/server";
import { getAllBrands, getAllTypes } from "@/lib/cars";
import { sitemapHtmlTable } from "@/lib/sitemap-html";

const BASE = "https://vipluxurycarrental.com";
const DATE = "2026-07-08";

function esc(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

const BRAND_SLUG: Record<string, string> = {
  Lamborghini: "rent-lamborghini-in-dubai", Ferrari: "rent-ferrari-in-dubai",
  "Rolls Royce": "rent-rolls-royce-in-dubai", Bentley: "rent-bentley-in-dubai",
  Porsche: "rent-porsche-in-dubai", Mercedes: "rent-mercedes-in-dubai",
  BMW: "rent-bmw-in-dubai", Audi: "rent-audi-in-dubai",
  "Range Rover": "rent-range-rover-in-dubai", Nissan: "rent-nissan-in-dubai",
  Chevrolet: "rent-chevrolet-in-dubai", McLaren: "rent-mclaren-in-dubai",
  Cadillac: "rent-cadillac-in-dubai", GMC: "rent-gmc-in-dubai",
  Toyota: "rent-toyota-in-dubai", Volkswagen: "rent-volkswagen-in-dubai",
  "Mini Cooper": "rent-mini-cooper-in-dubai",
};
const TYPE_SLUG: Record<string, string> = {
  Sports: "sports-car-rental-in-dubai", Luxury: "luxury-car-rental-in-dubai", SUV: "suv-car-rental-in-dubai",
};

export async function GET(request: NextRequest) {
  const accept = request.headers.get("accept") || "";
  const isBrowser = accept.includes("text/html");
  const allBrands = getAllBrands();
  const allTypes = getAllTypes().filter(Boolean) as string[];

  const entries: { url: string; arUrl: string }[] = [];

  for (const brand of allBrands) {
    const slug = BRAND_SLUG[brand];
    if (slug) entries.push({ url: `${BASE}/${slug}/`, arUrl: `${BASE}/ar/${slug}/` });
  }
  for (const type of allTypes) {
    const slug = TYPE_SLUG[type];
    if (slug) entries.push({ url: `${BASE}/${slug}/`, arUrl: `${BASE}/ar/${slug}/` });
  }

  if (isBrowser) {
    return new NextResponse(sitemapHtmlTable({
      title: "Brand Sitemap",
      description: "This XML Sitemap contains brand landing and category pages for VIP Luxury Car Rental Dubai.",
      columns: ["URL", "Last Mod."],
      rows: entries.map((e) => ({
        cells: [
          `<a class="url-link" href="${esc(e.url)}" target="_blank">${esc(e.url)}</a>`,
          DATE,
        ],
      })),
    }), { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  let urls = "";
  for (const e of entries) {
    urls += `  <url>
    <loc>${esc(e.url)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${esc(e.url)}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${esc(e.arUrl)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(e.url)}"/>
    <lastmod>${DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}</urlset>`,
    { status: 200, headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } }
  );
}
