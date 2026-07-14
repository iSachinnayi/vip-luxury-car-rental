"use client";

// ═══════════════════════════════════════════════
//  Admin Car Editor — Full management form
//  Shows existing images, clean UI, no datalist
// ═══════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface CarForm {
  title: string; slug: string; excerpt: string;
  description_short: string; description_full: string;
  brand: string; car_type: string;
  pricing: Record<string, string>;
  specs: Record<string, string>;
  km_limits: Record<string, string>;
  deposit: Record<string, string>;
  seo: Record<string, string>;
  images: string[]; thumbnail: string; old_url: string;
}

const EMPTY: CarForm = {
  title: "", slug: "", excerpt: "", description_short: "", description_full: "",
  brand: "", car_type: "",
  pricing: { per_day: "", per_hour: "", per_week: "", per_month: "" },
  specs: { model_year: "", engine: "", horsepower: "", top_speed: "", acceleration: "", fuel_type: "", transmission: "", seating: "", doors: "" },
  km_limits: { per_day: "", per_week: "", per_month: "", extra_km: "" },
  deposit: { no_deposit_fee: "", security: "" },
  seo: { title: "", description: "", focus_keyword: "" },
  images: [], thumbnail: "", old_url: "",
};

const TABS = [
  { key: "basic", label: "Basic Info" },
  { key: "pricing", label: "Pricing & KM" },
  { key: "specs", label: "Specifications" },
  { key: "content", label: "Content & SEO" },
  { key: "images", label: "Photos" },
];

