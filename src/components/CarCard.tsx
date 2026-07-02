// ═══════════════════════════════════════════════
//  CarCard — Premium Car Listing Card
//  Features: 3D tilt, strikethrough pricing, glassmorphism
// ═══════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { CarCardData } from "@/types/car";

interface CarCardProps {
  car: CarCardData;
  index?: number;
}

export default function CarCard({ car, index = 0 }: CarCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  const dayPrice = parseInt(car.pricing.per_day || "0");
  const weekPrice = parseInt(car.pricing.per_week || "0");
  const originalDay = car.pricing.original_per_day
    ? parseInt(car.pricing.original_per_day)
    : null;
  const kmDay = car.km_limits.per_day || "300";

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${-mousePos.y * 6}deg) rotateY(${mousePos.x * 6}deg)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg)",
        transition: isHovered ? "none" : "transform 0.6s ease",
      }}
    >
      {/* Card Container */}
      <div
        className={`
          relative overflow-hidden rounded-3xl border 
          ${isHovered ? "border-gold/50 shadow-2xl shadow-gold/20" : "border-white/10"}
          bg-dark-card transition-all duration-500
        `}
        style={{
          boxShadow: isHovered
            ? "0 30px 60px rgba(200, 169, 81, 0.15)"
            : "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* ═══ IMAGE SECTION ═══ */}
        <Link href={`/car/${car.slug}`} className="block relative h-64 md:h-72 overflow-hidden">
          {/* Image */}
          <motion.div
            className="absolute inset-0"
            animate={{
              scale: isHovered ? 1.08 : 1,
              x: isHovered ? mousePos.x * 10 : 0,
              y: isHovered ? mousePos.y * 10 : 0,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src={car.thumbnail || "/placeholder-car.webp"}
              alt={car.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-black/30 to-transparent" />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: `radial-gradient(circle at ${50 + mousePos.x * 20}% ${50 + mousePos.y * 20}%, rgba(200,169,81,0.08), transparent 60%)`,
            }}
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="px-3 py-1.5 bg-gold text-black text-xs font-bold rounded-full"
            >
              {car.specs.model_year || "2025"}
            </motion.span>
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="px-3 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs rounded-full border border-white/20"
            >
              {car.car_type || "Luxury"}
            </motion.span>
          </div>

          {/* Price on Image with Strikethrough */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="flex items-end justify-between">
              <div>
                {originalDay && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-400 text-sm line-through">
                      AED {originalDay.toLocaleString()}/DAY
                    </span>
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-full border border-red-500/30"
                    >
                      {car.pricing.discount_day || "20% OFF"}
                    </motion.span>
                  </div>
                )}
                <motion.span
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl md:text-4xl font-bold text-gold block"
                >
                  AED {dayPrice.toLocaleString()}
                </motion.span>
                <span className="text-gray-400 text-xs">/DAY · Free cancellation</span>
              </div>

              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 
                           flex items-center justify-center text-white hover:text-red-400 hover:border-red-400/50
                           transition-colors flex-shrink-0"
                onClick={(e) => e.preventDefault()}
              >
                ♡
              </motion.button>
            </div>
          </div>
        </Link>

        {/* ═══ CONTENT SECTION ═══ */}
        <div className="p-5 md:p-6 space-y-4">
          {/* Title + Brand */}
          <div>
            <Link href={`/car/${car.slug}`}>
              <h3 className="font-serif text-xl md:text-2xl font-bold text-white tracking-wide
                             group-hover:text-gold transition-colors duration-300">
                {car.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">{car.brand}</span>
              {car.categories.slice(0, 2).map((cat) => {
                const catName = typeof cat === "string" ? cat : cat.name;
                return (
                  <span key={catName} className="text-xs text-gray-600">· {catName}</span>
                );
              })}
            </div>
            {/* Animated Divider */}
            <motion.div
              className="h-0.5 bg-gradient-to-r from-gold to-transparent mt-3"
              initial={{ width: "30%" }}
              animate={{ width: isHovered ? "60%" : "30%" }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* ═══ INFO CARDS ═══ */}
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {/* Weekly */}
            <InfoCard
              icon="📅"
              label="WEEKLY"
              value={weekPrice ? `AED ${weekPrice.toLocaleString()}` : "—"}
              strikethrough={
                car.pricing.original_per_week
                  ? `AED ${parseInt(car.pricing.original_per_week).toLocaleString()}`
                  : undefined
              }
            />
            {/* KM */}
            <InfoCard
              icon="📏"
              label="KM/DAY"
              value={`${kmDay} KM`}
              strikethrough={
                car.km_limits.original_per_day
                  ? `${car.km_limits.original_per_day} KM`
                  : undefined
              }
            />
            {/* Deposit */}
            <InfoCard
              icon="💎"
              label="DEPOSIT"
              value={car.deposit.no_deposit_fee ? "No Deposit" : "Available"}
              highlight={!!car.deposit.no_deposit_fee}
            />
          </div>

          {/* ═══ CTA BUTTONS ═══ */}
          <div className="flex gap-3 pt-2">
            <Link
              href={`/car/${car.slug}`}
              className="flex-1 relative overflow-hidden rounded-xl bg-gold px-6 py-3.5
                         font-bold text-black text-sm text-center
                         transition-all duration-300 group/btn"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">🔹 Book Now</span>
              <span className="block text-[10px] opacity-70 mt-0.5">Free Cancellation</span>
            </Link>

            <a
              href={`https://wa.me/971501564849?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(car.title)}`}
              target="_blank"
              className="w-12 h-12 rounded-xl border border-white/10 bg-white/5
                         flex items-center justify-center text-lg
                         hover:border-green-500/50 hover:bg-green-500/10 transition-all"
              title="WhatsApp"
            >
              💬
            </a>

            <a
              href="tel:+971501564849"
              className="w-12 h-12 rounded-xl border border-white/10 bg-white/5
                         flex items-center justify-center text-lg
                         hover:border-gold/50 transition-all"
              title="Call Now"
            >
              📞
            </a>
          </div>
        </div>

        {/* Corner Glow */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-gold/5 rounded-full blur-3xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}

// ═══ INFO CARD SUB-COMPONENT ═══
function InfoCard({
  icon,
  label,
  value,
  strikethrough,
  highlight = false,
}: {
  icon: string;
  label: string;
  value: string;
  strikethrough?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`
        rounded-xl p-3 text-center border transition-all duration-300
        ${highlight ? "bg-green-500/10 border-green-500/30 ring-1 ring-green-500/20" : "bg-white/[0.03] border-white/[0.06]"}
        group-hover:bg-white/[0.06]
      `}
    >
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">{label}</div>
      {strikethrough && (
        <div className="text-[10px] text-gray-500 line-through mb-0.5">{strikethrough}</div>
      )}
      <div className={`text-xs font-bold ${highlight ? "text-green-400" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}
