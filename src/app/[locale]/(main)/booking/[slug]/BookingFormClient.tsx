// ═══════════════════════════════════════════════
//  Booking Form Client Component
//  Complete booking form with deposit logic
// ═══════════════════════════════════════════════

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { CarCardData } from "@/types/car";
import { useCurrency } from "@/lib/CurrencyContext";
import { useCarTranslation } from "@/lib/useCarTranslation";
import { waBookingRequest, waBookingSuccess } from "@/lib/whatsapp";
import { Icons } from "@/lib/icons";

// ─── Constants ───
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
const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

// ─── Location Select ───
function LocationSelect({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
                   hover:border-gold/30 transition-all duration-300 text-white text-sm outline-none cursor-pointer"
      >
        <span className="flex-shrink-0">{Icons.mapPin}</span>
        <span className="flex-1 text-left">{locale === "ar" ? (LOCATIONS_AR[value] || value) : value}</span>
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
            transition={{ duration: 0.15, ease: easeOut }}
            className="absolute z-50 mt-1.5 w-full rounded-xl border border-white/[0.08] bg-dark-card/95 backdrop-blur-xl
                       shadow-2xl shadow-black/50 overflow-hidden"
          >
            {LOCATIONS.map((locName) => (
              <button key={locName} type="button" onClick={() => { onChange(locName); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-all duration-200
                  ${value === locName
                    ? "bg-gold/10 text-gold border-l-2 border-gold"
                    : "text-gray-300 hover:bg-white/[0.04] hover:text-white border-l-2 border-transparent"
                  }`}
              >
                {Icons.mapPin}
                {locale === "ar" ? (LOCATIONS_AR[locName] || locName) : locName}
                {value === locName && (
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

// ─── Main Component ───
export default function BookingFormClient({ car, initialPickup, initialDrop, initialFrom, initialTo }: {
  car: CarCardData;
  initialPickup: string;
  initialDrop: string;
  initialFrom: string;
  initialTo: string;
}) {
  const locale = useLocale();
  const t = useTranslations("booking");
  const carT = useTranslations("car");
  const { getTitle } = useCarTranslation();
  const carName = getTitle(car.slug, car.title);
  const { code: currencyCode, symbol, rate } = useCurrency();

  // ─── Car Type Labels ───
  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      "Sports": carT("typeSports"),
      "Luxury": carT("typeLuxury"),
      "SUV": carT("typeSUV"),
    };
    return map[type] || type;
  };

  // ─── Form State ───
  const [pickupLocation, setPickupLocation] = useState(initialPickup);
  const [dropLocation, setDropLocation] = useState(initialDrop);
  const [pickupDate, setPickupDate] = useState(initialFrom);
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnDate, setReturnDate] = useState(initialTo);
  const [returnTime, setReturnTime] = useState("10:00");
  const [depositOption, setDepositOption] = useState<"security" | "noDeposit">("security");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [bookingId, setBookingId] = useState("");

  // ─── Pricing ───
  const dayPrice = parseInt(car.pricing.per_day || "0");
  const noDepositFee = parseInt(car.deposit.no_deposit_fee || "200");
  const securityDeposit = parseInt(car.deposit.security || "5000");

  const calcDays = useCallback(() => {
    if (!pickupDate || !returnDate) return 1;
    const from = new Date(pickupDate);
    const to = new Date(returnDate);
    const diff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  }, [pickupDate, returnDate]);

  const days = calcDays();
  const rentalSubtotal = dayPrice * days;
  const taxAmount = Math.round(rentalSubtotal * 0.05);
  const depositFee = depositOption === "noDeposit" ? noDepositFee * days : 0;
  const grandTotal = rentalSubtotal + taxAmount + depositFee;

  const formatPrice = (aed: number) => {
    const converted = Math.round(aed * rate).toLocaleString();
    return `${symbol}${converted}${currencyCode !== "AED" ? ` ${currencyCode}` : ""}`;
  };

  // ─── Generate WhatsApp URL ───
  const depositTextEN = depositOption === "security"
    ? "Security Deposit (AED " + securityDeposit.toLocaleString() + ")"
    : "No Deposit (AED " + noDepositFee + "/day)";
  const depositTextAR = depositOption === "security"
    ? "إيداع تأمين (AED " + securityDeposit.toLocaleString() + ")"
    : "بدون إيداع (AED " + noDepositFee + "/يوم)";
  const depositText = locale === "ar" ? depositTextAR : depositTextEN;

  const whatsappUrl = waBookingRequest({
    carName: carName,
    carSlug: car.slug,
    pickupLocation,
    dropLocation,
    pickupDate: pickupDate || "",
    returnDate: returnDate || "",
    pickupTime,
    returnTime,
    depositText,
    totalPrice: formatPrice(grandTotal),
    fullName: fullName || "",
    phone: phone || "",
    email: email || "",
    notes: notes || "",
    locale: locale as "en" | "ar",
  });

  // ─── Submit Booking ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setSubmitError(t("formErrorNamePhone"));
      return;
    }
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carSlug: car.slug,
          carTitle: car.title,
          pickupLocation,
          dropLocation,
          pickupDate,
          pickupTime,
          returnDate,
          returnTime,
          depositOption,
          days,
          dayPrice,
          rentalSubtotal,
          taxAmount,
          depositFee,
          grandTotal,
          currencyCode,
          fullName,
          phone,
          email,
          notes,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || t("formErrorBookingFailed"));
      }

      const data = await res.json();
      setBookingId(data.bookingId || "");
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t("formErrorGeneral"));
    } finally {
      setSubmitting(false);
    }
  };

  // ─── WhatsApp for success page (includes booking ref) ───
  const successWhatsAppUrl = bookingId
    ? waBookingSuccess({ carName, bookingId, locale: locale as "en" | "ar" })
    : whatsappUrl;

  // ─── Success View ───
  if (submitted) {
    return (
      <main className="min-h-screen bg-dark pt-20 md:pt-24">
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <h1 className="font-serif text-3xl md:text-4xl text-white mb-4">{t("successTitle")}</h1>
          
          {/* Booking ID Badge */}
          {bookingId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-4"
            >
              <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="16" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              <span className="text-sm font-bold text-gold tracking-wider">{bookingId}</span>
            </motion.div>
          )}

          <p className="text-gray-400 mb-2">{t("successDesc", { car: getTitle(car.slug, car.title) })}</p>
          <p className="text-gray-500 text-sm mb-2">{t("successRefNote", { id: bookingId })}</p>
          <p className="text-gray-500 text-sm mb-8">{t("successContactNote")}</p>
          <div className="space-y-3">
            <a href={successWhatsAppUrl} target="_blank"
              className="group relative overflow-hidden flex items-center justify-center gap-2 w-full py-4 rounded-xl
                         bg-gradient-to-r from-gold to-gold/90 text-black font-bold text-sm
                         shadow-[0_8px_25px_rgba(200,169,81,0.3)] transition-all"
            >
              <span className="relative z-10 flex items-center gap-2">
                {Icons.whatsapp}
                {t("chatWhatsApp")}
                {Icons.arrow}
              </span>
            </a>
            <Link href="/" className="block w-full py-3 rounded-xl border border-white/10 text-gray-300 font-medium hover:bg-white/5 transition-all text-center text-sm">
              {t("backToHomepage")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-dark pt-16 md:pt-20">
      {/* ═══ Page Header ═══ */}
      <section className="border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Link href="/" className="hover:text-gold transition-colors">{t("homeBreadcrumb")}</Link>
              <span>/</span>
              <Link href={`/car/${car.slug}`} className="hover:text-gold transition-colors">{getTitle(car.slug, car.title)}</Link>
              <span>/</span>
              <span className="text-gold">{t("breadcrumbBook")}</span>
            </div>
            <h1 className="font-serif text-2xl md:text-4xl text-white">{t("pageTitle")}</h1>
            <p className="text-gray-500 text-sm mt-1">{t("pageDesc")}</p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* ═══ LEFT: Form ═══ */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] flex items-center gap-4"
            >
              <div className="w-24 h-16 md:w-32 md:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-dark">
                <img src={car.thumbnail} alt={car.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base md:text-lg font-bold text-white truncate">{getTitle(car.slug, car.title)}</h2>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span className="text-gold font-semibold">{car.brand}</span>
                  <span>·</span>
                  <span>{getTypeLabel(car.car_type || "Luxury")}</span>
                  <span>·</span>
                  <span>{car.specs.model_year}</span>
                </div>
                <div className="mt-2">
                  <span className="text-lg font-bold text-gold">{formatPrice(dayPrice)}</span>
                  <span className="text-xs text-gray-500 ml-1">{t("perDay")}</span>
                </div>
              </div>
            </motion.div>

            {/* Dates & Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="p-5 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08]"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                  {Icons.calendar}
                </div>
                <h3 className="text-sm font-bold text-white">{t("datesTime")}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">{t("pickupDateLabel")}</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">{Icons.calendar}</div>
                    <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm outline-none
                                 focus:border-gold/50 hover:border-white/20 transition-all [color-scheme:dark]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">{t("pickupTimeLabel")}</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">{Icons.clock}</div>
                    <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm outline-none
                                 focus:border-gold/50 hover:border-white/20 transition-all [color-scheme:dark]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">{t("returnDateLabel")}</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">{Icons.calendar}</div>
                    <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm outline-none
                                 focus:border-gold/50 hover:border-white/20 transition-all [color-scheme:dark]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">{t("returnTimeLabel")}</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">{Icons.clock}</div>
                    <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm outline-none
                                 focus:border-gold/50 hover:border-white/20 transition-all [color-scheme:dark]" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Pickup & Drop Locations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08]"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                  {Icons.mapPin}
                </div>
                <h3 className="text-sm font-bold text-white">{t("locationTitle")}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LocationSelect label={t("pickupLocationLabel")} value={pickupLocation} onChange={setPickupLocation} />
                <LocationSelect label={t("dropLocationLabel")} value={dropLocation} onChange={setDropLocation} />
              </div>
            </motion.div>

            {/* Deposit Option */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-5 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08]"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                  {Icons.shield}
                </div>
                <h3 className="text-sm font-bold text-white">{t("depositTitle")}</h3>
              </div>
              <div className="space-y-3">
                <button type="button" onClick={() => setDepositOption("security")}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left
                    ${depositOption === "security"
                      ? "border-gold/50 bg-gold/5"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                    }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                    ${depositOption === "security" ? "border-gold" : "border-white/30"}`}
                  >
                    {depositOption === "security" && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{t("securityDepositText", { amount: securityDeposit.toLocaleString() })}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{t("securityDepositDesc")}</div>
                  </div>
                </button>
                <button type="button" onClick={() => setDepositOption("noDeposit")}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left
                    ${depositOption === "noDeposit"
                      ? "border-gold/50 bg-gold/5"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                    }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                    ${depositOption === "noDeposit" ? "border-gold" : "border-white/30"}`}
                  >
                    {depositOption === "noDeposit" && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{t("noDepositText", { amount: noDepositFee })}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{t("noDepositDesc")}</div>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08]"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                  {Icons.user}
                </div>
                <h3 className="text-sm font-bold text-white">{t("contactTitle")}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">{t("fullNameLabel")}</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">{Icons.user}</div>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                      placeholder={t("fullNamePlaceholder")}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm outline-none
                                 focus:border-gold/50 hover:border-white/20 transition-all placeholder:text-gray-600" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">{t("phoneLabel")}</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">{Icons.phone}</div>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder={t("phonePlaceholder")}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm outline-none
                                 focus:border-gold/50 hover:border-white/20 transition-all placeholder:text-gray-600" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">{t("emailLabel")}</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">{Icons.mail}</div>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("emailPlaceholder")}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm outline-none
                                 focus:border-gold/50 hover:border-white/20 transition-all placeholder:text-gray-600" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">{t("specialRequestsLabel")}</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("specialRequestsPlaceholder")}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm outline-none
                               focus:border-gold/50 hover:border-white/20 transition-all placeholder:text-gray-600 resize-none" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* ═══ RIGHT: Booking Summary ═══ */}
          <div className="lg:sticky lg:top-24 self-start">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 backdrop-blur-xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <h3 className="text-base font-bold text-white">{t("bookingSummary")}</h3>
              </div>

              {/* Car */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-dark">
                  <img src={car.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white truncate">{getTitle(car.slug, car.title)}</div>
                  <div className="text-[10px] text-gray-500">{car.brand} · {getTypeLabel(car.car_type || "Luxury")}</div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 py-4 border-b border-white/[0.06]">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("durationLabel")}</span>
                  <span className="text-white">{locale === "ar" ? `${t("day")} ${days}` : `${days} ${days === 1 ? t("day") : t("days")}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("pickupLabel")}</span>
                  <span className="text-white text-right text-xs">{locale === "ar" ? (LOCATIONS_AR[pickupLocation] || pickupLocation) : pickupLocation}<br />{pickupDate || "—"} {locale === "ar" ? "في" : "at"} {pickupTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("returnLabel")}</span>
                  <span className="text-white text-right text-xs">{locale === "ar" ? (LOCATIONS_AR[dropLocation] || dropLocation) : dropLocation}<br />{returnDate || "—"} {locale === "ar" ? "في" : "at"} {returnTime}</span>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 py-4 border-b border-white/[0.06]">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("rentalLabel")} ({formatPrice(dayPrice)} × {days} {days === 1 ? t("day") : t("days")})</span>
                  <span className="text-white">{formatPrice(rentalSubtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("taxLabel")}</span>
                  <span className="text-white">{formatPrice(taxAmount)}</span>
                </div>
                {depositOption === "noDeposit" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-500">{t("noDepositFeeLabel")} ({formatPrice(noDepositFee)} × {days} {t("days")})</span>
                    <span className="text-amber-400">{formatPrice(depositFee)}</span>
                  </motion.div>
                )}
                {depositOption === "security" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t("securityDepositLabel")}</span>
                    <span className="text-emerald-400 text-xs">AED {securityDeposit.toLocaleString()} {t("refundable")}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4">
                <span className="text-base font-bold text-white">{t("totalLabel")}</span>
                <div className="text-right">
                  {depositOption === "noDeposit" && (
                    <div className="text-[10px] text-gray-500">{t("inclDepositFee")}</div>
                  )}
                  <span className="text-2xl font-bold text-gold">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Error */}
              {submitError && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                  {submitError}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mt-6">
                <button type="button" onClick={handleSubmit} disabled={submitting}
                  className="group relative overflow-hidden flex items-center justify-center gap-2 w-full py-4 rounded-xl
                             bg-gradient-to-r from-gold to-gold/90 text-black font-bold text-sm
                             shadow-[0_8px_25px_rgba(200,169,81,0.3)] hover:shadow-[0_12px_35px_rgba(200,169,81,0.45)]
                             transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12
                                -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                  <span className="relative z-10 flex items-center gap-2">
                    {submitting ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                          <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        {t("submittingText")}
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {t("confirmBookingText")}
                        {Icons.arrow}
                      </>
                    )}
                  </span>
                </button>

                <a href={whatsappUrl} target="_blank"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-white/10 text-gray-300 font-medium hover:bg-white/5 hover:border-gold/30 transition-all group"
                >
                  {Icons.whatsapp}
                  <span className="text-gold">{t("bookViaWhatsApp")}</span>
                </a>
                <a href="tel:+971501564849"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-white/10 text-gray-300 font-medium hover:bg-white/5 hover:border-white/20 transition-all group"
                >
                  {Icons.phone}
                  {t("call")}
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-5 pt-5 border-t border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-gray-600">
                  <svg className="w-3 h-3 text-green-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {t("freeDeliveryFeature")}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-600">
                  <svg className="w-3 h-3 text-green-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {t("insuranceFeature")}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-600">
                  <svg className="w-3 h-3 text-green-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {t("payFeature")}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
