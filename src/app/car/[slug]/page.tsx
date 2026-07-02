// ═══════════════════════════════════════════════
//  Single Car Page — Server Component
//  Uses real data from lib/cars
// ═══════════════════════════════════════════════

import { notFound } from "next/navigation";
import { getCarBySlug } from "@/lib/cars";
import CarDetailClient from "./CarDetailClient";

export default async function SingleCarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) return notFound();
  return <CarDetailClient car={car} />;
}
