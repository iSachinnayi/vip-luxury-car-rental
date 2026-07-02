// ═══════════════════════════════════════════════
//  Homepage — Hero + All Sections
//  Design: "The Showroom" — Cinematic Luxury
// ═══════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CATEGORIES = [
  { name: "Luxury", slug: "luxury-car-rental-in-dubai", count: 40 },
  { name: "Sports", slug: "sports-car-rental-in-dubai", count: 31 },
  { name: "SUV", slug: "suv-car-rental-in-dubai", count: 31 },
];

const BRANDS = [
  "Lamborghini", "Ferrari", "Rolls Royce", "Bentley", "Porsche",
  "Mercedes", "BMW", "Audi", "Range Rover", "McLaren",
  "Nissan", "Chevrolet", "Cadillac", "GMC", "Toyota",
];

const WHY_US = [
  { icon: "🚗", title: "350+ Premium Cars", desc: "Largest fleet of luxury, sports & exotic cars in Dubai" },
  { icon: "⭐", title: "167+ Google Reviews", desc: "Rated 4.9/5 by our happy customers" },
  { icon: "🚚", title: "Free Doorstep Delivery", desc: "Complimentary delivery anywhere in Dubai & UAE" },
];

export default function HomePage() {
  return (
    <main>
      {/* ════════════════════════════════════════════ */}
      {/*  SECTION 1: CINEMATIC HERO                  */}
      {/* ════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* CSS Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark/95 to-dark" />
          
          {/* Animated Gold Particles */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gold rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>

          {/* Gradient Orbs */}
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], rotate: [45, 0, 45] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Tagline */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 mb-6 text-xs uppercase tracking-[0.3em] 
                         text-gold border border-gold/30 rounded-full bg-gold/5"
            >
              Premium Luxury Car Rental Dubai
            </motion.span>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white 
                         leading-tight mb-6"
            >
              Drive Beyond
              <span className="block text-gradient-gold text-3xl md:text-4xl lg:text-5xl mt-2">
                LUXURY CAR RENTAL DUBAI
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8"
            >
              Exploring the royalty and extravagance of Dubai is incomplete without a luxurious ride.
            </motion.p>

            {/* Quick Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <div className="flex flex-col md:flex-row gap-3 p-3 rounded-2xl 
                            bg-white/[0.05] border border-white/10 backdrop-blur-xl">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-black/50">
                  <span>📍</span>
                  <input
                    type="text"
                    placeholder="Pickup Location"
                    defaultValue="Dubai"
                    className="bg-transparent text-white text-sm w-full outline-none placeholder-gray-500"
                  />
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-black/50">
                  <span>📅</span>
                  <input
                    type="date"
                    className="bg-transparent text-white text-sm w-full outline-none [color-scheme:dark]"
                  />
                </div>
                <Link
                  href="/all-cars"
                  className="btn-gold flex items-center justify-center gap-2 px-8 py-3 
                             whitespace-nowrap text-sm"
                >
                  🔍 Search Cars
                </Link>
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-16"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-gray-500 text-sm flex flex-col items-center gap-1"
              >
                <span>Explore Our Fleet</span>
                <span className="text-lg">↓</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/*  SECTION 2: CATEGORIES                       */}
      {/* ════════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">
              Choose Your Ride
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-transparent mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/${cat.slug}`}
                  className="group block relative h-64 md:h-80 rounded-3xl overflow-hidden 
                             border border-white/10 hover:border-gold/30 transition-all"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    i === 0 ? "from-gold/20 via-dark to-dark" :
                    i === 1 ? "from-red-500/10 via-dark to-dark" :
                    "from-blue-500/10 via-dark to-dark"
                  }`} />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-white 
                                   group-hover:text-gold transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">{cat.count} Cars Available</p>
                  </div>

                  <motion.div
                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gold/20 
                               flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="text-gold">→</span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/*  SECTION 3: WHY US                            */}
      {/* ════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">
              Why VIP Luxury Car Rental?
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-transparent mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {WHY_US.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-2xl glass-card hover:border-gold/20 
                           hover:bg-white/[0.05] transition-all group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/*  SECTION 4: BRAND SHOWCASE                    */}
      {/* ════════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">
              Rent A Car From Top Brands
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-transparent mx-auto" />
          </motion.div>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {BRANDS.map((brand, i) => (
              <motion.div
                key={brand}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/rent-${brand.toLowerCase().replace(/\s+/g, "-")}-in-dubai`}
                  className="block text-center p-4 md:p-6 rounded-2xl glass-card 
                             hover:border-gold/30 hover:bg-white/[0.05] transition-all group"
                >
                  <div className="text-xs md:text-sm font-bold text-gray-300 
                                group-hover:text-gold transition-colors">
                    {brand}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/*  SECTION 5: CTA — WhatsApp / Contact          */}
      {/* ════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-dark to-gold/5 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
              Ready to Drive Your Dream Car?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Book via WhatsApp and get instant confirmation. Free delivery anywhere in Dubai.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/971501564849"
                target="_blank"
                className="btn-gold flex items-center gap-2 px-8 py-4 text-base"
              >
                💬 Book via WhatsApp
              </a>
              <a
                href="tel:+971501564849"
                className="btn-dark flex items-center gap-2 px-8 py-4 text-base"
              >
                📞 Call +971 50 156 4849
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/*  FLOATING WHATSAPP BUTTON                    */}
      {/* ════════════════════════════════════════════ */}
      <motion.a
        href="https://wa.me/971501564849"
        target="_blank"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 
                   flex items-center justify-center text-2xl shadow-lg 
                   hover:bg-green-400 hover:scale-110 transition-all
                   shadow-green-500/30"
        title="Chat on WhatsApp"
      >
        💬
      </motion.a>
    </main>
  );
}
