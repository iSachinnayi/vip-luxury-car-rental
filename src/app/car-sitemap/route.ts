// Car Sitemap — 109 car detail pages with image tags
import { NextRequest, NextResponse } from "next/server";
import { getAllCars } from "@/lib/cars";
import { getCarImages } from "@/lib/images";
import { sitemapHtmlTable } from "@/lib/sitemap-html";

const BASE = "https://vipluxurycarrental.com";
const DATE = "2026-07-08";

function esc(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

export async function GET(request: NextRequest) {
  const cars = getAllCars();
  const accept = request.headers.get("accept") || "";
  const isBrowser = accept.includes("text/html");

  const entries: { url: string; arUrl: string; imgs: string[]; title: string }[] = [];
  for (const car of cars) {
    if (!car.slug) continue;
    const ci = getCarImages(car.id);
    const imgs: string[] = [];
    if (ci.thumbnail) imgs.push(`${BASE}${ci.thumbnail}`);
    for (const g of ci.gallery) {
      if (g && imgs.length < 10 && !imgs.includes(`${BASE}${g}`)) imgs.push(`${BASE}${g}`);
    }
    entries.push({ url: `${BASE}/car/${car.slug}/`, arUrl: `${BASE}/ar/car/${car.slug}/`, imgs, title: car.title });
  }

  if (isBrowser) {
    return new NextResponse(sitemapHtmlTable({
      title: "Car Sitemap",
      description: "This XML Sitemap contains car detail pages for VIP Luxury Car Rental Dubai.",
      columns: ["URL", "Images", "Last Mod."],
      rows: entries.map((e) => ({
        cells: [
          `<a class="url-link" href="${esc(e.url)}" target="_blank">${esc(e.url)}</a>`,
          e.imgs.length > 0 ? `<span class="badge badge-imgs">${e.imgs.length} image${e.imgs.length > 1 ? "s" : ""}</span>` : "—",
          DATE,
        ],
      })),
    }), { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  let urls = "";
  for (const e of entries) {
    let imagesXml = "";
    for (const img of e.imgs) imagesXml += `    <image:image><image:loc>${esc(img)}</image:loc></image:image>\n`;
    urls += `  <url>
    <loc>${esc(e.url)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${esc(e.url)}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${esc(e.arUrl)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(e.url)}"/>
    ${imagesXml}    <lastmod>${DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }

  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}</urlset>`,
    { status: 200, headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } }
  );
}
