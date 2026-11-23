'use client';

import {
  Sheet,
  SheetClose,
  SheetTitle,
  SheetFooter,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import { FiltersContent } from './filters-content';
import { ArrowRight, SlidersHorizontal, Trash } from 'lucide-react';
import { useHotelFiltersQuery } from '../../use-hotel-filters-query';

// ------------------------------

export function FiltersSheet() {
  const { resetAllFilters, hasActiveFilters, activeFiltersCount } =
    useHotelFiltersQuery();

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="link">
            <SlidersHorizontal />
            <span>فیلترها</span>
          </Button>
        }
      />

      <SheetContent className={'w-full! gap-0'} showCloseButton={false}>
        <SheetHeader className="h-18 flex-row items-center gap-2.5 border-b px-4">
          <SheetClose>
            <ArrowRight className="size-5" />
          </SheetClose>

          <SheetTitle>فیلترهای جستجو</SheetTitle>
          <SheetDescription className="hidden" />

          {hasActiveFilters && (
            <Button
              size={'sm'}
              type="button"
              className={'mr-auto h-9 gap-2 rounded-lg px-3'}
              variant={'destructive'}
              onClick={resetAllFilters}
            >
              {/* <Trash className="size-4" /> */}
              <span>حذف فیلترها</span>
              <span>({activeFiltersCount})</span>
            </Button>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <FiltersContent />
        </div>

        <SheetFooter className="border-t">
          <Button>مشاهده 125 نتیجه</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
