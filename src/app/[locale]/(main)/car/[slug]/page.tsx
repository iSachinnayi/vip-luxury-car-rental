// ═══════════════════════════════════════════════
//  Single Car Page — Server Component
//  Uses real data from lib/cars
// ═══════════════════════════════════════════════

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCarBySlug, getAllCars } from "@/lib/cars";
import { generateCarMeta } from "@/lib/seo";
import { generateCarMetaAr } from "@/lib/seo-ar";
import { carSchema, breadcrumbSchema } from "@/lib/schema";
import CarDetailClient from "./CarDetailClient";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return getAllCars().map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const car = getCarBySlug(slug);
  if (!car) return { title: "Car Not Found" };
  const isAr = locale === "ar";
  const meta = isAr ? generateCarMetaAr(car) : generateCarMeta(car);
  const images = car.thumbnail ? [{ url: car.thumbnail, width: 1200, height: 630, alt: car.title }] : [];
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: isAr ? `/ar/car/${slug}/` : `/car/${slug}/` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      images,
      url: `/car/${slug}/`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: car.thumbnail ? [car.thumbnail] : [],
    },
  };
}

export default async function SingleCarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) return notFound();

  // Get related cars (same brand or type, exclude current)
  const allCars = getAllCars();
  const relatedCars = allCars
    .filter((c) => c.slug !== slug && (c.brand === car.brand || c.car_type === car.car_type))
    .slice(0, 4);

  // Breadcrumb schema
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "All Cars", url: "/all-cars" },
    { name: car.brand, url: `/rent-${car.brand.toLowerCase().replace(/\s+/g, "-")}-in-dubai` },
    { name: car.title, url: `/car/${slug}` },
  ]);

  // Product schema
  const product = carSchema({
    title: car.title,
    brand: car.brand,
    slug: car.slug,
    pricing: car.pricing,
    specs: car.specs,
    excerpt: car.excerpt,
    images: car.images,
  });

  return (
    <>
      <script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        id="schema-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }}
      />
      <CarDetailClient car={car} relatedCars={relatedCars} />
    </>
  );
}
