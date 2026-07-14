"use client";

// ═══════════════════════════════════════════════
//  Admin Sidebar — Pure SVG icons, premium glass UI
// ═══════════════════════════════════════════════

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardIcon,
  BookingsIcon,
  CarsIcon,
  PagesIcon,
  MessagesIcon,
  UsersIcon,
  SettingsIcon,
  PriceIcon,
  ExternalLinkIcon,
} from "./Icons";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: DashboardIcon },
  { label: "Bookings", href: "/admin/bookings", icon: BookingsIcon },
  { label: "Cars", href: "/admin/cars", icon: CarsIcon },
  { label: "Prices", href: "/admin/prices", icon: PriceIcon },
  { label: "Pages", href: "/admin/pages", icon: PagesIcon },
  { label: "Messages", href: "/admin/messages", icon: MessagesIcon },
  { label: "Users", href: "/admin/users", icon: UsersIcon },
  { label: "Settings", href: "/admin/settings", icon: SettingsIcon },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-dark-border/60">
        <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-9 h-9 bg-gradient-to-br from-gold to-gold-600 rounded-xl flex items-center justify-center shadow-lg shadow-gold/10">
            <span className="text-dark font-bold text-sm tracking-tight">V</span>
          </div>
          <div className="leading-tight">
            <h2 className="text-[13px] font-semibold text-white tracking-wide">VIP Admin</h2>
            <p className="text-[10px] text-gray-600 tracking-wider uppercase">Luxury Car Rental</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                transition-all duration-200 group relative
                ${isActive
                  ? "bg-gradient-to-r from-gold/10 to-gold/5 text-gold border border-gold/15"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] border border-transparent"
                }
              `}
            >
              <Icon className={`${isActive ? "text-gold" : "text-gray-500 group-hover:text-gray-300"} flex-shrink-0`} size={18} />
              <span className="font-medium">{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-auto bg-gold/15 text-gold text-[10px] px-2 py-0.5 rounded-full font-medium">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gold rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-dark-border/60">
        <Link
          href="/"
          target="_blank"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-gray-400 hover:bg-white/[0.03] transition-all"
        >
          <ExternalLinkIcon size={16} />
          <span>View Site</span>
        </Link>
      </div>
    </aside>
  );
}
