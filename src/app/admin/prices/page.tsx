// ═══════════════════════════════════════════════
//  Admin: Price & Specs Management Dashboard
//  Premium UI with thumbnails, bulk edit, all fields
// ═══════════════════════════════════════════════

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CarPrice {
  id: number;
  title: string;
  slug: string;
  brand: string;
  car_type: string;
  pricing: { per_day: string; per_hour: string; per_week: string; per_month: string; };
  km_limits: { per_day: string; per_week: string; per_month: string; extra_km_charge: string; };
  deposit: { no_deposit_fee: string; security_deposit: string; };
  specs: { model_year: string; engine?: string; transmission?: string; };
  thumbnail: string;
}

type SortField = "title" | "brand" | "model_year" | "per_day";
type SortDir = "asc" | "desc";

export default function PricesPage() {
  const [cars, setCars] = useState<CarPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [bulkSection, setBulkSection] = useState<"pricing" | "km_limits" | "deposit">("pricing");
  const [bulkField, setBulkField] = useState("all");
  const [bulkOp, setBulkOp] = useState<"add" | "subtract" | "percent_add" | "percent_subtract" | "set">("add");
  const [bulkValue, setBulkValue] = useState("");
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const showNotif = useCallback((msg: string, type: "success" | "error") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  useEffect(() => {
    fetch("/admin/api/prices")
      .then((r) => r.json()).then((data) => { setCars(data.cars || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const brands = useMemo(() => [...new Set(cars.map((c) => c.brand).filter(Boolean))].sort(), [cars]);
  const types = useMemo(() => [...new Set(cars.map((c) => c.car_type).filter(Boolean))].sort(), [cars]);
  const years = useMemo(() => [...new Set(cars.map((c) => c.specs.model_year).filter(Boolean))].sort().reverse(), [cars]);

  const filteredCars = useMemo(() => {
    let r = [...cars];
    if (search) { const q = search.toLowerCase(); r = r.filter((c) => c.title.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)); }
    if (brandFilter) r = r.filter((c) => c.brand === brandFilter);
    if (typeFilter) r = r.filter((c) => c.car_type === typeFilter);
    if (yearFilter) r = r.filter((c) => c.specs.model_year === yearFilter);
    r.sort((a, b) => {
      let va: string | number = "", vb: string | number = "";
      if (sortField === "title") { va = a.title; vb = b.title; }
      else if (sortField === "brand") { va = a.brand; vb = b.brand; }
      else if (sortField === "model_year") { va = a.specs.model_year; vb = b.specs.model_year; }
      else { va = parseFloat(a.pricing.per_day); vb = parseFloat(b.pricing.per_day); }
      if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
      return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
    return r;
  }, [cars, search, brandFilter, typeFilter, yearFilter, sortField, sortDir]);

  useEffect(() => { if (selectAll) setSelectedIds(new Set(filteredCars.map((c) => c.id))); else setSelectedIds(new Set()); }, [selectAll, filteredCars]);

  const saveCar = async (carId: number, changes: any) => {
    try {
      const res = await fetch("/admin/api/prices", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ carId, ...changes }) });
      if ((await res.json()).success) {
        const reload = await fetch("/admin/api/prices"); setCars((await reload.json()).cars || []); return true;
      }
    } catch {}
    return false;
  };

  const handleBulk = async () => {
    const value = parseFloat(bulkValue);
    if (isNaN(value) || selectedIds.size === 0) return;
    setBulkProcessing(true);
    try {
      const res = await fetch("/admin/api/prices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ carIds: Array.from(selectedIds), operation: bulkOp, value, section: bulkSection, field: bulkField === "all" ? null : bulkField }) });
      const data = await res.json();
      if (data.success) {
        showNotif(`${data.updatedCount} cars updated`, "success");
        const reload = await fetch("/admin/api/prices"); setCars((await reload.json()).cars || []);
        setSelectedIds(new Set()); setSelectAll(false);
      }
    } catch { showNotif("Bulk update failed", "error"); }
    setBulkProcessing(false);
  };

  const exportCSV = () => {
    const headers = ["Car Name", "Brand", "Year", "Hourly", "Daily", "Weekly", "Monthly", "Km/Day", "Km/Week", "Km/Month", "Extra Km", "No Deposit", "Security Deposit"];
    const rows = filteredCars.map((c) => [c.title, c.brand, c.specs.model_year, c.pricing.per_hour, c.pricing.per_day, c.pricing.per_week, c.pricing.per_month, c.km_limits.per_day, c.km_limits.per_week, c.km_limits.per_month, c.km_limits.extra_km_charge, c.deposit.no_deposit_fee, c.deposit.security_deposit]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([rows.map(r => r.join(",")).join("\n"), headers.join(",")].reverse(), { type: "text/csv" }));
    a.download = `car-prices-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>;

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Price & Specs Manager</h1>
          <p className="text-sm text-gray-500 mt-1">{cars.length} cars · {selectedIds.size} selected</p>
        </div>
        <button onClick={exportCSV} className="px-4 py-2 text-sm border border-white/10 text-gray-300 rounded-xl hover:border-gold/30 hover:text-gold transition-all">Export CSV</button>
      </div>

      {/* Bulk Bar */}
      <AnimatePresence>{selectedIds.size > 0 && (
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
          className="p-4 rounded-xl bg-gold/5 border border-gold/20">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-gold font-medium">{selectedIds.size} selected</span>
            <select value={bulkSection} onChange={(e) => { setBulkSection(e.target.value as any); setBulkField("all"); }}
              className="px-3 py-1.5 text-sm bg-dark border border-white/10 rounded-lg text-gray-300">
              <option value="pricing">Pricing</option><option value="km_limits">Km Limits</option><option value="deposit">Deposit</option>
            </select>
            <select value={bulkField} onChange={(e) => setBulkField(e.target.value)}
              className="px-3 py-1.5 text-sm bg-dark border border-white/10 rounded-lg text-gray-300">
              <option value="all">All Fields</option>
              {FIELD_GROUPS.find(g => g.key === bulkSection)?.fields.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
            </select>
            <select value={bulkOp} onChange={(e) => setBulkOp(e.target.value as any)}
              className="px-3 py-1.5 text-sm bg-dark border border-white/10 rounded-lg text-gray-300">
              <option value="add">+ Add</option><option value="subtract">- Subtract</option>
              <option value="percent_add">+% Add</option><option value="percent_subtract">-% Subtract</option><option value="set">= Set</option>
            </select>
            <input type="number" value={bulkValue} onChange={(e) => setBulkValue(e.target.value)} placeholder="Value"
              className="w-24 px-3 py-1.5 text-sm bg-dark border border-white/10 rounded-lg text-white input-no-spin" />
            <button onClick={handleBulk} disabled={bulkProcessing || !bulkValue}
              className="px-4 py-1.5 text-sm bg-gold text-dark font-semibold rounded-lg hover:bg-gold-600 disabled:opacity-50">{bulkProcessing ? "..." : "Apply"}</button>
            <button onClick={() => { setSelectedIds(new Set()); setSelectAll(false); }} className="px-3 py-1.5 text-sm text-gray-400 hover:text-white">Clear</button>
          </div>
        </motion.div>
      )}</AnimatePresence>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cars..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-gold/30 transition-all" />
        </div>
        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-dark border border-white/10 rounded-xl text-gray-300 focus:border-gold/30">
          <option value="">All Brands</option>{brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-dark border border-white/10 rounded-xl text-gray-300 focus:border-gold/30">
          <option value="">All Types</option>{types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-dark border border-white/10 rounded-xl text-gray-300 focus:border-gold/30">
          <option value="">All Years</option>{years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={sortField} onChange={(e) => setSortField(e.target.value as SortField)}
          className="px-3 py-2 text-sm bg-dark border border-white/10 rounded-xl text-gray-300 focus:border-gold/30">
          <option value="title">Name</option><option value="brand">Brand</option><option value="model_year">Year</option><option value="per_day">Price</option>
        </select>
        <button onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")}
          className="px-3 py-2 text-sm border border-white/10 rounded-xl text-gray-400 hover:text-gold">{sortDir === "asc" ? "↑" : "↓"}</button>
        <button onClick={() => setSelectAll(!selectAll)}
          className={`px-3 py-2 text-sm border rounded-xl ${selectAll ? "border-gold/40 text-gold bg-gold/5" : "border-white/10 text-gray-400 hover:text-white"}`}>
          {selectAll ? "Deselect All" : "Select All"}
        </button>
      </div>

      {/* Car Cards */}
      <div className="space-y-3">
        {filteredCars.map(car => (
          <CarCard key={car.id} car={car} selected={selectedIds.has(car.id)}
            onToggle={() => toggleSelect(car.id, setSelectedIds)} onSave={(ch) => saveCar(car.id, ch)} />
        ))}
        {filteredCars.length === 0 && <div className="p-12 text-center text-gray-600 text-sm">No cars match your filters</div>}
      </div>

      <div className="text-xs text-gray-600">Showing {filteredCars.length} of {cars.length} cars</div>

      <AnimatePresence>{notification && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium ${notification.type === "success" ? "bg-emerald-900/80 text-emerald-300 border border-emerald-700/50" : "bg-red-900/80 text-red-300 border border-red-700/50"}`}>
          {notification.msg}
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}

// ─── Toggle Select Helper ─────────────────────────

function toggleSelect(id: number, setter: React.Dispatch<React.SetStateAction<Set<number>>>) {
  setter(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
}

// ─── Field Groups Data ────────────────────────────

const FIELD_GROUPS = [
  { key: "pricing", label: "Pricing", fields: [{ key: "per_hour", label: "Hourly" }, { key: "per_day", label: "Daily" }, { key: "per_week", label: "Weekly" }, { key: "per_month", label: "Monthly" }] },
  { key: "km_limits", label: "Km Limits", fields: [{ key: "per_day", label: "Per Day" }, { key: "per_week", label: "Per Week" }, { key: "per_month", label: "Per Month" }, { key: "extra_km_charge", label: "Extra Km" }] },
  { key: "deposit", label: "Deposit", fields: [{ key: "no_deposit_fee", label: "No Deposit" }, { key: "security_deposit", label: "Security Deposit" }] },
];

// ─── Section config for display ──────────────────

const SECTIONS: { key: string; label: string; prefix?: string; suffix?: string }[] = [
  { key: "pricing", label: "Pricing", prefix: "AED" },
  { key: "km_limits", label: "Km Limits", suffix: "km" },
  { key: "km_limits_extra", label: "Extra Km", prefix: "AED" },
  { key: "deposit", label: "Deposit", prefix: "AED" },
];

// ─── Car Card ─────────────────────────────────────

function CarCard({ car, selected, onToggle, onSave }: { car: CarPrice; selected: boolean; onToggle: () => void; onSave: (changes: any) => Promise<boolean> }) {
  const [pricing, setPricing] = useState(car.pricing);
  const [kmLimits, setKmLimits] = useState(car.km_limits);
  const [deposit, setDeposit] = useState(car.deposit);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => { setPricing(car.pricing); setKmLimits(car.km_limits); setDeposit(car.deposit); }, [car.pricing, car.km_limits, car.deposit]);

  const hasChanges = JSON.stringify({ pricing, km_limits: kmLimits, deposit }) !== JSON.stringify({ pricing: car.pricing, km_limits: car.km_limits, deposit: car.deposit });

  const handleSave = async () => {
    setSaving(true);
    const ch: any = {};
    if (JSON.stringify(pricing) !== JSON.stringify(car.pricing)) ch.pricing = pricing;
    if (JSON.stringify(kmLimits) !== JSON.stringify(car.km_limits)) ch.km_limits = kmLimits;
    if (JSON.stringify(deposit) !== JSON.stringify(car.deposit)) ch.deposit = deposit;
    if (Object.keys(ch).length > 0) await onSave(ch);
    setSaving(false);
  };

  const ic = "w-full px-2 py-1.5 text-xs text-right bg-dark border border-white/[0.06] rounded-lg text-white focus:border-gold/50 focus:outline-none transition-all input-no-spin";

  return (
    <div className={`rounded-xl border transition-all ${selected ? "border-gold/30 bg-gold/[0.03]" : "border-white/[0.06] bg-white/[0.02]"}`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <input type="checkbox" checked={selected} onChange={e => { e.stopPropagation(); onToggle(); }}
          className="w-4 h-4 rounded border-white/20 bg-dark checked:bg-gold checked:border-gold accent-gold shrink-0" />
        <div className="w-12 h-12 rounded-lg bg-dark-card border border-white/[0.06] overflow-hidden shrink-0">
          {car.thumbnail
            ? <img src={car.thumbnail} alt={car.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-gray-700 text-[10px] uppercase">No img</div>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{car.title}</p>
          <p className="text-[11px] text-gray-500">{car.brand}{car.specs.model_year ? ` · ${car.specs.model_year}` : ""}</p>
        </div>
        <div className="text-right shrink-0 mr-2">
          <p className="text-gold text-sm font-semibold">AED {parseInt(car.pricing.per_day).toLocaleString()}</p>
          <p className="text-[10px] text-gray-600">/day</p>
        </div>
        <svg className={`w-4 h-4 text-gray-600 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expanded */}
      <AnimatePresence>{expanded && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-t border-white/[0.04]">
          <div className="p-3 space-y-4">

            {/* Pricing */}
            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">Pricing (AED)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["per_hour", "per_day", "per_week", "per_month"] as const).map(f => (
                  <label key={f} className="flex items-center gap-1"><span className="text-[10px] text-gray-500 w-12">{f === "per_hour" ? "Hourly" : f === "per_day" ? "Daily" : f === "per_week" ? "Weekly" : "Monthly"}</span>
                    <input type="number" value={pricing[f]} onChange={e => setPricing(p => ({ ...p, [f]: e.target.value }))} className={ic} /></label>
                ))}
              </div>
            </div>

            {/* Km Limits */}
            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">Km Limits</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["per_day", "per_week", "per_month"] as const).map(f => (
                  <label key={f} className="flex items-center gap-1"><span className="text-[10px] text-gray-500 w-12">{f === "per_day" ? "Day" : f === "per_week" ? "Week" : "Month"}</span>
                    <input type="number" value={kmLimits[f]} onChange={e => setKmLimits(k => ({ ...k, [f]: e.target.value }))} className={ic} /><span className="text-[10px] text-gray-500">km</span></label>
                ))}
                <label className="flex items-center gap-1"><span className="text-[10px] text-gray-500 w-12">Extra</span>
                  <input type="number" value={kmLimits.extra_km_charge} onChange={e => setKmLimits(k => ({ ...k, extra_km_charge: e.target.value }))} className={ic} /><span className="text-[10px] text-gray-500">AED</span></label>
              </div>
            </div>

            {/* Deposit */}
            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">Deposit (AED)</p>
              <div className="grid grid-cols-2 gap-2">
                {(["no_deposit_fee", "security_deposit"] as const).map(f => (
                  <label key={f} className="flex items-center gap-1"><span className="text-[10px] text-gray-500 w-20">{f === "no_deposit_fee" ? "No Deposit" : "Security"}</span>
                    <input type="number" value={deposit[f]} onChange={e => setDeposit(d => ({ ...d, [f]: e.target.value }))} className={ic} /></label>
                ))}
              </div>
            </div>

            {/* Save */}
            <div className="flex justify-end pt-2 border-t border-white/[0.04]">
              <button onClick={handleSave} disabled={!hasChanges || saving}
                className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${hasChanges ? "bg-gold text-dark hover:bg-gold-600" : "bg-white/[0.04] text-gray-600 cursor-not-allowed"}`}>
                {saving ? "Saving..." : hasChanges ? "Save Changes" : "No Changes"}
              </button>
            </div>
          </div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}
