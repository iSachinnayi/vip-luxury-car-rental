// Location Sitemap — Emirates + brand/category sub-pages
import { NextRequest, NextResponse } from "next/server";
import { getAllBrands, getAllTypes } from "@/lib/cars";
import { getEmirateSlugs } from "@/lib/emirates";
import { sitemapHtmlTable } from "@/lib/sitemap-html";

const BASE = "https://vipluxurycarrental.com";
const DATE = "2026-07-08";

function esc(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

export async function GET(request: NextRequest) {
  const accept = request.headers.get("accept") || "";
  const isBrowser = accept.includes("text/html");
  const allBrands = getAllBrands();
  const allTypes = getAllTypes().filter(Boolean) as string[];
  const emirates = getEmirateSlugs();

  const entries: { url: string; arUrl: string }[] = [];

  for (const emirate of emirates) {
    entries.push({ url: `${BASE}/location/${emirate}/`, arUrl: `${BASE}/ar/location/${emirate}/` });
  }
  for (const emirate of emirates) {
    for (const brand of allBrands) {
      const slug = `rent-${brand.toLowerCase().replace(/\s+/g, "-")}`;
      entries.push({ url: `${BASE}/location/${emirate}/${slug}/`, arUrl: `${BASE}/ar/location/${emirate}/${slug}/` });
    }
    for (const type of allTypes) {
      const slug = `${type.toLowerCase()}-car-rental`;
      entries.push({ url: `${BASE}/location/${emirate}/${slug}/`, arUrl: `${BASE}/ar/location/${emirate}/${slug}/` });
    }
  }

  if (isBrowser) {
    return new NextResponse(sitemapHtmlTable({
      title: "Location Sitemap",
      description: "This XML Sitemap contains location pages for VIP Luxury Car Rental Dubai.",
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
    <priority>0.5</priority>
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
