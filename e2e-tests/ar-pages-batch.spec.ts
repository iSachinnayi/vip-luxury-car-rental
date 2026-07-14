// ═══════════════════════════════════════════════
//  Comprehensive AR Pages Test — sitemap + booking
//  + extra routes. Covers ALL ~309 AR pages.
// ═══════════════════════════════════════════════

import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test("[AR Batch] Verify ALL AR pages: sitemap + booking + extra", async ({ page: p }) => {
  // ── 1. Fetch sitemap.xml & parse AR URLs ──
  const resp = await p.request.get(`${BASE}/sitemap.xml`);
  expect(resp.ok()).toBe(true);

  const xml = await resp.text();
  const sitemapArUrls: string[] = [];

  const locRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
  let match: RegExpExecArray | null;
  while ((match = locRegex.exec(xml)) !== null) {
    const url = match[1];
    if (url.includes("/ar/")) {
      sitemapArUrls.push(url);
    }
  }

  // ── 2. Generate booking page AR URLs ──
  // Car slugs from sitemap EN car detail pages
  const allCarSlugs: string[] = [];
  const carRegex = /<loc>https?:\/\/[^/]+\/car\/([^/]+)\/<\/loc>/g;
  while ((match = carRegex.exec(xml)) !== null) {
    const slug = match[1];
    if (slug && !allCarSlugs.includes(slug)) allCarSlugs.push(slug);
  }

  const bookingArUrls = allCarSlugs.map((slug) => `${BASE}/ar/booking/${slug}/`);

  // ── 3. Extra AR routes not in sitemap ──
  // (not-found is Next.js internal — no direct AR URL)
  const extraArUrls: string[] = [];

  const allArUrls = [
    ...sitemapArUrls.map((u) => u.replace(/https?:\/\/[^/]+/, BASE)),
    ...bookingArUrls,
    ...extraArUrls,
  ];

  // Remove duplicates (just in case)
  const uniqueArUrls = [...new Set(allArUrls)];

  console.log(`\n📋 Sitemap AR URLs: ${sitemapArUrls.length}`);
  console.log(`📋 Booking AR URLs: ${bookingArUrls.length}`);
  console.log(`📋 Extra AR URLs:   ${extraArUrls.length}`);
  console.log(`📋 TOTAL AR URLs:   ${uniqueArUrls.length}`);
  console.log(`📋 EN car slugs:    ${allCarSlugs.length}`);
  console.log(`📋 EN + AR total:   ${sitemapArUrls.length * 2 + bookingArUrls.length + extraArUrls.length} page views\n`);

  expect(uniqueArUrls.length).toBeGreaterThanOrEqual(300);

  // ── 4. Test all AR URLs ──
  const BATCH_SIZE = 10;
  const failures: { url: string; reason: string }[] = [];
  const results: { url: string; status: number; titleLen: number }[] = [];

  for (let i = 0; i < uniqueArUrls.length; i += BATCH_SIZE) {
    const batch = uniqueArUrls.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (url) => {
        try {
          const res = await p.request.get(url, { timeout: 15000 });

          if (!res.ok()) {
            return { url, status: res.status(), titleLen: 0, fail: `${url} → ${res.status()}` };
          }

          const body = await res.text();
          const titleLen = (body.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1]?.length || 0;

          if (titleLen === 0) {
            return { url, status: res.status(), titleLen: 0, fail: `${url} → no <title>` };
          }

          return { url, status: res.status(), titleLen, fail: null };
        } catch (err: any) {
          return { url, status: 0, titleLen: 0, fail: `${url} → ${err.message}` };
        }
      })
    );

    for (const r of batchResults) {
      if (r.fail) failures.push({ url: r.url, reason: r.fail });
      results.push({ url: r.url, status: r.status, titleLen: r.titleLen });
    }

    const passed = batchResults.filter((r) => !r.fail).length;
    console.log(`  Progress: ${Math.min(i + BATCH_SIZE, uniqueArUrls.length)}/${uniqueArUrls.length} (${passed}/${batch.length} OK)`);
  }

  // ── 5. Summary ──
  const passed = results.filter((r) => r.status === 200 && r.titleLen > 0).length;

  console.log(`\n═══════════════════════════════════════════`);
  console.log(`  ✅ Passed: ${passed}/${uniqueArUrls.length}`);
  console.log(`  ❌ Failed: ${failures.length}/${uniqueArUrls.length}`);
  console.log(`═══════════════════════════════════════════\n`);

  if (failures.length > 0) {
    console.log("Failures:");
    failures.forEach((f) => console.log(`  ❌ ${f.reason}`));
  }

  expect(failures.length).toBe(0);
});
