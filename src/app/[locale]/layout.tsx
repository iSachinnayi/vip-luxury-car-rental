// ═══════════════════════════════════════════════
//  Locale Layout — i18n Provider + lang/dir
//  NextIntlClientProvider is HERE so messages
//  update correctly on client-side locale switch
// ═══════════════════════════════════════════════

import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { CurrencyProvider } from "@/lib/CurrencyContext";
import LocaleScript from "./LocaleScript";
import enMessages from "../../../messages/en.json";
import arMessages from "../../../messages/ar.json";

export const dynamic = "force-dynamic";

const ALL_MESSAGES: Record<string, Record<string, unknown>> = {
  en: enMessages as Record<string, unknown>,
  ar: arMessages as Record<string, unknown>,
};

const BASE_URL = "https://vipluxurycarrental.com";

// RTL locales
const RTL_LOCALES = ["ar"];

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const isDefault = locale === "en";

  return {
    alternates: {
      canonical: isDefault ? `${BASE_URL}/` : `${BASE_URL}/${locale}/`,
      languages: {
        en: `${BASE_URL}/`,
        ar: `${BASE_URL}/ar/`,
        "x-default": `${BASE_URL}/`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
  // Use statically imported messages — Turbopack can't resolve dynamic imports
  const messages = ALL_MESSAGES[locale] || ALL_MESSAGES.en;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CurrencyProvider>
        <LocaleScript locale={locale} dir={dir} />
        <div dir={dir} lang={locale} className="contents">
          {children}
        </div>
      </CurrencyProvider>
    </NextIntlClientProvider>
  );
}
