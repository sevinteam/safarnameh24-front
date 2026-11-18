import {
  Star,
  Crown,
  Sparkles,
  BadgePercent,
  ArrowUpWideNarrow,
  ArrowDownNarrowWide,
} from 'lucide-react';

import { SortOption, SortValue } from './types';

// ------------------------------

const SORT_QUERY_KEY = 'sort';
const DEFAULT_SORT: SortValue = 'recommended';

const SORT_VALUES = [
  'recommended',
  'lowest-price',
  'highest-rating',
  'highest-price',
  'highest-discount',
  'stars-desc',
] as const;

const SORT_OPTIONS: readonly SortOption[] = [
  {
    value: 'recommended',
    label: 'پیشنهادی',
    description: 'ترکیبی از محبوبیت، امتیاز مسافران و ارزش خرید',
    icon: Sparkles,
    isPrimary: true,
  },
  {
    value: 'lowest-price',
    label: 'کمترین قیمت',
    description: 'مرتب‌سازی از ارزان‌ترین به گران‌ترین',
    icon: ArrowDownNarrowWide,
    isPrimary: true,
  },
  {
    value: 'highest-rating',
    label: 'بالاترین امتیاز',
    description: 'بر اساس میانگین امتیاز نظرات ثبت‌شده مسافران',
    icon: Crown,
    isPrimary: true,
  },
  {
    value: 'highest-price',
    label: 'بیشترین قیمت',
    description: 'مرتب‌سازی از گران‌ترین به ارزان‌ترین',
    icon: ArrowUpWideNarrow,
    isPrimary: false,
  },
  {
    value: 'highest-discount',
    label: 'بیشترین تخفیف',
    description: 'هتل‌هایی با بالاترین درصد تخفیف',
    icon: BadgePercent,
    isPrimary: false,
  },
  {
    value: 'stars-desc',
    label: 'بیشترین ستاره',
    description: 'از هتل‌های ۵ ستاره به ۱ ستاره',
    icon: Star,
    isPrimary: false,
  },
] as const;

// ------------------------------

export { SORT_QUERY_KEY, SORT_VALUES, DEFAULT_SORT, SORT_OPTIONS };
