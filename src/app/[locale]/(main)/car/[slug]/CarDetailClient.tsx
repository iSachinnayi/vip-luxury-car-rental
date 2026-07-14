// ═══════════════════════════════════════════════
//  Car Detail Client — Redesigned
//  Image slideshow → Pricing + Booking → Gallery
// ═══════════════════════════════════════════════

"use client";


import { useState, useEffect, useCallback, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { CarCardData } from "@/types/car";
import { useCurrency } from "@/lib/CurrencyContext";
import { useCarTranslation } from "@/lib/useCarTranslation";
import { waCarInterest, waCarDetailWithDates } from "@/lib/whatsapp";
import { Icons } from "@/lib/icons";

// ─── Animation Variants ───
const easeOut = [0.25, 0.46, 0.45, 0.94] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

// ─── Locations ───
const LOCATIONS = ["Dubai", "Abu Dhabi", "Ajman", "Fujairah", "Ras Al-Khaimah", "Sharjah", "Umm Al-Quwain"];
const LOCATIONS_AR: Record<string, string> = {
  "Dubai": "دبي",
  "Abu Dhabi": "أبو ظبي",
  "Ajman": "عجمان",
  "Fujairah": "الفجيرة",
  "Ras Al-Khaimah": "رأس الخيمة",
  "Sharjah": "الشارقة",
  "Umm Al-Quwain": "أم القيوين",
};

// ─── Date Picker ───
function DatePicker({ label, value, onChange }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const locale = useLocale();
  const ref = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">{label}</label>
      <div className="relative group">
        {/* Left calendar icon - click to open picker */}
        <button type="button" onClick={() => ref.current?.showPicker()}
          className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center
                     cursor-pointer z-10 text-gold/50 hover:text-gold transition-all duration-300
                     rounded-l-xl">
          {Icons.calendar}
        </button>
        {/* Native date input - no right icon visible */}
        <input ref={ref} type="date" value={value} lang={locale === "ar" ? "ar-SA" : "en"}
          onChange={(e) => onChange(e.target.value)}
          onClick={() => ref.current?.showPicker()}
          className="w-full pl-11 pr-3 py-3 rounded-xl bg-gradient-to-b from-white/[0.03] to-white/[0.01]
                     border border-white/10 text-white text-sm outline-none transition-all duration-300
                     focus:border-gold/50 hover:border-white/20 [color-scheme:dark]
                     [&::-webkit-calendar-picker-indicator]:hidden" />
      </div>
    </motion.div>
  );
}

// ─── FAQ Accordion Item ───
function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01]
                 border border-white/[0.06] hover:border-gold/20 transition-all duration-300 overflow-hidden"
    >
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 md:px-6 py-4 text-left cursor-pointer"
      >
        <span className="text-sm md:text-base font-medium text-white/90 group-hover:text-gold transition-colors pr-4">
          {question}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: easeOut }}
          className="flex-shrink-0 w-6 h-6 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center
                     text-gold text-xs font-bold"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-6 pb-4 pt-0">
              <div className="h-px bg-gradient-to-r from-gold/20 via-gold/10 to-transparent mb-3" />
              <p className="text-sm text-gray-400 leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Animated Location Select ───
