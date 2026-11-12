export type HotelCard = {
  id: string;
  image: string;
  name: string;
  hotel_slug: string;
  city: string;
  city_slug: string;
  country: string;
  country_slug: string;
  address: string;
  rating: number;
  reviewCount: number;
  stars: number;
  price: number; // قیمت نهایی پرداختی
  originalPrice?: number; // قیمت قبل تخفیف (خط‌خورده)
  discountPercentage?: number; // درصد تخفیف برای نمایش در بج
};
