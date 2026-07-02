// ═══════════════════════════════════════════════
//  Brand/Category Page — Dynamic Route
//  Handles: /rent-lamborghini-in-dubai, /sports-car-rental-in-dubai, etc.
// ═══════════════════════════════════════════════

import { notFound } from "next/navigation";
import Link from "next/link";
import { sampleCars } from "@/data/sampleCars";
import CarCard from "@/components/CarCard";

// Brand pages from existing site
const BRAND_SLUGS = [
  "rent-lamborghini-in-dubai", "rent-ferrari-in-dubai", "rent-rolls-royce-in-dubai",
  "rent-bentley-in-dubai", "rent-porsche-in-dubai", "rent-mercedes-in-dubai",
  "rent-bmw-in-dubai", "rent-audi-in-dubai", "rent-range-rover-in-dubai",
  "rent-nissan-in-dubai", "rent-chevrolet-in-dubai", "rent-mclaren-in-dubai",
  "rent-cadillac-in-dubai", "rent-gmc-in-dubai", "rent-toyota-in-dubai",
  "rent-volkswagen-in-dubai", "rent-mini-cooper-in-dubai", "rent-ford-in-dubai",
];

const CATEGORY_SLUGS = [
  { slug: "sports-car-rental-in-dubai", name: "Sports Car" },
  { slug: "luxury-car-rental-in-dubai", name: "Luxury Car" },
  { slug: "suv-car-rental-in-dubai", name: "SUV Car" },
];

function getBrandName(slug: string): string {
  return slug
    .replace("rent-", "")
    .replace("-in-dubai", "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getCategoryName(slug: string): string | null {
  const cat = CATEGORY_SLUGS.find((c) => c.slug === slug);
  return cat ? cat.name : null;
}

export function generateStaticParams() {
  return [...BRAND_SLUGS, ...CATEGORY_SLUGS.map((c) => c.slug)].map((slug) => ({ slug }));
}

export default async function BrandCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const isBrand = BRAND_SLUGS.includes(slug);
  const isCategory = CATEGORY_SLUGS.some((c) => c.slug === slug);

  if (!isBrand && !isCategory) return notFound();

  const brandName = isBrand ? getBrandName(slug) : "";
  const categoryName = isCategory ? getCategoryName(slug)! : "";
  const pageTitle = isBrand ? `Rent ${brandName} in Dubai` : `${categoryName} Rental in Dubai`;

  // Filter cars
  let filteredCars = sampleCars;
  if (isBrand) {
    filteredCars = sampleCars.filter(
      (c) => c.brand.toLowerCase() === brandName.toLowerCase()
    );
  }
  if (isCategory) {
    filteredCars = sampleCars.filter(
      (c) => c.car_type.toLowerCase() === categoryName.toLowerCase().replace(" car", "")
    );
  }

  return (
    <main className="min-h-screen bg-dark pt-8 md:pt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gold transition-colors">
            ← Home
          </Link>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mt-2">
            {pageTitle}
          </h1>
          <p className="text-gray-400 mt-2">
            {filteredCars.length} cars available
          </p>
        </div>

        {/* Car Grid */}
        {filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-xl font-bold text-white mb-2">No cars available</h3>
            <p className="text-gray-400">Check other categories</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-16">
            {filteredCars.map((car, i) => (
              <CarCard key={car.id} car={car} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
