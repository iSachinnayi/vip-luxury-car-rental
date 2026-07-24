// ═══════════════════════════════════════════════
//  Homepage — Premium Luxury Experience
//  Rich animations, gold aesthetics, dark luxury
// ═══════════════════════════════════════════════

"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import SEOHead from "@/components/SEOHead";
import HomeSections from "@/components/HomeSections";
import CategoryCards from "@/components/CategoryCards";
import BrandsMarquee from "@/components/BrandsMarquee";
import LocationSwitcher from "@/components/LocationSwitcher";
import { defaultMeta } from "@/lib/seo";
import { defaultMetaAr } from "@/lib/seo-ar";
import { waGeneralInquiry } from "@/lib/whatsapp";

// ─── Animation Variants ───
const easeOut = [0.25, 0.46, 0.45, 0.94] as const;
const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } } },
};

const CAT_IMAGES: Record<string, string> = {
  Luxury: "/api/images/2024/05/1-Rolls-Royce-Ghost-Black-Badge.webp",
  Sports: "/api/images/2024/05/1-Lamborghini-Huracan-EVO-Spyder-1.webp",
  SUV: "/api/images/2024/05/1-Range-Rover-Vogue-HSE-Black.webp",
  Sedan: "/api/images/2024/05/1-Audi-A6-Black.webp",
};

const CATEGORIES = [
  { name: "Luxury", slug: "luxury-car-rental-in-dubai", count: 40, gradient: "from-amber-900/20 via-dark to-dark", desc: "Premium sedans & executive vehicles for the discerning traveler", svgKey: "Luxury" },
  { name: "Sports", slug: "sports-car-rental-in-dubai", count: 31, gradient: "from-red-900/20 via-dark to-dark", desc: "High-performance supercars for an adrenaline-filled experience", svgKey: "Sports" },
  { name: "SUV", slug: "suv-car-rental-in-dubai", count: 31, gradient: "from-blue-900/20 via-dark to-dark", desc: "Spacious luxury SUVs perfect for family trips & desert adventures", svgKey: "SUV" },
  { name: "Sedan", slug: "all-cars", count: 7, gradient: "from-emerald-900/20 via-dark to-dark", desc: "Comfortable & elegant sedans perfect for business & city travel", svgKey: "Sedan" },
];

