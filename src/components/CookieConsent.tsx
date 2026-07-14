// ═══════════════════════════════════════════════
//  CookieConsent — GDPR Cookie Banner
//  Appears once, stores consent in localStorage
// ═══════════════════════════════════════════════

"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";

const CONSENT_KEY = "vip-cookie-consent";

export default function CookieConsent() {
  const t = useTranslations("common");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Small delay so it doesn't pop up immediately on page load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 md:bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50"
        >
          <div className="p-5 rounded-2xl bg-dark-card/95 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="flex items-start gap-3 mb-3">
              <svg className="w-5 h-5 text-gold shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                <path d="M8.5 8.5v.01" />
                <path d="M16 15.5v.01" />
                <path d="M12 12v.01" />
                <path d="M11 17v.01" />
                <path d="M7 14v.01" />
              </svg>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t("cookieMessage")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={accept}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gold text-black font-bold text-xs
                           hover:bg-gold/90 transition-all shadow-[0_2px_10px_rgba(200,169,81,0.3)]
                           cursor-pointer"
              >
                {t("cookieAccept")}
              </button>
              <button
                onClick={decline}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 text-xs
                           hover:text-white hover:border-white/20 transition-all cursor-pointer"
              >
                {t("cookieDecline")}
              </button>
            </div>

            <p className="text-gray-600 text-[10px] mt-3 text-center">
              <Link href="/privacy" className="hover:text-gold transition-colors">{t("cookiePrivacy")}</Link>
              {" · "}
              <Link href="/terms" className="hover:text-gold transition-colors">{t("cookieTerms")}</Link>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
