// Redirect /favicon.ico to /favicon.svg
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(new URL("/favicon.svg", "https://vipluxurycarrental.com"), 301);
}
