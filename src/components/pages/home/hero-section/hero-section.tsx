'use client';

import 'swiper/css';
import './style.css';

import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import Image from 'next/image';
import HeroSearch from './hero-search';
import { cover_pictures } from './constants';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// ------------------------------

export function HeroSection() {
  return (
    <section className="-mx-4 -mt-8 xl:-mt-2">
      <div className="hidden h-120 overflow-hidden sm:block xl:rounded-[3rem]">
        <Swiper
          autoplay={{
            delay: 8000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }}

          speed={800}
          effect={'fade'}
          grabCursor={true}
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay, EffectFade]}
          className="swiper-hero-section bg-input size-full"
        >
          {cover_pictures?.map((slide, index) => (
            <SwiperSlide key={index}>
              <Image
                fill
                src={slide}
                alt="hotel-pictures"
                priority={index === 0}
                className="object-cover object-center"
                sizes="(min-width: 1280px) 1280px, (min-width: 640px) 100vw, 0px"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <HeroSearch />
    </section>
  );
}
