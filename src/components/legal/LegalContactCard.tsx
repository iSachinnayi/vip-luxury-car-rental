// ═══════════════════════════════════════════════
//  Legal Contact Card — Shared for Privacy & Terms
// ═══════════════════════════════════════════════

"use client";

import { useTranslations } from "next-intl";

interface ContactItem {
  label: string;
  value: string;
  href?: string;
}

export default function LegalContactCard({ items }: { items: ContactItem[] }) {
  const t = useTranslations("legal");
  return (
    <div className="mt-6 p-5 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06]">
      <h3 className="text-white text-sm font-semibold mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        {t("contactUs")}
      </h3>
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="text-gray-500 w-24 shrink-0">{item.label}</span>
            {item.href ? (
              <a
                href={item.href}
                className="text-gray-300 hover:text-gold transition-colors"
              >
                {item.value}
              </a>
            ) : (
              <span className="text-gray-300">{item.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
