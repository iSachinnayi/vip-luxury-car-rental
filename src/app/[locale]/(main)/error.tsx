// ═══════════════════════════════════════════════
//  Error Boundary — Graceful error handling
// ═══════════════════════════════════════════════

"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  return (
    <main className="min-h-screen bg-dark pt-20 md:pt-24 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 text-center">
        <div className="text-7xl md:text-8xl font-serif font-bold text-red-500/20 mb-4">!</div>
        <h1 className="font-serif text-2xl md:text-3xl text-white mb-3">{t("errorTitle")}</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          {t("errorDesc")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={reset}
            className="px-6 py-3 rounded-xl bg-gold text-black font-bold text-sm
                       hover:bg-gold/90 transition-all shadow-[0_4px_15px_rgba(200,169,81,0.3)] cursor-pointer">
            {t("tryAgain")}
          </button>
          <Link href="/"
            className="px-6 py-3 rounded-xl border border-white/10 text-gray-300 font-medium text-sm
                       hover:border-gold/30 hover:text-gold transition-all">
            {t("homepage")}
          </Link>
        </div>
      </div>
    </main>
  );
}
