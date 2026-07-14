"use client";

// ═══════════════════════════════════════════════
//  Admin Dashboard — Premium Stats + Activity
// ═══════════════════════════════════════════════

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRightIcon, CalendarIcon } from "@/components/admin/Icons";

interface DashboardStats {
  totalCars: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalBrands: number;
  unreadMessages: number;
  recentBookings: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  async function fetchStats() {
    try {
      const [bookingRes, messagesRes, carsRes] = await Promise.all([
        fetch("/admin/api/bookings?limit=5"),
        fetch("/admin/api/messages?unread=true"),
        fetch("/admin/api/cars"),
      ]);

      const bookingData = bookingRes.ok ? await bookingRes.json() : { bookings: [], total: 0 };
      const messagesData = messagesRes.ok ? await messagesRes.json() : { unread: 0 };
      const carsData = carsRes.ok ? await carsRes.json() : { cars: [], brands: [], total: 0 };

      const bookings = bookingData.bookings || [];
      setStats({
        totalCars: carsData.total || 0,
        totalBookings: bookingData.total || bookings.length,
        pendingBookings: bookings.filter((b: any) => b.status === "pending").length,
        confirmedBookings: bookings.filter((b: any) => b.status === "confirmed").length,
        totalBrands: (carsData.brands || []).length,
        unreadMessages: messagesData.unread || 0,
        recentBookings: bookings.slice(0, 5),
      });
    } catch (err) { console.error("Dashboard fetchStats error:", err); } finally { setLoading(false); }
  }

  const cards = [
    { label: "Total Cars", value: stats?.totalCars ?? 0, href: "/admin/cars", accent: "gold", detail: `${stats?.totalBrands ?? 0} brands` },
    { label: "Total Bookings", value: stats?.totalBookings ?? 0, href: "/admin/bookings", accent: "blue", detail: "all time" },
    { label: "Pending", value: stats?.pendingBookings ?? 0, href: "/admin/bookings?status=pending", accent: "amber", detail: "awaiting confirmation" },
    { label: "Confirmed", value: stats?.confirmedBookings ?? 0, href: "/admin/bookings?status=confirmed", accent: "emerald", detail: "active rentals" },
    { label: "Messages", value: stats?.unreadMessages ?? 0, href: "/admin/messages", accent: "red", detail: stats?.unreadMessages ? "unread" : "all read" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <div className="w-4 h-4 border border-gold/30 border-t-gold rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white font-serif">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Overview of your rental business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => {
          const accentMap: Record<string, string> = {
            gold: "border-gold/25 bg-gold/[0.04]",
            blue: "border-blue-500/25 bg-blue-500/[0.04]",
            amber: "border-amber-500/25 bg-amber-500/[0.04]",
            emerald: "border-emerald-500/25 bg-emerald-500/[0.04]",
            red: "border-red-500/25 bg-red-500/[0.04]",
          };
          const textMap: Record<string, string> = {
            gold: "text-gold", blue: "text-blue-400", amber: "text-amber-400",
            emerald: "text-emerald-400", red: "text-red-400",
          };
          return (
            <Link key={card.href} href={card.href} className={`${accentMap[card.accent]} border rounded-xl p-4 hover:brightness-110 transition-all group`}>
              <p className="text-gray-500 text-xs tracking-wider uppercase">{card.label}</p>
              <p className={`${textMap[card.accent]} text-3xl font-bold mt-1 font-serif`}>{card.value}</p>
              <p className="text-gray-600 text-[10px] mt-1">{card.detail}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-dark-card/60 border border-dark-border/60 rounded-xl p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "View Bookings", href: "/admin/bookings" },
            { label: "Manage Cars", href: "/admin/cars" },
            { label: "Edit Pages", href: "/admin/pages" },
            { label: "Messages", href: "/admin/messages" },
            { label: "View Site", href: "/", external: true },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              className="px-3.5 py-2 bg-dark/50 border border-dark-border/80 text-gray-400 text-xs rounded-lg hover:text-white hover:border-gray-600 transition-all"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-dark-card/60 border border-dark-border/60 rounded-xl">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-dark-border/60">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Bookings</h2>
          <Link href="/admin/bookings" className="flex items-center gap-1 text-gold text-xs hover:underline">
            View All <ChevronRightIcon size={12} />
          </Link>
        </div>

        {stats?.recentBookings && stats.recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-600 text-[11px] uppercase tracking-wider border-b border-dark-border/40">
                  <th className="text-left px-4 py-3 font-medium">Booking</th>
                  <th className="text-left px-4 py-3 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Vehicle</th>
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Date</th>
                  <th className="text-right px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((b: any) => (
                  <tr key={b.id} className="border-b border-dark-border/30 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-gold font-mono text-[11px] font-medium">{b.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white text-sm">{b.customer?.name}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-gray-400 text-sm">{b.car?.title?.slice(0, 28)}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <CalendarIcon size={12} />
                        {b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-GB") : "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider
                        ${b.status === "pending" ? "bg-amber-500/10 text-amber-400" : ""}
                        ${b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" : ""}
                        ${b.status === "completed" ? "bg-blue-500/10 text-blue-400" : ""}
                        ${b.status === "cancelled" ? "bg-red-500/10 text-red-400" : ""}
                      `}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-sm text-center py-10">No bookings recorded yet.</p>
        )}
      </div>
    </div>
  );
}
