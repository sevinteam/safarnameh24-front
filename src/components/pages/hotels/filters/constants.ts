import type { FilterOptionItem, GuestRatingOption } from './types';

export const PRICE_RANGE_BOUNDS = {
  min: 500_000,
  max: 80_000_000,
  step: 500_000,
} as const;

export const STAR_OPTIONS: readonly FilterOptionItem<number>[] = [
  { value: 5, label: '۵ ستاره', count: 22 },
  { value: 4, label: '۴ ستاره', count: 17 },
  { value: 3, label: '۳ ستاره', count: 2 },
  { value: 2, label: '۲ ستاره', count: 57 },
  { value: 1, label: '۱ ستاره', count: 23 },
] as const;

// Base-10 rating thresholds matching hotel card scores (e.g. 8.8 / 10)
export const GUEST_RATING_OPTIONS: readonly GuestRatingOption[] = [
  { value: 9, label: '۹ به بالا', badge: 'فوق‌العاده' },
  { value: 8, label: '۸ به بالا', badge: 'عالی' },
  { value: 7, label: '۷ به بالا', badge: 'خیلی خوب' },
  { value: 6, label: '۶ به بالا', badge: 'خوب' },
] as const;

export const PROPERTY_TYPE_OPTIONS: readonly FilterOptionItem[] = [
  { value: 'hotel', label: 'هتل' },
  { value: 'apartment-hotel', label: 'هتل آپارتمان' },
  { value: 'boutique-hotel', label: 'بوتیک هتل' },
  { value: 'eco-lodge', label: 'اقامتگاه بوم‌گردی' },
  { value: 'guesthouse', label: 'مهمانپذیر' },
  { value: 'villa', label: 'ویلا و سوئیت' },
] as const;

export const AMENITY_OPTIONS: readonly FilterOptionItem[] = [
  { value: 'free-breakfast', label: 'صبحانه رایگان' },
  { value: 'free-wifi', label: 'وای‌فای رایگان' },
  { value: 'parking', label: 'پارکینگ اختصاصی' },
  { value: 'pool', label: 'استخر و سونا' },
  { value: 'restaurant', label: 'رستوران و کافی‌شاپ' },
  { value: 'gym', label: 'باشگاه بدنسازی' },
  { value: 'airport-transfer', label: 'ترانسفر فرودگاهی' },
  { value: 'elevator', label: 'آسانسور' },
  { value: 'laundry', label: 'لاندری و خشکشویی' },
  { value: 'room-service', label: 'روم‌سرویس ۲۴ ساعته' },
  { value: 'conference-hall', label: 'سالن کنفرانس' },
  { value: 'disabled-access', label: 'مناسب افراد کم‌توان' },
] as const;
