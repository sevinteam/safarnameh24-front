'use client';

import 'swiper/css';
import './style.css';

import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import Image from 'next/image';
import HeroSearch from './hero-search';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

import heroImage_1 from '@/assets/images/background/hero-1.jpg';
import heroImage_2 from '@/assets/images/background/hero-2.jpg';
import heroImage_3 from '@/assets/images/background/hero-3.jpg';

// ------------------------------

export function HeroSection() {
  return (
    <section className="-mx-4 -mt-6 xl:mt-0">
      <div className="hidden h-110 overflow-hidden sm:block xl:rounded-[3rem]">
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
          {[heroImage_1, heroImage_2, heroImage_3]?.map((slide, index) => (
            <SwiperSlide key={index}>
              <Image
                fill
                src={slide}
                // sizes="100vw"
                sizes="(min-width: 1280px) 1280px, (min-width: 640px) 100vw, 0px"
                alt="hotel-pictures"
                priority={index === 0}
                className="object-cover object-center"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <HeroSearch />
    </section>
  );
}
