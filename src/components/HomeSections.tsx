// ═══════════════════════════════════════════════
//  HomeSections — Premium animated content
//  Offers → Car Type Deep → Steps → Docs
//  → Conditions → Why Choose
// ═══════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import LatestCars from "./LatestCars";

interface PageContent {
  id: number; title: string; slug: string;
  content: { headings: { level: string; text: string }[]; paragraphs: string[]; images: { src: string; alt: string }[]; };
}

const SECTIONS: Record<string, { start: number; end: number }> = {
  offers: { start: 20, end: 25 },
  luxury: { start: 25, end: 28 },
  suv: { start: 35, end: 38 },
  conditions: { start: 48, end: 54 },
  why_choose: { start: 58, end: 70 },
};

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } } };

const CONDITIONS = [
  { labelKey: "conditionInsurance", valueKey: "conditionInsuranceVal", icon: "shield" },
  { labelKey: "conditionMinAge", valueKey: "conditionMinAgeVal", icon: "age" },
  { labelKey: "conditionMinExp", valueKey: "conditionMinExpVal", icon: "license" },
  { labelKey: "conditionMileage", valueKey: "conditionMileageVal", icon: "speed" },
  { labelKey: "conditionExtraKM", valueKey: "conditionExtraKMVal", icon: "road" },
];

