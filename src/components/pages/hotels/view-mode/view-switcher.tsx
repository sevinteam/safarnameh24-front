'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from '@/lib/utils';
import { ViewMode } from './types';
import { VIEW_OPTIONS } from './constants';

import { Button } from '@/components/ui/button';
import { useEffect, useId, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import { useViewModeQuery } from './use-view-mode-query';

type Props = {
  className?: string;
  showLabel?: boolean;
  onViewChange?: (view: ViewMode) => void;
};

// ------------------------------

export const ViewSwitcher = ({
  onViewChange,
  showLabel = true,
  className,
}: Props) => {
  const { viewMode, setViewMode } = useViewModeQuery({ onViewChange });

  const layoutGroupId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="bg-sidebar h-10 w-30 animate-pulse rounded-full" />;
  }

  return (
    <div className={cn('hidden items-center gap-3 md:flex', className)}>
      {showLabel && <span className="text-sm font-medium">نوع نمایش :</span>}

      <LayoutGroup id={layoutGroupId}>
        <div
          className={cn('bg-secondary flex rounded-lg border p-0.5', className)}
        >
          {VIEW_OPTIONS.map((item) => {
            const Icon = item.icon;
            const isActive = item.value === viewMode;

            return (
              <Tooltip key={item.value}>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      size={'icon-sm'}
                      variant={'link'}
                      aria-label={item.label}
                      aria-pressed={isActive}
                      className={'relative z-10'}
                      onClick={() => setViewMode(item.value)}
                    >
                      <Icon
                        className={cn(
                          'size-4 shrink-0 transition-colors duration-300',
                          isActive && 'text-white dark:text-black',
                        )}
                      />
                      <span className="sr-only">{item.label}</span>

                      {isActive && (
                        <motion.div
                          layoutId="active-theme-pill"
                          className="bg-primary absolute inset-0 -z-10 rounded-md"
                        />
                      )}
                    </Button>
                  }
                />

                <TooltipContent side="bottom">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
};
