'use client';

import 'swiper/css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';

import { ArrowLeft, ArrowRight, User } from 'lucide-react';
import Image from 'next/image';
import { cn } from 'cn';
import { TOP_CITIES } from '@/lib/constants/general';

import heroImage_1 from '@/assets/images/background/hero-3.jpg';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import Link from 'next/link';
import { SectionTitle } from '@/components/common/section-topbar/section-title';
import { SectionNavigation } from '@/components/common/section-topbar/section-navigation';

// ------------------------------

export function TopCities() {
  const swiperRef = useRef<SwiperType>(null);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle>شهرهای پربازدید ایران</SectionTitle>

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
              slidesPerView: 6,
              slidesOffsetAfter: 0,
              slidesOffsetBefore: 0,
            },
          }}

          spaceBetween={24}
          className="size-full"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {TOP_CITIES.map((item, i) => (
            <SwiperSlide key={i} className="max-w-48 select-none xl:max-w-full">
              <Link
                href={'/'}
                className="group flex flex-col gap-4 overflow-hidden"
              >
                <div className="bg-card relative flex h-56 overflow-hidden rounded-2xl">
                  <div
                    className={cn(
                      'flex w-fit items-center gap-1 rounded-md bg-white/80 text-xs font-semibold backdrop-blur-md dark:bg-black/80',
                      'px-2 py-1',
                      'absolute top-3 right-3 z-20 sm:top-2',
                      'transition-all ease-in-out',
                      'sm:invisible sm:opacity-0 sm:group-hover:visible sm:group-hover:top-3 sm:group-hover:opacity-100',
                      '',
                    )}
                  >
                    <span>{item.accommodations_count}</span>
                    <span>اقامتگاه</span>
                  </div>

                  <Image
                    fill
                    alt=""
                    sizes="192px"
                    src={heroImage_1}
                    className="z-10 object-cover"
                  />
                </div>

                <div className={'truncate text-sm font-semibold'}>
                  <span>{item.province}</span>
                  <span className="mx-1">,</span>
                  <span className="text-muted-foreground">{item.city}</span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