export default function HomeSections() {
  const t = useTranslations("homeSections");
  const th = useTranslations("home");
  const [content, setContent] = useState<PageContent | null>(null);

  const STEPS = [
    { num: "01", title: t("step1Title"), desc: t("step1Desc"), icon: "search" },
    { num: "02", title: t("step2Title"), desc: t("step2Desc"), icon: "calendar" },
    { num: "03", title: t("step3Title"), desc: t("step3Desc"), icon: "key" },
  ];

  const REASONS = [
    { title: t("reason1Title"), desc: t("reason1Desc"), icon: "fleet" },
    { title: t("reason2Title"), desc: t("reason2Desc"), icon: "location" },
    { title: t("reason3Title"), desc: t("reason3Desc"), icon: "chauffeur" },
    { title: t("reason4Title"), desc: t("reason4Desc"), icon: "nodeposit" },
    { title: t("reason5Title"), desc: t("reason5Desc"), icon: "reviews" },
    { title: t("reason6Title"), desc: t("reason6Desc"), icon: "custom" },
  ];

  const FAQS = [
    { q: t("faqQ1"), a: t("faqA1") },
    { q: t("faqQ2"), a: t("faqA2") },
    { q: t("faqQ3"), a: t("faqA3") },
    { q: t("faqQ4"), a: t("faqA4") },
    { q: t("faqQ5"), a: t("faqA5") },
    { q: t("faqQ6"), a: t("faqA6") },
  ];

  useEffect(() => {
    fetch("/api/content/home-2")
      .then((r) => (r.ok ? r.json() : null))
      .then(setContent)
      .catch((err) => console.error("HomeSections fetch error:", err));
  }, []);

  const paras = content?.content?.paragraphs || [];
  const getSection = (key: string) => {
    const range = SECTIONS[key];
    if (!range) return [];
    return paras.slice(range.start, range.end);
  };

  if (!content) {
    // Don't return null — render everything with fallback content.
    // Sections have hardcoded translations; only API paragraphs are missing.
  }

  return (
    <>
      {/* ════════════════════════════════════════════ */}
      {/*  SPECIAL OFFERS — Clean Single Column       */}
      {/* ════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-dark border-y border-white/[0.04] overflow-hidden"
        aria-label="Latest car rental offers and deals in Dubai"
        itemScope itemType="https://schema.org/Offer">

        {/* Animated background glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] 
                      rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(200,169,81,0.05) 0%, transparent 60%)",
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-12">
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-gold mb-4 font-medium">{t("specialOffers")}</span>
            <h2 className="font-serif text-4xl md:text-5xl text-white">{t("latestOffers")}</h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-gold via-gold/50 to-transparent mx-auto mt-5" aria-hidden="true" />
          </motion.div>

          {/* Content — all paragraphs same style */}
          <div className="space-y-6 text-left max-w-3xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-content text-gray-400 leading-relaxed text-sm md:text-base"
            >
              {t("offersPara1")}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-content text-gray-400 leading-relaxed text-sm md:text-base"
            >
              {t("offersPara2")}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-content text-gray-400 leading-relaxed text-sm md:text-base"
            >
              {t("offersPara3")}
            </motion.p>
          </div>

          {/* Latest Cars — full-width carousel */}
        </div>
        <div className="w-full">
          <LatestCars />
          <div className="flex justify-center mt-8">
            <Link href="/all-cars"
              className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-semibold
                         border border-gold/40 text-gold bg-gold/5
                         hover:bg-gold/15 hover:border-gold/60
                         transition-all duration-300
                         shadow-[0_4px_15px_rgba(200,169,81,0.12)] hover:shadow-[0_8px_30px_rgba(200,169,81,0.25)]">
              <span>{t("exploreFullCollection")}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/*  BEST LUXURY CAR RENTAL — Article + Cars  */}
      {/* ════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-dark border-y border-white/[0.04] overflow-hidden"
        itemScope itemType="https://schema.org/Article">
        
        {/* Background glow */}
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,169,81,0.04) 0%, transparent 60%)" }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-12">
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-gold mb-4 font-medium">{t("luxuryLabel")}</span>
            <h2 className="font-serif text-4xl md:text-5xl text-white">{t("bestLuxuryTitle")}</h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-gold via-gold/50 to-transparent mx-auto mt-5" aria-hidden="true" />
          </motion.div>

          {/* Article content */}
          <div className="space-y-5 text-left max-w-3xl mx-auto">
            {[
              t("luxuryPara1"),
              t("luxuryPara2"),
              t("luxuryPara3"),
            ].map((text, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="font-content text-gray-400 leading-relaxed text-sm md:text-base"
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>

        {/* Luxury Cars Carousel — full-width */}
        <div className="w-full">
          <LatestCars type="Luxury" />
          <div className="flex justify-center mt-8">
            <Link href="/luxury-car-rental-in-dubai"
              className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-semibold
                         border border-gold/40 text-gold bg-gold/5
                         hover:bg-gold/15 hover:border-gold/60
                         transition-all duration-300
                         shadow-[0_4px_15px_rgba(200,169,81,0.12)] hover:shadow-[0_8px_30px_rgba(200,169,81,0.25)]">
              <span>{t("exploreLuxury")}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/*  SPORTS CAR RENTAL — Article + Cars       */}
      {/* ════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-dark border-y border-white/[0.04] overflow-hidden"
        itemScope itemType="https://schema.org/Article">

        {/* Background glow */}
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,169,81,0.04) 0%, transparent 60%)" }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-12">
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-gold mb-4 font-medium">{t("sportsLabel")}</span>
            <h2 className="font-serif text-4xl md:text-5xl text-white">{t("sportsTitle")}</h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-gold via-gold/50 to-transparent mx-auto mt-5" aria-hidden="true" />
          </motion.div>

          {/* Article content */}
          <div className="space-y-5 text-left max-w-3xl mx-auto">
            {[
              t("sportsPara1"),
              t("sportsPara2"),
              t("sportsPara3"),
            ].map((text, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="font-content text-gray-400 leading-relaxed text-sm md:text-base"
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>

        {/* Sports Cars Carousel — full-width */}
        <div className="w-full">
          <LatestCars type="Sports" />
          <div className="flex justify-center mt-8">
            <Link href="/sports-car-rental-in-dubai"
              className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-semibold
                         border border-gold/40 text-gold bg-gold/5
                         hover:bg-gold/15 hover:border-gold/60
                         transition-all duration-300
                         shadow-[0_4px_15px_rgba(200,169,81,0.12)] hover:shadow-[0_8px_30px_rgba(200,169,81,0.25)]">
              <span>{t("exploreSports")}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/*  SUV CAR RENTAL — Article + Cars          */}
      {/* ════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-dark border-y border-white/[0.04] overflow-hidden"
        itemScope itemType="https://schema.org/Article">

        {/* Background glow */}
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,169,81,0.04) 0%, transparent 60%)" }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-12">
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-gold mb-4 font-medium">{t("suvLabel")}</span>
            <h2 className="font-serif text-4xl md:text-5xl text-white">{t("suvTitle")}</h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-gold via-gold/50 to-transparent mx-auto mt-5" aria-hidden="true" />
          </motion.div>

          {/* Article content */}
          <div className="space-y-5 text-left max-w-3xl mx-auto">
            {[
              t("suvPara1"),
              t("suvPara2"),
              t("suvPara3"),
            ].map((text, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="font-content text-gray-400 leading-relaxed text-sm md:text-base"
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>

        {/* SUV Cars Carousel — full-width */}
        <div className="w-full">
          <LatestCars type="SUV" />
          <div className="flex justify-center mt-8">
            <Link href="/suv-car-rental-in-dubai"
              className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-semibold
                         border border-gold/40 text-gold bg-gold/5
                         hover:bg-gold/15 hover:border-gold/60
                         transition-all duration-300
                         shadow-[0_4px_15px_rgba(200,169,81,0.12)] hover:shadow-[0_8px_30px_rgba(200,169,81,0.25)]">
              <span>{t("exploreSUV")}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/*  3 EASY STEPS — Timeline Design           */}
      {/* ════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-dark border-y border-white/[0.04] overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gold/5 rounded-full blur-[100px] opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gold/5 rounded-full blur-[100px] opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] 
                      bg-gradient-to-b from-gold/[0.03] via-transparent to-transparent rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14">
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-gold mb-4 font-medium">{t("howItWorks")}</span>
            <h2 className="font-serif text-4xl md:text-5xl text-white">{t("rentStepsTitle")}</h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-gold via-gold/50 to-transparent mx-auto mt-5" />
          </motion.div>

          {/* Desktop: horizontal timeline */}
          <div className="hidden md:block max-w-5xl mx-auto">
            <div className="relative grid grid-cols-3 gap-8">
              {/* Connecting line — from right edge of first circle to left edge of last */}
              <div className="absolute top-[40px] left-[21%] right-[21%] h-px bg-gradient-to-r from-gold/40 via-gold/20 to-gold/40" aria-hidden="true" />
              {/* Dot at each step on the line */}
              {[0, 1, 2].map((i) => (
                <div key={"dot-top-" + i} className="absolute top-[36px] w-[10px] h-[10px] rounded-full bg-gold/30 border-2 border-dark"
                  style={{ left: `calc(${16.67 + i * 33.33}% - 5px)` }} aria-hidden="true" />
              ))}
              {/* Dot at each step on the line */}
              {[0, 1, 2].map((i) => (
                <div key={"dot-bottom-" + i} className="absolute top-[48px] w-[10px] h-[10px] rounded-full bg-gold/30 border-2 border-dark"
                  style={{ left: `calc(${16 + i * 34}%)` }} aria-hidden="true" />
              ))}

              {STEPS.map((step, i) => (
                <motion.div key={step.num}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-center relative"
                >
                  {/* Step icon */}
                  <motion.div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 
                                        border-2 border-gold/30 flex items-center justify-center mx-auto mb-6
                                        shadow-[0_0_25px_rgba(200,169,81,0.12)]
                                        hover:shadow-[0_0_35px_rgba(200,169,81,0.25)]
                                        group-hover/card:border-gold/50 transition-all duration-500"
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 + 0.15, type: "spring", stiffness: 150, damping: 12 }}
                      className="text-gold"
                    >
                      {step.icon === "search" ? (
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                        </svg>
                      ) : step.icon === "calendar" ? (
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>
                        </svg>
                      ) : (
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                        </svg>
                      )}
                    </motion.div>

                    {/* Pulse ring */}
                    <motion.div className="absolute inset-0 rounded-full"
                      style={{ boxShadow: "0 0 0 0 rgba(200,169,81,0.3)" }}
                      animate={{ boxShadow: ["0 0 0 0 rgba(200,169,81,0.3)", "0 0 0 12px rgba(200,169,81,0)", "0 0 0 0 rgba(200,169,81,0)"] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
                    />
                  </motion.div>

                  {/* Card */}
                  <motion.div className="p-6 rounded-2xl border border-white/[0.06] bg-dark-card
                                        hover:border-gold/30 transition-all duration-500 group/card
                                        shadow-sm hover:shadow-[0_12px_40px_rgba(200,169,81,0.1)]
                                        relative overflow-hidden"
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {/* Top gradient line on hover */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent 
                                    opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                    {/* Step badge */}
                    <div className="inline-flex items-center gap-1.5 mb-3">
                      <span className="text-[10px] font-mono font-bold text-gold/60 bg-gold/5 px-2 py-0.5 rounded border border-gold/10">
                        {t("stepPrefix")} {step.num}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3 group-hover/card:text-gold transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical stack */}
          <div className="md:hidden max-w-md mx-auto space-y-6 relative">
            <div className="absolute top-10 bottom-10 left-[23px] w-px bg-gradient-to-b from-gold/40 via-gold/20 to-gold/40" aria-hidden="true" />
            {/* Mobile dots */}
            {[0, 1, 2].map((i) => (
              <div key={i} className="absolute w-2 h-2 rounded-full bg-gold/20 border border-dark"
                style={{ left: "21px", top: `${33 + i * 110}px` }} aria-hidden="true" />
            ))}
            {STEPS.map((step, i) => (
              <motion.div key={step.num}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex items-start gap-4 relative"
              >
                <motion.div className="relative z-10 w-11 h-11 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 
                                      border-2 border-gold/30 flex items-center justify-center flex-shrink-0
                                      shadow-[0_0_15px_rgba(200,169,81,0.1)]"
                >
                  {step.icon === "search" ? (
                    <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                    </svg>
                  ) : step.icon === "calendar" ? (
                    <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                    </svg>
                  )}
                </motion.div>
                <div className="p-4 rounded-2xl border border-white/[0.06] bg-dark-card flex-1
                              hover:border-gold/30 transition-all duration-500">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[9px] font-mono font-bold text-gold/50 bg-gold/5 px-1.5 py-0.5 rounded border border-gold/10">
                      {t("stepPrefix")} {step.num}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">{step.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/*  DOCUMENTS                                 */}
      {/* ════════════════════════════════════════════ */}
      <DocumentsSection />

      {/* ════════════════════════════════════════════ */}
      {/*  RENTAL CONDITIONS — Premium Grid         */}
      {/* ════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-dark border-y border-white/[0.04] overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-gold/5 rounded-full blur-[100px] opacity-30 pointer-events-none" />
        <div className="absolute bottom-20 right-[10%] w-64 h-64 bg-gold/5 rounded-full blur-[100px] opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] 
                      bg-gradient-to-b from-gold/[0.03] via-transparent to-transparent rounded-full blur-[80px] pointer-events-none" />
        
        {/* Decorative dots pattern */}
        <div className="absolute inset-0 opacity-[0.015]" 
             style={{ backgroundImage: "radial-gradient(circle, #C8A951 1px, transparent 1px)", backgroundSize: "40px 40px" }}
             aria-hidden="true" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14">
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-gold mb-4 font-medium">
              {t("termsLabel")}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-white">
              {t("rentalTerms")}
            </h2>
            <p className="text-gray-400 text-sm md:text-base mt-4 max-w-2xl mx-auto">
              {t("termsDesc")}
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-gold via-gold/50 to-transparent mx-auto mt-5" />
          </motion.div>

          {/* Condition cards — 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {CONDITIONS.map((c, i) => (
              <motion.div key={c.labelKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="p-6 rounded-2xl border border-white/[0.06] bg-dark-card
                           hover:border-gold/30 transition-all duration-500 group
                           shadow-sm hover:shadow-[0_10px_40px_rgba(200,169,81,0.12)]
                           relative overflow-hidden"
              >
                {/* Top accent bar */}
                <motion.div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent 
                                       opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Index number */}
                <div className="absolute top-3 right-3 text-[11px] font-mono font-bold text-white/[0.04] select-none">
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <motion.div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 
                                        border border-gold/20 flex items-center justify-center flex-shrink-0
                                        group-hover:from-gold/30 group-hover:to-gold/10 
                                        group-hover:border-gold/40 transition-all duration-500
                                        shadow-[0_0_15px_rgba(200,169,81,0.06)]
                                        group-hover:shadow-[0_0_25px_rgba(200,169,81,0.15)]"
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {c.icon === "shield" ? (
                      <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    ) : c.icon === "age" ? (
                      <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/>
                      </svg>
                    ) : c.icon === "license" ? (
                      <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 12h4"/><path d="M14 12h4"/><path d="M6 16h12"/>
                      </svg>
                    ) : c.icon === "speed" ? (
                      <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                      </svg>
                    )}
                  </motion.div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-medium group-hover:text-gold/70 transition-colors duration-300">
                      {t(c.labelKey)}
                    </div>
                    <div className="text-sm md:text-base text-white font-medium leading-snug">
                      {t(c.valueKey)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/*  WHY CHOOSE — Benefits + FAQ for SEO     */}
      {/* ════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-dark border-y border-white/[0.04] overflow-hidden"
        itemScope itemType="https://schema.org/FAQPage">
        
        {/* Background */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gold/5 rounded-full blur-[100px] opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gold/5 rounded-full blur-[100px] opacity-20" />
        <div className="absolute inset-0 opacity-[0.012]" 
             style={{ backgroundImage: "radial-gradient(circle, #C8A951 1px, transparent 1px)", backgroundSize: "40px 40px" }}
             aria-hidden="true" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-gold mb-4 font-medium">{t("whyUsLabel")}</span>
            <h2 className="font-serif text-4xl md:text-5xl text-white">{t("whyChooseTitle")}</h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-gold via-gold/50 to-transparent mx-auto mt-5" />
          </motion.div>

          {/* Short intro from article */}
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-center text-gray-400 text-sm md:text-base max-w-3xl mx-auto mb-12 leading-relaxed">
            {t("whyChooseIntro")}
          </motion.p>

          {/* Stats row — Trust signals with count-up animation */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6 md:gap-10 mb-14 px-6 py-5 rounded-2xl border border-white/[0.06] bg-dark-card/60 max-w-3xl mx-auto
                       hover:border-gold/20 transition-all duration-500"
          >
            {[
              { num: "4.9", label: th("googleRating"), sub: th("reviews200") },
              { num: "350+", label: th("premiumCars"), sub: th("inFleet") },
              { num: "15+", label: th("carBrands"), sub: th("topManufacturers") },
              { num: "24/7", label: th("support247"), sub: th("roundClock") },
            ].map((s, i) => (
              <motion.div key={s.label} className="flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                {i > 0 && <div className="hidden md:block w-px h-8 bg-white/[0.06]" />}
                <div className="text-center">
                  <motion.div className="text-gold font-bold text-lg md:text-xl drop-shadow-[0_0_6px_rgba(200,169,81,0.2)]"
                    initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 150 }}
                  >
                    {s.num}
                  </motion.div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</div>
                  <div className="text-[9px] text-gray-600">{s.sub}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 6 benefit cards — 3×2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto mb-16">
            {REASONS.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="p-5 rounded-2xl border border-white/[0.06] bg-dark-card
                           hover:border-gold/30 transition-all duration-500 group
                           shadow-sm hover:shadow-[0_8px_30px_rgba(200,169,81,0.08)]
                           relative overflow-hidden"
              >
                <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-start gap-3.5">
                  <motion.div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 
                                        border border-gold/20 flex items-center justify-center flex-shrink-0
                                        group-hover:from-gold/25 group-hover:to-gold/10 
                                        group-hover:border-gold/40 transition-all duration-500"
                    whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}
                  >
                    {item.icon === "fleet" ? (
                      <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <rect x="1" y="6" width="15" height="12" rx="2"/><rect x="16" y="8" width="7" height="8" rx="1"/><circle cx="5.5" cy="16.5" r="1.5"/><circle cx="18.5" cy="16.5" r="1.5"/>
                      </svg>
                    ) : item.icon === "location" ? (
                      <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                    ) : item.icon === "chauffeur" ? (
                      <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    ) : item.icon === "nodeposit" ? (
                      <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M12 9v4"/><path d="M12 17h.01"/>
                      </svg>
                    ) : item.icon === "reviews" ? (
                      <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                      </svg>
                    )}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-gold transition-colors duration-300">{item.title}</h3>
                    <p className="text-[12px] text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Google Reviews Badge — Social Proof */}
          <motion.a href="https://share.google/qqpIIhI3xgIFhL1xN" target="_blank"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 max-w-md mx-auto mb-14 p-4 rounded-2xl 
                       border border-white/[0.06] bg-dark-card/60 hover:border-gold/30 transition-all duration-500
                       hover:shadow-[0_8px_25px_rgba(200,169,81,0.08)] group"
          >
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => (
                <svg key={s} className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
            </div>
            <div className="text-left">
              <div className="text-sm text-white font-semibold">{t("googleRatingBadge")}</div>
              <div className="text-[10px] text-gray-500">{t("reviewsSub")}</div>
            </div>
            <svg className="w-4 h-4 text-gray-500 group-hover:text-gold transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </motion.a>

          {/* FAQ Accordion — SEO goldmine for voice search */}
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-8">
              <span className="inline-block text-xs uppercase tracking-[0.25em] text-gold mb-3 font-medium">
                {t("faqLabel")}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-white">
                {t("faqTitle")}
              </h3>
            </motion.div>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════
//  FAQ Item — Accordion
// ═══════════════════════════════════════════════
function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl border border-white/[0.06] bg-dark-card overflow-hidden
                 hover:border-gold/20 transition-all duration-300"
      itemScope itemType="https://schema.org/Question"
    >
      <button onClick={() => {
        setOpen(!open);
        // Smooth scroll to keep FAQ in view when opening
        if (!open) {
          setTimeout(() => {
            const el = document.getElementById(`faq-${index}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 50);
        }
      }}
        className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left"
        aria-expanded={open}
        id={`faq-${index}`}
      >
        <span className="text-sm md:text-base text-white font-medium pr-4" itemProp="name">{question}</span>
        <motion.svg className="w-4 h-4 text-gold flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <motion.div initial={false} animate={{ height: open ? "auto" : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="overflow-hidden"
      >
        <div className="px-4 md:px-5 pb-4 md:pb-5 text-gray-400 text-sm leading-relaxed" itemScope itemType="https://schema.org/Answer">
          <div className="h-px bg-gradient-to-r from-gold/20 via-gold/10 to-transparent mb-3" />
          <p itemProp="text">{answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════
//  DOCUMENTS
// ═══════════════════════════════════════════════
function DocumentsSection() {
  const tDoc = useTranslations("homeSections");
  const docs = [
    {
      id: "tourists",
      label: tDoc("forTourists"),
      icon: "globe",
      sub: tDoc("touristsSub"),
      items: [
        { text: tDoc("touristsItem1"), icon: "passport", badge: tDoc("touristsItem1Badge") },
        { text: tDoc("touristsItem2"), icon: "visa", badge: tDoc("touristsItem2Badge") },
        { text: tDoc("touristsItem3"), icon: "license", badge: tDoc("touristsItem3Badge") },
        { text: tDoc("touristsItem4"), icon: "idp", badge: tDoc("touristsItem4Badge") },
      ],
    },
    {
      id: "residents",
      label: tDoc("forResidents"),
      icon: "uae",
      sub: tDoc("residentsSub"),
      items: [
        { text: tDoc("residentsItem1"), icon: "license", badge: tDoc("residentsItem1Badge") },
        { text: tDoc("residentsItem2"), icon: "emirates", badge: tDoc("residentsItem2Badge") },
        { text: tDoc("residentsItem3"), icon: "visa", badge: tDoc("residentsItem3Badge") },
      ],
    },
  ];

  return (
    <section className="relative py-20 md:py-28 bg-dark border-y border-white/[0.04] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] 
                    bg-gradient-to-b from-gold/[0.04] via-transparent to-transparent rounded-full blur-[100px] pointer-events-none" />
      
      {/* Subtle geometric decoration */}
      <div className="absolute top-10 right-[5%] w-32 h-32 border border-white/[0.03] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-10 left-[5%] w-24 h-24 border border-white/[0.03] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14">
          <span className="inline-block text-xs uppercase tracking-[0.25em] text-gold mb-4 font-medium">{tDoc("requirementsLabel")}</span>
          <h2 className="font-serif text-4xl md:text-5xl text-white">{tDoc("whatYouNeed")}</h2>
          <p className="text-gray-400 text-sm md:text-base mt-4 max-w-xl mx-auto">
            {tDoc("requirementsDesc")}
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-gold via-gold/50 to-transparent mx-auto mt-5" />
        </motion.div>

        {/* Two columns — side by side */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Vertical divider — desktop only */}
          <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-gold/20 via-gold/10 to-transparent 
                          -translate-x-px pointer-events-none" aria-hidden="true" />

          {docs.map((group, gi) => (
            <motion.div key={group.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-dark-card
                         hover:border-gold/30 transition-all duration-500 group
                         shadow-sm hover:shadow-[0_8px_30px_rgba(200,169,81,0.08)]
                         relative overflow-hidden"
            >
              {/* Card top accent on hover */}
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <motion.div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 
                                      border border-gold/20 flex items-center justify-center flex-shrink-0
                                      group-hover:from-gold/25 group-hover:to-gold/10 
                                      group-hover:border-gold/40 transition-all duration-500
                                      shadow-[0_0_15px_rgba(200,169,81,0.06)]"
                  whileHover={{ scale: 1.08, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {group.icon === "globe" ? (
                    <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <rect x="3" y="3" width="18" height="15" rx="2"/>
                      <path d="M3 9h18"/><path d="M9 21V9"/><path d="M15 21V9"/>
                    </svg>
                  )}
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors duration-300">
                    {group.label}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">{group.sub}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent mb-5" />

              {/* Items list */}
              <ul className="space-y-3">
                {group.items.map((item, i) => (
                  <motion.li key={i}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: gi * 0.15 + i * 0.08, duration: 0.4 }}
                    className="flex items-center gap-3 text-gray-300 text-sm group/item
                               p-2 -mx-2 rounded-lg hover:bg-white/[0.02] transition-colors duration-300"
                  >
                    {/* SVG icon */}
                    <span className="w-8 h-8 rounded-lg bg-gold/5 border border-gold/10 
                                   flex items-center justify-center flex-shrink-0
                                   group-hover/item:bg-gold/10 group-hover/item:border-gold/20 
                                   transition-all duration-300">
                      {item.icon === "passport" ? (
                        <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 12h6"/><path d="M12 9v6"/>
                        </svg>
                      ) : item.icon === "visa" ? (
                        <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                      ) : item.icon === "license" ? (
                        <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 12h4"/><path d="M14 12h4"/><path d="M6 16h12"/>
                        </svg>
                      ) : item.icon === "idp" ? (
                        <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M9 5v14"/>
                        </svg>
                      )}
                    </span>
                    <span className="flex-1">{item.text}</span>
                    {/* Status badge */}
                    <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                      item.badge === "Required"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                        : item.badge === "Recommended"
                        ? "bg-gold/10 text-gold border border-gold/20"
                        : "bg-gray-500/10 text-gray-400 border border-gray-500/15"
                    }`}>
                      {item.badge}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-[11px] text-gray-600 mt-8">
          {tDoc("docNote")}
        </motion.p>
      </div>
    </section>
  );
}
