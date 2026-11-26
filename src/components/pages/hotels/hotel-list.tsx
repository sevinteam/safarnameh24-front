'use client';

import { MOCK_HOTELS } from '@/config/data/general';
import { HotelCard as HotelCardB } from '@/components/common/hotel-card/organisms/hotel-card.b';
import { HotelCard as HotelCardA } from '@/components/common/hotel-card/organisms/hotel-card.main';
import { HotelCard as HotelCardC } from '@/components/common/hotel-card/organisms/hotel-card.secondary';
import { useViewModeQuery } from './view-mode/use-view-mode-query';
import { cn } from 'cn';
import { useMediaQuery } from '@/hooks/use-media-query';
import HotelCardTypeA from '@/components/common/hotel-card/organisms/hotel-card.type-a';

// ------------------------------

export function HotelList() {
  const hotels = MOCK_HOTELS;
  const isDesktop = useMediaQuery('(min-width: 1280px)');

  const { viewMode, isGrid } = useViewModeQuery();

  if (hotels.length === 0) {
    return (
      <div className="text-muted-foreground rounded-xl border border-dashed p-10 text-center text-sm">
        هتلی با این مشخصات پیدا نشد.
      </div>
    );
  }

  // Render horizontal list card (C) only on desktop list mode; everywhere else render card A
  const shouldRenderListCard = isDesktop && !isGrid;

  return (
    <section
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-2',
        // Pure CSS handles column counts cleanly across all breakpoints
        isGrid ? 'xl:grid-cols-3' : 'gap-8 xl:grid-cols-1',
      )}
    >
      {hotels.map((item, i) =>
        shouldRenderListCard ? (
          <HotelCardC key={`${item.id}-${i}`} {...item} />
        ) : (
          <HotelCardTypeA key={`${item.id}-${i}`} info={item} showTags />
        ),
      )}
    </section>
  );
}
