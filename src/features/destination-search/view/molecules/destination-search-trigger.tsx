import { MapPin } from 'lucide-react';

import { useDestination } from '../../model/destination-search-context';

type Props = {};

// ------------------------------

export default function DestinationSearchTrigger(props: Props) {
  const {} = props;

  const { destination } = useDestination();

  return (
    <div className="relative flex h-13 min-w-80 items-center gap-2 rounded-xl border px-4">
      {destination ? (
        <>
          <span className="bg-sidebar text-muted-foreground absolute -top-2.5 right-2.5 z-10 px-1.5 text-xs font-medium">
            شهر یا هتل مقصد (داخلی و خارجی)
          </span>

          <MapPin className="text-muted-foreground size-4.5" />

          <p className="text-sm font-semibold">
            {destination.type === 'city'
              ? destination.scope === 'domestic'
                ? `${destination.name} , ${destination.province}`
                : `${destination.name} , ${destination.country}`
              : `هتل ${destination.name} , ${destination.city}`}
          </p>
        </>
      ) : (
        <>
          <MapPin className="text-muted-foreground size-4.5" />

          <span className="text-muted-foreground text-sm font-medium">
            شهر یا هتل مقصد (داخلی و خارجی)
          </span>
        </>
      )}
    </div>
  );
}
