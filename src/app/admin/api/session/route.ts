// ═══════════════════════════════════════════════
//  GET /admin/api/session — Check if authenticated
// ═══════════════════════════════════════════════

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";

export async function GET() {
  const username = await requireAdmin();
  if (!username) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({ username, authenticated: true });
}
