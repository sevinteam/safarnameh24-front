'use client';

import 'swiper/css';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { Navigation } from 'swiper/modules';
import StoryModal from './StoryModal';

type StoryItem = {
  id: number;
  title: string;
  image: string;
  citySlug: string;
};

const STORIES: StoryItem[] = [
  { id: 1, title: 'پایتخت (تهران)', image: '/image/city/tehran.png', citySlug: 'tehran' },
  { id: 2, title: 'اصفهان', image: '/image/city/shiraz.png', citySlug: 'isfahan' },
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
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);
  const [loadingStoryId, setLoadingStoryId] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current);
      }
    };
  }, []);

  const syncNavigationState = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleStoryClick = (id: number) => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
    }
    setLoadingStoryId(id);
    openTimerRef.current = setTimeout(() => {
      setLoadingStoryId(null);
      setSelectedStoryId(id);
      openTimerRef.current = null;
    }, 700);
  };

  const hasMoreThanTen = STORIES.length > 10;

  return (
    <div className="w-full">
      {/* ======================================================== */}
      {/* 1. Circular Stories / Destinations Bar (Swiper) */}
      {/* ======================================================== */}
      <div className="relative pt-6 pb-4">
        <div className="relative flex items-center gap-2 sm:gap-3">
          {/* Navigation Arrow Right (Previous in RTL) - shown only when > 10 stories */}
          {hasMoreThanTen && (
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
              aria-label="اسلاید قبلی"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-zinc-600 transition hover:text-zinc-900 active:scale-95 disabled:cursor-default disabled:opacity-30 z-10"
            >
              <ChevronRight className="size-5" />
            </button>
          )}

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
              {STORIES.map((story) => {
                const isLoading = loadingStoryId === story.id;
                const isOpen = selectedStoryId === story.id;
                const isDashed = isLoading || isOpen;

                return (
                  <SwiperSlide key={story.id} className="select-none">
                    <div
                      onClick={() => handleStoryClick(story.id)}
                      className="flex flex-col items-center gap-2 cursor-pointer focus:outline-none relative"
                    >
                      {/* Circular Image Container with Gap + SVG Stroke */}
                      <div className="relative size-[68px] sm:size-[84px] rounded-full flex items-center justify-center">
                        {/* Inner Image with clear white gap from outer stroke */}
                        <div className="relative size-[calc(100%-14px)] overflow-hidden rounded-full bg-zinc-100 z-10">
                          <Image
                            fill
                            sizes="(max-width: 768px) 68px, 84px"
                            src={story.image}
                            alt={story.title}
                            className="object-cover"
                          />
                        </div>

                        {/* SVG Stroke Ring with space around photo */}
                        <svg
                          className={`absolute inset-0 size-full z-20 pointer-events-none ${
                            isLoading ? 'animate-[spin_2.5s_linear_infinite]' : ''
                          }`}
                          viewBox="0 0 100 100"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="47.5"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            strokeDasharray={isDashed ? '13 11.87' : undefined}
                          />
                        </svg>
                      </div>

                      {/* City/Province Title */}
                      <span className="text-xs font-bold text-center tracking-tight text-zinc-800 whitespace-nowrap">
                        {story.title}
                      </span>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          {/* Navigation Arrow Left (Next in RTL) - shown only when > 10 stories */}
          {hasMoreThanTen && (
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
              aria-label="اسلاید بعدی"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-zinc-600 transition hover:text-zinc-900 active:scale-95 disabled:cursor-default disabled:opacity-30 z-10"
            >
              <ChevronLeft className="size-5" />
            </button>
          )}
        </div>
      </div>

      {/* Story Modal Viewer */}
      <StoryModal
        isOpen={selectedStoryId !== null}
        initialStoryId={selectedStoryId || 1}
        onClose={() => setSelectedStoryId(null)}
        stories={STORIES}
      />
    </div>
  );
}
