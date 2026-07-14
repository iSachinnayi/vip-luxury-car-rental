"use client";

// ═══════════════════════════════════════════════
//  Admin Pages — All site pages organized by type
// ═══════════════════════════════════════════════

import { useState, useEffect } from "react";
import Link from "next/link";
import { SearchIcon, EyeIcon } from "@/components/admin/Icons";

interface PageInfo {
  slug: string;
  title: string;
  type: string;
  editUrl: string;
  hasContent: boolean;
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/admin/api/pages");
        const data = await res.json();
        setPages(data.pages || []);
      } catch (err) { console.error("Fetch pages error:", err); } finally { setLoading(false); }
    }
    load();
  }, []);

  const filtered = pages.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
  });

  const grouped = {
    static: filtered.filter((p) => p.type === "static"),
    brand: filtered.filter((p) => p.type === "brand"),
    category: filtered.filter((p) => p.type === "category"),
  };

  function PageSection({ title, items }: { title: string; items: PageInfo[] }) {
    if (items.length === 0) return null;
    return (
      <div>
        <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">{title} <span className="text-gray-700 font-normal">({items.length})</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {items.map((page) => {
            const href = page.editUrl || `/${page.slug}/`;
            // Skip invalid URLs to prevent "Cannot prefetch '//'" errors
            if (!href || href === "//") return null;
            return (
              <Link
                key={page.slug}
                href={href}
                target="_blank"
                className="bg-dark-card/60 border border-dark-border/60 rounded-xl p-3.5 hover:border-gold/25 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-white group-hover:text-gold transition-colors truncate">{page.title}</h3>
                    <p className="text-[11px] text-gray-600 mt-0.5 font-mono">/{page.slug}/</p>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-medium uppercase tracking-wider whitespace-nowrap ${
                    page.hasContent ? "bg-emerald-500/8 text-emerald-400" : "bg-amber-500/8 text-amber-400"
                  }`}>
                    {page.hasContent ? "Content" : "Dynamic"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[9px] text-gray-600 bg-dark/40 px-2 py-0.5 rounded uppercase tracking-wider">{page.type}</span>
                  <span className="flex items-center gap-0.5 text-[10px] text-gold opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                    <EyeIcon size={10} /> Open
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white font-serif">Pages</h1>
        <p className="text-gray-500 text-sm mt-0.5">{pages.length} pages on site</p>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={15} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pages..."
          className="w-full bg-dark-card/50 border border-dark-border/60 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gold/30 transition-all"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-600 text-sm">Loading...</div>
      ) : (
        <div className="space-y-7">
          <PageSection title="Static Pages" items={grouped.static} />
          <PageSection title="Brand Pages" items={grouped.brand} />
          <PageSection title="Category Pages" items={grouped.category} />
        </div>
      )}
    </div>
  );
}
