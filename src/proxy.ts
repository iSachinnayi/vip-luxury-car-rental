// ═══════════════════════════════════════════════
//  i18n Proxy — Locale routing (Next.js 16)
//  Handles /ar/ prefix + auto-detect
//  English stays at / (as-needed prefix)
// ═══════════════════════════════════════════════

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except static files, API, and admin
  // Excludes: api/, admin/, _next/, static assets, and files with extensions
  matcher: [
    "/((?!api|admin|_next|brand-logos|data|images|favicon\\.ico|favicon\\.svg|robots\\.txt|sitemap\\.xml).*)"
  ],
};
