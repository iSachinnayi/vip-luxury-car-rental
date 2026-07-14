// ═══════════════════════════════════════════════
//  Accessibility Tests (simplified)
// ═══════════════════════════════════════════════

import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test("[a11y] EN pages have heading", async ({ page: p }) => {
  await p.goto(`${BASE}/about/`);
  await p.waitForLoadState("networkidle");
  await p.waitForTimeout(2000);
  expect(await p.locator("h1").count()).toBeGreaterThanOrEqual(1);
});

test("[a11y] AR pages have heading", async ({ page: p }) => {
  await p.goto(`${BASE}/ar/about/`);
  await p.waitForLoadState("networkidle");
  await p.waitForTimeout(2000);
  expect(await p.locator("h1").count()).toBeGreaterThanOrEqual(1);
});

test("[a11y] Car page images have alt text", async ({ page: p }) => {
  await p.goto(`${BASE}/car/lamborghini-urus/`);
  await p.waitForLoadState("networkidle");
  await p.waitForTimeout(2000);
  expect(await p.locator("img[alt]").count()).toBeGreaterThan(0);
});

test("[a11y] Site has nav landmarks", async ({ page: p }) => {
  await p.goto(`${BASE}/about/`);
  await p.waitForLoadState("networkidle");
  await p.waitForTimeout(1000);
  expect(await p.locator("nav").count()).toBeGreaterThanOrEqual(1);
});

test("[a11y] AR page has RTL elements", async ({ page: p }) => {
  await p.goto(`${BASE}/ar/`);
  await p.waitForLoadState("networkidle");
  await p.waitForTimeout(3000);
  expect(await p.locator('[dir="rtl"]').count()).toBeGreaterThanOrEqual(1);
});

test("[a11y] Booking page has interactive elements", async ({ page: p }) => {
  await p.goto(`${BASE}/booking/lamborghini-urus/`);
  await p.waitForLoadState("networkidle");
  await p.waitForTimeout(2000);
  expect(await p.locator("a, button").count()).toBeGreaterThan(5);
});
