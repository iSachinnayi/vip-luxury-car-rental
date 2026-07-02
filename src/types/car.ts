// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  Shared Types for VIP Luxury Car Rental
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export interface CarData {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  description_short: string;
  description_full: string;
  pricing: {
    per_day: string;
    per_hour: string;
    per_week: string;
    per_month: string;
    original_per_day?: string;
    original_per_week?: string;
    original_per_month?: string;
    discount_day?: string;
    discount_week?: string;
    discount_month?: string;
  };
  specs: {
    model_year: string;
  };
  km_limits: {
    per_day: string;
    per_week: string;
    per_month: string;
    extra_km: string;
    original_per_day?: string;
    original_per_week?: string;
    original_per_month?: string;
  };
  deposit: {
    no_deposit_fee: string;
    security: string;
  };
  brand: string;
  car_type: string;
  categories: string[] | { name: string; slug?: string }[];
  images: string[];
  thumbnail: string;
  old_url: string;
}

export interface CarCardData {
  id: number;
  title: string;
  slug: string;
  pricing: {
    per_day: string;
    per_week: string;
    per_month: string;
    per_hour?: string;
    original_per_day?: string;
    original_per_week?: string;
    original_per_month?: string;
    discount_day?: string;
    discount_week?: string;
    discount_month?: string;
  };
  specs: { model_year: string };
  km_limits: {
    per_day: string;
    per_week: string;
    per_month: string;
    extra_km: string;
    original_per_day?: string;
    original_per_week?: string;
    original_per_month?: string;
  };
  deposit: { no_deposit_fee: string; security: string };
  brand: string;
  car_type: string;
  categories: string[] | { name: string; slug?: string }[];
  images: string[];
  thumbnail: string;
}

