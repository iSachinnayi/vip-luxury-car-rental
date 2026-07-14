"use client";

// ═══════════════════════════════════════════════
//  Admin Users — Account & role management
// ═══════════════════════════════════════════════

import { useState } from "react";
import { InfoIcon } from "@/components/admin/Icons";

export default function AdminUsersPage() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    if (newPassword.length < 6) { setMessage("Password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setMessage("Passwords do not match."); return; }
    setMessage("Password managed via ADMIN_PASSWORD environment variable.");
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white font-serif">Users</h1>
        <p className="text-gray-500 text-sm mt-0.5">Admin account and permissions</p>
      </div>

      {/* Admin Account */}
      <div className="bg-dark-card/60 border border-dark-border/60 rounded-xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center flex-shrink-0">
            <span className="text-gold font-bold text-sm">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm">Admin</h3>
            <p className="text-xs text-gray-500 mt-0.5">admin@vipluxurycarrental.com</p>
            <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-wider">Role: Super Admin</p>
          </div>
          <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="px-3 py-1.5 text-[11px] bg-dark/50 border border-dark-border/60 text-gray-400 rounded-lg hover:border-gray-600 hover:text-white transition-all whitespace-nowrap">
            {showPasswordForm ? "Cancel" : "Change Password"}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handleChangePassword} className="mt-5 pt-5 border-t border-dark-border/60 space-y-4 max-w-md">
            {message && (
              <div className="bg-amber-500/8 border border-amber-500/15 text-amber-400 text-xs px-3.5 py-2.5 rounded-lg">{message}</div>
            )}
            <div>
              <label className="block text-[11px] text-gray-500 mb-1.5 font-medium">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-dark/50 border border-dark-border/60 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/30" required />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1.5 font-medium">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-dark/50 border border-dark-border/60 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/30" required />
            </div>
            <button type="submit" className="px-4 py-2 bg-gold text-dark text-xs font-semibold rounded-lg hover:bg-gold-500 transition-all uppercase tracking-wider">Update Password</button>
          </form>
        )}
      </div>

      {/* Roles */}
      <div className="bg-dark-card/60 border border-dark-border/60 rounded-xl p-5">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Role Structure</h2>
        <div className="space-y-3">
          {[
            { role: "Super Admin", desc: "Full access to all modules and settings.", color: "border-l-gold", active: true },
            { role: "Manager", desc: "Manage bookings, cars, and messages.", color: "border-l-blue-500/50", active: false },
            { role: "Staff", desc: "View bookings and update statuses.", color: "border-l-gray-600", active: false },
          ].map((r) => (
            <div key={r.role} className={`bg-dark/50 rounded-lg p-3.5 border-l-2 ${r.color} ${!r.active ? "opacity-50" : ""}`}>
              <p className="text-sm text-white font-medium">{r.role}</p>
              <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3.5 flex items-start gap-2.5">
        <InfoIcon className="text-amber-400/70 flex-shrink-0 mt-0.5" size={15} />
        <p className="text-xs text-amber-400/70 leading-relaxed">
          Admin credentials are managed via <code className="text-gold text-[11px]">ADMIN_USERNAME</code> and <code className="text-gold text-[11px]">ADMIN_PASSWORD</code> environment variables.
          Multi-role support is planned for a future release.
        </p>
      </div>
    </div>
  );
}
