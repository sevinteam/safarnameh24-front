import { CalendarRange, Hotel, Search } from 'lucide-react';

import { useDatePicker } from '@/components/common/date-picker';
import { useDestination } from '@/components/common/destination-search';

type Props = {
  openModal: () => void;
};

// ------------------------------

export default function SearchBarTrigger(props: Props) {
  const { openModal } = props;

  const { destination } = useDestination();
  const { selectedDates } = useDatePicker();

  const datesIsSelected = selectedDates?.length === 2;

  return (
    <div
      className="flex h-16 w-full cursor-pointer items-center gap-4 sm:gap-8 md:mx-auto md:w-fit md:px-4"
      onClick={openModal}
    >
      <div className="flex items-center gap-2 text-xs sm:gap-2.5 sm:text-sm">
        <Hotel className="text-muted-foreground size-5 sm:size-6" />

        {destination ? (
          <span className="font-semibold">هتل‌ های {destination.name}</span>
        ) : (
          <span className="font-medium">بدون مقصد</span>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs sm:gap-2.5 sm:text-sm">
        <CalendarRange className="text-muted-foreground size-5 sm:size-6" />

        {datesIsSelected ? (
          <span className="font-semibold">
            {`${selectedDates[0].format('DD MMMM')} تا ${selectedDates[1].format('DD MMMM')}`}
          </span>
        ) : (
          <span className="font-medium">بدون تاریخ اقامت</span>
        )}
      </div>

      <Search className="bg-secondary mr-auto size-10 rounded-full p-2.5 sm:size-10.5 md:mr-0" />
    </div>
  );
}
