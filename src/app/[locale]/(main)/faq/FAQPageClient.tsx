// ═══════════════════════════════════════════════
//  FAQ — /faq
//  12 most common questions about luxury car rental
// ═══════════════════════════════════════════════

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import SEOHead from "@/components/SEOHead";
import { faqSchema } from "@/lib/schema";

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-white/[0.06] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 md:py-5 text-left cursor-pointer group"
      >
        <span className="text-sm md:text-base text-white font-medium pr-4 group-hover:text-gold transition-colors">
          {q}
        </span>
        <span className={`text-gold text-lg transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-gray-400 text-sm leading-relaxed pb-4 md:pb-5 pr-8">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const t = useTranslations("faq");
  const locale = useLocale();
  const isAr = locale === "ar";
  const faqTitle = isAr ? "الأسئلة الشائعة | VIP Luxury Car Rental Dubai" : "Frequently Asked Questions | VIP Luxury Car Rental Dubai";
  const faqDesc = isAr
    ? "اعثر على إجابات للأسئلة الشائعة حول تأجير السيارات الفاخرة في دبي. تعرف على المتطلبات والتأمين والودائع والتوصيل والمزيد."
    : "Find answers to common questions about luxury car rental in Dubai. Learn about requirements, insurance, deposits, delivery, and more.";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  const FAQS = Array.from({ length: 12 }, (_, i) => ({
    q: t("q" + (i + 1)),
    a: t("a" + (i + 1)),
  }));

  const schema = faqSchema(FAQS);

  return (
    <main className="min-h-screen bg-dark pt-20 md:pt-24 pb-16">
      <script id="schema-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SEOHead
        title={faqTitle}
        description={faqDesc}
        canonical="https://vipluxurycarrental.com/faq/"
      />

      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 mb-10">
        <div className="p-6 md:p-10 rounded-3xl
                     bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent
                     border border-white/[0.06] backdrop-blur-xl text-center">
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gold transition-colors mb-4">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {t("home")}
          </Link>
          <span className="inline-block text-xs uppercase tracking-[0.25em] text-gold mb-3 font-medium">
            {t("label")}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
            {t("title")}
          </h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            {t("subtitle")} <Link href="/contact/" className="text-gold hover:underline">{t("ctaContact")}</Link>.
          </p>
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <div className="p-4 md:p-6 rounded-3xl
                     bg-gradient-to-b from-white/[0.04] via-white/[0.02] to-transparent
                     border border-white/[0.06]">
          {FAQS.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} open={openIndex === i} onToggle={() => toggle(i)} />
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent
                        border border-white/[0.06] text-center">
          <p className="text-gray-400 text-sm mb-3">{t("stillQuestions")}</p>
          <Link href="/contact/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-black font-bold text-sm
                       hover:bg-gold/90 transition-all shadow-[0_4px_15px_rgba(200,169,81,0.3)]">
            {t("ctaContact")}
          </Link>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gold transition-colors">
            {t("backHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
