// ═══════════════════════════════════════════════
//  Contact Page — /contact
// ═══════════════════════════════════════════════

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import SEOHead from "@/components/SEOHead";
import { generatePageMeta } from "@/lib/seo";
import { APP_CONFIG } from "@/lib/config";

export default function ContactPage() {
  const t = useTranslations("contact");
  const meta = generatePageMeta(t("pageTitle"), "Get in touch with VIP Luxury Car Rental Dubai. Contact us via WhatsApp, phone, or email to book your dream luxury car.");
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("formErrorFallback"));
      setStatus("sent");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || t("formErrorSendFailed"));
    }
  };
  return (
    <main className="min-h-screen bg-dark pt-8 md:pt-12">
      <SEOHead title={meta.title} description={meta.description} />
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/" className="text-sm text-gray-500 hover:text-gold transition-colors">
            {t("breadcrumbHome")}
          </Link>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mt-2">
            {t("pageTitle")}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl glass-card">
              <h3 className="text-lg font-bold text-white mb-4">{t("sectionTitle")}</h3>
              <div className="space-y-4 text-sm text-gray-400">
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">📍</span>
                  <div>
                    <div className="text-white font-medium">{t("addressLabel")}</div>
                    <div>{t("addressValue")}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">📞</span>
                  <div>
                    <div className="text-white font-medium">{t("phoneLabel")}</div>
                    <a href={`tel:${APP_CONFIG.PHONE.replace(/\+/g, "")}`} className="hover:text-gold transition-colors">
                      {APP_CONFIG.PHONE}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">✉️</span>
                  <div>
                    <div className="text-white font-medium">{t("emailLabel")}</div>
                    <a href="mailto:booking@vipluxurycarrental.com" className="hover:text-gold transition-colors break-all">
                      booking@vipluxurycarrental.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">💬</span>
                  <div>
                    <div className="text-white font-medium">{t("whatsappLabel")}</div>
                    <a href={`https://wa.me/${APP_CONFIG.WA_PHONE}`} target="_blank"
                      className="text-green-400 hover:text-green-300 transition-colors">
                      {t("whatsappAction")}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-card">
              <h3 className="text-lg font-bold text-white mb-4">{t("hoursTitle")}</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>{t("hoursDays")}</span>
                  <span className="text-white">{t("hoursValue")}</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">{t("hoursNote")}</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] 
                        border border-white/10 backdrop-blur-xl"
          >
            <h3 className="text-xl font-bold text-white mb-6">{t("formTitle")}</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {status === "sent" && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                  {t("formSuccessMsg")}
                </div>
              )}
              {status === "error" && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  ❌ {errorMsg}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">{t("formNameLabel")}</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder={t("formNamePlaceholder")} required
                    className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-white
                               focus:border-gold/50 outline-none transition-colors placeholder-gray-600" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">{t("formPhoneLabel")}</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder={t("formPhonePlaceholder")} required
                    className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-white
                               focus:border-gold/50 outline-none transition-colors placeholder-gray-600" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">{t("formEmailLabel")}</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder={t("formEmailPlaceholder")} required
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-white
                             focus:border-gold/50 outline-none transition-colors placeholder-gray-600" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">{t("formMessageLabel")}</label>
                <textarea rows={4} name="message" value={form.message} onChange={handleChange} placeholder={t("formMessagePlaceholder")} required
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-white
                             focus:border-gold/50 outline-none transition-colors placeholder-gray-600 resize-none" />
              </div>
              <button type="submit" disabled={status === "sending"}
                className="btn-gold w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                {status === "sending" ? t("formSendingText") : t("formSubmitText")}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
