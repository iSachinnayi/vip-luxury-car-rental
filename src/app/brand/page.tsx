// ═══════════════════════════════════════════════
//  Brand Listing — Uses real data
// ═══════════════════════════════════════════════

import Link from "next/link";
import { getAllBrands, getAllCars } from "@/lib/cars";

export default function BrandPage() {
  const brands = getAllBrands();
  const allCars = getAllCars();

  return (
    <main className="min-h-screen bg-dark pt-8 md:pt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gold transition-colors">← Home</Link>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mt-2">Rent A Car From Top Brands</h1>
          <p className="text-gray-400 mt-2">Choose from {brands.length} premium car brands</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((brand) => {
            const count = allCars.filter((c) => c.brand.toLowerCase() === brand.toLowerCase()).length;
            const slug = `rent-${brand.toLowerCase().replace(/\s+/g, "-")}-in-dubai`;
            return (
              <Link key={brand} href={`/${slug}`}
                className="group p-6 md:p-8 rounded-2xl glass-card hover:border-gold/30 hover:bg-white/[0.05] transition-all text-center">
                <div className="font-serif text-lg md:text-2xl font-bold text-white group-hover:text-gold transition-colors">{brand}</div>
                <p className="text-sm text-gray-500 mt-1">{count} cars</p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
