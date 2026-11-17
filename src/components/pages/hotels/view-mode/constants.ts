import { ViewMode, ViewModeOption } from './types';
import { LayoutGrid, LayoutList } from 'lucide-react';

// ------------------------------

const VIEW_MODE_QUERY_KEY = 'view';
const DEFAULT_VIEW_MODE: ViewMode = 'list';
const VIEW_MODE_VALUES = ['list', 'grid'] as const;

const VIEW_OPTIONS: readonly ViewModeOption[] = [
  {
    value: 'list',
    label: 'نمایش لیستی',
    icon: LayoutList,
  },
  {
    value: 'grid',
    label: 'نمایش شبکه‌ای',
    icon: LayoutGrid,
  },
] as const;

// ------------------------------

export {
  DEFAULT_VIEW_MODE,
  VIEW_OPTIONS,
  VIEW_MODE_QUERY_KEY,
  VIEW_MODE_VALUES,
};
