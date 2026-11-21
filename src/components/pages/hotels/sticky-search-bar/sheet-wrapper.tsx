import {
  Sheet,
  SheetClose,
  SheetTitle,
  SheetHeader,
  SheetFooter,
  SheetContent,
  SheetDescription,
} from '@/components/ui/sheet';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { DatePicker, useDatePicker } from '@/components/common/date-picker';
import { DestinationSearch } from '@/components/common/destination-search';
import { cn } from 'cn';

type Props = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

// ------------------------------

export default function SheetWrapper(props: Props) {
  const { open, onOpenChange } = props;

  const { selectedDates } = useDatePicker();

  const datesIsSelected = selectedDates?.length === 2;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={'w-full! gap-0 lg:hidden'}
        showCloseButton={false}
      >
        <SheetHeader className="flex-row gap-2.5 border-b px-4 py-6">
          <SheetClose className={'flex'}>
            <ArrowRight className="size-5" />
          </SheetClose>

          <SheetTitle>
            <span>انتخاب مقصد و تاریخ اقامت</span>
          </SheetTitle>

          <SheetDescription className={'hidden'} />
        </SheetHeader>

        <div
          className={cn('grid px-4 py-8', datesIsSelected ? 'gap-8' : 'gap-6')}
        >
          <DestinationSearch />
          <DatePicker />
        </div>

        <SheetFooter className="border-t">
          <SheetClose
            className={'flex'}
            render={<Button>بروزرسانی جستجو</Button>}
          ></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
