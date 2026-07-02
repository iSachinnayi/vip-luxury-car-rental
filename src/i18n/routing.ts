// ═══════════════════════════════════════════════
//  i18n Routing Configuration
// ═══════════════════════════════════════════════

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localeDetection: true,
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
