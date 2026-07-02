// ═══════════════════════════════════════════════
//  Brand/Category Page — Uses real data
// ═══════════════════════════════════════════════

import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCars } from "@/lib/cars";
import CarCard from "@/components/CarCard";

const BRAND_SLUGS = [
  "rent-lamborghini-in-dubai", "rent-ferrari-in-dubai", "rent-rolls-royce-in-dubai",
  "rent-bentley-in-dubai", "rent-porsche-in-dubai", "rent-mercedes-in-dubai",
  "rent-bmw-in-dubai", "rent-audi-in-dubai", "rent-range-rover-in-dubai",
  "rent-nissan-in-dubai", "rent-chevrolet-in-dubai", "rent-mclaren-in-dubai",
  "rent-cadillac-in-dubai", "rent-gmc-in-dubai", "rent-toyota-in-dubai",
  "rent-volkswagen-in-dubai", "rent-mini-cooper-in-dubai", "rent-ford-in-dubai",
];

const CATEGORY_MAP: Record<string, string> = {
  "sports-car-rental-in-dubai": "Sports",
  "luxury-car-rental-in-dubai": "Luxury",
  "suv-car-rental-in-dubai": "SUV",
};

function getBrandName(slug: string): string {
  return slug.replace("rent-", "").replace("-in-dubai", "").split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function generateStaticParams() {
  return [...BRAND_SLUGS, ...Object.keys(CATEGORY_MAP)].map((slug) => ({ slug }));
}

export default async function BrandCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const isBrand = BRAND_SLUGS.includes(slug);
  const isCategory = slug in CATEGORY_MAP;
  if (!isBrand && !isCategory) return notFound();

  const pageTitle = isBrand ? `Rent ${getBrandName(slug)} in Dubai` : `${CATEGORY_MAP[slug]} Car Rental in Dubai`;

  const allCars = getAllCars();
  const filteredCars = isBrand
    ? allCars.filter((c) => c.brand.toLowerCase() === getBrandName(slug).toLowerCase())
    : allCars.filter((c) => c.car_type.toLowerCase() === CATEGORY_MAP[slug].toLowerCase());

  return (
    <main className="min-h-screen bg-dark pt-8 md:pt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gold transition-colors">← Home</Link>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mt-2">{pageTitle}</h1>
          <p className="text-gray-400 mt-2">{filteredCars.length} cars available</p>
        </div>
        {filteredCars.length === 0 ? (
          <div className="text-center py-20"><div className="text-4xl mb-4">🚗</div><h3 className="text-xl font-bold text-white mb-2">No cars available</h3></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-16">
            {filteredCars.map((car, i) => <CarCard key={car.id} car={car} index={i} />)}
          </div>
        )}
      </div>
    </main>
  );
}
