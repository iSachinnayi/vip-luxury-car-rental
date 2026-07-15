// Sitemap Index — like RankMath's sitemap_index.xml
// Lists all sub-sitemaps with last modified dates
import { NextResponse } from "next/server";

const BASE = "https://vipluxurycarrental.com";

function xmlEscape(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

export async function GET() {
  const date = "2026-07-08";
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${BASE}/car-sitemap</loc><lastmod>${date}</lastmod></sitemap>
  <sitemap><loc>${BASE}/page-sitemap</loc><lastmod>${date}</lastmod></sitemap>
  <sitemap><loc>${BASE}/location-sitemap</loc><lastmod>${date}</lastmod></sitemap>
  <sitemap><loc>${BASE}/brand-sitemap</loc><lastmod>${date}</lastmod></sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
