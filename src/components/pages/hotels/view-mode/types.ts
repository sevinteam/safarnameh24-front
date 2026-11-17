import type { LucideIcon } from 'lucide-react';
import { VIEW_MODE_VALUES } from './constants';

// ------------------------------

type ViewMode = (typeof VIEW_MODE_VALUES)[number];

type ViewModeOption = {
  value: ViewMode;
  label: string;
  icon: LucideIcon;
};

// ------------------------------

export type { ViewMode, ViewModeOption };
