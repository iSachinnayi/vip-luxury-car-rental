// ═══════════════════════════════════════════════
//  Main Site Layout — Header + Footer + SEO
//  Only wraps public-facing pages (not /admin)
// ═══════════════════════════════════════════════

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import SchemaOrg from "@/components/SchemaOrg";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Header />
      <main className="flex-1 pt-16 md:pt-20 bg-dark">{children}</main>
      <Footer />
      <CookieConsent />
      <SchemaOrg locale={locale} />
      <FloatingWhatsApp />
    </>
  );
}
