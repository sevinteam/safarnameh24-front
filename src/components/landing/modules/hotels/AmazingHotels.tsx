'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useQueryState, parseAsStringEnum } from 'nuqs';

import { Hotel } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { SuggestedHotel, TopBarConfig } from '../../shared';
import { axiosInstance } from '@/utils/axios';

const parseAsShowToggle = parseAsStringEnum(['show', 'hide']).withDefault(
  'hide',
);

type ApiResponse = { data: Hotel[] };

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

// ----------------------------

export function AmazingHotels() {
  const [visibleCount, setVisibleCount] = useState(6);

  const [state] = useQueryState('amazing-hotels', parseAsShowToggle);
  const isActive = state === 'show';

  const { data, status } = useQuery<ApiResponse>({
    enabled: isActive,
    queryKey: ['amazing-hotels'],
    queryFn: () => axiosInstance('/hotel/hotels/amazing-hotels'),
  });

  const amazingHotels = data?.data ?? [];
  if (!isActive) return null;

  return (
    <div>
      <TopBarConfig
        className="mb-3"
        title={{ type: 'single', text: 'هتل های شگفت انگیز' }}
      />

      {status !== 'pending' && !amazingHotels.length && (
        <div className="text-cs85 font-semibold text-zinc-500">
          * هتلی برای نمایش وجود ندارد !
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {status === 'pending'
          ? Array(6)
              .fill(null)
              .map((_, index) => (
                <Skeleton key={index} className="h-[23.5rem] rounded-xl" />
              ))
          : amazingHotels.length > 0 &&
            amazingHotels?.slice(0, visibleCount).map((hotel, index) => (
              <div key={index} className="relative">
                {hasLastMinuteDiscount(hotel) && (
                  <span className="pointer-events-none absolute right-5 top-5 z-10 inline-flex animate-pulse items-center gap-1.5 rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-extrabold text-white shadow-md shadow-rose-600/40">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
                      <span className="relative inline-flex size-2 rounded-full bg-white" />
                    </span>
                    <span>لحظه آخری</span>
                  </span>
                )}

                <SuggestedHotel hotel={hotel} bestType="amazing" />
              </div>
            ))}
      </div>

      {visibleCount < amazingHotels?.length && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 6)}
          className="mt-6 w-fit rounded-lg bg-zinc-200/80 px-5 py-2 text-cs08 font-semibold"
        >
          مشاهده بیشتر
        </button>
      )}
    </div>
  );
}