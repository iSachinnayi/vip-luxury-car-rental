// ═══════════════════════════════════════════════
//  POST /admin/api/login — Authenticate admin
// ═══════════════════════════════════════════════

import { NextResponse } from "next/server";
import { createSession, setSessionCookie } from "@/lib/admin/auth";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Track login attempts (in-memory, resets on server restart)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 1000 * 60 * 15; // 15 minutes

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();

    // Check rate limit
    const record = loginAttempts.get(ip);
    if (record) {
      if (record.count >= MAX_ATTEMPTS && now - record.lastAttempt < LOCKOUT_DURATION) {
        const remaining = Math.ceil((LOCKOUT_DURATION - (now - record.lastAttempt)) / 1000 / 60);
        return NextResponse.json(
          { message: `Too many attempts. Try again in ${remaining} minutes.`, locked: true },
          { status: 429 }
        );
      }
      if (now - record.lastAttempt > LOCKOUT_DURATION) {
        loginAttempts.delete(ip);
      }
    }

    const { username, password, rememberMe } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required." },
        { status: 400 }
      );
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      // Track failed attempt
      loginAttempts.set(ip, {
        count: (record?.count || 0) + 1,
        lastAttempt: now,
      });
      const remaining = MAX_ATTEMPTS - (record?.count || 0) - 1;
      return NextResponse.json(
        { message: remaining > 0 ? `Invalid credentials. ${remaining} attempts remaining.` : "Account locked. Try again later." },
        { status: 401 }
      );
    }

    // Reset attempts on success
    loginAttempts.delete(ip);

    // Create session
    const token = await createSession(rememberMe);
    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
    });
    setSessionCookie(response, token, rememberMe);

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
