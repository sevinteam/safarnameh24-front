'use client';

import 'swiper/css';
import 'swiper/css/pagination';

import { useRef } from 'react';
import { Hotel } from '@/types';
import { axiosInstance } from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { Navigation, Autoplay } from 'swiper/modules';

import { Section } from './molecules/Section';
import { Skeleton } from '@/components/ui/skeleton';
import { isEmptyOrInvalid } from '@/utils/services';
import { SuggestedHotel, TopBarConfig } from '../../shared';

type Props = { hotelSlug: string };
type ApiResponse = { data: Array<Hotel> };

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

export function SuggestedHotels(props: Props) {
  const { hotelSlug } = props;
  const swiperRef = useRef<SwiperType>(null);

  const { data, status } = useQuery<ApiResponse>({
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(hotelSlug),
    queryKey: ['suggested-hotels-by-slug', hotelSlug],
    queryFn: () => axiosInstance(`/hotel/hotels/by-hotel-slug/${hotelSlug}`),
  });

  if (isEmptyOrInvalid({ data, status })) return null;

  const city = data?.data?.[0]?.city?.name;
  const province = data?.data?.[0]?.city?.province;

  const topBarConfigTitle = city
    ? `هتل های پیشنهادی شهر ${city}`
    : 'هتل های پیشنهادی';

  return (
    <Section sectionID="suggested-hotels" className="-ml-5 xl:ml-0">
      <TopBarConfig
        arraylength={data?.data?.length}
        subtitle="هتل های پیشنهادی زروان تریپ رو از دست نده !"
        title={{ type: 'single', text: topBarConfigTitle }}
        prevClickFunc={() => swiperRef.current?.slidePrev()}
        nextClickFunc={() => swiperRef.current?.slideNext()}
        viewAllHref={`/hotel?city=${city}&province=${province}`}
      />

      {status === 'pending' ? (
        <>
          <Skeleton className="h-[23.5rem] xl:hidden" />
          <div className="hidden h-[23.5rem] grid-cols-4 gap-5 xl:grid">
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <Skeleton key={index} className="rounded-xl" />
              ))}
          </div>
        </>
      ) : (
        <Swiper
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 'auto', slidesOffsetAfter: 22 },
            1280: {
              slidesPerView: 4,
              slidesOffsetAfter: 0,
            },
          }}
          speed={600}
          autoplay={
            data?.data && data?.data?.length > 4
              ? {
                  delay: 4000,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          modules={[Navigation, Autoplay]}
          className="suggestedHotels-swiper"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {data?.data?.map((hotel, index) => (
            <SwiperSlide
              key={index}
              className="max-w-72 select-none pb-4 xl:max-w-full"
            >
              <div className="relative">
                {hasLastMinuteDiscount(hotel) && (
                  <span className="pointer-events-none absolute right-5 top-5 z-10 inline-flex animate-pulse items-center gap-1.5 rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-extrabold text-white shadow-md shadow-rose-600/40">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
                      <span className="relative inline-flex size-2 rounded-full bg-white" />
                    </span>
                    <span>لحظه آخری</span>
                  </span>
                )}

                <SuggestedHotel hotel={hotel} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Section>
  );
}