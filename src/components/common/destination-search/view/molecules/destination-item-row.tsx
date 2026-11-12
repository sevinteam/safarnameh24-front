import React from 'react';
import { MapPin, Building2, Star, Check } from 'lucide-react';
import { Destination } from '../../model/types';
import { useDestination } from '../../model/destination-search-context';

interface DestinationItemRowProps {
  item: Destination;
}

// ------------------------------

export const DestinationItemRow: React.FC<DestinationItemRowProps> = ({
  item,
}) => {
  const { destination, setDestination, closeModal } = useDestination();

  const isCity = item.type === 'city';
  const isSelected = destination?.slug === item.slug;

  function onSelect(item: Destination) {
    setDestination(item);
    closeModal();
  }

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group flex h-16 cursor-pointer items-center justify-between px-4 transition-colors sm:px-6 ${
        isSelected
          ? 'bg-accent text-accent-foreground font-medium'
          : 'hover:bg-muted text-foreground'
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex-center text-muted-foreground shrink-0 rounded-lg transition-colors ${
            isSelected ? '' : 'text-muted-foreground'
          }`}
        >
          {isCity ? (
            <MapPin className="size-5.5" />
          ) : (
            <Building2 className="size-5.5" />
          )}
        </div>

        <div className="min-w-0">
          <span className="truncate text-sm leading-tight font-semibold">
            {`${isCity ? '' : 'هتل'} ${item.name}`}
          </span>

          <div className="text-muted-foreground mt-1.5 truncate text-xs font-medium">
            {isCity
              ? item.scope === 'domestic'
                ? `استان ${item?.province}, ${item.country}`
                : `${item.country}`
              : `${item.city}، ${item.country}`}
          </div>
        </div>
      </div>

      <div className="mr-2 flex shrink-0 items-center gap-2">
        {isCity && item.accommodations_count && (
          <span className="text-muted-foreground bg-muted rounded-md px-2.5 py-1 text-xs font-medium group-hover:bg-transparent">
            {item.accommodations_count} اقامتگاه
          </span>
        )}

        {!isCity && item.stars && (
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <Star key={i} className="size-3 fill-current text-amber-500" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
