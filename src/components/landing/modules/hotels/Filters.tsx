'use client';

import { memo, Suspense } from 'react';
import { IoClose } from 'react-icons/io5';
import { Filter, Building } from 'iconsax-react';
import { useHotelQuery } from '@/context';

import {
  Star,
  PriceRange,
  ClearFilters,
  OtherFilters,
  ResidenceType,
  RoomFacilities,
  HotelFacilities,
} from './molecules/filters';

import {
  Sheet,
  SheetTitle,
  SheetClose,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';

import { Accordion } from '@/components/ui/accordion';

// کلیدهای value مربوط به AccordionItem هر فیلتر (در پوشه molecules/filters)
const ALL_FILTER_VALUES = [
  'star',
  'price-range',
  'residence-type',
  'other-filters',
  'hotel-facilities',
  'room-facilities',
];

// ------------------------------
// ۱. مموایز کردن لیست فیلترها برای جلوگیری از رندرهای تکراری هنگام تغییر وضعیت سرچ
const FilterItemsList = memo(function FilterItemsList({
  defaultOpenAll = false,
}: {
  defaultOpenAll?: boolean;
}) {
  return (
    <Accordion
      type="multiple"
      defaultValue={defaultOpenAll ? ALL_FILTER_VALUES : undefined}
      className="divide-y"
    >
      <Star />
      <PriceRange />
      <ResidenceType />
      <OtherFilters />
      <HotelFacilities />
      <RoomFacilities />
    </Accordion>
  );
});

// ------------------------------
export function Filters() {
  const {
    queryState: { isPending, totalLength },
  } = useHotelQuery();

  return (
    <Suspense>
      {/* === حالت موبایل (Small-Screen) === */}
      <div className="flex h-9 gap-3 lg:hidden">
        <Sheet>
          <SheetTrigger className="flex-center shadow-light gap-2 rounded-full border bg-white px-4">
            <Filter size="17" color="#52525b" />
            <span className="text-cs75 pt-0.5 font-bold text-zinc-600">
              فیلتر ها
            </span>
          </SheetTrigger>

          <SheetContent className="grid w-full grid-rows-[auto_1fr_auto] p-0">
            <SheetHeader className="shadow-light flex h-16 flex-row items-center justify-between border-b px-6">
              <SheetTitle className="hidden"></SheetTitle>
              <SheetDescription className="hidden"></SheetDescription>

              <span className="text-cs85 font-bold">فیلتر های جستجو</span>

              <SheetClose>
                <IoClose color="#555" size={20} />
              </SheetClose>
            </SheetHeader>

            {/* لیست فیلترها در موبایل */}
            <div className="custom-scrollbar divide-y overflow-auto pb-4">
              <FilterItemsList defaultOpenAll={false} />
            </div>

            <div className="shadow-light flex h-20 items-center justify-between border-t px-6">
              <ClearFilters />

              <div className="flex-center text-cs08 bg-cs-blue/10 text-cs-blue h-10 w-36 gap-1 rounded-lg font-semibold">
                {isPending ? (
                  <div className="loader-dots-blue" />
                ) : totalLength ? (
                  <>
                    <span>{totalLength}</span>
                    <span>هتل یافت شد</span>
                  </>
                ) : (
                  'موردی یافت نشد'
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* شمارنده نتایج موبایل */}
        <div className="flex-center shadow-light gap-2 rounded-full border bg-white px-4">
          <Building size="18" color="#52525b" />

          <div className="flex-center text-cs75 gap-1 pt-0.5 font-bold text-zinc-600">
            <span>نتایج :</span>
            <span>{totalLength}</span>
            <span>هتل</span>
          </div>
        </div>
      </div>

      {/* === حالت دسکتاپ (Large-Screen) - استیکی با حداکثر ارتفاع صفحه و اسکرول داخلی === */}
      <div className="shadow-light sticky top-24 hidden max-h-[calc(100dvh-7rem)] flex-col rounded-2xl bg-white text-zinc-800 lg:flex">
        <div className="flex-between shrink-0 items-center border-b px-5 py-4">
          <span className="text-cs85 font-bold">فیلتر های جستجو</span>
          <ClearFilters />
        </div>

        {/* لیست اسکرول‌خور دسکتاپ - کل فضای عمودی صفحه را پر می‌کند */}
        <div
          dir="ltr"
          className="custom-scrollbar min-h-0 flex-1 overflow-y-auto"
        >
          <div dir="rtl">
            <FilterItemsList defaultOpenAll={true} />
          </div>
        </div>

        {/* دکمه وضعیت نتایج در پایین فیلتر دسکتاپ */}
        <div className="flex-between shrink-0 items-center border-t px-5 py-4">
          <div className="flex-center bg-cs-dark-blue rounded-cs-10 text-cs08 h-11 w-full gap-1 font-semibold text-white">
            {isPending ? (
              <div className="loader-dots" />
            ) : totalLength ? (
              <>
                <span>نتایج :</span>
                <span className="mr-1">{totalLength}</span>
                <span>هتل</span>
              </>
            ) : (
              'نتیجه ای یافت نشد'
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}