"use client";

// ═══════════════════════════════════════════════
//  Admin Login — Premium dark theme
// ═══════════════════════════════════════════════

import { useState, FormEvent } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/admin/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials.");
        setLoading(false);
        return;
      }

      // Use full page navigation to ensure session cookie is sent
      window.location.href = "/admin/";
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold/10">
            <span className="text-dark font-bold text-lg">V</span>
          </div>
          <h1 className="text-xl font-bold text-white font-serif">VIP Luxury Cars</h1>
          <p className="text-gray-600 text-xs mt-1">Administration Panel</p>
        </div>

        {/* Card */}
        <div className="bg-dark-card border border-dark-border/60 rounded-xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-xs px-3.5 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-dark/50 border border-dark-border/80 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/15 transition-all"
                placeholder="Enter username"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark/50 border border-dark-border/80 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/15 transition-all"
                placeholder="Enter password"
                required
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-dark-border/80 bg-dark/50 accent-gold"
              />
              <span className="text-xs text-gray-500">Remember for 7 days</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-500 text-dark font-semibold text-sm py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in\u2026" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-700 text-[10px] mt-5 tracking-wider uppercase">
          VIP Luxury Car Rental Dubai &middot; v1.0
        </p>
      </div>
    </div>
  );
}
