"use client";

// ═══════════════════════════════════════════════
//  Admin Layout — Sidebar + TopBar — Premium Dark
// ═══════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { MenuIcon, LogoutIcon } from "@/components/admin/Icons";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [authState, setAuthState] = useState<"loading" | "auth" | "unauth">("loading");

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/admin/api/session");
        if (!res.ok) { setAuthState("unauth"); router.push("/admin/login"); return; }
        const data = await res.json();
        setUser(data.username || "Admin");
        setAuthState("auth");
      } catch { setAuthState("unauth"); router.push("/admin/login"); }
    };
    check();
  }, [router]);

  // Close sidebar on route change (MUST be before conditional return — hooks order)
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const handleLogout = useCallback(async () => {
    await fetch("/admin/api/logout", { method: "POST" });
    setUser(null);
    router.push("/admin/login");
  }, [router]);

  // Login page — hide sidebar (use startsWith for trailing slash support)
  if (pathname === "/admin/login" || pathname === "/admin/login/") return <>{children}</>;

  // While checking auth, show nothing to prevent content flash
  if (authState === "loading") return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <div className="w-4 h-4 border border-gold/30 border-t-gold rounded-full animate-spin" />
        Verifying...
      </div>
    </div>
  );

  // Not authenticated — don't render anything, redirect already fired
  if (authState === "unauth") return null;

  const pageName = pathname === "/admin" || pathname === "/admin/"
    ? "Dashboard"
    : pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "";

  return (
    <div className="min-h-screen bg-dark text-white flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64
        bg-dark-card border-r border-dark-border/60
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen max-w-full">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-dark-card/70 backdrop-blur-xl border-b border-dark-border/60">
          <div className="flex items-center justify-between px-4 lg:px-6 h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-white transition-colors p-1 -ml-1">
                <MenuIcon size={20} />
              </button>
              <nav className="hidden sm:flex items-center gap-1.5 text-sm">
                <span className="text-gold font-medium">Admin</span>
                <span className="text-gray-700">/</span>
                <span className="text-gray-400">{pageName}</span>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center">
                  <span className="text-gold text-[11px] font-semibold">A</span>
                </div>
                <span className="text-sm text-gray-400 hidden sm:block">{user || "Admin"}</span>
              </div>

              <button onClick={handleLogout} className="text-gray-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/5" title="Sign out">
                <LogoutIcon size={17} />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
