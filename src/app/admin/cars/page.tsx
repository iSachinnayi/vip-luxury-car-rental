"use client";

// ═══════════════════════════════════════════════
//  Admin Cars — Fleet manager with edit-first UX
//  Click card = edit. View live = secondary.
// ═══════════════════════════════════════════════

import { useState, useEffect } from "react";
import Link from "next/link";
import { SearchIcon, FilterIcon, EditIcon } from "@/components/admin/Icons";

interface CarSummary {
  id: number;
  title: string;
  slug: string;
  brand: string;
  car_type: string;
  pricing: { per_day: string };
  thumbnail: string;
  images: string[];
}

export default function AdminCarsPage() {
  const [cars, setCars] = useState<CarSummary[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/admin/api/cars");
        const data = await res.json();
        setCars(data.cars || []);
        setBrands(data.brands || []);
      } catch (err) { console.error("Fetch cars error:", err); } finally { setLoading(false); }
    }
    load();
  }, []);

  const filtered = cars.filter((c) => {
    if (brandFilter !== "all" && c.brand !== brandFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q) || c.car_type.toLowerCase().includes(q);
  });

  const types = [...new Set(cars.map((c) => c.car_type))];

  const brandOptions = brands.map((b) => ({ value: b, label: b }));

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white font-serif">Cars</h1>
          <p className="text-gray-500 text-sm mt-0.5">{cars.length} vehicles in fleet</p>
        </div>
        <Link
          href="/admin/cars/new/edit"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gold text-dark text-sm font-semibold rounded-lg hover:bg-gold-500 transition-all shadow-lg shadow-gold/5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add New Car
        </Link>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, brand or type..."
            className="w-full bg-dark-card/50 border border-dark-border/60 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gold/30 transition-all"
          />
        </div>
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="bg-dark-card/50 border border-dark-border/60 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-gold/30 transition-all min-w-[150px] appearance-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 10px center", backgroundRepeat: "no-repeat", backgroundSize: "16px" }}
        >
          <option value="all">All Brands</option>
          {brandOptions.map((b) => (<option key={b.value} value={b.value}>{b.label}</option>))}
        </select>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Vehicles", value: cars.length, accent: "text-gold" },
          { label: "Brands", value: brands.length, accent: "text-white" },
          { label: "Filtered", value: filtered.length, accent: "text-white" },
          { label: "Categories", value: types.length, accent: "text-white" },
        ].map((s) => (
          <div key={s.label} className="bg-dark-card/40 border border-dark-border/60 rounded-xl p-3.5 text-center">
            <p className={`text-lg font-bold font-serif ${s.accent}`}>{s.value}</p>
            <p className="text-gray-600 text-[10px] uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Car Grid ── */}
      {loading ? (
        <div className="text-center py-12 text-gray-600 text-sm">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((car) => (
            <div key={car.id} className="bg-dark-card/60 border border-dark-border/60 rounded-xl overflow-hidden hover:border-gold/25 transition-all group">
              {/* Clickable image → edit page */}
              <Link href={`/admin/cars/${car.slug}/edit`} className="block aspect-[16/10] bg-dark/60 overflow-hidden relative">
                {car.thumbnail ? (
                  <img src={car.thumbnail} alt={car.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700 text-[10px] uppercase tracking-wider">No Image</div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-gold text-dark text-xs font-semibold px-3 py-1.5 rounded-lg">Manage Car</span>
                </div>
              </Link>

              {/* Info */}
              <div className="p-3.5">
                <Link href={`/admin/cars/${car.slug}/edit`} className="block">
                  <h3 className="text-sm font-semibold text-white hover:text-gold transition-colors truncate">{car.title}</h3>
                  <p className="text-[11px] text-gold/80 mt-0.5">{car.brand}</p>
                </Link>

                <div className="flex items-center justify-between mt-2.5">
                  <p className="text-xs text-gray-400">
                    From <span className="text-gold font-semibold">AED {parseInt(car.pricing.per_day || "0").toLocaleString()}</span><span className="text-gray-600">/day</span>
                  </p>
                  <span className="text-[9px] text-gray-600 bg-dark/40 px-2 py-0.5 rounded uppercase tracking-wider">{car.car_type}</span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dark-border/40">
                  <Link
                    href={`/admin/cars/${car.slug}/edit`}
                    className="flex-1 text-center px-3 py-1.5 bg-gold/10 border border-gold/20 text-gold text-[11px] font-medium rounded-lg hover:bg-gold/20 transition-all"
                  >
                    <EditIcon size={12} className="inline mr-1" /> Edit
                  </Link>
                  <Link
                    href={`/car/${car.slug}/`}
                    target="_blank"
                    className="px-3 py-1.5 text-[11px] text-gray-500 border border-dark-border/60 rounded-lg hover:text-white hover:border-gray-600 transition-all"
                  >
                    View Live
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-600">
          <p className="text-sm">No vehicles match your filters.</p>
          {search || brandFilter !== "all" ? (
            <button onClick={() => { setSearch(""); setBrandFilter("all"); }} className="text-gold text-xs mt-2 hover:underline">Clear filters</button>
          ) : null}
        </div>
      )}
    </div>
  );
}
