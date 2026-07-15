// Page Sitemap — Core static pages
import { NextResponse } from "next/server";

const BASE = "https://vipluxurycarrental.com";
const DATE = "2026-07-08";

function esc(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

const PAGES: { path: string; priority: number; freq: string }[] = [
  { path: "/", priority: 1.0, freq: "weekly" },
  { path: "/all-cars/", priority: 0.9, freq: "daily" },
  { path: "/brand/", priority: 0.6, freq: "weekly" },
  { path: "/about/", priority: 0.5, freq: "monthly" },
  { path: "/contact/", priority: 0.5, freq: "monthly" },
  { path: "/faq/", priority: 0.5, freq: "monthly" },
];

export async function GET() {
  let urls = "";

  for (const page of PAGES) {
    const enUrl = `${BASE}${page.path}`;
    const arUrl = `${BASE}/ar${page.path}`;

    urls += `  <url>
    <loc>${esc(enUrl)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${esc(enUrl)}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${esc(arUrl)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(enUrl)}"/>
    <lastmod>${DATE}</lastmod>
    <changefreq>${page.freq}</changefreq>
    <priority>${page.priority}</priority>
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