function LocationSelect({ label, value, onChange, icon }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const loc = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const displayValue = loc === "ar" ? (LOCATIONS_AR[value] || value) : value;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">{label}</label>
      <button type="button" onClick={() => setOpen(!open)}
        className="group w-full flex items-center gap-2.5 p-3 rounded-xl bg-black/50 border border-white/10
                   hover:border-gold/30 transition-all duration-300 text-white text-sm outline-none cursor-pointer">
        <span className="flex-shrink-0">{icon}</span>
        <span className="flex-1 text-left">{displayValue}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="text-gray-400 group-hover:text-gold transition-colors flex-shrink-0">
          {Icons.chevronDown}
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute z-50 mt-1.5 w-full rounded-xl border border-white/[0.08] bg-dark-card/95 backdrop-blur-xl
                       shadow-2xl shadow-black/50 overflow-hidden"
          >
            {LOCATIONS.map((locName) => (
              <button key={locName} type="button" onClick={() => { onChange(locName); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-all duration-200
                  ${value === locName
                    ? "bg-gold/10 text-gold border-l-2 border-gold"
                    : "text-gray-300 hover:bg-white/[0.04] hover:text-white border-l-2 border-transparent"
                  }`}>
                {icon}
                {loc === "ar" ? (LOCATIONS_AR[locName] || locName) : locName}
                {value === loc && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                    <svg className="w-3.5 h-3.5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </motion.span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CarDetailClient({ car, relatedCars = [] }: { car: CarCardData; relatedCars?: CarCardData[] }) {
  const t = useTranslations("car");
  const locale = useLocale();
  const { getTitle, translations: carTranslations } = useCarTranslation();
  const { code: selectedCurrency, symbol, rate } = useCurrency();
  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      "Sports": t("typeSports"),
      "Luxury": t("luxury"),
      "SUV": t("typeSUV"),
    };
    return map[type] || type;
  };
  const carTitle = getTitle(car.slug, car.title);
  const carExcerpt = (() => {
    if (locale === "en" || carTranslations.length === 0) return car.excerpt;
    const found = carTranslations.find((tr) => tr.slug === car.slug);
    return found?.excerpt || car.excerpt;
  })();
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("Dubai");
  const [dropLocation, setDropLocation] = useState("Dubai");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const allImages = [car.thumbnail, ...car.images].filter(Boolean) as string[];
  const hasGallery = allImages.length > 0;

  // Auto-rotate slideshow
  const nextImage = useCallback(() => {
    if (!hasGallery) return;
    setActiveImage((i) => (i + 1) % allImages.length);
  }, [hasGallery, allImages.length]);

  useEffect(() => {
    if (!hasGallery || allImages.length < 2) return;
    const t = setInterval(nextImage, 4000);
    return () => clearInterval(t);
  }, [nextImage, hasGallery, allImages.length]);

  // Pricing
  const dayPrice = parseInt(car.pricing.per_day || "0");
  const weekPrice = parseInt(car.pricing.per_week || "0");
  const monthPrice = parseInt(car.pricing.per_month || "0");
  const originalDay = car.pricing.original_per_day ? parseInt(car.pricing.original_per_day) : null;
  const savings = originalDay ? originalDay - dayPrice : 0;

  const formatPrice = (aedPrice: string) => {
    if (aedPrice === "—") return "—";
    const price = parseInt(aedPrice || "0");
    const converted = Math.round(price * rate).toLocaleString();
    return `${symbol}${converted}${selectedCurrency !== "AED" ? ` ${selectedCurrency}` : ""}`;
  };

  return (
    <main className="min-h-screen bg-dark">
      {/* ════════════════════════════════════════ */}
      {/*  SECTION 1: HERO with filmstrip + info  */}
      {/* ════════════════════════════════════════ */}
      <section className="relative">
        {/* Image area */}
        <div className="relative h-[55vh] md:h-[60vh] lg:h-[65vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={activeImage} className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: easeOut }}
            >
              {hasGallery && (
                <Image src={allImages[activeImage]} alt={car.title}
                  fill className="object-cover" priority
                  sizes="100vw" />
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.08] via-dark/50 to-dark/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
          
          {/* Image counter */}
          <div className="absolute top-6 right-6 z-10 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/60 text-xs font-medium">
            {activeImage + 1} / {allImages.length}
          </div>

          {/* Thumbnail strip — glass morphism overlay inside hero image */}
          {hasGallery && allImages.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 z-20 backdrop-blur-2xl bg-gradient-to-t from-black/20 via-black/5 to-transparent">
              <div className="max-w-5xl mx-auto px-4 md:px-8 py-3 md:py-4">
                <div className="flex items-center justify-center gap-2 md:gap-3">
                  {allImages.slice(0, 5).map((img, i) => (
                    <button key={i} onClick={() => { setActiveImage(i); setLightboxOpen(true); }}
                      className={`flex-shrink-0 w-16 h-12 md:w-24 md:h-[72px] rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        i === activeImage
                          ? "border-gold shadow-[0_0_12px_rgba(200,169,81,0.3)] ring-1 ring-gold/30"
                          : "border-white/10 hover:border-white/30 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`${car.title} ${t("imageAlt", { n: i + 1 }).replace("+{n} ", "")}`} className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </button>
                  ))}
                  {allImages.length > 5 && (
                    <button onClick={() => { setActiveImage(0); setLightboxOpen(true); }}
                      className="flex-shrink-0 w-16 h-12 md:w-24 md:h-[72px] rounded-xl border-2 border-dashed border-white/15
                                 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/30
                                 transition-all duration-300 text-xs md:text-sm font-medium bg-white/[0.02] hover:bg-gold/5">
                      {t("more", { n: allImages.length - 5 })}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Animated gold divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeOut }}
          className="h-[1px] w-full origin-left bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        />

        {/* Car name only — no price here */}
        <div className="border-b border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 md:py-7">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-400 mb-2">
                <span className="text-gold font-semibold">{car.brand}</span>
                {car.car_type && <><span>·</span><span>{getTypeLabel(car.car_type)}</span></>}
                <span>·</span>
                <span>{car.specs.model_year}</span>
                {originalDay && (
                  <motion.span animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                    className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-full border border-red-500/30 ml-1">
                    {car.pricing.discount_day}
                  </motion.span>
                )}
              </div>
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {carTitle}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/*  SECTION 2: PRICING + BOOKING           */}
      {/* ════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">

          {/* ─── LEFT: Pricing + Mileage + Deposit ─── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Pricing Cards */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: t("perDayLabel"), price: car.pricing.per_day, original: car.pricing.original_per_day, discount: car.pricing.discount_day, icon: Icons.sun, period: t("perDaySuffix") },
                { label: t("perWeekLabel"), price: car.pricing.per_week, original: car.pricing.original_per_week, discount: car.pricing.discount_week, icon: Icons.week, period: t("perWeekSuffix") },
                { label: t("perMonthLabel"), price: car.pricing.per_month, original: car.pricing.original_per_month, discount: car.pricing.discount_month, icon: Icons.month, period: t("perMonthSuffix") },
              ].map((pkg) => (
                <motion.div key={pkg.label} variants={fadeUp}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="relative p-5 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] 
                             border border-white/[0.08] hover:border-gold/30 transition-all overflow-hidden group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center
                                  group-hover:bg-gold/20 group-hover:border-gold/40 transition-all duration-300">
                      {pkg.icon}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">{pkg.label}</div>
                      {pkg.original && <div className="text-[10px] text-gray-500 line-through">{formatPrice(pkg.original)}</div>}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl md:text-3xl font-bold text-gold">{formatPrice(pkg.price || "0")}</span>
                    <span className="text-[10px] text-gray-500">{pkg.period}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* ═══ Rent With Crypto + Insurance Included ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: easeOut }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {/* Rent With Crypto */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
                className="relative p-5 rounded-2xl bg-gradient-to-br from-amber-500/[0.06] via-amber-500/[0.02] to-transparent
                           border border-amber-500/20 hover:border-amber-500/40 group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center
                                group-hover:bg-amber-500/20 group-hover:border-amber-500/40 transition-all duration-300">
                    {Icons.bitcoin}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{t("rentWithCrypto")}</h3>
                    <p className="text-[10px] text-amber-400/70 font-medium">{t("payCrypto")}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {t("cryptoDesc")}
                </p>
              </motion.div>

              {/* Insurance Included */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
                className="relative p-5 rounded-2xl bg-gradient-to-br from-emerald-500/[0.06] via-emerald-500/[0.02] to-transparent
                           border border-emerald-500/20 hover:border-emerald-500/40 group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center
                                group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-all duration-300">
                    {Icons.shieldCheck}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{t("insuranceIncluded")}</h3>
                    <p className="text-[10px] text-emerald-400/70 font-medium">{t("fullComprehensive")}</p>
                  </div>
                </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{t("insuranceDesc")}</p>
              </motion.div>
            </motion.div>

            {/* Mileage + Deposit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-4">
                  {Icons.km}
                  <h3 className="text-sm font-bold text-white">{t("includedMileage")}</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: t("perDayLabel"), value: car.km_limits.per_day || "300", original: car.km_limits.original_per_day },
                    { label: t("perWeekLabel"), value: car.km_limits.per_week || "2100", original: car.km_limits.original_per_week },
                    { label: t("perMonthLabel"), value: car.km_limits.per_month || "5000", original: car.km_limits.original_per_month },
                  ].map((km) => (
                    <div key={km.label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{km.label}</span>
                      <div className="flex items-center gap-2">
                        {km.original && <span className="text-gray-600 line-through text-xs">{km.original} KM</span>}
                        <span className="text-white font-bold">{km.value} KM</span>
                        {km.original && (
                          <span className="text-green-400 text-[10px] font-bold">
                            +{Math.round((parseInt(km.value)/parseInt(km.original)-1)*100)}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/[0.06] flex justify-between text-xs">
                  <span className="text-gray-600">{t("extraKm")}</span>
                  <span className="text-gray-400">AED {car.km_limits.extra_km || "5"} / km</span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-4">
                  {Icons.shield}
                  <h3 className="text-sm font-bold text-white">{t("depositOptions")}</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <div className="mt-0.5">{Icons.noDeposit}</div>
                    <div>
                      <div className="text-white text-sm font-medium">{t("noDepositCardTitle", { amount: car.deposit.no_deposit_fee || "200" })}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{t("noDepositDesc")}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="mt-0.5">{Icons.lock}</div>
                    <div>
                      <div className="text-white text-sm font-medium">{t("securityDepositCardTitle", { amount: parseInt(car.deposit.security || "5000").toLocaleString() })}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{t("securityDepositDesc")}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Description */}
            {car.excerpt && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <h2 className="font-serif text-xl text-white mb-3">{t("aboutCar")}</h2>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">{carExcerpt}</p>
              </motion.div>
            )}

            {/* ═══ Not Included ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: easeOut }}
              className="p-5 rounded-2xl bg-gradient-to-b from-red-500/[0.03] to-red-500/[0.01] border border-red-500/10"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  {Icons.xCircle}
                </div>
                <h3 className="text-sm font-bold text-white">{t("notIncluded")}</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: t("taxInfo"), desc: t("taxDesc") },
                  { label: t("salik"), desc: t("salikDesc") },
                  { label: t("darb"), desc: t("darbDesc") },
                ].map((item, i) => (
                  <motion.div key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-red-500/[0.02] border border-red-500/5"
                  >
                    <div className="mt-0.5 flex-shrink-0">{Icons.xCircle}</div>
                    <div>
                      <div className="text-white text-sm font-medium">{item.label}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Mobile CTA */}
            <div className="lg:hidden space-y-3">
              <a href={`/${locale === "en" ? "" : locale + "/"}booking/${car.slug}?pickup=${encodeURIComponent(pickupLocation)}&drop=${encodeURIComponent(dropLocation)}&from=${pickupDate}&to=${returnDate}`}
                className="group relative overflow-hidden flex items-center justify-center gap-2 w-full py-4 rounded-xl
                           bg-gradient-to-r from-gold to-gold/90 text-black font-bold text-sm
                           shadow-[0_8px_25px_rgba(200,169,81,0.3)] transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12
                              -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {t("bookNow")}
                  {Icons.arrow}
                </span>
              </a>
              <a href={waCarInterest({ carName: carTitle, carSlug: car.slug, locale: locale as "en" | "ar" })}
                target="_blank"
                className="group relative overflow-hidden flex items-center justify-center gap-2 w-full py-4 rounded-xl
                           bg-gradient-to-r from-gold to-gold/90 text-black font-bold text-sm
                           shadow-[0_8px_25px_rgba(200,169,81,0.3)] transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12
                              -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                <span className="relative z-10 flex items-center gap-2">
                  {Icons.whatsapp}
                  {t("whatsapp")}
                  {Icons.arrow}
                </span>
              </a>
            </div>
          </div>

          {/* ─── RIGHT: Booking Sidebar ─── */}
          <div className="lg:sticky lg:top-24 self-start">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: easeOut }}
              className="p-6 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 backdrop-blur-xl"
            >
              <h3 className="text-xl font-bold text-white mb-6">{t("bookTitle")}</h3>

              {/* Pickup Location */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="mb-4"
              >
                <LocationSelect
                  label={t("pickupLocation")}
                  value={pickupLocation}
                  onChange={setPickupLocation}
                  icon={Icons.mapPin}
                />
              </motion.div>

              {/* Drop Location */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mb-4"
              >
                <LocationSelect
                  label={t("dropLocation")}
                  value={dropLocation}
                  onChange={setDropLocation}
                  icon={Icons.mapPin}
                />
              </motion.div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <DatePicker label={t("pickup")} value={pickupDate} onChange={setPickupDate} />
                <DatePicker label={t("return")} value={returnDate} onChange={setReturnDate} />
              </div>

              {/* Total / Day */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 }}
                className="p-4 rounded-xl bg-gradient-to-br from-gold/[0.08] to-gold/[0.02] border border-gold/20"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">{t("totalPerDay")}</span>
                  <div className="text-right">
                    {originalDay && (
                      <span className="text-xs text-gray-500 line-through block">{formatPrice(String(originalDay))}</span>
                    )}
                    <span className="text-xl font-bold text-gold">{formatPrice(car.pricing.per_day)}</span>
                  </div>
                </div>
                {savings > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mt-2 pt-2 border-t border-gold/20 flex justify-between text-xs"
                  >
                    <span className="text-green-400 font-medium">{t("youSave")}</span>
                    <span className="text-green-400 font-bold">{formatPrice(String(savings))}</span>
                  </motion.div>
                )}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="space-y-3 mt-5"
              >
                {/* Book Now → Booking page with pre-filled data */}
                <a
                  href={`/${locale === "en" ? "" : locale + "/"}booking/${car.slug}?pickup=${encodeURIComponent(pickupLocation)}&drop=${encodeURIComponent(dropLocation)}&from=${pickupDate}&to=${returnDate}`}
                  className="group relative overflow-hidden flex items-center justify-center gap-2 w-full py-4 rounded-xl
                             bg-gradient-to-r from-gold to-gold/90 text-black font-bold text-sm
                             shadow-[0_8px_25px_rgba(200,169,81,0.3)] hover:shadow-[0_12px_35px_rgba(200,169,81,0.45)]
                             transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12
                                -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {t("bookNow")}
                    {Icons.arrow}
                  </span>
                </a>
                <a
                  href={waCarDetailWithDates({ carName: carTitle, carSlug: car.slug, pickupLocation, dropLocation, pickupDate: pickupDate || '', returnDate: returnDate || '', pickupTime: "10:00", locale: locale as "en" | "ar" })}
                  target="_blank"
                  className="group relative overflow-hidden flex items-center justify-center gap-2 w-full py-3.5 rounded-xl
                             border border-white/10 text-gray-300 font-medium hover:bg-white/5 hover:border-gold/30 transition-all"
                >
                  <span className="flex items-center gap-2">
                    {Icons.whatsapp}
                    {t("whatsapp")}
                  </span>
                </a>
                <a href="tel:+971501564849"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-white/10 text-gray-300 font-medium hover:bg-white/5 hover:border-white/20 transition-all group">
                  {Icons.phone}
                  {t("call")}
                </a>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 }}
                className="mt-5 pt-5 border-t border-white/10 space-y-3"
              >
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {Icons.star}
                  <span className="text-white">{t("googleRating")}</span> {t("googleLabel")} <span className="text-white">{t("reviewsCount")}</span> {t("reviewsLabel")}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {Icons.check}
                  {t("freeDelivery")}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {Icons.shield}
                  {t("insuranceBadge")}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/*  SECTION 3: REQUIREMENTS                */}
      {/* ════════════════════════════════════════ */}
      <section className="py-12 md:py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="text-center mb-10"
          >
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-gold mb-4 font-medium">{t("requirements")}</span>
            <h2 className="font-serif text-3xl md:text-4xl text-white">{t("whatYouNeed")}</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-transparent mx-auto mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M8 8h8M8 12h6M8 16h4"/></svg>, title: t("validLicense"), desc: t("licenseDesc") },
              { icon: <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>, title: t("minAge"), desc: t("ageDesc") },
              { icon: <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>, title: t("securityDepositLabel"), desc: t("depositDesc") },
              { icon: <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 20h16M4 20V4m16 16V4M4 8h16M4 12h16M4 16h16"/></svg>, title: t("passportId"), desc: t("passportDesc") },
            ].map((req, i) => (
              <motion.div key={req.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.03, y: -3 }}
                className="group p-5 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01]
                           border border-white/[0.08] hover:border-gold/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center
                              mb-4 group-hover:bg-gold/20 group-hover:border-gold/40 transition-all duration-300">
                  {req.icon}
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{req.title}</h3>
                <p className="text-xs text-gray-500">{req.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/*  SECTION 4: CUSTOMER REVIEWS            */}
      {/* ════════════════════════════════════════ */}
      <section className="py-12 md:py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="text-center mb-10"
          >
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-gold mb-4 font-medium">{t("testimonials")}</span>
            <h2 className="font-serif text-3xl md:text-4xl text-white">{t("whatCustomersSay")}</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-transparent mx-auto mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: t("testimonial1Name"), initial: "AM", rating: 5, text: t("testimonial1Text"), date: t("testimonial1Date") },
              { name: t("testimonial2Name"), initial: "SC", rating: 5, text: t("testimonial2Text"), date: t("testimonial2Date") },
              { name: t("testimonial3Name"), initial: "RS", rating: 5, text: t("testimonial3Text"), date: t("testimonial3Date") },
            ].map((review, i) => (
              <motion.div key={review.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01]
                           border border-white/[0.08] hover:border-gold/20 transition-all duration-300"
              >
                {/* Quote mark */}
                <div className="absolute top-4 right-5 text-4xl font-serif text-gold/10 leading-none">"</div>
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <svg key={si} className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                {/* Text */}
                <p className="text-gray-400 text-sm leading-relaxed mb-5">&ldquo;{review.text}&rdquo;</p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center
                                text-black text-xs font-bold">
                    {review.initial}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{review.name}</div>
                    <div className="text-gray-600 text-xs">{review.date}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/*  SECTION 5: RELATED CARS                */}
      {/* ════════════════════════════════════════ */}
      {relatedCars.length > 0 && (
        <section className="py-12 md:py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: easeOut }}
              className="text-center mb-10"
            >
              <span className="inline-block text-xs uppercase tracking-[0.25em] text-gold mb-4 font-medium">{t("similarCars")}</span>
              <h2 className="font-serif text-3xl md:text-4xl text-white">{t("youMayAlsoLike")}</h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-transparent mx-auto mt-4" />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedCars.map((rc, i) => (
                <motion.a key={rc.slug} href={locale === "en" ? `/car/${rc.slug}` : `/${locale}/car/${rc.slug}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group block rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01]
                             border border-white/[0.08] hover:border-gold/30 overflow-hidden transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={rc.thumbnail} alt={rc.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent" />
                    {/* Brand badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm
                                    border border-white/10 text-[10px] font-medium text-white/80">
                      {rc.brand}
                    </div>
                    {/* Price */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-400">{t("from")}</div>
                        <div className="text-sm font-bold text-gold">{formatPrice(rc.pricing.per_day)} <span className="text-[10px] text-gray-500 font-normal">{t("perDaySuffix")}</span></div>
                      </div>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-white group-hover:text-gold transition-colors truncate">
                      {getTitle(rc.slug, rc.title)}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-500">
                      <span>{rc.car_type ? getTypeLabel(rc.car_type) : t("luxury")}</span>
                      <span>·</span>
                      <span>{rc.specs.model_year}</span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════ */}
      {/*  SECTION 6: FAQ                         */}
      {/* ════════════════════════════════════════ */}
      <section className="py-12 md:py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="text-center mb-10"
          >
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-gold mb-4 font-medium">{t("faq")}</span>
            <h2 className="font-serif text-3xl md:text-4xl text-white">{t("faqTitle")}</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-transparent mx-auto mt-4" />
          </motion.div>

          <div className="space-y-3">
            {Array.from({ length: 8 }, (_, i) => ({
              q: t("faqQ" + (i + 1)),
              a: t("faqA" + (i + 1)),
            })).map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/*  LIGHTBOX — Fullscreen Image Viewer     */}
      {/* ════════════════════════════════════════ */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            {/* ═══ Brand watermark ═══ */}
            <div className="absolute top-6 left-6 z-10">
              <span className="text-xs font-bold text-white/60 tracking-wide block leading-tight">{t("vipWatermark").split(" ")[0]}</span>
              <span className="text-[7px] text-gray-500 uppercase tracking-[0.15em] block leading-tight">{t("vipWatermark")}</span>
            </div>

            {/* Image counter */}
            <div className="absolute top-6 right-6 z-10 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/70 text-xs font-medium">
              {activeImage + 1} / {allImages.length}
            </div>

            {/* Previous */}
            {allImages.length > 1 && (
              <button onClick={(e) => { e.stopPropagation(); setActiveImage((i) => (i - 1 + allImages.length) % allImages.length); }}
                className="absolute left-2 md:left-4 z-10 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 backdrop-blur-sm
                           border border-white/10 flex items-center justify-center
                           text-white/80 hover:text-gold hover:border-gold/40 hover:bg-gold/10
                           transition-all duration-300 hover:scale-110 group">
                <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Image container with rounded corners */}
            <div className="relative max-h-[85vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
              {/* Gold border glow */}
              <div className="absolute -inset-1 bg-gradient-to-b from-gold/30 via-gold/10 to-transparent rounded-2xl blur-sm" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={allImages[activeImage]}
                    alt={car.title}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: easeOut }}
                    className="max-h-[82vh] max-w-[85vw] object-contain rounded-2xl"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Next */}
            {allImages.length > 1 && (
              <button onClick={(e) => { e.stopPropagation(); setActiveImage((i) => (i + 1) % allImages.length); }}
                className="absolute right-2 md:right-4 z-10 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 backdrop-blur-sm
                           border border-white/10 flex items-center justify-center
                           text-white/80 hover:text-gold hover:border-gold/40 hover:bg-gold/10
                           transition-all duration-300 hover:scale-110 group">
                <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2 px-4"
                onClick={(e) => e.stopPropagation()}>
                {allImages.slice(0, 9).map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-10 h-8 md:w-14 md:h-10 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      i === activeImage
                        ? "border-gold scale-110 shadow-[0_0_12px_rgba(200,169,81,0.3)]"
                        : "border-white/20 opacity-50 hover:opacity-100 hover:border-white/40"
                    }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Close button - bottom center */}
            <button onClick={() => setLightboxOpen(false)}
              className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 z-10 px-5 py-2 rounded-full
                         bg-white/5 backdrop-blur-sm border border-white/10 text-white/60 text-xs
                         hover:bg-white/10 hover:text-white transition-all flex items-center gap-2">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

