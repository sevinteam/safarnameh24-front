import { SORT_VALUES } from './constants';
import type { LucideIcon } from 'lucide-react';

// ------------------------------

type SortOption = {
  value: SortValue;
  label: string;
  description?: string;
  icon?: LucideIcon;
  isPrimary: boolean;
};

type SortValue = (typeof SORT_VALUES)[number];

// ------------------------------

export type { SortOption, SortValue };
