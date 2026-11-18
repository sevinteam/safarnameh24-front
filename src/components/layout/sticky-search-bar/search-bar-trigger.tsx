import { CalendarRange, Hotel, Moon, Search } from 'lucide-react';

import { useDatePicker } from '@/components/common/date-picker';
import { useDestination } from '@/components/common/destination-search';
import { Button } from '@/components/ui/button';

type Props = {
  openModal: () => void;
};

// ------------------------------

export default function SearchBarTrigger(props: Props) {
  const { openModal } = props;

  const { destination } = useDestination();
  const { selectedDates, draftNights } = useDatePicker();

  const datesIsSelected = selectedDates?.length === 2;

  return (
    <div className="flex h-20 w-full items-center gap-4 px-4 sm:gap-8 md:mx-auto md:w-fit">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          {/* <Hotel className="text-muted-foreground size-4 sm:size-6" /> */}

          {destination ? (
            <span className="font-semibold">* هتل‌ های {destination.name}</span>
          ) : (
            <span className="font-medium">بدون مقصد</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <CalendarRange className="text-muted-foreground size-4" />

          {datesIsSelected ? (
            <span className="font-semibold">
              {`${selectedDates[0].format('DD MMMM')} تا ${selectedDates[1].format('DD MMMM')}`}
            </span>
          ) : (
            <span className="font-medium">بدون تاریخ اقامت</span>
          )}

          {draftNights > 0 && (
            <span className="text-muted-foreground flex text-xs font-bold whitespace-nowrap">
              ( {draftNights} شب)
            </span>
          )}
        </div>
      </div>

      <Button onClick={openModal} className={'mr-auto'} size={'icon-lg'}>
        <Search />
      </Button>
    </div>
  );
}
