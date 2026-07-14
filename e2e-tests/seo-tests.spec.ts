// ═══════════════════════════════════════════════
//  SEO & Schema Tests — EN + AR
//  Verifies meta tags, hreflang, JSON-LD schemas
// ═══════════════════════════════════════════════

import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

const SSR_PAGES = [
  { path: "/", titleHint: "Premium Luxury" },
  { path: "/about/", titleHint: "About" },
  { path: "/privacy/", titleHint: "Privacy" },
  { path: "/terms/", titleHint: "Terms" },
  { path: "/car/lamborghini-urus/", titleHint: "Lamborghini Urus" },
  { path: "/rent-lamborghini-in-dubai/", titleHint: "Lamborghini" },
  { path: "/location/dubai/", titleHint: "Dubai" },
];

for (const page of SSR_PAGES) {
  test(`[Meta] ${page.path} has correct meta`, async ({ page: p }) => {
    await p.goto(`${BASE}${page.path}`);
    await p.waitForLoadState("networkidle");
    expect(await p.title()).toContain(page.titleHint);
  });
}

for (const page of SSR_PAGES) {
  test(`[AR] /ar${page.path} loads`, async ({ page: p }) => {
    await p.goto(`${BASE}/ar${page.path}`);
    await p.waitForLoadState("networkidle");
    expect((await p.title()).length).toBeGreaterThan(5);
  });
}

test("[Hreflang] Homepage alternates", async ({ page: p }) => {
  await p.goto(`${BASE}/`);
  const langs = await p.$$eval('link[rel="alternate"][hreflang]', (ls) =>
    ls.map((l) => l.getAttribute("hreflang"))
  );
  expect(langs).toContain("en");
  expect(langs).toContain("ar");
  expect(langs).toContain("x-default");
});

test("[Schema] Organization exists", async ({ page: p }) => {
  await p.goto(`${BASE}/`);
  const scripts = await p.$$eval('script[type="application/ld+json"]', (ss) =>
    ss.map((s) => JSON.parse(s.textContent || "{}"))
  );
  expect(scripts.some((s) => JSON.stringify(s).includes("Organization"))).toBeTruthy();
});

test("[Schema] Breadcrumb on car page", async ({ page: p }) => {
  await p.goto(`${BASE}/car/lamborghini-urus/`);
  const scripts = await p.$$eval('script[type="application/ld+json"]', (ss) =>
    ss.map((s) => JSON.parse(s.textContent || "{}"))
  );
  expect(scripts.some((s) => s["@type"] === "BreadcrumbList")).toBeTruthy();
});

test("[SEO] robots.txt", async ({ page: p }) => {
  const res = await p.goto(`${BASE}/robots.txt`);
  expect(res?.status()).toBe(200);
  expect(await res!.text()).toContain("Sitemap");
});

test("[SEO] sitemap.xml", async ({ page: p }) => {
  const res = await p.goto(`${BASE}/sitemap.xml`);
  expect(res?.status()).toBe(200);
  expect(await res!.text()).toContain("urlset");
});

test("[AR] /ru/ returns 404", async ({ page: p }) => {
  const res = await p.goto(`${BASE}/ru/`);
  expect(res?.status()).toBe(404);
});
