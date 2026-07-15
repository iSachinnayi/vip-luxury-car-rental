// ═══════════════════════════════════════════════
//  Sitemap Page — Beautiful HTML sitemap for users
//  Organized by content type: cars, locations,
//  brand pages, category pages, and static pages
// ═══════════════════════════════════════════════

import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getAllCars, getAllBrands, getAllTypes } from "@/lib/cars";
import { getEmirateSlugs } from "@/lib/emirates";

export const metadata: Metadata = {
  title: "Site Map",
  description: "Complete site map of VIP Luxury Car Rental Dubai. Browse all car rental options, locations, and services.",
  robots: { index: false, follow: true },
};

const BRAND_SLUG_MAP: Record<string, string> = {
  Lamborghini: "rent-lamborghini-in-dubai",
  Ferrari: "rent-ferrari-in-dubai",
  "Rolls Royce": "rent-rolls-royce-in-dubai",
  Bentley: "rent-bentley-in-dubai",
  Porsche: "rent-porsche-in-dubai",
  Mercedes: "rent-mercedes-in-dubai",
  BMW: "rent-bmw-in-dubai",
  Audi: "rent-audi-in-dubai",
  "Range Rover": "rent-range-rover-in-dubai",
  Nissan: "rent-nissan-in-dubai",
  Chevrolet: "rent-chevrolet-in-dubai",
  McLaren: "rent-mclaren-in-dubai",
  Cadillac: "rent-cadillac-in-dubai",
  GMC: "rent-gmc-in-dubai",
  Toyota: "rent-toyota-in-dubai",
  Volkswagen: "rent-volkswagen-in-dubai",
  "Mini Cooper": "rent-mini-cooper-in-dubai",
};

const TYPE_SLUG_MAP: Record<string, string> = {
  Sports: "sports-car-rental-in-dubai",
  Luxury: "luxury-car-rental-in-dubai",
  SUV: "suv-car-rental-in-dubai",
};

interface SectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

function Section({ title, icon, children }: SectionProps) {
  return (
    <div className="mb-10">
      <h2 className="text-xl md:text-2xl font-bold text-gold mb-4 flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {children}
      </div>
    </div>
  );
}

function SitemapLink({ href, label, sub }: { href: string; label: string; sub?: string }) {
  return (
    <Link
      href={href}
      className="block p-3 rounded-lg bg-white/5 hover:bg-gold/10 border border-white/10 hover:border-gold/30 transition-all duration-200 group"
    >
      <span className="text-white group-hover:text-gold transition-colors text-sm font-medium">
        {label}
      </span>
      {sub && (
        <span className="block text-xs text-gray-500 mt-0.5">{sub}</span>
      )}
    </Link>
  );
}

export default async function SitemapPage() {
  const cars = getAllCars();
  const allBrands = getAllBrands();
  const allTypes = getAllTypes().filter(Boolean) as string[];
  const emirates = getEmirateSlugs();

  // Group cars by brand for organized display
  const carsByBrand: Record<string, typeof cars> = {};
  for (const car of cars) {
    if (!carsByBrand[car.brand]) carsByBrand[car.brand] = [];
    carsByBrand[car.brand].push(car);
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative py-16 md:py-20 bg-gradient-to-b from-black via-black to-[#0A0A0A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-3">
            Site <span className="text-gold">Map</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Browse all pages on VIP Luxury Car Rental Dubai. Find your perfect luxury car, explore locations, and discover our services.
          </p>
        </div>
      </section>

      {/* Sitemap Content */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto px-4">

          {/* ── Core Pages ── */}
          <Section title="Core Pages" icon="🏠">
            <SitemapLink href="/" label="Home" sub="VIP Luxury Car Rental Dubai" />
            <SitemapLink href="/all-cars/" label="All Cars" sub="Browse our complete fleet" />
            <SitemapLink href="/brand/" label="Brands" sub="All car manufacturers" />
            <SitemapLink href="/about/" label="About Us" sub="Learn about our company" />
            <SitemapLink href="/contact/" label="Contact" sub="Get in touch with us" />
            <SitemapLink href="/faq/" label="FAQ" sub="Frequently asked questions" />
          </Section>

          {/* ── Car Category Pages ── */}
          <Section title="Car Categories" icon="🚘">
            {allTypes.map((type) => {
              const slug = TYPE_SLUG_MAP[type];
              return slug ? (
                <SitemapLink
                  key={type}
                  href={`/${slug}/`}
                  label={`${type} Car Rental in Dubai`}
                  sub={`Premium ${type.toLowerCase()} cars available`}
                />
              ) : null;
            })}
          </Section>

          {/* ── Brand Pages ── */}
          <Section title="Rent by Brand" icon="🏷️">
            {allBrands.map((brand) => {
              const slug = BRAND_SLUG_MAP[brand];
              return slug ? (
                <SitemapLink
                  key={brand}
                  href={`/${slug}/`}
                  label={`Rent ${brand} in Dubai`}
                  sub={`${carsByBrand[brand]?.length || 0} cars available`}
                />
              ) : null;
            })}
          </Section>

          {/* ── Location Pages ── */}
          <Section title="Service Locations" icon="📍">
            {emirates.map((emirate) => (
              <SitemapLink
                key={emirate}
                href={`/location/${emirate}/`}
                label={emirate === "abu-dhabi" ? "Abu Dhabi" : emirate === "sharjah" ? "Sharjah" : "Ras Al Khaimah"}
                sub="Luxury car rental services"
              />
            ))}
          </Section>

          {/* ── All Cars ── */}
          {Object.entries(carsByBrand).sort().map(([brand, brandCars]) => (
            <Section key={brand} title={`${brand} Cars`} icon="🚗">
              {brandCars.map((car) => (
                <SitemapLink
                  key={car.slug}
                  href={`/car/${car.slug}/`}
                  label={car.title}
                  sub={car.pricing?.per_day ? `From AED ${car.pricing.per_day}/day` : ""}
                />
              ))}
            </Section>
          ))}

        </div>
      </section>
    </main>
  );
}
