// ═══════════════════════════════════════════════
//  FloatingWhatsApp — Site-wide floating WhatsApp
//  Appears on ALL public pages (via main layout)
//  Uses locale-aware general inquiry message
// ═══════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import WhatsAppIcon from "./WhatsAppIcon";
import { waGeneralInquiry } from "@/lib/whatsapp";

export default function FloatingWhatsApp() {
  const locale = useLocale() as "en" | "ar";

  return (
    <motion.a
      href={waGeneralInquiry(locale)}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] 
                 flex items-center justify-center shadow-lg text-white
                 shadow-[#25D366]/30 hover:shadow-[#25D366]/50 hover:bg-[#22c35e] 
                 transition-all duration-300"
      title={locale === "ar" ? "تحدث معنا على واتساب" : "Chat with us on WhatsApp"}
      aria-label={locale === "ar" ? "واتساب" : "WhatsApp"}
    >
      <WhatsAppIcon className="w-7 h-7" />
    </motion.a>
  );
}
