// ═══════════════════════════════════════════════
//  Booking Flow E2E Tests
// ═══════════════════════════════════════════════

import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";
const SLUG = "lamborghini-urus";

// ──  Homepage → Book Now flow  ────────────────

test("[Booking] EN: Book Now from CarCard goes to booking page", async ({ page: p }) => {
  await p.goto(`${BASE}/all-cars/`);
  await p.waitForLoadState("networkidle");
  await p.waitForTimeout(3000);

  // Wait for car cards to render, then click first "Book Now"
  await p.waitForSelector(`a[href*="/booking/"]`, { timeout: 15000 });
  const bookNow = p.locator(`a[href*="/booking/"]`).first();
  await bookNow.scrollIntoViewIfNeeded();
  await bookNow.click({ force: true });
  await p.waitForURL(/\/booking\//, { timeout: 15000 });
  expect(p.url()).toContain("/booking/");
});

test("[Booking] AR: Book Now from CarCard goes to AR booking page", async ({ page: p }) => {
  await p.goto(`${BASE}/ar/all-cars/`);
  await p.waitForLoadState("networkidle");
  await p.waitForTimeout(3000);

  // Wait for car cards to render, then click first "Book Now"
  await p.waitForSelector(`a[href*="/booking/"]`, { timeout: 15000 });
  const bookNow = p.locator(`a[href*="/booking/"]`).first();
  await bookNow.scrollIntoViewIfNeeded();
  await bookNow.click({ force: true });
  await p.waitForURL(/\/ar\/booking\//, { timeout: 15000 });
  expect(p.url()).toContain("/ar/booking/");
});

// ──  Direct booking page access  ──────────────

test("[Booking] EN: Direct booking page has form sections", async ({ page: p }) => {
  await p.goto(`${BASE}/booking/${SLUG}/`);
  await p.waitForLoadState("networkidle");
  await p.waitForTimeout(2000);

  // Has contact fields (name, phone, email inputs)
  const inputs = await p.locator('input[type="text"], input[type="tel"], input[type="email"]').count();
  expect(inputs).toBeGreaterThanOrEqual(3);

  // Has booking summary sidebar / total
  const pageText = await p.locator("body").innerText();
  expect(pageText).toMatch(/total|aed|deposit|submit|confirm|book/i);
});

test("[Booking] AR: Direct booking page has RTL + form sections", async ({ page: p }) => {
  await p.goto(`${BASE}/ar/booking/${SLUG}/`);
  await p.waitForLoadState("networkidle");
  await p.waitForTimeout(2000);

  // RTL attribute
  expect(await p.locator('[dir="rtl"]').count()).toBeGreaterThanOrEqual(1);

  const inputs = await p.locator('input[type="text"], input[type="tel"], input[type="email"]').count();
  expect(inputs).toBeGreaterThanOrEqual(3);
});

// ──  Booking with pre-filled params  ──────────

test("[Booking] Params pre-fill location fields", async ({ page: p }) => {
  await p.goto(`${BASE}/booking/${SLUG}/?pickup=Dubai&drop=Abu%20Dhabi`);
  await p.waitForLoadState("networkidle");
  await p.waitForTimeout(2000);

  // The page should reflect pick-up/drop locations
  const body = await p.locator("body").innerText();
  expect(body).toMatch(/dubai/i);
  expect(body).toMatch(/abu dhabi/i);
});

// ──  WhatsApp booking link exists  ────────────

test("[Booking] Booking page has WhatsApp and Call buttons", async ({ page: p }) => {
  await p.goto(`${BASE}/booking/${SLUG}/`);
  await p.waitForLoadState("networkidle");
  await p.waitForTimeout(2000);

  // WhatsApp link
  const waLinks = await p.locator('a[href*="wa.me"]').count();
  expect(waLinks).toBeGreaterThanOrEqual(1);

  // Call link
  const callLinks = await p.locator('a[href*="tel:"]').count();
  expect(callLinks).toBeGreaterThanOrEqual(1);
});
