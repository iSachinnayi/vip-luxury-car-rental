import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// ─── Environment validation ───
const requiredEnvVars = [
  "NEXT_PUBLIC_WA_PHONE",
  "NEXT_PUBLIC_SITE_URL",
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`⚠️  Warning: ${envVar} not set — using default value`);
  }
}

const nextConfig: NextConfig = {
  output: "standalone", // Smaller Docker/server deployments
  trailingSlash: true, // Matches old WordPress site URLs
  skipTrailingSlashRedirect: false,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vipluxurycarrental.com",
      },
      {
        protocol: "https",
        hostname: "vz-ec98b50f-976.b-cdn.net", // Bunny CDN
      },
    ],
  },
};

export default withNextIntl(nextConfig);
