// ═══════════════════════════════════════════════
//  Emirate Car Grid — Reusable for all location pages
//  Shows all cars with search, filter, sort & pagination
// ═══════════════════════════════════════════════

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import CarCard from "@/components/CarCard";
import { useCurrency } from "@/lib/CurrencyContext";
import type { CarCardData } from "@/types/car";

const PER_PAGE = 12;
const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

interface EmirateCarGridProps {
  emirateSlug: string;
  brandName?: string;
  categoryName?: string;
  pageTitle?: string;
}

export default function EmirateCarGrid({ emirateSlug, brandName, categoryName, pageTitle }: EmirateCarGridProps) {
  const t = useTranslations("allCars");
  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      "Sports": t("typeSports"),
      "Luxury": t("typeLuxury"),
      "SUV": t("typeSUV"),
    };
    return map[type] || type;
  };
  const router = useRouter();
  const isLanding = !brandName && !categoryName; // On emirate landing page — filters navigate to sub-pages
  const [cars, setCars] = useState<CarCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(brandName || "All");
  const [selectedType, setSelectedType] = useState(categoryName || "All");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/api/cars")
      .then((r) => r.json())
      .then((data) => {
        setCars(data.cars || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Compute unique brands & types
  const brands = useMemo(() => {
    const set = new Set<string>();
    cars.forEach((c) => c.brand && set.add(c.brand));
    return ["All", ...Array.from(set).sort()];
  }, [cars]);

  const types = useMemo(() => {
    const set = new Set<string>();
    cars.forEach((c) => c.car_type && set.add(c.car_type));
    return ["All", ...Array.from(set).sort()];
  }, [cars]);

  // Filter
  const filteredCars = useMemo(() => {
    let result = [...cars];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          (c.car_type || "").toLowerCase().includes(q) ||
          c.specs.model_year.includes(q)
      );
    }
    if (selectedBrand !== "All") result = result.filter((c) => c.brand === selectedBrand);
    if (selectedType !== "All") result = result.filter((c) => c.car_type === selectedType);
    if (sortBy === "price-low") result.sort((a, b) => parseInt(a.pricing.per_day) - parseInt(b.pricing.per_day));
    else if (sortBy === "price-high") result.sort((a, b) => parseInt(b.pricing.per_day) - parseInt(a.pricing.per_day));
    else if (sortBy === "year") result.sort((a, b) => parseInt(b.specs.model_year) - parseInt(a.specs.model_year));
    return result;
  }, [cars, searchQuery, selectedBrand, selectedType, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBrand, selectedType, sortBy]);

  const totalPages = Math.ceil(filteredCars.length / PER_PAGE);
  const pageCars = filteredCars.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-dark-card border border-dark-border/50 rounded-xl h-[380px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header with results count */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
        <p className="text-gray-400 text-sm">
          <span className="text-white font-medium">{filteredCars.length}</span>{" "}
          {t("vehiclesAvailable", { count: filteredCars.length })}
          {brandName && " - " + brandName}
          {categoryName && " - " + categoryName}
        </p>

        {/* Grid / List toggle */}
        <div className="flex items-center gap-1.5 bg-dark-card border border-dark-border/60 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded ${viewMode === "grid" ? "bg-gold/15 text-gold" : "text-gray-500 hover:text-gray-300"} transition-colors`}
            aria-label={t("gridView")}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded ${viewMode === "list" ? "bg-gold/15 text-gold" : "text-gray-500 hover:text-gray-300"} transition-colors`}
            aria-label={t("listView")}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </span>
          <input
            type="text"
            placeholder={t("searchVehicles")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-card border border-dark-border/60 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold/40 transition-colors"
          />
        </div>

        {/* Brand filter (only show when not already on a brand page) */}
        {!brandName && (
          <Dropdown
            value={selectedBrand}
            onChange={(v: string) => {
              if (v !== "All") {
                const brandSlug = v.toLowerCase().replace(/\s+/g, "-");
                router.push(`/location/${emirateSlug}/rent-${brandSlug}/`);
              } else {
                setSelectedBrand("All");
              }
            }}
            options={brands}
            label={t("filterBrand")}
          />
        )}

        {/* Type filter (only show when not already on a category page) */}
        {!categoryName && (
          <Dropdown
            value={selectedType}
            onChange={(v: string) => {
              if (v !== "All") {
                router.push(`/location/${emirateSlug}/${v.toLowerCase()}-car-rental/`);
              } else {
                setSelectedType("All");
              }
            }}
            options={types.map((type) => ({
              value: type,
              label: type === "All" ? t("allTypes") : getTypeLabel(type),
            }))}
            label={t("filterType")}
          />
        )}

        {/* Sort */}
        <Dropdown
          value={sortBy}
          onChange={setSortBy}
          options={[
            { value: "popular", label: t("popular") },
            { value: "price-low", label: t("sortPriceLowHigh") },
            { value: "price-high", label: t("sortPriceHighLow") },
            { value: "year", label: t("sortYearNewest") },
          ]}
          label={t("sort")}
        />
      </div>

      {/* Car Grid */}
      <AnimatePresence mode="wait">
        {pageCars.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-card border border-dark-border/50 flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17v2a1 1 0 001 1h2a1 1 0 001-1v-2M17 17v2a1 1 0 001 1h2a1 1 0 001-1v-2" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">{t("noVehiclesMatch")}</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedBrand("All"); setSelectedType("All"); }}
              className="mt-3 text-gold text-sm hover:underline"
            >
              {t("clearAllFilters")}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={currentPage + selectedBrand + selectedType + sortBy + searchQuery}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: easeOut as any }}
            className={viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
              : "flex flex-col gap-3 sm:gap-4"
            }
          >
            {pageCars.map((car, i) => (
              <motion.div
                key={car.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03, ease: easeOut as any }}
              >
                <CarCard car={car} index={i} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10 pb-8 sm:pb-12">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-dark-card border border-dark-border/60 text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label={t("previousPage")}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((p, idx, arr) => (
              <span key={p} className="flex items-center">
                {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-gray-600 px-1">..</span>}
                <button
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    p === currentPage
                      ? "bg-gold/15 text-gold border border-gold/30"
                      : "text-gray-400 hover:text-white hover:bg-dark-card"
                  }`}
                >
                  {p}
                </button>
              </span>
            ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-dark-card border border-dark-border/60 text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label={t("nextPage")}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Dropdown Component ───────────────────────────

function Dropdown({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[] | string[];
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const items = Array.isArray(options)
    ? options.map((o) => (typeof o === "string" ? { value: o, label: o } : o))
    : [];

  const selected = items.find((i) => i.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-2 bg-dark-card border border-dark-border/60 rounded-lg py-2 px-3 text-sm text-white hover:border-gold/30 transition-colors min-w-[100px]"
      >
        <span className="text-gray-500 mr-1">{label}:</span>
        <span className="truncate">{selected?.label || value}</span>
        <svg className="w-3 h-3 ml-auto text-gray-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-dark-card border border-dark-border/60 rounded-lg py-1 shadow-xl z-50 max-h-60 overflow-y-auto">
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => { onChange(item.value); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                item.value === value
                  ? "text-gold bg-gold/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
