'use client';

import { useState } from 'react';

import SheetWrapper from './sheet-wrapper';
import { usePathname } from 'next/navigation';
import SearchBarTrigger from './search-bar-trigger';

import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { DatePicker } from '@/components/common/date-picker';
import { cn } from '@/lib/utils';
import { DestinationSearch } from '@/components/common/destination-search';
import SubmitButton from '@/components/pages/home/hero-section/submit-button';
import { useSmartScrollHeader } from '@/lib/hooks/use-smart-scroll-header';
import SortWrapper from '@/components/pages/hotels/sorting/sort-wrapper';
import { Button } from '@/components/ui/button';
import { Map, SlidersHorizontal } from 'lucide-react';

// ------------------------------

export default function StickySearchBar() {
  const [isOpen, setOpen] = useState(false);
  const handleOpenModal = () => setOpen(true);

  const isDesktop = useMediaQuery('(min-width: 640px)');
  const { isCollapsed } = useSmartScrollHeader({
    scrollDownThreshold: 35,
    scrollUpThreshold: 15,
    topThreshold: 500,
  });

  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <div
      className={cn(
        'bg-sidebar sticky inset-x-0 top-0 z-50 border-b shadow-2xl/5',
        '-mx-4 -mt-8 xl:mx-0',
        'transition-transform duration-300 ease-in-out will-change-transform',
        'lg:rounded-b-3xl lg:border lg:border-t-0',
        !isDesktop && isCollapsed ? '-translate-y-20' : 'translate-y-0',
      )}
    >
      <div className="lg:hidden">
        <SearchBarTrigger openModal={handleOpenModal} />
        <SheetWrapper open={isOpen} onOpenChange={setOpen} />

        <div className="flex-between border-t border-dashed px-4 py-2 lg:hidden">
          <Button variant="link" className={'lg:hidden'}>
            <SlidersHorizontal />
            <span>فیلترها</span>
          </Button>

          <SortWrapper />

          <Button variant="link" className={'lg:hidden'}>
            <Map />
            <span>نقشه</span>
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'hidden items-center gap-5 lg:grid lg:grid-cols-[0.8fr_1fr_auto]',
          'p-8 pt-10',
        )}
      >
        <DestinationSearch />
        <DatePicker />
        {/* <SortWrapper /> */}

        <SubmitButton className="col-span-2 lg:col-span-1" />
      </div>
    </div>
  );
}
