// ═══════════════════════════════════════════════
//  i18n Routing Configuration
// ═══════════════════════════════════════════════

import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localeDetection: false,
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

// Locale-aware navigation utilities
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
