import { cn } from 'cn';
import { Sparkles } from 'lucide-react';

import { DestinationItemRow } from '../molecules/destination-item-row';
import { useDestination } from '../../model/destination-search-context';
import { DestinationEmptyState } from '../molecules/destination-empty-state';

// ------------------------------

export function DestinationList() {
  const {
    search: { displayItems, isSearching },
  } = useDestination();

  if (displayItems.length === 0) {
    return <DestinationEmptyState />;
  }

  return (
    <div className={cn('flex min-h-0 flex-col space-y-3')}>
      <div className="text-muted-foreground flex h-4 shrink-0 items-center justify-between px-4 text-xs font-medium sm:px-6">
        {!isSearching ? (
          <div className="text-foreground flex items-center gap-2">
            <Sparkles className="size-3.5 text-amber-500" />
            <span>مقصدهای پیشنهادی و پرطرفدار</span>
          </div>
        ) : (
          <>
            <span>نتایج جستجو</span>

            <div className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 font-semibold tracking-wide">
              {displayItems?.length} مورد
            </div>
          </>
        )}
      </div>

      <div className="scrollbar-custom scroll-fade-t overflow-y-auto pb-4 sm:h-96">
        {displayItems.map((item) => (
          <DestinationItemRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
