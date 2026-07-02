// ═══════════════════════════════════════════════
//  Root Layout — i18n + RTL Support + Theme
// ═══════════════════════════════════════════════

import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "VIP Luxury Car Rental Dubai | Premium Sports & Exotic Cars",
  description: "Experience Dubai in style with VIP Luxury Car Rental. Choose from our exclusive fleet of 350+ premium sports cars, luxury SUVs, and exotic vehicles.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-dark text-white font-sans">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1 pt-16 md:pt-20">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
