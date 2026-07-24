// ═══════════════════════════════════════════════
//  Footer — Essential links + Contact
// ═══════════════════════════════════════════════

"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import SiteLogo from "@/components/SiteLogo";
import { EMIRATES } from "@/lib/emirates";
import { APP_CONFIG } from "@/lib/config";

export default function Footer() {
  const t = useTranslations("footer");
  const common = useTranslations("common");
  const locale = useLocale();
  const isRtlLocale = locale === "ar";

  const BOTTOM_LINKS = [
    { label: t("faq"), href: "/faq" },
    { label: t("privacy"), href: "/privacy" },
    { label: t("terms"), href: "/terms" },
  ];

  const QUICK_LINKS = [
    { label: t("allCars"), href: "/all-cars" },
    { label: t("brands"), href: "/brand" },
    { label: t("luxuryCars"), href: "/luxury-car-rental-in-dubai" },
    { label: t("sportsCars"), href: "/sports-car-rental-in-dubai" },
    { label: t("suvRental"), href: "/suv-car-rental-in-dubai" },
    { label: "Site Map", href: "/sitemap" },
    { label: t("contact"), href: "/contact" },
  ];

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  };

  const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
  };

  return (
    <footer className="bg-dark border-t border-white/[0.04] mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {/* Brand */}
          <motion.div variants={fadeUp} className="space-y-4">
            <Link href="/" className="inline-block">
              <SiteLogo showTagline size="md" link={false} />
            </Link>

            {/* Animated gold divider */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "60px", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: easeOut }}
              className="h-[1.5px] rounded-full
                         bg-gradient-to-r from-gold via-gold/80 to-transparent
                         shadow-[0_0_8px_rgba(200,169,81,0.2)]"
            />

            <p className="text-sm text-gray-400 leading-relaxed">
              {t("brandDesc")}
            </p>
            {/* Social / Trust */}
            <div className="flex items-center gap-3 pt-2">
              <a href={`https://wa.me/${APP_CONFIG.WA_PHONE}`} target="_blank"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center
                           text-gray-400 hover:text-green-400 hover:border-green-400/30 hover:bg-green-500/5
                           transition-all duration-300"
                aria-label="WhatsApp">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a href={`tel:${APP_CONFIG.PHONE.replace(/\+/g, "")}`}
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center
                           text-gray-400 hover:text-gold hover:border-gold/30 hover:bg-gold/5
                           transition-all duration-300"
                aria-label="Call">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeUp}>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.15em] mb-5">{t("quickLinks")}</h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm text-gray-400 hover:text-gold transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-gold transition-colors duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={fadeUp}>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.15em] mb-5">{t("contactUs")}</h4>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{t("address")}</span>
              </div>
              <a href={`tel:${APP_CONFIG.PHONE.replace(/\+/g, "")}`} className="flex items-center gap-3 hover:text-gold transition-colors duration-300 group">
                <svg className="w-4 h-4 text-gray-500 group-hover:text-gold transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <span>{t("phone")}</span>
              </a>
              <a href="mailto:booking@vipluxurycarrental.com" className="flex items-center gap-3 hover:text-gold transition-colors duration-300 group break-all">
                <svg className="w-4 h-4 text-gray-500 group-hover:text-gold transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>{t("email")}</span>
              </a>
              <a href="https://wa.me/971501564849" target="_blank"
                className="flex items-center gap-3 text-emerald-400 hover:text-emerald-300 transition-colors duration-300 group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>{t("whatsapp")}</span>
              </a>
            </div>
          </motion.div>

          {/* Service Areas */}
          <motion.div variants={fadeUp}>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.15em] mb-5">{t("serviceAreas")}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/all-cars/"
                  className="text-sm text-gray-400 hover:text-gold transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-gold transition-colors duration-300" />
                  {t("dubai")}
                </Link>
              </li>
              {EMIRATES.map((emirate) => (
                <li key={emirate.slug}>
                  <Link href={`/location/${emirate.slug}/`}
                    className="text-sm text-gray-400 hover:text-gold transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-gold transition-colors duration-300" />
                    {isRtlLocale && emirate.nameAr ? emirate.nameAr : emirate.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div variants={fadeUp}
          className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-[11px] text-gray-600">
            &copy; {new Date().getFullYear()} {t("brandName")}. {t("rightsReserved")}
          </p>
          <div className="flex items-center gap-5">
            {BOTTOM_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
