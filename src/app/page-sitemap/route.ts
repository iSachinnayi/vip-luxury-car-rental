// Page Sitemap — Core static pages
import { NextRequest, NextResponse } from "next/server";
import { sitemapHtmlTable } from "@/lib/sitemap-html";

const BASE = "https://vipluxurycarrental.com";
const DATE = "2026-07-08";

function esc(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

const PAGES = [
  { path: "/", priority: 1.0, freq: "weekly" },
  { path: "/all-cars/", priority: 0.9, freq: "daily" },
  { path: "/brand/", priority: 0.6, freq: "weekly" },
  { path: "/about/", priority: 0.5, freq: "monthly" },
  { path: "/contact/", priority: 0.5, freq: "monthly" },
  { path: "/faq/", priority: 0.5, freq: "monthly" },
];

export async function GET(request: NextRequest) {
  const accept = request.headers.get("accept") || "";
  const isBrowser = accept.includes("text/html");

  const entries = PAGES.map((p) => ({
    url: `${BASE}${p.path}`,
    arUrl: `${BASE}/ar${p.path}`,
    priority: p.priority,
  }));

  if (isBrowser) {
    return new NextResponse(sitemapHtmlTable({
      title: "Page Sitemap",
      description: "This XML Sitemap contains core pages for VIP Luxury Car Rental Dubai.",
      columns: ["URL", "Priority", "Last Mod."],
      rows: entries.map((e) => ({
        cells: [
          `<a class="url-link" href="${esc(e.url)}">${esc(e.url)}</a>`,
          `<span class="priority">${e.priority}</span>`,
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
    <priority>${e.priority}</priority>
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
