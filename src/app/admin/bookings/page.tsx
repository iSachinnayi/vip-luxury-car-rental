"use client";

// ═══════════════════════════════════════════════
//  Admin Bookings — Full booking management
// ═══════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchIcon, CalendarIcon, PhoneIcon } from "@/components/admin/Icons";

interface Booking {
  id: string;
  status: string;
  createdAt: string;
  car: { slug: string; title: string };
  customer: { name: string; phone: string; email?: string; notes?: string };
  rental: {
    pickup: { location: string; date: string; time: string };
    drop: { location: string; date: string; time: string };
    days: number;
    depositOption: string;
  };
  pricing: {
    currency: string;
    dayPrice: number;
    rentalSubtotal: number;
    taxAmount: number;
    depositFee: number;
    grandTotal: number;
  };
}

const STATUS_FILTERS = [
  { key: "all", label: "All", color: "" },
  { key: "pending", label: "Pending", color: "text-amber-400" },
  { key: "confirmed", label: "Confirmed", color: "text-emerald-400" },
  { key: "completed", label: "Completed", color: "text-blue-400" },
  { key: "cancelled", label: "Cancelled", color: "text-red-400" },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 });
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      const statusParam = filter !== "all" ? `?status=${filter}` : "";
      const res = await fetch(`/admin/api/bookings${statusParam}`);
      const data = await res.json();
      setBookings(data.bookings || []);
      setStats({ total: data.total, pending: data.pending, confirmed: data.confirmed, completed: data.completed, cancelled: data.cancelled });
    } catch (err) { console.error("Fetch bookings error:", err); } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  async function updateStatus(id: string, status: string) {
    try {
      await fetch("/admin/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchBookings();
    } catch (err) { console.error("Update booking error:", err); }
  }

  const filtered = bookings.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return b.id.toLowerCase().includes(q) || b.customer.name.toLowerCase().includes(q) || b.customer.phone.includes(q) || b.car.title.toLowerCase().includes(q);
  });

  const statusCls = (s: string) => {
    const map: Record<string, string> = {
      pending: "bg-amber-500/8 text-amber-400 border-amber-500/15",
      confirmed: "bg-emerald-500/8 text-emerald-400 border-emerald-500/15",
      completed: "bg-blue-500/8 text-blue-400 border-blue-500/15",
      cancelled: "bg-red-500/8 text-red-400 border-red-500/15",
    };
    return map[s] || "bg-gray-500/8 text-gray-400 border-gray-500/15";
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white font-serif">Bookings</h1>
        <p className="text-gray-500 text-sm mt-0.5">{stats.total} total bookings</p>
      </div>

      {/* Status filter chips */}
      <div className="flex flex-wrap gap-1.5">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key === filter ? "all" : s.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === s.key
                ? "bg-gold/10 text-gold border border-gold/20"
                : "bg-dark-card/50 text-gray-500 border border-dark-border/60 hover:border-gray-600 hover:text-gray-300"
            }`}
          >
            {s.label}
            <span className={`ml-1.5 opacity-60 ${s.color}`}>
              {s.key === "all" ? stats.total : stats[s.key as keyof typeof stats]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={15} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID, customer, phone or car..."
          className="w-full bg-dark-card/50 border border-dark-border/60 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gold/30 transition-all"
        />
      </div>

      {/* Table card */}
      <div className="bg-dark-card/60 border border-dark-border/60 rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-600 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-600 text-sm">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-600 text-[11px] uppercase tracking-wider border-b border-dark-border/40">
                  <th className="text-left px-4 py-3 font-medium">Booking</th>
                  <th className="text-left px-4 py-3 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Vehicle</th>
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Pickup</th>
                  <th className="text-left px-4 py-3 font-medium hidden xl:table-cell">Total</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-dark-border/30 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelectedBooking(b)}>
                    <td className="px-4 py-3">
                      <span className="text-gold font-mono text-[11px] font-medium hover:text-gold-300 transition-colors">{b.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white text-sm">{b.customer.name}</div>
                      <div className="flex items-center gap-1 text-gray-500 text-[11px] mt-0.5">
                        <PhoneIcon size={10} /> {b.customer.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-gray-400 text-sm">{b.car.title?.slice(0, 30)}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <CalendarIcon size={11} />
                        {b.rental?.pickup?.date || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <span className="text-white font-medium text-sm">
                        {b.pricing.currency} {b.pricing.grandTotal?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider border ${statusCls(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        {b.status === "pending" && (
                          <>
                            <button onClick={() => updateStatus(b.id, "confirmed")} className="px-2 py-1 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 rounded hover:bg-emerald-500/20 transition-all">Confirm</button>
                            <button onClick={() => updateStatus(b.id, "cancelled")} className="px-2 py-1 text-[10px] font-medium bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-all">Cancel</button>
                          </>
                        )}
                        {b.status === "confirmed" && (
                          <button onClick={() => updateStatus(b.id, "completed")} className="px-2 py-1 text-[10px] font-medium bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-all">Complete</button>
                        )}
                        {b.status === "completed" && (
                          <span className="text-gray-600 text-[10px] font-medium">Completed</span>
                        )}
                        {b.status === "cancelled" && (
                          <button onClick={() => updateStatus(b.id, "pending")} className="px-2 py-1 text-[10px] font-medium bg-amber-500/10 text-amber-400 rounded hover:bg-amber-500/20 transition-all">Reopen</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Booking Detail Drawer ──────────────── */}
      <AnimatePresence>
        {selectedBooking && (
          <>
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40" onClick={() => setSelectedBooking(null)} />
            
            {/* Drawer */}
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-dark-card border-l border-dark-border/60 z-50 overflow-y-auto">
              
              {/* Header */}
              <div className="sticky top-0 bg-dark-card border-b border-dark-border/60 z-10 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-white font-semibold">Booking Details</h2>
                  <p className="text-gold font-mono text-xs mt-0.5">{selectedBooking.id}</p>
                </div>
                <button onClick={() => setSelectedBooking(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-gold/30 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 text-sm">

                {/* Status */}
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider border ${statusCls(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                  <span className="text-gray-500 text-xs">{selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleDateString() : "-"}</span>
                </div>

                {/* Customer */}
                <Section title="Customer">
                  <Row label="Name" value={selectedBooking.customer.name} />
                  <Row label="Phone" value={selectedBooking.customer.phone} />
                  {selectedBooking.customer.email && <Row label="Email" value={selectedBooking.customer.email} />}
                  {selectedBooking.customer.notes && <Row label="Notes" value={selectedBooking.customer.notes} />}
                </Section>

                {/* Vehicle */}
                <Section title="Vehicle">
                  <Row label="Car" value={selectedBooking.car.title} />
                </Section>

                {/* Rental Period */}
                <Section title="Rental Period">
                  <Row label="Pickup" value={`${selectedBooking.rental?.pickup?.date || "-"} at ${selectedBooking.rental?.pickup?.time || "-"}`} />
                  <Row label="Pickup Location" value={selectedBooking.rental?.pickup?.location || "-"} />
                  <Row label="Drop-off" value={`${selectedBooking.rental?.drop?.date || "-"} at ${selectedBooking.rental?.drop?.time || "-"}`} />
                  <Row label="Drop Location" value={selectedBooking.rental?.drop?.location || "-"} />
                  <Row label="Duration" value={`${selectedBooking.rental?.days || 0} days`} />
                  <Row label="Deposit Option" value={selectedBooking.rental?.depositOption || "-"} />
                </Section>

                {/* Pricing */}
                <Section title="Pricing">
                  <Row label="Daily Rate" value={`${selectedBooking.pricing.currency} ${selectedBooking.pricing.dayPrice?.toLocaleString() || "0"}`} />
                  <Row label="Subtotal" value={`${selectedBooking.pricing.currency} ${selectedBooking.pricing.rentalSubtotal?.toLocaleString() || "0"}`} />
                  <Row label="Tax" value={`${selectedBooking.pricing.currency} ${selectedBooking.pricing.taxAmount?.toLocaleString() || "0"}`} />
                  {selectedBooking.pricing.depositFee > 0 && (
                    <Row label="Deposit Fee" value={`${selectedBooking.pricing.currency} ${selectedBooking.pricing.depositFee?.toLocaleString() || "0"}`} />
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-dark-border/40 mt-2">
                    <span className="text-white font-semibold">Grand Total</span>
                    <span className="text-gold font-semibold text-base">
                      {selectedBooking.pricing.currency} {selectedBooking.pricing.grandTotal?.toLocaleString() || "0"}
                    </span>
                  </div>
                </Section>

                {/* Quick Actions */}
                <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">Quick Actions</p>
                  <div className="flex gap-2">
                    {selectedBooking.status === "pending" && (
                      <>
                        <button onClick={() => { updateStatus(selectedBooking.id, "confirmed"); setSelectedBooking(null); }}
                          className="flex-1 px-4 py-2 text-sm font-medium bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all">Confirm</button>
                        <button onClick={() => { updateStatus(selectedBooking.id, "cancelled"); setSelectedBooking(null); }}
                          className="flex-1 px-4 py-2 text-sm font-medium bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all">Cancel</button>
                      </>
                    )}
                    {selectedBooking.status === "confirmed" && (
                      <button onClick={() => { updateStatus(selectedBooking.id, "completed"); setSelectedBooking(null); }}
                        className="flex-1 px-4 py-2 text-sm font-medium bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all">Mark Completed</button>
                    )}
                    {selectedBooking.status === "cancelled" && (
                      <button onClick={() => { updateStatus(selectedBooking.id, "pending"); setSelectedBooking(null); }}
                        className="flex-1 px-4 py-2 text-sm font-medium bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500/20 transition-all">Reopen</button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500 text-xs">{label}</span>
      <span className="text-white text-xs font-medium text-right max-w-[60%] truncate">{value}</span>
    </div>
  );
}
