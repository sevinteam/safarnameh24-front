import { Pagination } from './Pagination';
import { TopBarConfig } from '../../shared';

import { Skeleton } from '@/components/ui/skeleton';
import { Hotel } from '@/types/landing/hotels';

import HotelNotFound from './molecules/hotel-not-found';
import { DHotelCard, MHotelCard } from './molecules/hotel-card';

type Props = {
  city?: string;
  data?: Hotel[];
  totalPages?: number;
  status: 'error' | 'success' | 'pending';
  isFetching?: boolean;
};

function hasLastMinuteDiscount(hotel: Hotel): boolean {
  const h = hotel as any;
  return Boolean(
    h?.is_last_minute_active ||
      h?.has_last_minute ||
      h?.is_last_minute ||
      h?.has_hotel_last_minute ||
      Number(h?.last_minute_discount_percent ?? 0) > 0 ||
      Number(h?.last_minute_discount ?? 0) > 0,
  );
}

function LastMinuteBadge({ hotel }: { hotel: Hotel }) {
  if (!hasLastMinuteDiscount(hotel)) return null;

  return (
    <span className="pointer-events-none absolute right-5 top-5 z-10 inline-flex animate-pulse items-center gap-1.5 rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-extrabold text-white shadow-md shadow-rose-600/40">
      <span className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
        <span className="relative inline-flex size-2 rounded-full bg-white" />
      </span>
      <span>لحظه آخری</span>
    </span>
  );
}

// ------------------------------

export function HotelListContent(props: Props) {
  const { data, status, city, totalPages, isFetching = false } = props;

  // ۱. تفکیک لود اولیه از آپدیت‌های پس‌زمینه فیلترها
  // اسکلتون فقط زمانی نشان داده می‌شود که هیچ دیتایی روی صفحه نباشد
  const isInitialLoading = status === 'pending' && (!data || data.length === 0);
  const isUpdating = isFetching && !!data && data.length > 0;

  // ۲. نمایش حالت خالی بودن یا خطا (تنها در صورتی که دیتایی نباشد و در حال لود هم نباشد)
  if (!isInitialLoading && (!data || data.length === 0)) {
    return (
      <div>
        <TopBarConfig
          className="mb-3"
          title={{
            type: 'single',
            text: `هتل‌های ${city ? `شهر ${city}` : 'شهرهای مختلف ایران'}`,
          }}
        />

        <HotelNotFound />
      </div>
    );
  }

  return (
    <div className="relative">
      <TopBarConfig
        className="mb-3"
        title={{
          type: 'single',
          text: `هتل‌های ${city ? `شهر ${city}` : 'شهرهای مختلف ایران'}`,
        }}
      />

      {/* ۳. حالت موبایل و تبلت (Small-Screen) */}
      <div
        className={`grid gap-6 transition-opacity duration-200 md:grid-cols-2 xl:hidden ${
          isUpdating ? 'pointer-events-none opacity-50' : 'opacity-100'
        }`}
      >
        {isInitialLoading
          ? Array(8)
              .fill(null)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-[23.5rem] w-full rounded-xl bg-zinc-200/70"
                />
              ))
          : data?.map((hotel, index) => (
              <div
                key={hotel.slug || (hotel as any).id || index}
                className="relative"
              >
                <LastMinuteBadge hotel={hotel} />
                <MHotelCard
                  {...hotel}
                  index={index} // فعال‌سازی لود با اولویت تصویر برای ۲ کارت اول
                />
              </div>
            ))}
      </div>

      {/* ۴. حالت دسکتاپ (Large-Screen) */}
      <div
        className={`hidden gap-6 transition-opacity duration-200 xl:grid ${
          isUpdating ? 'pointer-events-none opacity-50' : 'opacity-100'
        }`}
      >
        {isInitialLoading
          ? Array(8)
              .fill(null)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-[14rem] w-full rounded-2xl bg-zinc-200/70"
                />
              ))
          : data?.map((hotel, index) => (
              <div
                key={hotel.slug || (hotel as any).id || index}
                className="relative"
              >
                <LastMinuteBadge hotel={hotel} />
                <DHotelCard
                  {...hotel}
                  index={index} // فعال‌سازی لود با اولویت تصویر برای ۲ کارت اول
                />
              </div>
            ))}
      </div>

      {/* ۵. صفحه‌بندی */}
      <div className="mt-8">
        <Pagination pageCount={totalPages} />
      </div>
    </div>
  );
}