// ═══════════════════════════════════════════════
//  Legal Page Layout
//  Premium layout for Privacy Policy & Terms pages
// ═══════════════════════════════════════════════

"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useCallback, useEffect, useRef, useState } from "react";

interface TocItem {
  id: string;
  label: string;
}

export default function LegalPageLayout({
  title,
  lastUpdated,
  sections,
  children,
}: {
  title: string;
  lastUpdated: string;
  sections: TocItem[];
  children: React.ReactNode;
}) {
  const t = useTranslations("legal");
  const [activeSection, setActiveSection] = useState<string>("");
  const sectionIdsRef = useRef<string[]>([]);
  const tickingRef = useRef(false);
  const activeRef = useRef<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  // Keep ref in sync with sections prop
  sectionIdsRef.current = sections.map((s) => s.id);

  // ── Scroll-based active section highlighting ──
  // Uses requestAnimationFrame for smooth updates + getBoundingClientRect
  // to reliably find the section closest to the viewport top
  const updateActiveSection = useCallback(() => {
    const ids = sectionIdsRef.current;
    if (!ids.length) return;

    const HEADER_OFFSET = 100;
    let current = ids[0];

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= HEADER_OFFSET) {
        current = id;
      }
    }

    // Only update state if it changed
    if (current !== activeRef.current) {
      activeRef.current = current;
      setActiveSection(current);
    }
  }, []);

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    if (!ids.length) return;

    // Set initial state
    activeRef.current = ids[0];
    setActiveSection(ids[0]);

    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(() => {
          updateActiveSection();
          tickingRef.current = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial call after a tick to ensure DOM is ready
    requestAnimationFrame(() => updateActiveSection());

    return () => {
      window.removeEventListener("scroll", handleScroll);
      tickingRef.current = false;
    };
  }, [sections, updateActiveSection]);

  return (
    <main className="min-h-screen bg-dark pt-20 md:pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* ═══ HEADER ═══ */}
        <div className="mb-10 p-6 md:p-10 rounded-3xl
                     bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent
                     border border-white/[0.06] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gold transition-colors mb-4 group">
            <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {t("backToHomepage")}
          </Link>

          <div className="flex items-start gap-4">
            <div className="hidden md:flex w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 items-center justify-center shrink-0 mt-1">
              <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">{title}</h1>
              <p className="text-gray-500 text-sm mt-1.5">
                {t("lastUpdated")} <span className="text-gray-400">{lastUpdated}</span>
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent mt-6" />
        </div>

        <div className="flex gap-8 relative">
          {/* ═══ TABLE OF CONTENTS — Desktop ═══ */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 p-5 rounded-2xl
                         bg-gradient-to-b from-white/[0.03] to-transparent
                         border border-white/[0.06]">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
                {t("onThisPage")}
              </h3>
              <nav className="space-y-1">
                {sections.map(({ id, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={`block text-xs py-1.5 px-3 rounded-lg transition-all duration-300 ${
                      activeSection === id
                        ? "text-gold bg-gold/5 border-l-2 border-gold"
                        : "text-gray-500 hover:text-gray-300 border-l-2 border-transparent"
                    }`}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* ═══ MAIN CONTENT ═══ */}
          <div className="flex-1 min-w-0" ref={contentRef}>
            <div className="p-4 sm:p-6 md:p-10 rounded-3xl
                         bg-gradient-to-b from-white/[0.04] via-white/[0.02] to-transparent
                         border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              {children}
            </div>

            {/* ═══ MOBILE TABLE OF CONTENTS ═══ */}
            <div className="lg:hidden mt-6 p-4 rounded-2xl
                         bg-gradient-to-b from-white/[0.03] to-transparent
                         border border-white/[0.06]">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                {t("sections")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {sections.map(({ id, label }, i) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors border ${
                      activeSection === id
                        ? "bg-gold/10 text-gold border-gold/20"
                        : "bg-white/[0.04] text-gray-400 hover:text-gold hover:bg-gold/5 border-white/[0.06]"
                    }`}
                  >
                    {i + 1}. {label}
                  </a>
                ))}
              </div>
            </div>

            {/* ═══ BACK LINK ═══ */}
            <div className="mt-8 text-center">
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gold transition-colors group">
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                {t("backToHomepage")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
