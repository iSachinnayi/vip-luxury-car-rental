// ═══════════════════════════════════════════════
//  Centralized SVG Icons — Single source of truth
//  Usage: {Icons.search} or <span className="...">{Icons.calendar}</span>
// ═══════════════════════════════════════════════

import type { ReactNode } from "react";

function makeIcon(children: ReactNode, className: string): ReactNode {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function makeIconFilled(children: ReactNode, className: string): ReactNode {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      {children}
    </svg>
  );
}

export const Icons = {
  // ─── Listing / Filter ──────────────────────────
  search: makeIcon(<><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></>, "w-4 h-4"),
  grid: makeIcon(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>, "w-4 h-4"),
  list: makeIcon(<><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></>, "w-4 h-4"),
  chevronDown: makeIcon(<polyline points="6 9 12 15 18 9" />, "w-3.5 h-3.5"),
  chevronLeft: makeIcon(<polyline points="15 18 9 12 15 6" />, "w-4 h-4"),
  chevronRight: makeIcon(<polyline points="9 18 15 12 9 6" />, "w-4 h-4"),
  close: makeIcon(<path d="M18 6L6 18M6 6l12 12" />, "w-3 h-3"),
  sort: makeIcon(<><path d="M3 6h18" /><path d="M6 12h12" /><path d="M10 18h4" /></>, "w-4 h-4"),

  // ─── Car cards / Car detail / Booking ──────────
  car: makeIcon(<><path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17v2a1 1 0 001 1h2a1 1 0 001-1v-2M17 17v2a1 1 0 001 1h2a1 1 0 001-1v-2" /><circle cx="7" cy="12" r="1.5" fill="currentColor" /><circle cx="17" cy="12" r="1.5" fill="currentColor" /></>, "w-4 h-4"),
  sun: makeIcon(<><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></>, "w-6 h-6 text-gold"),
  week: makeIcon(<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>, "w-6 h-6 text-gold"),
  month: makeIcon(<><rect x="2" y="4" width="20" height="18" rx="2" /><path d="M8 2v4M16 2v4M2 10h20" /><circle cx="12" cy="16" r="1.5" fill="#C8A951" /></>, "w-6 h-6 text-gold"),
  km: makeIcon(<><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>, "w-5 h-5 text-gold"),
  shield: makeIcon(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, "w-5 h-5 text-emerald-400"),
  star: makeIconFilled(<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />, "w-4 h-4 text-gold"),
  mapPin: makeIcon(<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></>, "w-4 h-4 text-gold"),
  calendar: makeIcon(<><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>, "w-4 h-4 text-gold"),
  clock: makeIcon(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, "w-4 h-4 text-gold"),
  user: makeIcon(<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></>, "w-4 h-4 text-gold"),
  mail: makeIcon(<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>, "w-4 h-4 text-gold"),
  phone: makeIcon(<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />, "w-4 h-4 text-gold"),
  whatsapp: makeIconFilled(<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />, "w-5 h-5"),
  arrow: makeIcon(<path d="M5 12h14M12 5l7 7-7 7" />, "w-4 h-4"),
  noDeposit: makeIcon(<><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /></>, "w-5 h-5 text-emerald-400"),
  lock: makeIcon(<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>, "w-5 h-5 text-gold"),
  check: makeIcon(<polyline points="20 6 9 17 4 12" />, "w-4 h-4 text-green-400"),
  bitcoin: makeIcon(<><circle cx="12" cy="12" r="10" stroke="#F7931A" /><path d="M12.5 8.5h-2v3h2c1 0 1.5-.5 1.5-1.5s-.5-1.5-1.5-1.5zM12.5 13.5h-2v3h2c1 0 1.5-.5 1.5-1.5s-.5-1.5-1.5-1.5z" stroke="#F7931A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M11 7v10M13 7v10" stroke="#F7931A" strokeWidth="1.2" strokeLinecap="round" /></>, "w-6 h-6"),
  xCircle: makeIcon(<><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></>, "w-5 h-5 text-red-400"),
  shieldCheck: makeIcon(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>, "w-6 h-6 text-emerald-400"),
} as const;
