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

import { DatePicker } from '@/components/common/date-picker';
import { DestinationSearch } from '@/components/common/destination-search';

type Props = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

// ------------------------------

export default function SheetWrapper(props: Props) {
  const { open, onOpenChange } = props;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={'w-full! gap-0'} showCloseButton={false}>
        <SheetHeader className="flex-row gap-2.5 border-b px-4 py-6">
          <SheetClose className={'flex'}>
            <ArrowRight className="size-5" />
          </SheetClose>

          <SheetTitle>
            <span>انتخاب مقصد و تاریخ اقامت</span>
          </SheetTitle>

          <SheetDescription className={'hidden'} />
        </SheetHeader>

        <div className="grid gap-6 px-4 py-8">
          <DestinationSearch />
          <DatePicker />
        </div>

        <SheetFooter className="border-t">
          <Button>بروزرسانی جستجو</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
