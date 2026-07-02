// ═══════════════════════════════════════════════
//  All Cars — Real data from API + Filters + Grid
// ═══════════════════════════════════════════════

"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import CarCard from "@/components/CarCard";
import type { CarCardData } from "@/types/car";

export default function AllCarsPage() {
  const [cars, setCars] = useState<CarCardData[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    fetch("/api/cars")
      .then((r) => r.json())
      .then((data) => {
        setCars(data.cars);
        setBrands(data.brands);
        setTypes(data.types);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredCars = useMemo(() => {
    let result = [...cars];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q) || c.car_type.toLowerCase().includes(q));
    }
    if (selectedBrand !== "All") result = result.filter((c) => c.brand === selectedBrand);
    if (selectedType !== "All") result = result.filter((c) => c.car_type === selectedType);
    if (sortBy === "price-low") result.sort((a, b) => parseInt(a.pricing.per_day) - parseInt(b.pricing.per_day));
    else if (sortBy === "price-high") result.sort((a, b) => parseInt(b.pricing.per_day) - parseInt(a.pricing.per_day));
    else if (sortBy === "year") result.sort((a, b) => parseInt(b.specs.model_year) - parseInt(a.specs.model_year));
    return result;
  }, [cars, searchQuery, selectedBrand, selectedType, sortBy]);

  if (loading) return (
    <main className="min-h-screen bg-dark pt-8"><div className="max-w-7xl mx-auto px-4 flex items-center justify-center h-96">
      <div className="text-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" /><p className="text-gray-400">Loading cars...</p></div></div></main>
  );

  return (
    <main className="min-h-screen bg-dark pt-8 md:pt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white">All Cars</h1>
          <p className="text-gray-400 mt-2">{filteredCars.length} of {cars.length} cars</p>
        </motion.div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              <input type="text" placeholder='Search: "Red sports car under 2000 AED"' value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm placeholder-gray-600 focus:border-gold/30 outline-none" />
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-gold/30 outline-none">
              <option value="popular" className="bg-dark">🔥 Popular</option>
              <option value="price-low" className="bg-dark">💰 Low to High</option>
              <option value="price-high" className="bg-dark">💰 High to Low</option>
              <option value="year" className="bg-dark">📅 Newest</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-gold/30 outline-none">
              <option value="All" className="bg-dark">🏷️ All Brands</option>
              {brands.map((b) => <option key={b} value={b} className="bg-dark">{b}</option>)}
            </select>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-gold/30 outline-none">
              <option value="All" className="bg-dark">🚗 All Types</option>
              {types.map((t) => <option key={t} value={t} className="bg-dark">{t}</option>)}
            </select>
            {(selectedBrand !== "All" || selectedType !== "All" || searchQuery) && (
              <button onClick={() => { setSelectedBrand("All"); setSelectedType("All"); setSearchQuery(""); }}
                className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10">✕ Clear</button>
            )}
          </div>
        </div>

        {filteredCars.length === 0 ? (
          <div className="text-center py-20"><div className="text-4xl mb-4">🔍</div><h3 className="text-xl font-bold text-white mb-2">No cars found</h3><p className="text-gray-400">Try adjusting filters</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-16">
            {filteredCars.map((car, i) => <CarCard key={car.id} car={car} index={i} />)}
          </div>
        )}
      </div>
    </main>
  );
}
