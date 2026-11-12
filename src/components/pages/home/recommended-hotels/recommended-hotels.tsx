'use client';

import 'swiper/css';
import { useRef } from 'react';

import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';

import { TOP_CITIES } from '@/lib/constants/general';

import { HotelCard } from '@/components/common/hotel-card/organisms/hotel-card.main';
import { SectionTitle } from '@/components/common/section-topbar/section-title';
import { SectionNavigation } from '@/components/common/section-topbar/section-navigation';
import { MOCK_HOTELS } from '@/lib/constants/hotel-card';

// ------------------------------

export function RecommendedHotels() {
  const swiperRef = useRef<SwiperType>(null);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle>هتل های پیشنهادی</SectionTitle>

        <SectionNavigation
          nextSlide={() => swiperRef.current?.slideNext()}
          prevSlide={() => swiperRef.current?.slidePrev()}
        />
      </div>

      <div className="-mx-4 xl:mx-0">
        <Swiper
          breakpoints={{
            0: {
              slidesPerView: 'auto',
              slidesOffsetAfter: 20,
              slidesOffsetBefore: 20,
            },
            1280: {
              slidesPerView: 4,
              slidesOffsetAfter: 0,
              slidesOffsetBefore: 0,
            },
          }}

          spaceBetween={24}
          modules={[Pagination]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {MOCK_HOTELS.map((item, i) => (
            <SwiperSlide
              key={String(item.id + i)}
              className="max-w-74 select-none xl:max-w-full"
            >
              <HotelCard {...item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
