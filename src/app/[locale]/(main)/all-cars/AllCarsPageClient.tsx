// ═══════════════════════════════════════════════
//  All Cars — Redesigned
//  Glass card header · Pagination · Filters · Animations
// ═══════════════════════════════════════════════

"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import CarCard from "@/components/CarCard";
import SEOHead from "@/components/SEOHead";
import { useCurrency } from "@/lib/CurrencyContext";
import { Icons } from "@/lib/icons";
import type { CarCardData } from "@/types/car";

const PER_PAGE = 12;
const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

// ─── Custom Dropdown ───
function FilterDropdown({ value, onChange, options, icon, label }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
  icon: React.ReactNode; label: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const selectedLabel = options.find((o) => o.value === value)?.label || label;
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(!open)}
        className="group w-full flex items-center gap-2 px-3 py-2.5 rounded-xl
                   bg-gradient-to-b from-white/[0.06] to-white/[0.02]
                   border border-white/[0.1] text-white text-xs md:text-sm
                   hover:border-gold/30 hover:from-gold/[0.06] hover:to-gold/[0.02]
                   focus:border-gold/50 focus:ring-1 focus:ring-gold/20
                   transition-all duration-300 outline-none cursor-pointer">
        <span className="text-gray-400 group-hover:text-gold transition-colors flex-shrink-0">{icon}</span>
        <span className="flex-1 text-left truncate">{selectedLabel}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="text-gray-500 group-hover:text-gold transition-colors flex-shrink-0">{Icons.chevronDown}</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: easeOut }}
            className="absolute z-50 mt-1.5 left-0 right-0 min-w-[160px] rounded-xl border border-white/[0.08]
                       bg-[#1a1a1a]/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
            {options.map((opt) => (
              <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setOpen(false); }}
                className={"w-full flex items-center gap-2.5 px-3 py-2.5 text-xs md:text-sm text-left transition-all duration-150 " + (value === opt.value ? "bg-gold/10 text-gold border-l-2 border-gold" : "text-gray-300 hover:bg-white/[0.04] hover:text-white border-l-2 border-transparent")}>
                {value === opt.value && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />}
                <span className={value === opt.value ? "" : "ml-[14px]"}>{opt.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Pagination ───
function Pagination({ current, total, onChange, labels }: {
  current: number; total: number; onChange: (p: number) => void;
  labels: { previous: string; next: string; page: string; pagination: string };
}) {
  if (total <= 1) return null;
  const getPages = () => {
    const p: (number | "...")[] = [];
    if (total <= 7) { for (let i = 1; i <= total; i++) p.push(i); }
    else {
      p.push(1);
      if (current > 3) p.push("...");
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) p.push(i);
      if (current < total - 2) p.push("...");
      p.push(total);
    }
    return p;
  };
  return (
    <motion.nav initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="flex items-center justify-center gap-1.5 md:gap-2 pt-8 pb-4" aria-label={labels.pagination}>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        disabled={current === 1} onClick={() => onChange(current - 1)}
        className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-gold
                   hover:bg-white/[0.04] border border-transparent hover:border-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
        aria-label={labels.previous}>{Icons.chevronLeft}</motion.button>
      {getPages().map((page, i) =>
        page === "..." ? <span key={"d-" + i} className="w-5 text-center text-gray-600 text-xs select-none">...</span>
        : (
          <motion.button key={page} whileHover={page !== current ? { scale: 1.05 } : {}} whileTap={page !== current ? { scale: 0.95 } : {}}
            onClick={() => onChange(page)}
            className={"relative w-9 h-9 md:w-10 md:h-10 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 " + (page === current ? "text-black bg-gold shadow-[0_4px_15px_rgba(200,169,81,0.3)]" : "text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent hover:border-white/10")} aria-current={page === current ? "page" : undefined} aria-label={labels.page.replace("{page}", String(page))}>
            {page === current && <motion.span layoutId="activePage" className="absolute inset-0 rounded-xl bg-gold" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
            <span className="relative z-10">{page}</span>
          </motion.button>
        )
      )}
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        disabled={current === total} onClick={() => onChange(current + 1)}
        className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-gold
                   hover:bg-white/[0.04] border border-transparent hover:border-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
        aria-label={labels.next}>{Icons.chevronRight}</motion.button>
    </motion.nav>
  );
}

// ─── Empty State ───
function EmptyState({ onClear, title, desc, clearLabel }: { onClear: () => void; title: string; desc: string; clearLabel: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center mx-auto mb-5">{Icons.car}</motion.div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-6">{desc}</p>
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={onClear}
        className="px-5 py-2.5 rounded-xl bg-gold/10 border border-gold/20 text-gold text-sm font-medium hover:bg-gold/20 transition-all duration-300">{clearLabel}</motion.button>
    </motion.div>
  );
}

// ─── List View Item ───
function ListCarItem({ car, index, fromLabel, perDayLabel }: { car: CarCardData; index: number; fromLabel: string; perDayLabel: string }) {
  const { symbol, fmt } = useCurrency();
  const [imgError, setImgError] = useState(false);
  const imgSrc = car.thumbnail || car.images?.[0] || "";
  const carHref = "/car/" + car.slug;
  return (
    <motion.a href={carHref}
      initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
      transition={{ delay: index * 0.03 }} whileHover={{ x: 4 }}
      className="group flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]
                 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
      <div className="w-24 h-16 md:w-32 md:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-dark">
        {!imgError && imgSrc ? (
          <img src={imgSrc} alt={car.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17v2a1 1 0 001 1h2a1 1 0 001-1v-2M17 17v2a1 1 0 001 1h2a1 1 0 001-1v-2"/></svg>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-white group-hover:text-gold transition-colors truncate">{car.title}</h3>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
          <span className="text-gold/80 font-medium">{car.brand}</span><span>·</span><span>{car.car_type || "Luxury"}</span><span>·</span><span>{car.specs.model_year}</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-xs text-gray-500">{fromLabel}</div>
        <div className="text-sm font-bold text-gold">{symbol}{fmt(parseInt(car.pricing.per_day))}</div>
        <div className="text-[10px] text-gray-600">{perDayLabel}</div>
      </div>
    </motion.a>
  );
}

// ─── Main Component ───
export default function AllCarsPage() {
  const t = useTranslations("allCars");
  const locale = useLocale();
  const isAr = locale === "ar";
  const seoTitle = isAr ? "جميع السيارات الفاخرة للإيجار في دبي | VIP Luxury Car Rental Dubai" : "All Luxury Cars for Rent in Dubai | VIP Luxury Car Rental Dubai";
  const seoDesc = isAr
    ? "تصفح أكثر من 350 سيارة فاخرة ورياضية وغريبة للإيجار في دبي. تصفية حسب العلامة التجارية أو النوع أو الميزانية. توصيل مجاني في جميع أنحاء الإمارات. احجز سيارة أحلامك اليوم!"
    : "Browse 350+ luxury, sports, and exotic cars for rent in Dubai. Filter by brand, type, or budget. Free delivery across the UAE. Book your dream car today!";
  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      "Sports": t("typeSports"),
      "Luxury": t("typeLuxury"),
      "SUV": t("typeSUV"),
    };
    return map[type] || type;
  };
  const [cars, setCars] = useState<CarCardData[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/api/cars").then((r) => r.json()).then((data) => {
      setCars(data.cars || []); setBrands(data.brands || []); setTypes(data.types || []); setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredCars = useMemo(() => {
    let result = [...cars];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q) || (c.car_type || '').toLowerCase().includes(q) || c.specs.model_year.includes(q));
    }
    if (selectedBrand !== "All") result = result.filter((c) => c.brand === selectedBrand);
    if (selectedType !== "All") result = result.filter((c) => c.car_type === selectedType);
    if (sortBy === "price-low") result.sort((a, b) => parseInt(a.pricing.per_day) - parseInt(b.pricing.per_day));
    else if (sortBy === "price-high") result.sort((a, b) => parseInt(b.pricing.per_day) - parseInt(a.pricing.per_day));
    else if (sortBy === "year") result.sort((a, b) => parseInt(b.specs.model_year) - parseInt(a.specs.model_year));
    return result;
  }, [cars, searchQuery, selectedBrand, selectedType, sortBy]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedBrand, selectedType, sortBy]);

  const totalPages = Math.ceil(filteredCars.length / PER_PAGE);
  const paginatedCars = filteredCars.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const hasActiveFilters = selectedBrand !== "All" || selectedType !== "All" || searchQuery !== "";
  const clearFilters = () => { setSelectedBrand("All"); setSelectedType("All"); setSearchQuery(""); };

  const brandOptions = useMemo(() => {
    let available = cars;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      available = available.filter((c) => c.title.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q) || (c.car_type || '').toLowerCase().includes(q) || c.specs.model_year.includes(q));
    }
    return [...new Set(available.map((c) => c.brand).filter(Boolean))].sort();
  }, [cars, searchQuery]);

  const typeOptions = useMemo(() => {
    let available = cars;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      available = available.filter((c) => c.title.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q) || (c.car_type || '').toLowerCase().includes(q) || c.specs.model_year.includes(q));
    }
    if (selectedBrand !== "All") available = available.filter((c) => c.brand === selectedBrand);
    return [...new Set(available.map((c) => c.car_type).filter(Boolean))].sort();
  }, [cars, searchQuery, selectedBrand]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4" />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-gray-500 text-sm">{t("loading")}</motion.p>
      </div>
    </div>
  );

  return (
    <div className="bg-dark pt-4 md:pt-8 pb-16">
      <SEOHead title={seoTitle} description={seoDesc} canonical="https://vipluxurycarrental.com/all-cars/" />

      {/* ItemList Schema for search engines */}
      <script
        id="schema-itemlist"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: isAr ? "جميع السيارات الفاخرة للإيجار في دبي" : "All Luxury Cars for Rent in Dubai",
            description: isAr ? "تصفح أكثر من 350 سيارة فاخرة ورياضية وغريبة للإيجار في دبي." : "Browse 350+ luxury, sports, and exotic cars for rent in Dubai.",
            url: "https://vipluxurycarrental.com/all-cars/",
            numberOfItems: cars.length,
            itemListElement: cars.slice(0, 20).map((car, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: "https://vipluxurycarrental.com/car/" + car.slug + "/",
              name: car.title,
            })),
          }),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ════════ Glass Card Header ════════ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOut }}
          className="mb-8 p-6 md:p-8 rounded-3xl relative z-10
                     bg-gradient-to-b from-white/[0.04] via-white/[0.02] to-transparent
                     border border-white/[0.06] backdrop-blur-xl"
        >
          {/* Title */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4 }}>
            <div className="flex items-end justify-between">
              <div>
                <h1 className="font-serif text-3xl md:text-5xl font-bold text-white">{t("title")}</h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                  className="text-gray-500 text-sm mt-1.5">
                  <span className="text-gold font-semibold">{filteredCars.length}</span> {t("of")} {cars.length} {t("carsAvailable")}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Gold Divider */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.15, duration: 0.6, ease: easeOut }}
            className="h-[1px] w-full origin-left bg-gradient-to-r from-transparent via-gold/40 to-transparent my-5" />

          {/* Filters */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <div className="relative flex-1 min-w-[140px] max-w-[200px] group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-gray-400 group-focus-within:text-gold transition-colors">{Icons.search}</div>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("searchPlaceholder")}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.1] text-white text-xs md:text-sm
                             placeholder-gray-500 outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 hover:border-gold/30 hover:from-gold/[0.06] transition-all duration-300" />
              </div>
              <div className="w-[120px] md:w-[140px]">
                <FilterDropdown value={selectedBrand} onChange={setSelectedBrand} icon={Icons.car} label={t("allBrands")}
                  options={[{ value: "All", label: t("allBrands") }, ...brandOptions.map((b) => ({ value: b, label: b }))]} />
              </div>
              <div className="w-[110px] md:w-[130px]">
                <FilterDropdown value={selectedType} onChange={setSelectedType} icon={Icons.sort} label={t("allTypes")}
                  options={[{ value: "All", label: t("allTypes") }, ...typeOptions.map((t) => ({ value: t, label: getTypeLabel(t) }))]} />
              </div>
              <div className="w-[110px] md:w-[130px]">
                <FilterDropdown value={sortBy} onChange={(v) => setSortBy(v)} icon={Icons.sort} label={t("sort")}
                  options={[{ value: "popular", label: t("popular") }, { value: "price-low", label: t("priceLow") }, { value: "price-high", label: t("priceHigh") }, { value: "year", label: t("newest") }]} />
              </div>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setViewMode("grid")}
                  className={"w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 " + (viewMode === "grid" ? "bg-gold/15 text-gold" : "text-gray-500 hover:text-white hover:bg-white/[0.04]")} aria-label={t("gridView")}>{Icons.grid}</motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setViewMode("list")}
                  className={"w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 " + (viewMode === "list" ? "bg-gold/15 text-gold" : "text-gray-500 hover:text-white hover:bg-white/[0.04]")} aria-label={t("listView")}>{Icons.list}</motion.button>
              </div>
            </div>
          </motion.div>

          {/* Active Filters */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap items-center gap-2 mt-4 overflow-hidden">
                {selectedBrand !== "All" && <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[11px] font-medium">{selectedBrand}<button onClick={() => setSelectedBrand("All")} className="hover:text-white transition-colors">{Icons.close}</button></motion.span>}
                {selectedType !== "All" && <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[11px] font-medium">{selectedType}<button onClick={() => setSelectedType("All")} className="hover:text-white transition-colors">{Icons.close}</button></motion.span>}
                {searchQuery && <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[11px] font-medium">&ldquo;{searchQuery}&rdquo;<button onClick={() => setSearchQuery("")} className="hover:text-white transition-colors">{Icons.close}</button></motion.span>}
                <button onClick={clearFilters} className="text-[11px] text-gray-500 hover:text-white transition-colors ml-1">{t("clearAllFilters")}</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Info */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <div className="text-xs text-gray-600">
              {t("showing")} <span className="text-gray-400 font-medium">{(currentPage - 1) * PER_PAGE + 1}</span>&ndash;<span className="text-gray-400 font-medium">{Math.min(currentPage * PER_PAGE, filteredCars.length)}</span> {t("of")} <span className="text-gray-400 font-medium">{filteredCars.length}</span> {t("results")}
            </div>
          </motion.div>
        </motion.div>

        {/* ════════ Car Grid / List ════════ */}
        <AnimatePresence mode="wait">
          {paginatedCars.length === 0 ? (
            <EmptyState key="empty" onClear={clearFilters} title={t("noCarsTitle")} desc={t("noCarsDesc")} clearLabel={t("clearAll")} />
          ) : viewMode === "grid" ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-auto-cars gap-4 md:gap-5">
              {paginatedCars.map((car, i) => (
                <motion.div key={car.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                  <CarCard car={car} index={i} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {paginatedCars.map((car, i) => (<ListCarItem key={car.id} car={car} index={i} fromLabel={t("from")} perDayLabel={t("perDay")} />))}
            </motion.div>
          )}
        </AnimatePresence>

        <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage}
          labels={{ previous: t("previousPage"), next: t("nextPage"), page: t("pageNumber"), pagination: t("pagination") }} />

        {/* ═══ Page Content (SEO) ═══ */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8 p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <p className="text-sm text-gray-400 leading-relaxed">
            {t("seoDescription", { count: cars.length })}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
