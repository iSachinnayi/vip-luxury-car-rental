// Location Sitemap — Emirates + brand/category sub-pages
import { NextResponse } from "next/server";
import { getAllBrands, getAllTypes } from "@/lib/cars";
import { getEmirateSlugs } from "@/lib/emirates";

const BASE = "https://vipluxurycarrental.com";
const DATE = "2026-07-08";

function esc(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

export async function GET() {
  const allBrands = getAllBrands();
  const allTypes = getAllTypes().filter(Boolean) as string[];
  const emirates = getEmirateSlugs();
  let urls = "";

  // Emirates main pages
  for (const emirate of emirates) {
    const enUrl = `${BASE}/location/${emirate}/`;
    const arUrl = `${BASE}/ar/location/${emirate}/`;
    urls += `  <url>
    <loc>${esc(enUrl)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${esc(enUrl)}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${esc(arUrl)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(enUrl)}"/>
    <lastmod>${DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }

  // Brand + category sub-pages per emirate
  for (const emirate of emirates) {
    for (const brand of allBrands) {
      const slug = `rent-${brand.toLowerCase().replace(/\s+/g, "-")}`;
      const enUrl = `${BASE}/location/${emirate}/${slug}/`;
      const arUrl = `${BASE}/ar/location/${emirate}/${slug}/`;
      urls += `  <url>
    <loc>${esc(enUrl)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${esc(enUrl)}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${esc(arUrl)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(enUrl)}"/>
    <lastmod>${DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
`;
    }
    for (const type of allTypes) {
      const slug = `${type.toLowerCase()}-car-rental`;
      const enUrl = `${BASE}/location/${emirate}/${slug}/`;
      const arUrl = `${BASE}/ar/location/${emirate}/${slug}/`;
      urls += `  <url>
    <loc>${esc(enUrl)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${esc(enUrl)}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${esc(arUrl)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(enUrl)}"/>
    <lastmod>${DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
`;
    }
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
