// ═══════════════════════════════════════════════
//  useCarTranslation — Loads translated car names
//  Uses DeepL-generated cars_{locale}.json
//  Falls back to English title if not found
// ═══════════════════════════════════════════════

"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";

interface CarTranslation {
  slug: string;
  title: string;
  excerpt?: string;
}

const cache: Record<string, CarTranslation[]> = {};

export function useCarTranslation() {
  const locale = useLocale();
  const [translations, setTranslations] = useState<CarTranslation[]>([]);

  useEffect(() => {
    if (locale === "en") {
      setTranslations([]);
      return;
    }

    if (cache[locale]) {
      setTranslations(cache[locale]);
      return;
    }

    fetch(`/data/translations/cars_${locale}.json?_=${Date.now()}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        cache[locale] = data || [];
        setTranslations(cache[locale]);
      })
      .catch(() => setTranslations([]));
  }, [locale]);

  const getTitle = (slug: string, fallback: string): string => {
    if (!slug || translations.length === 0) return fallback;
    const found = translations.find((t) => t.slug === slug);
    return found?.title || fallback;
  };

  return { getTitle, translations };
}
