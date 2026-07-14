// ═══════════════════════════════════════════════
//  LatestCars — Responsive 1/2/3/4-Up Carousel
//  12 cars, center highlighted, full-width
//  Mobile: 1 | Tablet: 2 | Desktop: 3 | Wide: 4
// ═══════════════════════════════════════════════

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import CarCard from "./CarCard";
import type { CarCardData } from "@/types/car";

function useIsRtl(): boolean {
  const [rtl, setRtl] = useState(false);
  useEffect(() => { setRtl(document.documentElement.dir === "rtl"); }, []);
  return rtl;
}

const AUTOPLAY_DELAY = 5000;

/** How many cards to show based on viewport width */
function getVisibleCount(w: number) {
  if (w < 640) return 1;      // Mobile
  if (w < 1024) return 2;     // Tablet
  if (w < 1400) return 3;     // Desktop / Medium
  return 4;                    // Wide / Large
}

export default function LatestCars({ type: carType }: { type?: string }) {
  const isRtl = useIsRtl();
  const [cars, setCars] = useState<CarCardData[]>([]);
  const [current, setCurrent] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [colW, setColW] = useState(400);
  const [visible, setVisible] = useState(3);
  const vpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = carType ? `/api/cars?type=${encodeURIComponent(carType)}` : "/api/cars";
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.cars) {
          const withImages = data.cars.filter((c: CarCardData) => c.thumbnail);
          const shuffled = [...withImages].sort(() => Math.random() - 0.5);
          setCars(shuffled.slice(0, 12));
        }
      })
      .catch((err) => console.error("LatestCars: fetch error", err));
  }, [carType]);

  // Measure + determine visible count
  useEffect(() => {
    const el = vpRef.current;
    if (!el) return;
    const m = () => {
      const w = el.clientWidth;
      const v = getVisibleCount(w);
      setVisible(v);
      setColW(w / v);
    };
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cars]);

  const goTo = useCallback(
    (i: number) => {
      // Keep current in range so we can always show `visible` items
      const max = cars.length - visible;
      const min = visible > 1 ? 1 : 0;
      setCurrent(Math.max(min, Math.min(max, i)));
    },
    [cars.length, visible]
  );
  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  useEffect(() => {
    if (isPaused || cars.length === 0) return;
    const timer = setInterval(next, AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [isPaused, next, cars.length]);

  if (cars.length < visible) return null;

  // Offset: center the `current` card in the visible window
  // For 3-up: show [current-1, current, current+1] → offset = -(current-1)*colW
  // For 2-up: show [current-1, current] → offset = -(current-1)*colW (if current>=1)
  // For 1-up: show [current] → offset = -current*colW
  const rawOffset = visible === 1
    ? -current * colW
    : -(current - 1) * colW;
  const offset = isRtl ? -rawOffset : rawOffset;

  return (
    <div className="relative mt-10 md:mt-14">
      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mb-5">
        {cars.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? "w-6 bg-gold shadow-[0_0_6px_rgba(200,169,81,0.3)]" : "w-1.5 bg-white/20 hover:bg-white/40"}`}
            aria-label={`Car ${i + 1}`} />
        ))}
      </div>

      {/* Stage */}
      <div className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Arrows */}
        <button onClick={isRtl ? next : prev}
          className="absolute -left-1 md:-left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-11 md:h-11 rounded-full bg-dark-card border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/40 transition-all duration-300 shadow-lg"
          aria-label={isRtl ? "Next" : "Previous"}>
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={isRtl ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} /></svg>
        </button>
        <button onClick={isRtl ? prev : next}
          className="absolute -right-1 md:-right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-11 md:h-11 rounded-full bg-dark-card border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/40 transition-all duration-300 shadow-lg"
          aria-label={isRtl ? "Previous" : "Next"}>
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={isRtl ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} /></svg>
        </button>

        {/* Viewport */}
        <div ref={vpRef} className="overflow-hidden rounded-xl">
          <motion.div className="flex" animate={{ x: offset }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {cars.map((car, i) => {
              const isCenter = i === current;
              const half = Math.floor((visible - 1) / 2);
              const isVisible = i >= current - half && i <= current + half + (visible % 2 === 0 ? 1 : 0);
              
              // Even visible count (2, 4): all cards full opacity, only active has gold border
              // Odd visible count (1, 3): center highlighted, sides faded for focus effect
              const isEvenLayout = visible % 2 === 0;
              
              return (
                <div key={car.id} className="shrink-0 px-2 md:px-3" style={{ width: colW }}>
                  <motion.div
                    animate={{
                      scale: isEvenLayout ? 1 : (isCenter ? 1 : 0.92),
                      opacity: isVisible ? (isEvenLayout ? 1 : (isCenter ? 1 : 0.5)) : 0,
                    }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative"
                  >
                    {isCenter && (
                      <div className="absolute -inset-[1px] rounded-xl border border-gold/40 pointer-events-none z-10" />
                    )}
                    <CarCard car={car} index={i} />
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Counter */}
        <div className="mt-3 text-center">
          <span className="text-[10px] uppercase tracking-[0.15em] text-gray-600">{current + 1} / {cars.length}</span>
        </div>
      </div>
    </div>
  );
}
