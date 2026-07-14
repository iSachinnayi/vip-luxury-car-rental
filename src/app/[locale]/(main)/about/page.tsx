// ═══════════════════════════════════════════════
//  About Us — /about
//  Company story, stats, team, values
// ═══════════════════════════════════════════════

import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale === "ar") {
    return {
      title: "من نحن",
      description: "اكتشف VIP Luxury Car Rental دبي. مع أكثر من 350 مركبة فاخرة، تقييم 4.9 نجوم، وخدمة على مدار الساعة، نحن الشركة الرائدة في تأجير السيارات الفاخرة في دبي.",
      alternates: { canonical: "/ar/about/" },
      openGraph: {
        title: "من نحن | VIP Luxury Car Rental Dubai",
        description: "شركة تأجير السيارات الفاخرة الرائدة في دبي. أكثر من 350 مركبة، تقييم 4.9 نجوم، توصيل مجاني.",
        url: "/ar/about/",
        images: [{ url: "https://vipluxurycarrental.com/opengraph-image", width: 1200, height: 630 }],
      },
    };
  }
  return {
    title: "About Us",
    description: "Discover VIP Luxury Car Rental Dubai. With 350+ premium vehicles, 4.9★ rating, and 24/7 service, we are Dubai's premier luxury car rental company.",
    alternates: { canonical: "/about/" },
    openGraph: {
      title: "About Us | VIP Luxury Car Rental Dubai",
      description: "Dubai's premier luxury car rental company. 350+ vehicles, 4.9★ rating, free delivery.",
      url: "/about/",
      images: [{ url: "https://vipluxurycarrental.com/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

const STATS = [
  { value: "350+", key: "statsPremium" },
  { value: "4.9★", key: "statsRating" },
  { value: "15+", key: "statsBrands" },
  { value: "24/7", key: "statsSupport" },
];

const VALUES = [
  {
    key: "Quality",
    icon: "⭐",
  },
  {
    key: "Customer",
    icon: "🤝",
  },
  {
    key: "Availability",
    icon: "🕐",
  },
  {
    key: "Delivery",
    icon: "🚚",
  },
];

export default async function AboutPage() {
  const t = await getTranslations("about");
  return (
    <main className="min-h-screen bg-dark pt-20 md:pt-24 pb-16">
      {/* ═══ HERO ═══ */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
          <span className="inline-block text-xs uppercase tracking-[0.25em] text-gold mb-4 font-medium">
            {t("label")}
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6">
            {t("title")}<br />
            <span className="text-gold">{t("titleGold")}</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((stat) => (
            <div key={stat.key}
              className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent
                         border border-white/[0.06] text-center">
              <div className="text-2xl md:text-3xl font-bold text-gold mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{t(stat.key)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ STORY ═══ */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 mb-16">
        <div className="p-6 md:p-10 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06]">
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-6">{t("storyTitle")}</h2>
          <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
            <p>{t("storyP1")}</p>
            <p>{t("storyP2")}</p>
            <p>{t("storyP3")}</p>
          </div>
        </div>
      </section>

      {/* ═══ VALUES ═══ */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 mb-16">
        <h2 className="font-serif text-2xl md:text-3xl text-white text-center mb-10">{t("valuesTitle")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {VALUES.map((v) => (
            <div key={v.key}
              className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent
                         border border-white/[0.06] flex items-start gap-4">
              <span className="text-2xl mt-1">{v.icon}</span>
              <div>
                <h3 className="text-white font-bold text-sm mb-2">{t("value" + v.key)}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t("value" + v.key + "Desc")}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="text-center max-w-2xl mx-auto px-4 md:px-8">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-gold/[0.05] to-transparent border border-gold/10">
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-4">{t("ctaTitle")}</h2>
          <p className="text-gray-400 text-sm mb-6">{t("ctaDesc")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/all-cars/"
              className="px-8 py-3 rounded-xl bg-gold text-black font-bold text-sm
                         hover:bg-gold/90 transition-all shadow-[0_4px_15px_rgba(200,169,81,0.3)]">
              {t("ctaBrowse")}
            </Link>
            <Link href="/contact/"
              className="px-8 py-3 rounded-xl border border-white/10 text-gray-300 font-medium text-sm
                         hover:border-gold/30 hover:text-gold transition-all">
              {t("ctaContact")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
