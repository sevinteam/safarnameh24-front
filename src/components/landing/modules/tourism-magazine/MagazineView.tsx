'use client';

import 'swiper/css';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { Navigation } from 'swiper/modules';

type StoryItem = {
  id: number;
  title: string;
  image: string;
  citySlug: string;
  isDashed?: boolean;
};

const STORIES: StoryItem[] = [
  { id: 1, title: 'پایتخت (تهران)', image: '/image/city/tehran.png', citySlug: 'tehran' },
  { id: 2, title: 'اصفهان', image: '/image/city/shiraz.png', citySlug: 'isfahan', isDashed: true },
  { id: 3, title: 'بوشهر', image: '/image/city/antalia.png', citySlug: 'bushehr' },
  { id: 4, title: 'چارمحال بختیاری', image: '/image/city/rasht.png', citySlug: 'chaharmahal' },
  { id: 5, title: 'مازندران', image: '/image/city/rasht.png', citySlug: 'mazandaran' },
  { id: 6, title: 'بندر عباس', image: '/image/city/hormozgan.png', citySlug: 'bandar-abbas' },
  { id: 7, title: 'کرمانشاه', image: '/image/city/shiraz.png', citySlug: 'kermanshah' },
  { id: 8, title: 'آذربایجان غربی', image: '/image/city/antalia.png', citySlug: 'west-azerbaijan' },
  { id: 9, title: 'مشهد', image: '/image/city/mashhad.png', citySlug: 'mashhad' },
  { id: 10, title: 'گلستان', image: '/image/city/rasht.png', citySlug: 'golestan' },
  { id: 11, title: 'شیراز', image: '/image/city/shiraz.png', citySlug: 'shiraz' },
];

export default function MagazineView() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const syncNavigationState = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div className="w-full">
      {/* ======================================================== */}
      {/* 1. Circular Stories / Destinations Bar (Swiper) */}
      {/* ======================================================== */}
      <div className="relative pt-6 pb-4">
        <div className="relative flex items-center gap-2 sm:gap-3">
          {/* Navigation Arrow Right (Previous in RTL) */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
            aria-label="اسلاید قبلی"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-zinc-600 transition hover:text-zinc-900 active:scale-95 disabled:cursor-default disabled:opacity-30 z-10"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Swiper Stories Container */}
          <div className="min-w-0 flex-1">
            <Swiper
              dir="rtl"
              modules={[Navigation]}
              speed={450}
              spaceBetween={16}
              slidesPerView={3.5}
              breakpoints={{
                480: { slidesPerView: 4.5, spaceBetween: 16 },
                640: { slidesPerView: 6, spaceBetween: 18 },
                768: { slidesPerView: 7, spaceBetween: 20 },
                1024: { slidesPerView: 9, spaceBetween: 20 },
                1280: { slidesPerView: 10, spaceBetween: 20 },
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                syncNavigationState(swiper);
              }}
              onSlideChange={syncNavigationState}
              onResize={syncNavigationState}
              className="!py-2"
            >
              {STORIES.map((story) => (
                <SwiperSlide key={story.id} className="select-none">
                  <div className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none">
                    {/* Circular Image Container with Red Outline */}
                    <div
                      className={`relative size-16 sm:size-20 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${
                        story.isDashed
                          ? 'border-2 border-dashed border-red-500 p-0.5'
                          : 'border-2 border-red-500 p-0.5'
                      }`}
                    >
                      <div className="relative h-full w-full overflow-hidden rounded-full bg-zinc-100">
                        <Image
                          fill
                          sizes="(max-width: 768px) 64px, 80px"
                          src={story.image}
                          alt={story.title}
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* City/Province Title */}
                    <span className="text-xs font-bold text-center tracking-tight text-zinc-800 whitespace-nowrap group-hover:text-red-600 transition-colors">
                      {story.title}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Navigation Arrow Left (Next in RTL) */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={isEnd}
            aria-label="اسلاید بعدی"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-zinc-600 transition hover:text-zinc-900 active:scale-95 disabled:cursor-default disabled:opacity-30 z-10"
          >
            <ChevronLeft className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
