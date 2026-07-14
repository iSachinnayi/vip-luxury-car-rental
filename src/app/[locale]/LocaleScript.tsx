// ═══════════════════════════════════════════════
//  LocaleScript — Sets <html> lang + dir client-side
//  Needed because root layout has hardcoded lang="en"
// ═══════════════════════════════════════════════

"use client";

import { useEffect } from "react";

export default function LocaleScript({ locale, dir }: { locale: string; dir: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    document.documentElement.style.colorScheme = dir === "rtl" ? "dark" : "dark";
  }, [locale, dir]);

  return null;
}
