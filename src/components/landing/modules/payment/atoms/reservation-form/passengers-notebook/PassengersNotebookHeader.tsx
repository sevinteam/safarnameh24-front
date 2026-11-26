import {
  SheetClose,
  SheetTitle,
  SheetHeader,
  SheetDescription,
} from '@/components/ui/sheet';

import Image from 'next/image';
import { X } from 'lucide-react';
import logo from '@/assets';

// ------------------------------

export function PassengersNotebookHeader() {
  return (
    <SheetHeader className="flex-row items-center justify-between gap-3 space-y-0">
      <div className="flex items-center gap-3">
        <div className="flex-center size-12 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={logo}
            alt="لوگو زروان تریپ"
            width={96}
            height={96}
            className="aspect-auto w-full object-contain"
          />
        </div>

        <div className="flex flex-col items-start text-right">
          <SheetTitle className="text-sm font-extrabold text-zinc-900">
            زروان تریپ
          </SheetTitle>

          <SheetDescription className="mt-0.5 font-inter text-xs font-bold text-zinc-800">
            Agency Zarvantrip
          </SheetDescription>
        </div>
      </div>

      <SheetClose
        type="button"
        aria-label="بستن"
        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
      >
        <X className="size-5" />
      </SheetClose>
    </SheetHeader>
  );
}
