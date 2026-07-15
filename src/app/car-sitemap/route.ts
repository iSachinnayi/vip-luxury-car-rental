// Car Sitemap — 109 car detail pages with image tags
import { NextResponse } from "next/server";
import { getAllCars } from "@/lib/cars";
import { getCarImages } from "@/lib/images";

const BASE = "https://vipluxurycarrental.com";
const DATE = "2026-07-08";

function esc(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

export async function GET() {
  const cars = getAllCars();
  let urls = "";

  for (const car of cars) {
    if (!car.slug) continue;
    const enUrl = `${BASE}/car/${car.slug}/`;
    const arUrl = `${BASE}/ar/car/${car.slug}/`;

    // Get images
    const ci = getCarImages(car.id);
    const imgs = new Set<string>();
    if (ci.thumbnail) imgs.add(esc(`${BASE}${ci.thumbnail}`));
    for (const g of ci.gallery) {
      if (g && imgs.size < 10) imgs.add(esc(`${BASE}${g}`));
    }

    let imagesXml = "";
    for (const img of imgs) {
      imagesXml += `    <image:image><image:loc>${img}</image:loc></image:image>\n`;
    }

    urls += `  <url>
    <loc>${esc(enUrl)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${esc(enUrl)}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${esc(arUrl)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(enUrl)}"/>
    ${imagesXml}    <lastmod>${DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
