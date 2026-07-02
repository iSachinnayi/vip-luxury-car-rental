// ═══════════════════════════════════════════════
//  Single Car Page — Gallery + Booking + Deposit
//  Design: "The Showroom" — Cinematic Luxury
// ═══════════════════════════════════════════════

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { sampleCars } from "@/data/sampleCars";
import { notFound } from "next/navigation";

// ─── CURRENCY CONFIG ───
const CURRENCIES: Record<string, { symbol: string; rate: number }> = {
  AED: { symbol: "د.إ", rate: 1 },
  USD: { symbol: "$", rate: 0.27 },
  EUR: { symbol: "€", rate: 0.25 },
  GBP: { symbol: "£", rate: 0.21 },
  RUB: { symbol: "₽", rate: 24.5 },
  INR: { symbol: "₹", rate: 22.8 },
  SAR: { symbol: "ر.س", rate: 1.02 },
};

export default async function SingleCarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CarDetail slug={slug} />;
}

function CarDetail({ slug }: { slug: string }) {
  const car = sampleCars.find((c) => c.slug === slug);
  if (!car) return notFound();

  const [selectedCurrency, setSelectedCurrency] = useState("AED");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const galleryParallax = useTransform(scrollYProgress, [0, 0.3], [0, 150]);

  const currency = CURRENCIES[selectedCurrency] || CURRENCIES.AED;

  const convertPrice = (aedPrice: number) => {
    return Math.round(aedPrice * currency.rate).toLocaleString();
  };

  const formatPrice = (aedPrice: string) => {
    if (aedPrice === "—") return "—";
    const price = parseInt(aedPrice || "0");
    return `${currency.symbol}${convertPrice(price)}${selectedCurrency !== "AED" ? ` ${selectedCurrency}` : ""}`;
  };

  const dayPrice = parseInt(car.pricing.per_day || "0");
  const weekPrice = parseInt(car.pricing.per_week || "0");
  const monthPrice = parseInt(car.pricing.per_month || "0");
  const originalDay = car.pricing.original_per_day ? parseInt(car.pricing.original_per_day) : null;
  const savings = originalDay ? originalDay - dayPrice : 0;

  return (
    <main className="min-h-screen bg-dark">
      {/* ═══ SECTION 1: GALLERY ═══ */}
      <section ref={galleryRef} className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: galleryParallax }}>
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-dark to-dark/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/30" />
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-6 left-6 z-20"
        >
          <Link
            href="/all-cars"
            className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md 
                       rounded-full border border-white/10 text-white text-sm 
                       hover:bg-gold hover:text-black transition-all"
          >
            ← All Cars
          </Link>
        </motion.div>

        {/* Currency Selector on Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-6 right-6 z-20"
        >
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 
                       text-white text-sm focus:border-gold/50 outline-none transition-colors"
          >
            {Object.entries(CURRENCIES).map(([code, c]) => (
              <option key={code} value={code} className="bg-dark">
                {c.symbol} {code}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Car Title + Price on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
              <span className="text-gold">{car.brand}</span>
              <span>·</span>
              <span>{car.car_type}</span>
              <span>·</span>
              <span>{car.specs.model_year}</span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              {car.title}
            </h1>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-baseline gap-2">
                {originalDay && (
                  <span className="text-gray-500 text-lg line-through">
                    {formatPrice(String(originalDay))}
                  </span>
                )}
                <span className="text-4xl md:text-5xl font-bold text-gold">
                  {formatPrice(car.pricing.per_day)}
                </span>
                <span className="text-gray-400 text-sm">/DAY</span>
              </div>
              {originalDay && (
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full border border-red-500/30"
                >
                  {car.pricing.discount_day}
                </motion.span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white/40 text-sm flex flex-col items-center"
          >
            <span>↓</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ SECTION 2: DETAILS + BOOKING ═══ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* ═══ LEFT: DETAILS ═══ */}
          <div className="lg:col-span-2 space-y-12">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { label: "Model Year", value: car.specs.model_year || "2025", icon: "📅" },
                { label: "KM / Day", value: `${car.km_limits.per_day || "300"} km`, icon: "📏" },
                { label: "Extra KM", value: `AED ${car.km_limits.extra_km || "5"}`, icon: "⚡" },
                { label: "Type", value: car.car_type || "Luxury", icon: "🏎️" },
              ].map((stat) => (
                <div key={stat.label}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]
                             hover:border-gold/30 transition-all text-center"
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                  <div className="text-white font-bold mt-1">{stat.value}</div>
                </div>
              ))}
            </motion.div>

            {/* Pricing Table with Strikethrough */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-2xl text-white mb-4">Rental Pricing</h2>
              <div className="w-12 h-0.5 bg-gold mb-6" />

              {savings > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-gold/10 to-red-500/5 
                             border border-gold/20 flex items-center gap-3"
                >
                  <span className="text-2xl">🔥</span>
                  <div>
                    <span className="text-gold font-bold">Limited Time Offer</span>
                    <span className="text-gray-400 text-sm ml-2">
                      Save AED {savings.toLocaleString()}/day — Book longer for bigger discounts!
                    </span>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Per Day", price: car.pricing.per_day, original: car.pricing.original_per_day, discount: car.pricing.discount_day, icon: "☀️" },
                  { label: "Per Week", price: car.pricing.per_week, original: car.pricing.original_per_week, discount: car.pricing.discount_week, icon: "📅" },
                  { label: "Per Month", price: car.pricing.per_month, original: car.pricing.original_per_month, discount: car.pricing.discount_month, icon: "📆" },
                  { label: "Per Hour", price: "—", icon: "⏱️" },
                ].map((pkg) => (
                  <div key={pkg.label}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]
                               hover:border-gold/30 transition-all text-center relative overflow-hidden"
                  >
                    {pkg.discount && (
                      <div className="absolute -top-2 -right-2 w-14 h-14">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 
                                      rotate-45 translate-x-4 -translate-y-4" />
                        <span className="absolute top-1 right-1 text-[9px] font-bold text-white rotate-12">
                          {pkg.discount}
                        </span>
                      </div>
                    )}
                    <div className="text-2xl mb-2">{pkg.icon}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{pkg.label}</div>
                    {pkg.original && (
                      <div className="text-xs text-gray-500 line-through mb-0.5">{formatPrice(pkg.original)}</div>
                    )}
                    <div className="text-lg font-bold text-gold">{formatPrice(pkg.price || "0")}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* KM + Deposit Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  📏 Included Mileage
                  {car.km_limits.original_per_day && <span className="text-gold text-xs">(Upgraded)</span>}
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Per Day", value: car.km_limits.per_day || "300", original: car.km_limits.original_per_day },
                    { label: "Per Week", value: car.km_limits.per_week || "2100", original: car.km_limits.original_per_week },
                    { label: "Per Month", value: car.km_limits.per_month || "5000", original: car.km_limits.original_per_month },
                  ].map((km) => (
                    <div key={km.label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{km.label}</span>
                      <div className="flex items-center gap-2">
                        {km.original && <span className="text-gray-600 line-through text-xs">{km.original} KM</span>}
                        <span className="text-white font-bold">{km.value} KM</span>
                        {km.original && (
                          <span className="text-green-400 text-[10px] font-bold">
                            +{Math.round((parseInt(km.value) / parseInt(km.original) - 1) * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-500">
                  Extra KM: <span className="text-white">{car.km_limits.extra_km || "5"} AED/km</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <h3 className="text-sm font-bold text-white mb-3">💎 Deposit Options</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-400">✅</span>
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">No Deposit Fee</div>
                      <div className="text-gray-400 text-xs">
                        Pay <span className="text-green-400">AED {car.deposit.no_deposit_fee || "200"}/day</span> → No security deposit
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <span className="text-yellow-400">🔒</span>
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">Security Deposit</div>
                      <div className="text-gray-400 text-xs">
                        Pay <span className="text-yellow-400">AED {parseInt(car.deposit.security || "5000").toLocaleString()}</span> (refundable)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ RIGHT: BOOKING FORM ═══ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24 self-start"
          >
            <div className="p-6 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02]
                            border border-white/10 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white mb-6">Book This Car</h3>

              {/* Currency Selector */}
              <div className="mb-6">
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                  Currency
                </label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-white
                             focus:border-gold/50 focus:outline-none transition-colors"
                >
                  {Object.entries(CURRENCIES).map(([code, c]) => (
                    <option key={code} value={code}>
                      {c.symbol} {code}
                    </option>
                  ))}
                </select>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Pickup Location</label>
                  <input type="text" defaultValue="Dubai" readOnly
                    className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-white
                               focus:border-gold/50 outline-none transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Pickup Date</label>
                    <input type="date"
                      className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-white
                                 focus:border-gold/50 outline-none transition-colors [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Return Date</label>
                    <input type="date"
                      className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-white
                                 focus:border-gold/50 outline-none transition-colors [color-scheme:dark]" />
                  </div>
                </div>

                {/* Deposit Options */}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                    Deposit Protection Plan
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-start gap-3 p-3 rounded-xl border border-gold/50 bg-gold/5 cursor-pointer">
                      <input type="radio" name="deposit" defaultChecked className="mt-1 accent-gold" />
                      <div>
                        <div className="text-white text-sm font-medium">🔹 No Deposit Fee — AED {car.deposit.no_deposit_fee || "200"}/day</div>
                        <div className="text-gray-400 text-xs mt-0.5">Avoid blocking AED {parseInt(car.deposit.security || "5000").toLocaleString()} as security</div>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.03] cursor-pointer">
                      <input type="radio" name="deposit" className="mt-1 accent-gold" />
                      <div>
                        <div className="text-white text-sm font-medium">🔒 Security Deposit — AED {parseInt(car.deposit.security || "5000").toLocaleString()}</div>
                        <div className="text-gray-400 text-xs mt-0.5">Fully refundable upon return</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Total + Savings */}
              <div className="mt-6 p-4 rounded-xl bg-gold/10 border border-gold/20">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Estimated Total</span>
                  <div className="text-right">
                    {originalDay && (
                      <span className="text-xs text-gray-500 line-through block">{formatPrice(String(originalDay))}</span>
                    )}
                    <span className="text-xl font-bold text-gold">{formatPrice(car.pricing.per_day)}</span>
                  </div>
                </div>
                {savings > 0 && (
                  <div className="mt-2 pt-2 border-t border-gold/20 flex justify-between text-xs">
                    <span className="text-green-400">✨ You Save</span>
                    <span className="text-green-400 font-bold">{formatPrice(String(savings))}</span>
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 mt-6">
                <button className="w-full py-4 bg-gold text-black font-bold rounded-xl
                                   hover:shadow-lg hover:shadow-gold/30 transition-all
                                   relative overflow-hidden">
                  🔹 Request for Quote
                </button>
                <a href={`https://wa.me/971501564849?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(car.title)}`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl
                             border border-green-500/30 text-green-400 font-medium
                             hover:bg-green-500/10 transition-all">
                  💬 WhatsApp
                </a>
                <a href="tel:+971501564849"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl
                             border border-white/10 text-gray-300 font-medium
                             hover:bg-white/5 transition-all">
                  📞 Call +971 50 156 4849
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
