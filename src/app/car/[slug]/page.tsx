import { notFound } from 'next/navigation';
import { sampleCars } from '@/data/sampleCars';
import CarDetailClient from './CarDetailClient';

export default async function SingleCarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = sampleCars.find((c) => c.slug === slug);
  if (!car) return notFound();
  return <CarDetailClient car={car} />;
}
