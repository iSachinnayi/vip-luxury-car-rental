# AR Translation Plan — VIP Luxury Car Rental

## Strategy
1. Page-by-page, one at a time
2. Read full page → Add keys to en.json + ar.json → Update component → Test
3. English site ko kabhi mat toda
4. AR complete hone ke baad RU

## Priority Order (user's list)
1. ✅ All Cars page — Already uses `useTranslations`, minor fixes only
2. ❌ Type/Brand pages — `brand/page.tsx`, `brand/[slug]/page.tsx`
3. ❌ Location pages — `location/[emirate]/page.tsx` + sub-pages
4. ❌ Single Car page — `CarDetailClient.tsx` (MASSIVE)
5. ❌ About page — `about/page.tsx`
6. ❌ FAQ page — `faq/page.tsx`
7. ❌ Privacy Policy — `privacy/page.tsx`
8. ❌ Terms & Conditions — `terms/page.tsx`
9. ❌ Contact page — `contact/page.tsx`

## Also need to fix
- CookieConsent.tsx — hardcoded English
- not-found.tsx — hardcoded English
- error.tsx — hardcoded English
- BookingFormClient.tsx — hardcoded English
- EmirateCarGrid.tsx — hardcoded English
- BrandCategoryClient.tsx — hardcoded English

## Namespaces needed
- `about` — About page content
- `contact` — Contact page + form
- `faq` — FAQ Q&A pairs
- `privacy` — Privacy Policy legal text
- `terms` — Terms & Conditions legal text
- `common` — Shared strings (404, error, back links)
- `car` — Already exists, need to USE in CarDetailClient
- `booking` — Already exists, need to USE in BookingFormClient
