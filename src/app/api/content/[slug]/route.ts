// ═══════════════════════════════════════════════
//  API: /api/content/[slug] — Serve page content
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { getPageContent } from "@/lib/content";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const content = getPageContent(slug);

  if (!content) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 });
  }

  return NextResponse.json(content);
}