export default function AdminCarEditPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const isNew = slug === "new";

  const [form, setForm] = useState<CarForm>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [brands, setBrands] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  // Load brands/types once
  useEffect(() => {
    fetch("/admin/api/cars").then(r => r.json()).then(d => {
      setBrands(d.brands || []);
      setTypes(d.types || []);
    }).catch(() => {});
  }, []);

  // Load car
  const loadCar = useCallback(async () => {
    if (isNew) return;
    try {
      const res = await fetch(`/admin/api/cars/${slug}`);
      if (!res.ok) { setMessage("Car not found."); setLoading(false); return; }
      const d = await res.json();
      setForm({
        title: d.title || "", slug: d.slug || "", excerpt: d.excerpt || "",
        description_short: d.description_short || "", description_full: d.description_full || "",
        brand: d.brand || "", car_type: d.car_type || "",
        pricing: { per_day: d.pricing?.per_day || "", per_hour: d.pricing?.per_hour || "", per_week: d.pricing?.per_week || "", per_month: d.pricing?.per_month || "" },
        specs: { model_year: d.specs?.model_year || "", engine: d.specs?.engine || "", horsepower: d.specs?.horsepower || "", top_speed: d.specs?.top_speed || "", acceleration: d.specs?.acceleration || "", fuel_type: d.specs?.fuel_type || "", transmission: d.specs?.transmission || "", seating: d.specs?.seating || "", doors: d.specs?.doors || "" },
        km_limits: { per_day: d.km_limits?.per_day || "", per_week: d.km_limits?.per_week || "", per_month: d.km_limits?.per_month || "", extra_km: d.km_limits?.extra_km || "" },
        deposit: { no_deposit_fee: d.deposit?.no_deposit_fee || "", security: d.deposit?.security || "" },
        seo: { title: d.seo?.title || "", description: d.seo?.description || "", focus_keyword: d.seo?.focus_keyword || "" },
        images: d.images || [], thumbnail: d.thumbnail || "", old_url: d.old_url || "",
      });
    } catch { setMessage("Failed to load car."); } finally { setLoading(false); }
  }, [slug, isNew]);

  useEffect(() => { loadCar(); }, [loadCar]);

  function set(path: string, value: any) {
    setForm(p => {
      const keys = path.split(".");
      const n = { ...p } as any;
      let o = n;
      for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]];
      o[keys[keys.length - 1]] = value;
      return n;
    });
  }

  function autoSlug(title: string) {
    if (isNew || form.slug === slug)
      set("slug", title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = { ...form };
      if (!payload.slug) payload.slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const url = isNew ? "/admin/api/cars" : `/admin/api/cars/${slug}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.ok) {
        setMessage(isNew ? "Car created!" : "Changes saved!");
        if (isNew && data.car?.slug) router.push(`/admin/cars/${data.car.slug}/edit`);
      } else { setMessage(data.message || "Save failed."); }
    } catch { setMessage("Save failed."); }
    finally { setSaving(false); setTimeout(() => setMessage(""), 4000); }
  }

  // ─── UI ─────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <div className="w-4 h-4 border border-gold/30 border-t-gold rounded-full animate-spin" /> Loading...
      </div>
    </div>
  );

  const inp = "w-full bg-dark/50 border border-dark-border/60 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/15 transition-all";
  const ta = "w-full bg-dark/50 border border-dark-border/60 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/15 transition-all resize-y";

  function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
    return (
      <div className="relative">
        <select
          value={options.includes(value) ? value : ""}
          onChange={(e) => { if (e.target.value) onChange(e.target.value); }}
          className={`${inp} appearance-none pr-8 ${!value ? "text-gray-600" : ""}`}
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 10px center", backgroundRepeat: "no-repeat", backgroundSize: "16px" }}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {/* Custom value input */}
        {value && !options.includes(value) && (
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`${inp} mt-2`} placeholder="Custom value..." />
        )}
      </div>
    );
  }

  function Fld({ label, children, help }: { label: string; children: React.ReactNode; help?: string }) {
    return (
      <div>
        <label className="block text-[11px] text-gray-500 font-medium mb-1.5">{label}</label>
        {children}
        {help && <p className="text-[10px] text-gray-600 mt-1">{help}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-5xl">
      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/cars" className="text-gray-500 hover:text-white text-sm transition-colors">&larr; Cars</Link>
          <div className="w-px h-5 bg-dark-border/60" />
          <div>
            <h1 className="text-xl font-bold text-white font-serif">{isNew ? "Add New Car" : form.title || "Edit Car"}</h1>
            {!isNew && <p className="text-gray-600 text-xs mt-0.5 font-mono">/{form.slug || slug}/</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <Link href={`/car/${slug}/`} target="_blank" className="px-3.5 py-2 text-xs text-gray-500 border border-dark-border/60 rounded-lg hover:text-white hover:border-gray-600 transition-all">
              View Live &rarr;
            </Link>
          )}
          <button type="submit" disabled={saving} className="px-5 py-2.5 bg-gold text-dark text-sm font-semibold rounded-lg hover:bg-gold-500 transition-all disabled:opacity-50 shadow-lg shadow-gold/5">
            {saving ? "Saving..." : isNew ? "Create Car" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`text-xs px-4 py-3 rounded-lg ${message.includes("Car created") || message.includes("saved") ? "bg-emerald-500/8 text-emerald-400 border border-emerald-500/15" : "bg-red-500/8 text-red-400 border border-red-500/15"}`}>
          {message}
        </div>
      )}

      {/* ═══ TABS ═══ */}
      <div className="flex flex-wrap gap-1 border-b border-dark-border/60">
        {TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2.5 text-xs font-medium rounded-t-lg transition-all -mb-px ${
              activeTab === t.key ? "text-gold bg-gold/5 border border-b-transparent border-dark-border/60" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ TAB: BASIC INFO ═══ */}
      {activeTab === "basic" && (
        <div className="bg-dark-card/40 border border-dark-border/60 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Fld label="Car Title *">
              <input type="text" value={form.title} onChange={(e) => { set("title", e.target.value); autoSlug(e.target.value); }} className={inp} required placeholder="e.g., Lamborghini Urus" />
            </Fld>
            <Fld label="URL Slug" help="Auto-generated. Edit carefully — affects SEO and existing links.">
              <input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)} className={`${inp} font-mono text-xs`} placeholder="lamborghini-urus" />
            </Fld>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Fld label="Brand">
              <Select value={form.brand} onChange={(v) => set("brand", v)} options={brands} placeholder="Select or type brand..." />
            </Fld>
            <Fld label="Car Type">
              <Select value={form.car_type} onChange={(v) => set("car_type", v)} options={types} placeholder="Select or type type..." />
            </Fld>
          </div>
          <Fld label="Short Tagline / Excerpt">
            <input type="text" value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={inp} placeholder="e.g., Unleash the Beast — Lamborghini Urus" />
          </Fld>
        </div>
      )}

      {/* ═══ TAB: PRICING & KM ═══ */}
      {activeTab === "pricing" && (
        <div className="space-y-4">
          <div className="bg-dark-card/40 border border-dark-border/60 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Pricing in AED</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["per_day", "per_hour", "per_week", "per_month"].map((k) => (
                <Fld key={k} label={k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}>
                  <input type="number" value={form.pricing[k]} onChange={(e) => set(`pricing.${k}`, e.target.value)} className={inp} min="0" placeholder="0" />
                </Fld>
              ))}
            </div>
          </div>
          <div className="bg-dark-card/40 border border-dark-border/60 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">KM Limits</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["per_day", "per_week", "per_month", "extra_km"].map((k) => (
                <Fld key={k} label={k === "extra_km" ? "Extra KM Charge" : `KM ${k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}`}>
                  <input type="number" value={form.km_limits[k]} onChange={(e) => set(`km_limits.${k}`, e.target.value)} className={inp} min="0" placeholder="0" />
                </Fld>
              ))}
            </div>
          </div>
          <div className="bg-dark-card/40 border border-dark-border/60 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Deposit</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Fld label="No Deposit Fee (AED)"><input type="number" value={form.deposit.no_deposit_fee} onChange={(e) => set("deposit.no_deposit_fee", e.target.value)} className={inp} min="0" placeholder="0" /></Fld>
              <Fld label="Security Deposit (AED)"><input type="number" value={form.deposit.security} onChange={(e) => set("deposit.security", e.target.value)} className={inp} min="0" placeholder="0" /></Fld>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB: SPECS ═══ */}
      {activeTab === "specs" && (
        <div className="bg-dark-card/40 border border-dark-border/60 rounded-xl p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              ["model_year", "Model Year", "2024"],
              ["engine", "Engine", "4.0L V8 Twin-Turbo"],
              ["horsepower", "Horsepower", "641 HP"],
              ["top_speed", "Top Speed", "305 km/h"],
              ["acceleration", "0-100 km/h", "3.6 sec"],
              ["fuel_type", "Fuel Type", "Petrol"],
              ["transmission", "Transmission", "Automatic"],
              ["seating", "Seating", "5"],
              ["doors", "Doors", "4"],
            ].map(([key, label, ph]) => (
              <Fld key={key} label={label}>
                <input type="text" value={form.specs[key]} onChange={(e) => set(`specs.${key}`, e.target.value)} className={inp} placeholder={ph} />
              </Fld>
            ))}
          </div>
        </div>
      )}

      {/* ═══ TAB: CONTENT & SEO ═══ */}
      {activeTab === "content" && (
        <div className="space-y-4">
          <div className="bg-dark-card/40 border border-dark-border/60 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</h3>
            <Fld label="Short Description (for cards & listings)">
              <textarea value={form.description_short} onChange={(e) => set("description_short", e.target.value)} className={ta} rows={3} placeholder="Brief description shown in car cards..." />
            </Fld>
            <Fld label="Full Description (for car detail page)">
              <textarea value={form.description_full} onChange={(e) => set("description_full", e.target.value)} className={ta} rows={8} placeholder="Detailed description shown on the car's single page..." />
            </Fld>
          </div>
          <div className="bg-dark-card/40 border border-dark-border/60 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SEO Settings</h3>
            <div>
              <Fld label="Meta Title">
                <input type="text" value={form.seo.title} onChange={(e) => set("seo.title", e.target.value)} className={inp} placeholder="e.g., Lamborghini Urus Rental Dubai" />
              </Fld>
              <p className={`text-[10px] mt-1 ${(form.seo.title?.length || 0) > 60 ? "text-red-400" : "text-gray-600"}`}>
                {form.seo.title?.length || 0}/60 characters
              </p>
            </div>
            <div>
              <Fld label="Meta Description">
                <textarea value={form.seo.description} onChange={(e) => set("seo.description", e.target.value)} className={ta} rows={3} placeholder="SEO meta description for search results..." />
              </Fld>
              <p className={`text-[10px] mt-1 ${(form.seo.description?.length || 0) > 160 ? "text-red-400" : "text-gray-600"}`}>
                {form.seo.description?.length || 0}/160 characters
              </p>
            </div>
            <Fld label="Focus Keyword">
              <input type="text" value={form.seo.focus_keyword} onChange={(e) => set("seo.focus_keyword", e.target.value)} className={inp} placeholder="e.g., lamborghini urus rental dubai" />
            </Fld>
            <Fld label="Original WordPress URL">
              <input type="text" value={form.old_url} onChange={(e) => set("old_url", e.target.value)} className={`${inp} font-mono text-xs`} placeholder="https://vipluxurycarrental.com/car/lamborghini-urus/" />
            </Fld>
          </div>
        </div>
      )}

      {/* ═══ TAB: PHOTOS ═══ */}
      {activeTab === "images" && (
        <div className="bg-dark-card/40 border border-dark-border/60 rounded-xl p-5 space-y-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Car Photos</h3>

          {/* Current thumbnail */}
          <div>
            <p className="text-[11px] text-gray-500 font-medium mb-2">Thumbnail / Cover Image</p>
            <div className="flex items-start gap-4">
              <div className="w-48 aspect-[16/10] bg-dark/60 rounded-lg overflow-hidden border border-dark-border/60 flex-shrink-0">
                {form.thumbnail ? (
                  <img src={form.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700 text-[10px]">No image</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <input type="text" value={form.thumbnail} onChange={(e) => set("thumbnail", e.target.value)} className={`${inp} font-mono text-xs`} placeholder="/api/images/2024/06/example.webp" />
                <p className="text-[10px] text-gray-600 mt-1">URL of the cover image shown in cards and listings</p>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-gray-500 font-medium">Gallery Images ({form.images.length})</p>
            </div>

            {/* Gallery grid */}
            {form.images.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-4">
                {form.images.map((url, i) => (
                  <div key={i} className="group relative aspect-[4/3] bg-dark/60 rounded-lg overflow-hidden border border-dark-border/40">
                    <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    <button
                      type="button"
                      onClick={() => set("images", form.images.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-dark/50 rounded-lg p-8 text-center text-gray-600 text-sm mb-4">
                No gallery images yet. Add image URLs below.
              </div>
            )}

            {/* Image URL input */}
            <p className="text-[11px] text-gray-500 font-medium mb-1.5">Add Image URLs</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste image URL and press Add..."
                className={`${inp} flex-1 font-mono text-xs`}
                id="new-image-url"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const input = e.currentTarget;
                    const url = input.value.trim();
                    if (url && !form.images.includes(url)) {
                      set("images", [...form.images, url]);
                      input.value = "";
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById("new-image-url") as HTMLInputElement;
                  const url = input?.value?.trim();
                  if (url && !form.images.includes(url)) {
                    set("images", [...form.images, url]);
                    input.value = "";
                  }
                }}
                className="px-4 py-2.5 bg-gold/10 border border-gold/20 text-gold text-xs font-medium rounded-lg hover:bg-gold/20 transition-all whitespace-nowrap"
              >
                + Add
              </button>
            </div>
            <p className="text-[10px] text-gray-600 mt-1.5">
              Paste image URLs (e.g., <code className="text-gray-500">/api/images/2024/06/1.webp</code>) and click Add. Hover over images to remove them.
            </p>
          </div>
        </div>
      )}

      {/* ═══ BOTTOM BAR ═══ */}
      <div className="flex items-center justify-between pt-4 border-t border-dark-border/60">
        <Link href="/admin/cars" className="text-xs text-gray-600 hover:text-white transition-colors">&larr; Back to Cars</Link>
        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gold text-dark text-sm font-semibold rounded-lg hover:bg-gold-500 transition-all disabled:opacity-50 shadow-lg shadow-gold/5">
          {saving ? "Saving..." : isNew ? "Create Car" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
