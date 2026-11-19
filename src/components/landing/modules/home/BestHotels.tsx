'use client';

import 'swiper/css';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';

import Link from 'next/link';
import { useRef } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import { TopBarConfig } from '../../shared';
import { Skeleton } from '@/components/ui/skeleton';
import { generalInstance, isEmptyOrInvalid } from '@/utils/services';

type Data = {
  hotel_slug: string;
  image_logo_hotel: string;
  is_last_minute_active?: boolean;
  last_minute_discount_percent?: number;
};

type ApiResponse = {
  data: Data[];
};

function hasLastMinuteDiscount(hotel: Data): boolean {
  const h = hotel as any;
  return Boolean(
    h?.is_last_minute_active ||
      h?.has_last_minute ||
      h?.is_last_minute ||
      Number(h?.last_minute_discount_percent ?? 0) > 0,
  );
}

// -----------------------------------------------

export function BestHotels() {
  const swiperRef = useRef<SwiperType>(null);

  const { data, status } = useQuery<ApiResponse>({
    queryKey: ['best-hotels'],
    queryFn: () => generalInstance('/hotel/hotels/'),
  });

  if (isEmptyOrInvalid({ data, status })) return null;

  return (
    <div className="-ml-5 lg:ml-0">
      <TopBarConfig
        maxLength={6}
        arraylength={data?.data.length}
        prevClickFunc={() => swiperRef.current?.slidePrev()}
        nextClickFunc={() => swiperRef.current?.slideNext()}
        title={{ type: 'single', text: 'هتل های برتر ایران' }}
        subtitle="گروه هتداری بزرگ ایران که به ما اعتماد کرده اند"
      />

      {status === 'pending' ? (
        <>
          <Skeleton className="h-32 w-full xl:hidden" />

          <div className="hidden gap-5 xl:flex">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <Skeleton key={index} className="h-32 w-full" />
              ))}
          </div>
        </>
      ) : (
        <Swiper
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 'auto', slidesOffsetAfter: 22 },
            1280: { slidesPerView: 6, slidesOffsetAfter: 0 },
          }}
          modules={[Navigation]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="bestHotels-swiper h-32 lg:h-36"
        >
          {data?.data?.map((hotel, index) => (
            <SwiperSlide
              key={index}
              className="max-w-40 select-none xl:max-w-full"
            >
              <Link
                href={`/hotel/${hotel.hotel_slug}`}
                className="flex-center group relative h-28 rounded-xl bg-white p-4 shadow-[0_0.5rem_1rem_rgba(0,0,0,0.02)] xl:h-32 xl:p-6"
              >
                {hasLastMinuteDiscount(hotel) && (
                  <span className="pointer-events-none absolute right-2 top-2 z-10 inline-flex animate-pulse items-center gap-1 rounded-lg bg-rose-600 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm shadow-rose-600/40">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                    </span>
                    <span>لحظه آخری</span>
                  </span>
                )}

                {hotel && (
                  <Image
                    width={200}
                    height={200}
                    alt={'hotel-logo'}
                    src={hotel.image_logo_hotel}
                    className="full-size object-contain"
                  />
                )}

                <div className="absolute -z-10 bottom-1 left-1/2 h-10 w-20 -translate-x-1/2 rounded-xl bg-cs-red transition-all delay-100 duration-200 ease-in-out group-hover:-bottom-2"></div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}