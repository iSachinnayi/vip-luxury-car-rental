// ═══════════════════════════════════════════════
//  API: /api/images/[...path] — Serve car images
//  Auto-converts JPG/PNG/GIF to WebP on-the-fly
//  One-year cache for optimal performance
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const UPLOADS_DIR = path.join(
  "/",
  "var",
  "www",
  "vipluxurycarrental.com",
  "htdocs",
  "wp-content",
  "uploads"
);

const CACHE_HEADERS = { "Cache-Control": "public, max-age=31536000, immutable" };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const relativePath = pathSegments.join(path.sep);

  // Security: block path traversal
  if (relativePath.includes("..") || relativePath.includes("~")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const filePath = path.join(UPLOADS_DIR, relativePath);

  try {
    await fs.stat(filePath);
  } catch {
    return new NextResponse("Image not found", { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();

  // ── Convert JPG/PNG/GIF to WebP on-the-fly ──
  if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
    try {
      const buffer = await fs.readFile(filePath);
      const webp = await sharp(buffer)
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      return new NextResponse(webp, {
        headers: {
          "Content-Type": "image/webp",
          ...CACHE_HEADERS,
          "Content-Length": webp.length.toString(),
        },
      });
    } catch (err) {
      console.error("Image conversion error:", err);
      // Fallback to original
      const buffer = await fs.readFile(filePath);
      const mime: Record<string, string> = {
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
        ".png": "image/png", ".gif": "image/gif",
      };
      return new NextResponse(buffer, {
        headers: { "Content-Type": mime[ext] || "application/octet-stream", ...CACHE_HEADERS },
      });
    }
  }

  // ── WebP/SVG — serve directly ──
  const mime: Record<string, string> = {
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };
  const buffer = await fs.readFile(filePath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mime[ext] || "application/octet-stream",
      ...CACHE_HEADERS,
    },
  });
}
