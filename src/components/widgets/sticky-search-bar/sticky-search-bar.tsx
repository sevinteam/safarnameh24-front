import { useState } from 'react';

import SheetWrapper from './sheet-wrapper';
import { usePathname } from 'next/navigation';
import SearchBarTrigger from './search-bar-trigger';

import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { DatePicker } from '@/components/common/date-picker';

import { DestinationSearch } from '@/components/common/destination-search';
import SubmitButton from '@/components/pages/home/hero-section/submit-button';

// ------------------------------

export default function StickySearchBar() {
  const [isOpen, setOpen] = useState(false);
  const handleOpenModal = () => setOpen(true);

  const pathname = usePathname();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  if (pathname === '/') return null;

  return (
    <>
      {isDesktop ? (
        <div className="grid grid-cols-[1fr_1.4fr] items-center gap-x-4 gap-y-5 pt-8 pb-6 lg:grid-cols-[1fr_1fr_auto] lg:gap-6">
          <DestinationSearch />
          <DatePicker />
          <SubmitButton className="col-span-2 lg:col-span-1" />
        </div>
      ) : (
        <>
          <SearchBarTrigger openModal={handleOpenModal} />
          <SheetWrapper open={isOpen} onOpenChange={setOpen} />
        </>
      )}
    </>
  );
}
