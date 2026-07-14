"use client";

// ═══════════════════════════════════════════════
//  Admin Settings — Site configuration
// ═══════════════════════════════════════════════

import { useState, useEffect } from "react";

interface Settings {
  siteName: string;
  siteEmail: string;
  sitePhone: string;
  whatsappNumber: string;
  address: string;
  currency: string;
  taxRate: number;
  depositFee: number;
  bookingPrefix: string;
  social: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
    tiktok: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    googleAnalyticsId: string;
    facebookPixelId: string;
  };
}

const inputCls = "w-full bg-dark/50 border border-dark-border/60 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/15 transition-all";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { fetchSettings(); }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/admin/api/settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) { console.error("Fetch settings error:", err); } finally { setLoading(false); }
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/admin/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setMessage(res.ok ? "Settings saved." : "Failed to save.");
    } catch (err) { console.error("Save settings error:", err); setMessage("Failed to save."); } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  }

  function update(field: string, value: any) {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  }

  function updateSocial(key: string, value: string) {
    if (!settings) return;
    setSettings({ ...settings, social: { ...settings.social, [key]: value } });
  }

  function updateSeo(key: string, value: string) {
    if (!settings) return;
    setSettings({ ...settings, seo: { ...settings.seo, [key]: value } });
  }

  if (loading) return <div className="text-center py-12 text-gray-600 text-sm">Loading...</div>;

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white font-serif">Settings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Site configuration</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-gold text-dark text-xs font-semibold rounded-lg hover:bg-gold-500 transition-all disabled:opacity-50 uppercase tracking-wider">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className={`text-xs px-3.5 py-2.5 rounded-lg ${
          message.includes("saved") ? "bg-emerald-500/8 text-emerald-400 border border-emerald-500/15" : "bg-red-500/8 text-red-400 border border-red-500/15"
        }`}>
          {message}
        </div>
      )}

      {/* General */}
      <Section title="General">
        <Field label="Site Name"><input type="text" value={settings?.siteName || ""} onChange={(e) => update("siteName", e.target.value)} className={inputCls} /></Field>
        <Field label="Site Email"><input type="email" value={settings?.siteEmail || ""} onChange={(e) => update("siteEmail", e.target.value)} className={inputCls} /></Field>
        <Field label="Phone Number"><input type="text" value={settings?.sitePhone || ""} onChange={(e) => update("sitePhone", e.target.value)} className={inputCls} /></Field>
        <Field label="WhatsApp Number"><input type="text" value={settings?.whatsappNumber || ""} onChange={(e) => update("whatsappNumber", e.target.value)} className={inputCls} /></Field>
        <Field label="Address"><input type="text" value={settings?.address || ""} onChange={(e) => update("address", e.target.value)} className={inputCls} /></Field>
        <Field label="Default Currency"><input type="text" value={settings?.currency || "AED"} onChange={(e) => update("currency", e.target.value)} className={inputCls} /></Field>
      </Section>

      {/* Booking */}
      <Section title="Booking">
        <Field label="Tax Rate (%)"><input type="number" value={settings?.taxRate || 0} onChange={(e) => update("taxRate", parseFloat(e.target.value) || 0)} className={inputCls} /></Field>
        <Field label="Deposit Fee (AED)"><input type="number" value={settings?.depositFee || 0} onChange={(e) => update("depositFee", parseFloat(e.target.value) || 0)} className={inputCls} /></Field>
        <Field label="Booking ID Prefix"><input type="text" value={settings?.bookingPrefix || "VIP"} onChange={(e) => update("bookingPrefix", e.target.value)} className={inputCls} /></Field>
      </Section>

      {/* Social */}
      <Section title="Social Media">
        <Field label="Instagram"><input type="text" value={settings?.social.instagram || ""} onChange={(e) => updateSocial("instagram", e.target.value)} className={inputCls} placeholder="https://instagram.com/..." /></Field>
        <Field label="Facebook"><input type="text" value={settings?.social.facebook || ""} onChange={(e) => updateSocial("facebook", e.target.value)} className={inputCls} /></Field>
        <Field label="Twitter / X"><input type="text" value={settings?.social.twitter || ""} onChange={(e) => updateSocial("twitter", e.target.value)} className={inputCls} /></Field>
        <Field label="YouTube"><input type="text" value={settings?.social.youtube || ""} onChange={(e) => updateSocial("youtube", e.target.value)} className={inputCls} /></Field>
        <Field label="TikTok"><input type="text" value={settings?.social.tiktok || ""} onChange={(e) => updateSocial("tiktok", e.target.value)} className={inputCls} /></Field>
      </Section>

      {/* SEO */}
      <Section title="SEO">
        <Field label="Default Meta Title"><input type="text" value={settings?.seo.defaultTitle || ""} onChange={(e) => updateSeo("defaultTitle", e.target.value)} className={inputCls} /></Field>
        <Field label="Default Meta Description"><textarea value={settings?.seo.defaultDescription || ""} onChange={(e) => updateSeo("defaultDescription", e.target.value)} className={inputCls} rows={3} /></Field>
        <Field label="Google Analytics ID"><input type="text" value={settings?.seo.googleAnalyticsId || ""} onChange={(e) => updateSeo("googleAnalyticsId", e.target.value)} className={inputCls} placeholder="G-XXXXXXXXXX" /></Field>
        <Field label="Facebook Pixel ID"><input type="text" value={settings?.seo.facebookPixelId || ""} onChange={(e) => updateSeo("facebookPixelId", e.target.value)} className={inputCls} /></Field>
      </Section>
    </div>
  );
}

// ─── Reusable Components ───────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-dark-card/40 border border-dark-border/60 rounded-xl p-5">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] text-gray-500 mb-1.5 font-medium">{label}</label>
      {children}
    </div>
  );
}
