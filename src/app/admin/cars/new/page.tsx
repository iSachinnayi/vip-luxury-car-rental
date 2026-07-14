"use client";

// ═══════════════════════════════════════════════
//  Add New Car — Delegates to edit component
// ═══════════════════════════════════════════════

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewCarPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to edit page with "new" slug
    router.replace("/admin/cars/new/edit");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <div className="w-4 h-4 border border-gold/30 border-t-gold rounded-full animate-spin" />
        Loading editor...
      </div>
    </div>
  );
}
