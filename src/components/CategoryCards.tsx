// ═══════════════════════════════════════════════
//  CategoryCards — 4-column with 3D Tilt Magic
//  wah kya chiz bnayi h ✨
// ═══════════════════════════════════════════════

"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const CATS = [
  { nameKey: "catLuxury", slug: "luxury-car-rental-in-dubai", count: 40,
    img: "/api/images/2024/11/1-Rolls-Royce-Cullinan-Black-2025.webp",
    tagKey: "catTagLuxury" },
  { nameKey: "catSports", slug: "sports-car-rental-in-dubai", count: 31,
    img: "/api/images/2024/04/Urus-Black-With-Green-1.webp",
    tagKey: "catTagSports" },
  { nameKey: "catSUV", slug: "suv-car-rental-in-dubai", count: 31,
    img: "/api/images/2024/06/1-Mercedes-G63-Black-2022.webp",
    tagKey: "catTagSUV" },
  { nameKey: "catSedan", slug: "all-cars", count: 7,
    img: "/api/images/2024/05/1-BMW-735i-Black.webp",
    tagKey: "catTagSedan" },
];

/* ───── Entrance direction variants ───── */
const directions = [
  { x: -60, y: 20 },   // Luxury — left se
  { x: 60, y: -20 },   // Sports — right se up
  { x: -60, y: -20 },  // SUV — left se up
  { x: 60, y: 20 },    // Sedan — right se
];

function TiltCard({ cat, index, t }: { cat: typeof CATS[0]; index: number; t: (key: string) => string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [imageScale, setImageScale] = useState(1);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    // 3D Tilt — max ±12°
    setTilt({
      x: ((y - cy) / cy) * -12,
      y: ((x - cx) / cx) * 12,
    });

    // Glow follows cursor — as percentage
    setGlowPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });

    // Image zoom on mouse move
    setImageScale(1.08);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlowPos({ x: 50, y: 50 });
    setIsHovered(false);
    setImageScale(1);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const dir = directions[index];

  return (
    <motion.div
      initial={{ opacity: 0, x: dir.x, y: dir.y, scale: 0.9 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.12,
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Link
        href={`/${cat.slug}`}
        className="group block relative rounded-2xl overflow-hidden
                   bg-dark border border-white/[0.06] hover:border-gold/30 
                   transition-all duration-500 select-none
                   shadow-[0_4px_20px_rgba(0,0,0,0.4)] 
                   hover:shadow-[0_20px_60px_rgba(200,169,81,0.2)]
                   aspect-[4/5]"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* ─── 3D Tilt Layer ─── */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute inset-0"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: "preserve-3d",
            transition: isHovered ? "none" : "transform 0.5s ease-out",
          }}
        >
          {/* ─── CAR IMAGE ─── */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <img
              src={cat.img}
              alt={t(cat.nameKey)}
              className="w-full h-full object-cover object-center
                         transition-transform duration-[800ms] ease-out"
              style={{ transform: `scale(${imageScale})` }}
              loading="lazy"
            />
          </div>

          {/* ─── Gradient overlay ─── */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/10 to-transparent" />

          {/* ─── BADGE ─── */}
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12 + 0.25, duration: 0.4 }}
            className="absolute top-4 left-4 inline-block px-3 py-1 text-[10px] uppercase tracking-[0.15em] 
                       text-gold border border-gold/30 rounded-full bg-dark/60 backdrop-blur-sm"
            style={{ transform: "translateZ(30px)" }}
          >
            {t(cat.tagKey)}
          </motion.span>

          {/* ─── BOTTOM CONTENT ─── */}
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6"
               style={{ transform: "translateZ(20px)" }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 + 0.3, duration: 0.4 }}
            >
              {/* Gold accent line */}
              <motion.div
                className="w-8 h-[2px] bg-gold rounded-full mb-3"
                animate={{ width: isHovered ? 48 : 32 }}
                transition={{ duration: 0.3 }}
              />

              {/* Category name */}
              <h3 className="font-serif text-xl md:text-2xl font-bold text-white
                             group-hover:text-gold transition-colors duration-400 mb-1">
                {t(cat.nameKey)}
              </h3>

              {/* Vehicle count + Browse */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs tracking-wide">
                  {cat.count} {t("vehicles")}
                </span>
                <motion.span
                  className="text-gold text-xs font-medium flex items-center gap-1"
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    x: isHovered ? 0 : 8,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {t("browse")} →
                </motion.span>
              </div>
            </motion.div>
          </div>

          {/* ─── Bottom gold glow line ─── */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent
                      origin-center"
            animate={{
              scaleX: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ transform: "translateZ(10px)" }}
          />
        </div>

        {/* ─── CURSOR GLOW (follows mouse) ─── */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${glowPos.x}% ${glowPos.y}%, rgba(200,169,81,0.08), transparent 40%)`,
          }}
        />
      </Link>
    </motion.div>
  );
}

export default function CategoryCards() {
  const t = useTranslations("home");
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {CATS.map((cat, i) => (
        <TiltCard key={cat.nameKey} cat={cat} index={i} t={t} />
      ))}
    </div>
  );
}
