// ═══════════════════════════════════════════════
//  Contact Page — /contact
// ═══════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-dark pt-8 md:pt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/" className="text-sm text-gray-500 hover:text-gold transition-colors">
            ← Home
          </Link>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mt-2">
            Contact Us
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
              <h3 className="text-lg font-bold text-white mb-4">Get In Touch</h3>
              <div className="space-y-4 text-sm text-gray-400">
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">📍</span>
                  <div>
                    <div className="text-white font-medium">Address</div>
                    <div>Al Barsha Near Mall Of Emirates, Dubai</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">📞</span>
                  <div>
                    <div className="text-white font-medium">Phone</div>
                    <a href="tel:+971501564849" className="hover:text-gold transition-colors">
                      +971 50 156 4849
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">✉️</span>
                  <div>
                    <div className="text-white font-medium">Email</div>
                    <a href="mailto:booking@vipluxurycarrental.com" className="hover:text-gold transition-colors break-all">
                      booking@vipluxurycarrental.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">💬</span>
                  <div>
                    <div className="text-white font-medium">WhatsApp</div>
                    <a href="https://wa.me/971501564849" target="_blank"
                      className="text-green-400 hover:text-green-300 transition-colors">
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-card">
              <h3 className="text-lg font-bold text-white mb-4">Business Hours</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Monday - Sunday</span>
                  <span className="text-white">24/7</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">24/7 delivery and pick-up available</p>
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
            <h3 className="text-xl font-bold text-white mb-6">Send Us a Message</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Name</label>
                  <input type="text" placeholder="Your name"
                    className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-white
                               focus:border-gold/50 outline-none transition-colors placeholder-gray-600" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Phone</label>
                  <input type="tel" placeholder="+971 50 000 0000"
                    className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-white
                               focus:border-gold/50 outline-none transition-colors placeholder-gray-600" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Email</label>
                <input type="email" placeholder="your@email.com"
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-white
                             focus:border-gold/50 outline-none transition-colors placeholder-gray-600" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Message</label>
                <textarea rows={4} placeholder="How can we help you?"
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-white
                             focus:border-gold/50 outline-none transition-colors placeholder-gray-600 resize-none" />
              </div>
              <button type="submit"
                className="btn-gold w-full py-4 text-base">
                ✉️ Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
