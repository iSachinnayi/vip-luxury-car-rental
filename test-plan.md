# 🧪 VIP Luxury Car Rental — Complete Test Plan

## 📋 Reference Document
> Purpose: Store all testing data, findings, and plans in one place.
> Use this to track what's tested, what passed/failed, and what to fix next.

---

## 1. 🏗️ Build & Compilation

| Test | Tool | Expected | Status |
|---|---|---|---|
| TypeScript check | `npx next build` | 0 errors | ✅ PASS |
| ESLint check | `npx next lint` | 0 warnings | ⬜ TODO |
| Production build | `npx next build` | Success | ✅ PASS |

## 2. 🌐 Frontend — Static Pages (8 pages × 2 locales = 16)

| Page | EN Title | AR Title | EN Schema | AR Schema | RTL |
|---|---|---|---|---|---|
| `/` Homepage | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/all-cars/` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/brand/` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/about/` | ✅ | ✅ | ⬜ | ⬜ | ✅ |
| `/contact/` | ✅ | ✅ | ⬜ | ⬜ | ✅ |
| `/faq/` | ✅ | ✅ | ⬜ | ⬜ | ✅ |
| `/privacy/` | ✅ | ✅ | ⬜ | ⬜ | ✅ |
| `/terms/` | ✅ | ✅ | ⬜ | ⬜ | ✅ |

## 3. 🚗 Dynamic Pages (309 pages × 2 locales)

| Type | Count | Meta | Schema | RTL |
|---|---|---|---|---|
| Brand pages | 17 | ✅ | ✅ | ✅ |
| Category pages | 3 | ✅ | ✅ | ✅ |
| Car detail pages | 109 | ✅ | ✅ | ✅ |
| Booking pages | 109 | ✅ | ✅ | ✅ |
| Location pages | 63 | ✅ | ✅ | ✅ |

## 4. 🔍 SEO Checklist

| Test | Tool | Result |
|---|---|---|
| Hreflang tags present | Manual / hreflangchecker.com | ✅ |
| Canonical URLs correct | Manual | ✅ |
| Meta descriptions (EN) | Playwright test | ✅ |
| Meta descriptions (AR) | Playwright test | ✅ |
| OG tags (EN + AR) | Playwright test | ✅ |
| JSON-LD Organization schema | Playwright test | ✅ |
| JSON-LD Breadcrumb schema | Playwright test | ✅ |
| JSON-LD Product schema | Playwright test | ⬜ |
| JSON-LD WebSite schema | Playwright test | ✅ |
| Sitemap.xml valid | Playwright test | ✅ |
| Robots.txt valid | Playwright test | ✅ |
| Favicon loads | Manual | ✅ |
| PageSpeed Insights | pagespeed.web.dev | ⬜ |
| Mobile-friendly test | search.google.com | ⬜ |

## 5. 📱 UI/UX Checklist

| Test | Priority | Status |
|---|---|---|
| CarCard font sizes readable | Medium | ✅ Fixed |
| Call button shows "Call" not number | Low | ✅ Fixed |
| WhatsApp message includes car URL | High | ✅ Fixed |
| AR WhatsApp messages in Arabic | High | ✅ Fixed |
| Mobile responsive (320px+) | High | ⬜ |
| Tablet responsive (768px) | Medium | ⬜ |
| Desktop responsive (1920px) | Medium | ⬜ |
| Dark theme consistency | Low | ⬜ |
| RTL layout correct on AR pages | High | ✅ |
| Loading states visible | Medium | ⬜ |

## 6. 💬 WhatsApp Flow Test

| Location | EN Message | AR Message | Car URL |
|---|---|---|---|
| CarCardV7 button | ✅ | ✅ | ✅ |
| CarDetail mobile CTA | ✅ | ✅ | ✅ |
| CarDetail sidebar CTA | ✅ | ✅ | ✅ |
| Booking form | ✅ | ✅ | ✅ |
| Booking success | ✅ | ✅ | ✅ |
| Homepage hero CTA | ✅ | ✅ | N/A |
| Homepage bottom CTA | ✅ | ✅ | N/A |

## 7. 🌍 Internationalization

| Feature | EN | AR |
|---|---|---|
| Navigation | ✅ | ✅ |
| Footer | ✅ | ✅ |
| Car details | ✅ | ✅ |
| Booking form | ✅ | ✅ |
| FAQ | ✅ | ✅ |
| About page | ✅ | ✅ |
| Contact page | ✅ | ✅ |
| Privacy/Terms | ✅ | ✅ |
| Car names | Database | cars_ar.json ✅ |
| WhatsApp messages | ✅ | ✅ |
| Schema.org | ✅ | ✅ |
| Meta tags | ✅ | ✅ |

## 8. ⚡ Performance (Baseline)

| Metric | Current | Target | Tool |
|---|---|---|---|
| Lighthouse Performance | ⬜ | 90+ | PageSpeed Insights |
| Lighthouse SEO | ⬜ | 100 | PageSpeed Insights |
| Lighthouse Accessibility | ⬜ | 90+ | PageSpeed Insights |
| First Contentful Paint | ⬜ | <1.5s | PageSpeed Insights |
| Largest Contentful Paint | ⬜ | <2.5s | PageSpeed Insights |
| Cumulative Layout Shift | ⬜ | <0.1 | PageSpeed Insights |

## 9. 🛠️ Known Issues (To Fix)

| # | Issue | Severity | File | Status |
|---|---|---|---|---|
| 1 | Car descriptions empty | Medium | all_cars.json | ⬜ |
| 2 | CarCard V1-V6 hardcoded WhatsApp | Low | CarCardV1-V6.tsx | ⬜ (unused) |
| 3 | OG image build intermittent | Low | opengraph-image.tsx | ⬜ |
| 4 | Admin settings phone mismatch | Low | admin/api/settings | ⬜ |

## 10. 📊 Test Run History

| Date | Run Type | Pass | Fail | Notes |
|---|---|---|---|---|---|
| 2026-07-15 | Manual SEO audit | — | — | Baseline established |
| 2026-07-15 | WhatsApp audit | 6/6 | 0 | All buttons optimized |
| 2026-07-15 | CarCard UI audit | — | — | Font sizes improved |
| 2026-07-16 | SEO E2E tests (Playwright) | 20/20 | 0 | Meta, hreflang, schema, sitemap, robots, RU 404 |
| 2026-07-16 | Performance baseline (Lighthouse CI script) | 5/5 | 0 | EN/AR homepage ~15s (dev mode), car/brand pages ~1-1.5s |
| 2026-07-16 | Accessibility tests (Playwright) | 6/6 | 0 | Headings, alt text, nav, RTL, interactive elements |
| 2026-07-16 | Booking flow E2E (Playwright) | 6/6 | 0 | CarCard→booking, direct page, params pre-fill, WhatsApp/Call buttons |
| 2026-07-16 | AR pages batch (Playwright) | 309/309 | 0 | ALL AR pages (sitemap 200 + booking 109) — 200 OK |
| 2026-07-16 | **POST-FIX AUDIT** (Playwright) | **45/45** | **0** | SEO 20 + a11y 6 + booking 6 + AR batch 1 = **32 tests + 309 pages** |

---

*Last updated: 2026-07-16*
