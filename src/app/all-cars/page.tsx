// ═══════════════════════════════════════════════
//  All Cars — Listing Page with Filters + Grid
// ═══════════════════════════════════════════════

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CarCard from "@/components/CarCard";
import { sampleCars } from "@/data/sampleCars";

const ALL_BRANDS = [...new Set(sampleCars.map((c) => c.brand))].sort();
const ALL_TYPES = [...new Set(sampleCars.map((c) => c.car_type))].sort();

export default function AllCarsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  // Filter + Sort logic
  const filteredCars = useMemo(() => {
    let cars = [...sampleCars];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      cars = cars.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.car_type.toLowerCase().includes(q)
      );
    }

    // Brand filter
    if (selectedBrand !== "All") {
      cars = cars.filter((c) => c.brand === selectedBrand);
    }

    // Type filter
    if (selectedType !== "All") {
      cars = cars.filter((c) => c.car_type === selectedType);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        cars.sort((a, b) => parseInt(a.pricing.per_day) - parseInt(b.pricing.per_day));
        break;
      case "price-high":
        cars.sort((a, b) => parseInt(b.pricing.per_day) - parseInt(a.pricing.per_day));
        break;
      case "year":
        cars.sort((a, b) => parseInt(b.specs.model_year) - parseInt(a.specs.model_year));
        break;
      default: // popular - keep original order
        break;
    }

    return cars;
  }, [searchQuery, selectedBrand, selectedType, sortBy]);

  return (
    <main className="min-h-screen bg-dark pt-8 md:pt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white">
            All Cars
          </h1>
          <p className="text-gray-400 mt-2">
            {filteredCars.length} cars available · Find your perfect ride
          </p>
        </motion.div>

        {/* ═══ FILTER BAR ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Search Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* AI-Style Search */}
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                🔍
              </span>
              <input
                type="text"
                placeholder='Search: "Red sports car under 2000 AED"'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 
                           text-white text-sm placeholder-gray-600
                           focus:border-gold/30 focus:outline-none transition-colors"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden btn-dark flex items-center justify-center gap-2 px-6 py-3.5"
            >
              <span>⚙️</span>
              <span>Filters</span>
              <span className={`transition-transform ${showFilters ? "rotate-180" : ""}`}>▼</span>
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 
                         text-white text-sm
                         focus:border-gold/30 focus:outline-none transition-colors"
            >
              <option value="popular" className="bg-dark">🔥 Popular</option>
              <option value="price-low" className="bg-dark">💰 Price: Low to High</option>
              <option value="price-high" className="bg-dark">💰 Price: High to Low</option>
              <option value="year" className="bg-dark">📅 Newest First</option>
            </select>
          </div>

          {/* Filter Chips (Desktop) + Mobile Panel */}
          <AnimatePresence>
            {(showFilters || true) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 overflow-hidden"
              >
                {/* Brand Filter */}
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 
                             text-white text-sm
                             focus:border-gold/30 focus:outline-none transition-colors"
                >
                  <option value="All" className="bg-dark">🏷️ All Brands</option>
                  {ALL_BRANDS.map((b) => (
                    <option key={b} value={b} className="bg-dark">{b}</option>
                  ))}
                </select>

                {/* Type Filter */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 
                             text-white text-sm
                             focus:border-gold/30 focus:outline-none transition-colors"
                >
                  <option value="All" className="bg-dark">🚗 All Types</option>
                  {ALL_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-dark">{t}</option>
                  ))}
                </select>

                {/* Clear Filters */}
                {(selectedBrand !== "All" || selectedType !== "All" || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedBrand("All");
                      setSelectedType("All");
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 
                               text-sm hover:bg-red-500/10 transition-all"
                  >
                    ✕ Clear Filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ═══ CAR GRID ═══ */}
        {filteredCars.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No cars found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filters
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-16">
            {filteredCars.map((car, i) => (
              <CarCard key={car.id} car={car} index={i} />
            ))}
          </div>
        )}

        {/* Load More (placeholder for real pagination) */}
        {filteredCars.length >= 8 && (
          <div className="text-center pb-16">
            <button className="btn-dark px-8 py-3">
              Load More Cars ↓
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
