import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "VIP Luxury Car Rental Dubai | Premium Sports & Exotic Cars",
  description:
    "Experience Dubai in style with VIP Luxury Car Rental. Choose from our exclusive fleet of 350+ premium sports cars, luxury SUVs, and exotic vehicles.",
  keywords: [
    "luxury car rental Dubai",
    "sports car rental Dubai",
    "exotic car rental",
    "VIP car rental",
    "Lamborghini rental Dubai",
    "Ferrari rental Dubai",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-dark text-white font-sans">
        <Header />
        <main className="flex-1 pt-16 md:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
