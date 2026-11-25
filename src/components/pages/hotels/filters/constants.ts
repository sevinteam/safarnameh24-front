import type { FilterOptionItem, GuestRatingOption } from './types';

import {
  BedDouble,
  Building2,
  Home,
  Hotel,
  Landmark,
  TreePine,
} from 'lucide-react';

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

import type { LucideIcon } from 'lucide-react';
import {
  Accessibility,
  AirVent,
  ArrowUpDown,
  BellRing,
  Briefcase,
  CircleParking,
  Clock,
  Coffee,
  Dumbbell,
  Plane,
  Sparkles,
  Trees,
  Utensils,
  Vault,
  WashingMachine,
  Waves,
  Wifi,
} from 'lucide-react';

export type AmenityApiItem = {
  id: number; // Numeric DB ID for URL & filtering (?amenities=1,4)
  slug: string; // Stable key like 'free-wifi' for mapping lucide icons
  label: string; // Display title in Persian
  priority?: number;
};

// ------------------------------

// Ordered by popularity for Iranian hotel travelers (top 6 stay visible before Collapsible)
export const AMENITY_OPTIONS: readonly AmenityApiItem[] = [
  {
    id: 1,
    slug: 'free-breakfast',
    label: 'صبحانه رایگان',
    priority: 1,
  },
  {
    id: 2,
    slug: 'free-wifi',
    label: 'وای‌فای رایگان',
    priority: 2,
  },
  {
    id: 3,
    slug: 'parking',
    label: 'پارکینگ اختصاصی',
    priority: 3,
  },
  {
    id: 4,
    slug: 'pool',
    label: 'استخر و سونا',
    priority: 4,
  },
  {
    id: 5,
    slug: 'restaurant',
    label: 'رستوران و کافی‌شاپ',
    priority: 5,
  },
  {
    id: 6,
    slug: 'airport-transfer',
    label: 'ترانسفر فرودگاهی',
    priority: 6,
  },
  {
    id: 7,
    slug: 'gym',
    label: 'باشگاه بدنسازی',
    priority: 7,
  },
  {
    id: 8,
    slug: 'elevator',
    label: 'آسانسور',
    priority: 8,
  },
  {
    id: 9,
    slug: 'air-conditioning',
    label: 'تهویه مطبوع',
    priority: 9,
  },
  {
    id: 10,
    slug: 'laundry',
    label: 'لاندری و خشکشویی',
    priority: 10,
  },
  {
    id: 11,
    slug: 'room-service',
    label: 'روم‌سرویس ۲۴ ساعته',
    priority: 11,
  },
  {
    id: 12,
    slug: 'reception-24h',
    label: 'پذیرش ۲۴ ساعته',
    priority: 12,
  },
  {
    id: 13,
    slug: 'garden',
    label: 'فضای سبز و محوطه',
    priority: 13,
  },
  {
    id: 14,
    slug: 'safe-box',
    label: 'صندوق امانات',
    priority: 14,
  },
  {
    id: 15,
    slug: 'conference-hall',
    label: 'سالن کنفرانس',
    priority: 15,
  },
  {
    id: 16,
    slug: 'accessible',
    label: 'مناسب افراد کم‌توان',
    priority: 16,
  },
] as const;

// ------------------------------

// Maps backend amenity slugs to Lucide icons (safe even if DB IDs differ across environments)
export const AMENITY_ICONS: Record<string, LucideIcon> = {
  'free-breakfast': Coffee,
  'free-wifi': Wifi,
  parking: CircleParking,
  pool: Waves,
  restaurant: Utensils,
  'airport-transfer': Plane,
  gym: Dumbbell,
  elevator: ArrowUpDown,
  'air-conditioning': AirVent,
  laundry: WashingMachine,
  'room-service': BellRing,
  'reception-24h': Clock,
  garden: Trees,
  'safe-box': Vault,
  'conference-hall': Briefcase,
  accessible: Accessibility,
};

// Helper to safely resolve an icon with a clean fallback for future backend items
export function getAmenityIcon(slug: string): LucideIcon {
  return AMENITY_ICONS[slug] ?? Sparkles;
}

export const PROPERTY_TYPE_VALUES = [
  'hotel',
  'apartment-hotel',
  'boutique-hotel',
  'eco-lodge',
  'guesthouse',
  'villa',
] as const;

export type PropertyTypeSlug = (typeof PROPERTY_TYPE_VALUES)[number];

export type PropertyTypeOption = {
  value: PropertyTypeSlug;
  label: string;
  icon: LucideIcon;
  count?: number;
};

// ------------------------------

export const PROPERTY_TYPE_OPTIONS: readonly PropertyTypeOption[] = [
  { value: 'hotel', label: 'هتل', icon: Hotel },
  { value: 'apartment-hotel', label: 'هتل آپارتمان', icon: Building2 },
  { value: 'boutique-hotel', label: 'بوتیک هتل', icon: Landmark },
  { value: 'eco-lodge', label: 'اقامتگاه بوم‌گردی', icon: TreePine },
  { value: 'guesthouse', label: 'مهمانپذیر', icon: BedDouble },
  { value: 'villa', label: 'ویلا و سوئیت', icon: Home },
] as const;
