'use client';

import { TooltipProvider } from '@/components/ui/tooltip';

import { cn } from '@/lib/utils';
import { useViewModeQuery } from './use-view-mode-query';
import { ViewModeButton } from './view-mode-button';
import { ViewMode } from './types';
import { VIEW_OPTIONS } from './constants';

type Props = {
  onViewChange?: (view: ViewMode) => void;
  showLabel?: boolean;
  className?: string;
};

// ------------------------------

export const ViewSwitcher = ({
  onViewChange,
  showLabel = true,
  className,
}: Props) => {
  const { viewMode, setViewMode } = useViewModeQuery({ onViewChange });

  return (
    <div className={cn('hidden items-center gap-3 md:flex', className)}>
      {showLabel && <span className="text-sm font-medium">نوع نمایش :</span>}

      <div
        role="group"
        aria-label="تغییر نوع نمایش لیست هتل‌ها"
        className="bg-secondary flex items-center gap-0.5 rounded-lg border p-0.5"
      >
        {VIEW_OPTIONS.map((option) => (
          <ViewModeButton
            key={option.value}
            option={option}
            isActive={viewMode === option.value}
            onSelect={setViewMode}
          />
        ))}
      </div>
    </div>
  );
};
