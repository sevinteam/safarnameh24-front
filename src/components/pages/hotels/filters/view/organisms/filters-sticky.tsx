'use client';

import { cn } from '@/utils';
import StickyBox from 'react-sticky-box';

import { Button } from '@/components/ui/button';
import { MapView } from '../molecules/map-view';
import { SlidersHorizontal } from 'lucide-react';
import { FiltersContent } from './filters-content';

import { useHotelFiltersQuery } from '../../use-hotel-filters-query';

type Props = {
  className?: string;
};

// ------------------------------

export function FiltersSticky({ className }: Props) {
  const { resetAllFilters, hasActiveFilters, activeFiltersCount } =
    useHotelFiltersQuery();

  return (
    <StickyBox offsetTop={20} offsetBottom={20} bottom>
      <aside
        aria-label="فیلترهای جستجوی هتل"
        className={cn('hidden space-y-5 lg:block', className)}
      >
        <MapView />

        <div className="bg-card rounded-2xl border">
          {/* Header + Clear All */}
          <div className="flex items-center justify-between gap-2 border-b p-5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="text-muted-foreground size-4.5" />
              <span className="font-semibold">فیلترها</span>
            </div>

            {hasActiveFilters && (
              <Button
                size={'sm'}
                type="button"
                variant={'destructive'}
                onClick={resetAllFilters}
                className={'h-9 gap-2 rounded-lg px-3'}
              >
                <span>حذف فیلترها</span>
                <span>({activeFiltersCount})</span>
              </Button>
            )}
          </div>

          <FiltersContent />
        </div>
      </aside>
    </StickyBox>
  );
}