export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();
  const meta = locale === "ar" ? defaultMetaAr() : defaultMeta();
  // ─── Bunny CDN Direct Play URLs ───────────────
  // Using direct MP4 instead of HLS for maximum browser compatibility
  const BUNNY_DESKTOP_MP4 = "https://vz-ec98b50f-976.b-cdn.net/b1423da8-166f-4125-953a-4ee87c06562d/play_720p.mp4";
  const BUNNY_MOBILE_MP4 = "https://vz-ec98b50f-976.b-cdn.net/02f326e6-0f50-48b6-8a1f-4ba5c1c2e6a9/play_720p.mp4";

  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  // ─── Lazy Load Hero Video (improves LCP) ──────
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHeroVisible(true);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ─── Video Playback ───────────────────────────
  useEffect(() => {
    if (!heroVisible) return;
    [desktopVideoRef, mobileVideoRef].forEach((ref) => {
      const video = ref.current;
      if (!video) return;
      video.muted = true;
      video.play().catch(() => {});
    });
  }, [heroVisible]);

  // Deterministic particle positions to avoid hydration mismatch
  const particles = useMemo(() => [
    { x: 12.3, y: 45.6, d: 3.2, delay: 0.1 }, { x: 78.9, y: 23.4, d: 4.1, delay: 0.5 },
    { x: 34.5, y: 67.8, d: 2.8, delay: 0.9 }, { x: 56.7, y: 12.3, d: 3.7, delay: 1.3 },
    { x: 89.1, y: 78.9, d: 4.5, delay: 1.7 }, { x: 23.4, y: 34.5, d: 2.5, delay: 2.1 },
    { x: 67.8, y: 89.1, d: 3.9, delay: 2.5 }, { x: 45.6, y: 56.7, d: 3.0, delay: 0.3 },
    { x: 91.2, y: 11.2, d: 4.2, delay: 0.7 }, { x: 15.6, y: 92.3, d: 2.3, delay: 1.1 },
    { x: 73.4, y: 45.1, d: 3.5, delay: 1.5 }, { x: 38.9, y: 73.2, d: 4.8, delay: 1.9 },
    { x: 82.1, y: 34.8, d: 2.9, delay: 2.3 }, { x: 27.5, y: 82.4, d: 3.3, delay: 0.2 },
    { x: 62.3, y: 18.9, d: 4.6, delay: 0.6 }, { x: 44.8, y: 63.7, d: 2.6, delay: 1.0 },
    { x: 95.6, y: 41.2, d: 3.8, delay: 1.4 }, { x: 18.2, y: 28.5, d: 4.3, delay: 1.8 },
    { x: 53.1, y: 87.6, d: 2.7, delay: 2.2 }, { x: 71.9, y: 55.3, d: 3.1, delay: 0.4 },
  ], []);

  // ─── Count-Up Animation ───
  function useCountUp(target: number, duration: number, start: boolean) {
    const [count, setCount] = useState(0);
    const ref = useRef<number>(0);
    const isDecimal = target % 1 !== 0;

    useEffect(() => {
      if (!start) { setCount(0); return; }
      ref.current = 0;
      const steps = Math.min(isDecimal ? target * 10 : target, 60);
      const increment = target / steps;
      const interval = (duration * 1000) / steps;

      const timer = setInterval(() => {
        ref.current += increment;
        if (ref.current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(isDecimal ? Math.round(ref.current * 10) / 10 : Math.floor(ref.current));
        }
      }, interval);

      return () => clearInterval(timer);
    }, [target, duration, start]);

    return count;
  }

  function AnimatedStat({ target, suffix, label, sub, icon, delay }: {
    target: number; suffix: string; label: string; sub: string; icon: React.ReactNode; delay: number;
  }) {
    const [ref, inView] = useInViewOnce();
    const count = useCountUp(target, 1.5, inView);

    return (
      <motion.div ref={ref}
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay, ease: easeOut }}
        whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
        className="flex items-center gap-4 group"
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <motion.div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/10 flex items-center justify-center
                                group-hover:bg-gold/20 group-hover:border-gold/30 transition-all duration-300"
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
          >
            {icon}
          </motion.div>
          <div className="text-left">
            <motion.div className="flex items-baseline gap-0.5"
              animate={inView ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.4, delay: delay + 0.3 }}
            >
              <span className="text-xl md:text-2xl font-bold text-gold drop-shadow-[0_0_8px_rgba(200,169,81,0.25)]">
                {count}{suffix}
              </span>
            </motion.div>
            <div className="text-[11px] text-gray-400 font-medium">{label}</div>
            <div className="text-[9px] text-gray-600">{sub}</div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Simple useInView hook
  function useInViewOnce(): [React.RefObject<HTMLDivElement | null>, boolean] {
    const ref = useRef<HTMLDivElement | null>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
      }, { threshold: 0.3 });
      obs.observe(el);
      return () => obs.disconnect();
    }, []);
    return [ref, inView];
  }

  return (
    <main>
      <SEOHead
        title={meta.title}
        description={meta.description}
        ogImage="/api/images/2024/05/1-Rolls-Royce-Ghost-Black-Badge.webp"
        canonical={locale === "ar" ? "https://vipluxurycarrental.com/ar/" : "https://vipluxurycarrental.com"}
      />

      {/* ════════════════════════════════════════════ */}
      {/*  HERO — Cinematic Video Background        */}
      {/*  Full-viewport video with luxury overlay   */}
      {/* ════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        {/* ── Video Background ── */}
        <div className="absolute inset-0">
          {/* Desktop video with slow Ken Burns zoom */}
          <div className="hidden md:block absolute inset-0 overflow-hidden">
            <motion.div className="absolute inset-0 w-full h-full"
              animate={{ scale: [1, 1.05] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}>
              <video ref={desktopVideoRef} autoPlay muted={true} loop playsInline preload="none"
                className="w-full h-full object-cover"
                poster="/api/images/2024/04/Urus-Black-With-Green-1.webp"
                src={BUNNY_DESKTOP_MP4}
              />
            </motion.div>
          </div>

          {/* Mobile video — only rendered when hero is visible */}
          {heroVisible && (
            <video ref={mobileVideoRef} autoPlay muted={true} loop playsInline preload="none"
              className="md:hidden absolute inset-0 w-full h-full object-cover"
              poster="/api/images/2024/04/Urus-Black-With-Green-1.webp"
              src={BUNNY_MOBILE_MP4}
            />
          )}

          {/* Dark overlay layers — extra dark for cinematic depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/75 to-dark/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/30 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />

          {/* Gold ambient glow — softer but wider */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] md:w-[900px] h-[450px] md:h-[550px]
                        bg-gradient-to-b from-gold/[0.05] via-gold/[0.015] to-transparent
                        rounded-full blur-[120px]" />

          {/* Animated decorative rings */}
          <motion.div className="absolute top-16 left-[8%] w-24 h-24 rounded-full border border-gold/10"
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.4, 0.15], rotate: [0, 180, 360] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute bottom-32 right-[12%] w-16 h-16 rounded-full border border-gold/15"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.35, 0.1], rotate: [360, 180, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute top-1/2 right-[5%] w-8 h-8 rounded-full border border-gold/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
          {/* Diamond shape */}
          <motion.div className="absolute top-1/3 left-[12%] w-6 h-6 rotate-45 border border-gold/20 bg-gold/5"
            animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1], rotate: [45, 90, 45] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }} />

          {/* Gold particles — enhanced */}
          <div className="absolute inset-0">
            {particles.map((p, i) => (
              <motion.div key={i}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`, top: `${p.y}%`,
                  width: i % 3 === 0 ? '3px' : '2px',
                  height: i % 3 === 0 ? '3px' : '2px',
                  background: i % 4 === 0 ? '#C8A951' : 'rgba(200,169,81,0.6)',
                  boxShadow: i % 5 === 0 ? '0 0 4px rgba(200,169,81,0.4)' : 'none',
                }}
                animate={{
                  y: [0, -(20 + p.d * 6), 0],
                  opacity: [0, 0.7, 0],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3.5 + p.d * 0.5,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeInOut",
                }} />
            ))}
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-dark via-dark to-transparent" />
        </div>

        {/* ── Hero Content ── */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center">
          <motion.div variants={stagger.container} initial="hidden" animate="show" className="space-y-6 md:space-y-7">

            {/* ── 1. Badge with enhanced glow ── */}
            <motion.div variants={stagger.item}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full
                         border border-gold/30 bg-black/50 backdrop-blur-md
                         shadow-[0_0_30px_rgba(200,169,81,0.12)]">
              <motion.span className="w-1.5 h-1.5 rounded-full bg-gold"
                animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
              <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold font-medium">
                {t("heroTagline")}
              </span>
            </motion.div>

            {/* ── 2. Heading with word animation ── */}
            <motion.div variants={stagger.item}>
              {/* Visually hidden H1 for SEO — keyword focused, proper case */}
              <h1 className="sr-only">{t("heroSeoH1")}</h1>

              {/* Visible heading (div, not H1 — visual unchanged) */}
              <div className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1]">
                {/* Hero title words with stagger animation */}
                <span className="inline-flex flex-wrap justify-center gap-x-4">
                  {t("heroTitle").split(" ").map((word, wi) => (
                    <motion.span key={`${word}-${wi}`}
                      initial={{ opacity: 0, y: 40, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.7, delay: 0.3 + wi * 0.2, ease: easeOut }}
                      className="text-white"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
                <motion.span
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.7, ease: easeOut }}
                  className="block text-gradient-gold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2 md:mt-3
                             drop-shadow-[0_0_40px_rgba(200,169,81,0.3)]"
                >
                  {t("heroSubtitle")}
                </motion.span>
              </div>

              {/* Animated gold divider line */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "120px", opacity: 1 }}
                transition={{ duration: 0.8, delay: 1, ease: easeOut }}
                className="h-[2px] mx-auto mt-5 md:mt-6 rounded-full
                           bg-gradient-to-r from-transparent via-gold to-transparent
                           shadow-[0_0_10px_rgba(200,169,81,0.3)]"
              />
            </motion.div>

            {/* ── 3. Description ── */}
            <motion.p variants={stagger.item}
              className="text-gray-300 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed px-4">
              {t("heroDesc")}
            </motion.p>

            {/* ── 4. CTA Buttons ── */}
            <motion.div variants={stagger.item}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-2">
              <Link href="/all-cars"
                className="group relative overflow-hidden rounded-xl px-7 md:px-8 py-3.5 md:py-4
                           bg-gradient-to-r from-gold to-gold/90 text-black font-bold text-sm md:text-base
                           shadow-[0_8px_30px_rgba(200,169,81,0.35)]
                           hover:shadow-[0_12px_40px_rgba(200,169,81,0.5)]
                           transition-all duration-300 w-full sm:w-auto text-center">
                {/* Shimmer */}
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12
                                      -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                {/* Subtle glow pulse */}
                <motion.div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: 'inset 0 0 30px rgba(200,169,81,0.4)' }} />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {t("exploreFleet")}
                  <motion.svg className="w-4 h-4"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </motion.svg>
                </span>
              </Link>
              <a href={waGeneralInquiry(locale as "en" | "ar")}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-7 md:px-8 py-3.5 md:py-4 rounded-xl
                           border border-white/20 text-white text-sm md:text-base font-medium
                           hover:bg-white/10 hover:border-white/30 transition-all duration-300
                           group w-full sm:w-auto backdrop-blur-sm bg-white/5">
                <motion.svg className="w-4 h-4 md:w-5 md:h-5 text-emerald-400"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </motion.svg>
                {t("bookWhatsApp")}
              </a>
            </motion.div>

            {/* ── 5. Scroll indicator ── */}
            <motion.div variants={stagger.item} className="pt-4 md:pt-6">
              <motion.div animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="flex flex-col items-center gap-1.5 cursor-pointer"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                <motion.span className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-[0.25em]"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  {t("scrollExplore")}
                </motion.span>
                <motion.svg className="w-4 h-4 md:w-5 md:h-5 text-gray-500"
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </motion.svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/*  STATS RIBBON — Premium trust indicators   */}
      {/*  Counter-up animations + glass card design  */}
      {/* ════════════════════════════════════════════ */}
      <section className="relative bg-dark pb-6" aria-label="Trust Statistics">
        <div className="max-w-5xl mx-auto px-4 -mt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="relative rounded-2xl overflow-hidden
                       border border-white/[0.06] bg-dark-card/90 backdrop-blur-xl
                       shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          >
            {/* Animated gradient border line */}
            <motion.div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: "linear-gradient(90deg, transparent, #C8A951, transparent)" }}
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
            />

            <div className="flex flex-wrap justify-center gap-x-6 md:gap-x-10 gap-y-4 px-6 md:px-10 py-6">
              {[
                {
                  target: 4.9, suffix: "★", label: t("googleRating"), sub: "200+ ",
                  icon: <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
                },
                {
                  target: 350, suffix: "+", label: t("premiumCars"), sub: t("inFleet"),
                  icon: <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2"/><circle cx="7" cy="15" r="2"/><circle cx="17" cy="15" r="2"/></svg>,
                },
                {
                  target: 247, suffix: "", label: t("support247"), sub: t("roundClock"),
                  icon: <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
                },
                {
                  target: 15, suffix: "+", label: t("carBrands"), sub: t("topManufacturers"),
                  icon: <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>,
                },
              ].map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      whileInView={{ opacity: 1, scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                      className="hidden md:block w-px h-10 bg-white/[0.06] self-center"
                    />
                  )}
                  <AnimatedStat
                    target={s.target}
                    suffix={s.suffix}
                    label={s.label}
                    sub={s.sub}
                    icon={s.icon}
                    delay={0.2 + i * 0.12}
                  />
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/*  CATEGORIES — 3D Tilt Cards                */}
      {/* ════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-gold mb-4 font-medium">
              {t("ourCollection")}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-white">{t("categoriesTitle")}</h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-gold via-gold/50 to-transparent mx-auto mt-5" />
          </motion.div>

          <CategoryCards />
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/*  BRANDS — Auto-Scroll Marquee              */}
      {/* ════════════════════════════════════════════ */}
      <BrandsMarquee />

      {/* ════════════════════════════════════════════ */}
      {/*  SERVING ACROSS THE UAE                    */}
      {/* ════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 md:mb-8"
          >
            <span className="text-[10px] md:text-xs text-gold/60 uppercase tracking-[0.2em] font-medium">
              {t("uaeCoverage")}
            </span>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif text-white font-semibold mt-2">
              {t("servingAcross")}
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto mt-2">
              {t("uaeDesc")}
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            <LocationSwitcher showDubai label={t("emirates")} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/*  HOME SECTIONS — Content                    */}
      {/* ════════════════════════════════════════════ */}
      <HomeSections />

      {/* ════════════════════════════════════════════ */}
      {/* ════════════════════════════════════════════ */}
      {/*  CTA — Ready to Drive Your Dream Car?     */}
      {/* ════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 bg-dark border-y border-white/[0.04] overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.02] via-dark to-dark" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] 
                      bg-gold/5 rounded-full blur-[120px] opacity-40" />
        
        {/* Decorative elements */}
        <motion.div className="absolute top-10 left-[10%] w-20 h-20 border border-gold/10 rounded-full"
          animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true" />
        <motion.div className="absolute bottom-10 right-[10%] w-16 h-16 border border-gold/10 rounded-full"
          animate={{ y: [0, 12, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          aria-hidden="true" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Label */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-block text-xs uppercase tracking-[0.25em] text-gold mb-4 font-medium"
            >
              {t("ctaBookNow")}
            </motion.span>

            {/* Heading */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight">
              {t("ctaTitle")}
            </h2>

            {/* Description */}
            <p className="text-gray-400 mb-8 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
              {t("ctaSubtitle")}
            </p>

            {/* Trust badges row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8"
            >
              {[
                { text: t("instantConfirm"), icon: true },
                { text: t("freeDelivery"), icon: true },
                { text: t("noHiddenFees"), icon: true },
              ].map((badge) => (
                <span key={badge.text} className="text-[11px] text-gray-500 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {badge.text}
                </span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {/* Primary — WhatsApp */}
              <motion.a
                href={waGeneralInquiry(locale as "en" | "ar")}
                target="_blank"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="group relative overflow-hidden rounded-xl px-8 py-4
                           bg-gradient-to-r from-gold to-gold/90 text-black font-bold text-base
                           shadow-[0_8px_30px_rgba(200,169,81,0.35)] 
                           hover:shadow-[0_12px_40px_rgba(200,169,81,0.5)]
                           transition-all duration-300"
              >
                {/* Shimmer effect on hover */}
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12
                                      -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t("ctaWhatsapp")}
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </motion.a>

              {/* Secondary — Call */}
              <motion.a
                href="tel:+971501564849"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-3 px-8 py-4 rounded-xl text-base font-semibold
                           border-2 border-white/10 text-white
                           hover:border-gold/40 hover:text-gold
                           transition-all duration-300
                           shadow-sm hover:shadow-[0_8px_25px_rgba(200,169,81,0.1)]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                {t("callNow")}
              </motion.a>
            </motion.div>

            {/* Bottom reassurance */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-[11px] text-gray-600 mt-6"
            >
              {t("ctaReassurance")}
            </motion.p>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
