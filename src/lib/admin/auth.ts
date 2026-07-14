// ═══════════════════════════════════════════════
//  Admin Authentication — JWT-free session mgmt
//  Uses HMAC-signed cookies with crypto (zero deps)
// ═══════════════════════════════════════════════

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION = 1000 * 60 * 30; // 30 minutes
const REMEMBER_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days

// ─── Helpers ───────────────────────────────────

function getSecret(): string {
  return process.env.ADMIN_SECRET || "vip-admin-secret-change-in-production-2026";
}

async function sign(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const sigHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${payload}.${sigHex}`;
}

async function verify(token: string): Promise<string | null> {
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return null;
  const payload = token.slice(0, lastDot);
  const expectedSig = token.slice(lastDot + 1);

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const sigBin = new Uint8Array(
    expectedSig.match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) || []
  );
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    sigBin,
    encoder.encode(payload)
  );
  if (!valid) return null;

  // Decode payload
  try {
    const data = JSON.parse(atob(payload));
    if (data.exp && Date.now() > data.exp) return null;
    return data.username || null;
  } catch {
    return null;
  }
}

// ─── Public API ────────────────────────────────

export async function createSession(rememberMe = false): Promise<string> {
  const exp = Date.now() + (rememberMe ? REMEMBER_DURATION : SESSION_DURATION);
  const payload = btoa(JSON.stringify({
    username: "admin",
    exp,
    created: Date.now(),
  }));
  return sign(payload);
}

export async function getSession(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verify(token);
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  // Must match same path as setSessionCookie for deletion to work
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 0, // Expire immediately
  });
}

export function setSessionCookie(response: NextResponse, token: string, rememberMe: boolean): void {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: rememberMe ? 60 * 60 * 24 * 7 : 60 * 30,
  });
}

export async function requireAdmin(): Promise<string | null> {
  return getSession();
}
