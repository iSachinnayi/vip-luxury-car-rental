// ═══════════════════════════════════════════════
//  Booking Page — Server Component
//  Fetches car data, passes to BookingFormClient
// ═══════════════════════════════════════════════

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCarBySlug, getAllCars } from "@/lib/cars";
import { generateCarMeta } from "@/lib/seo";
import { generateCarMetaAr } from "@/lib/seo-ar";
import BookingFormClient from "./BookingFormClient";

export async function generateStaticParams() {
  return getAllCars().map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const car = getCarBySlug(slug);
  if (!car) return { title: "Car Not Found" };
  const isAr = locale === "ar";
  const meta = isAr ? generateCarMetaAr(car) : generateCarMeta(car);
  const bookTitle = isAr ? `حجز ${car.title}` : `Book ${car.title}`;
  const bookDesc = isAr
    ? `احجز ${car.title} أونلاين. تأكيد فوري، توصيل مجاني في جميع أنحاء دبي. ادفع بالبطاقة أو العملات الرقمية.`
    : `Book ${car.title} online. Instant confirmation, free delivery across Dubai. Pay with crypto or card.`;
  return {
    title: bookTitle,
    description: bookDesc,
    alternates: { canonical: isAr ? `/ar/booking/${slug}/` : `/booking/${slug}/` },
    openGraph: {
      title: bookTitle,
      description: meta.description,
      images: car.thumbnail ? [{ url: car.thumbnail }] : [],
    },
  };
}

export default async function BookingPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ pickup?: string; drop?: string; from?: string; to?: string }>;
}) {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) return notFound();

  const sp = searchParams ? await searchParams : {};
  const initialPickup = sp.pickup || "Dubai";
  const initialDrop = sp.drop || "Dubai";
  const initialFrom = sp.from || "";
  const initialTo = sp.to || "";

  return (
    <BookingFormClient
      car={car}
      initialPickup={initialPickup}
      initialDrop={initialDrop}
      initialFrom={initialFrom}
      initialTo={initialTo}
    />
  );
}
