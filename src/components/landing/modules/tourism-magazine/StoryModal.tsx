'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

type StoryItem = {
  id: number;
  title: string;
  image: string;
  citySlug: string;
  isDashed?: boolean;
  subImages?: string[];
};

type Props = {
  isOpen: boolean;
  initialStoryId: number;
  onClose: () => void;
  stories: StoryItem[];
};

export default function StoryModal({ isOpen, initialStoryId, onClose, stories }: Props) {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  useEffect(() => {
    const index = stories.findIndex((s) => s.id === initialStoryId);
    if (index !== -1) {
      setActiveStoryIndex(index);
      setActiveSubIndex(0);
      swiperInstance?.slideTo(index, 0);
    }
  }, [initialStoryId, isOpen, swiperInstance, stories]);

  const currentStory = stories[activeStoryIndex] || stories[0];
  const subImages = currentStory?.subImages || [currentStory?.image, currentStory?.image, currentStory?.image];

  const handleNext = useCallback(() => {
    if (activeSubIndex < subImages.length - 1) {
      setActiveSubIndex((prev) => prev + 1);
    } else if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex((prev) => prev + 1);
      setActiveSubIndex(0);
      swiperInstance?.slideNext();
    }
  }, [activeSubIndex, activeStoryIndex, subImages.length, stories.length, swiperInstance]);

  const handlePrev = useCallback(() => {
    if (activeSubIndex > 0) {
      setActiveSubIndex((prev) => prev - 1);
    } else if (activeStoryIndex > 0) {
      setActiveStoryIndex((prev) => prev - 1);
      setActiveSubIndex(0);
      swiperInstance?.slidePrev();
    }
  }, [activeSubIndex, activeStoryIndex, swiperInstance]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handlePrev();
      if (e.key === 'ArrowLeft') handleNext();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition active:scale-95"
        aria-label="بستن"
      >
        <X className="size-6" />
      </button>

      {/* Story Swiper Modal Container */}
      <div className="relative w-full max-w-6xl px-4 py-8 h-[90vh] flex items-center justify-center">
        <Swiper
          dir="rtl"
          modules={[Navigation]}
          initialSlide={activeStoryIndex}
          centeredSlides={true}
          slidesPerView={1.1}
          spaceBetween={16}
          breakpoints={{
            480: { slidesPerView: 1.8, spaceBetween: 20 },
            768: { slidesPerView: 2.5, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          onSlideChange={(swiper) => {
            setActiveStoryIndex(swiper.activeIndex);
            setActiveSubIndex(0);
          }}
          className="w-full h-full !flex !items-center !py-6"
        >
          {stories.map((story, idx) => {
            const isActive = idx === activeStoryIndex;
            const currentImages = story.subImages || [story.image, story.image, story.image];
            const activeImage = isActive ? currentImages[activeSubIndex] || story.image : story.image;

            return (
              <SwiperSlide
                key={story.id}
                className={`transition-all duration-300 flex items-center justify-center ${
                  isActive ? 'scale-100 opacity-100 z-20' : 'scale-85 opacity-50 blur-[1px] z-10'
                }`}
              >
                <div className="relative w-full max-w-[310px] sm:max-w-[330px] h-[540px] sm:h-[580px] rounded-[32px] overflow-hidden shadow-2xl bg-zinc-900 border border-white/15 flex flex-col justify-between">
                  {/* Background Story Image */}
                  <div className="absolute inset-0">
                    <Image
                      fill
                      src={activeImage}
                      alt={story.title}
                      className="object-cover transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/75" />
                  </div>

                  {/* Top Progress bars & Header */}
                  <div className="relative z-10 p-5 flex flex-col gap-3">
                    {/* Progress indicator segments */}
                    <div className="flex items-center gap-1.5 w-full">
                      {currentImages.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full overflow-hidden bg-white/30 ${
                            isActive && i <= activeSubIndex ? 'bg-white' : ''
                          }`}
                        >
                          {isActive && i === activeSubIndex && (
                            <div className="h-full bg-red-600 animate-[pulse_1.5s_infinite]" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* User / City Profile info */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2.5">
                        <div className="relative size-9 rounded-full overflow-hidden border-2 border-white/50 shadow-md">
                          <Image fill src={story.image} alt="" className="object-cover" />
                        </div>
                        <span className="text-white text-xs font-extrabold drop-shadow-md">
                          {story.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom info / gradient */}
                  <div className="relative z-10 p-5 text-white">
                    <p className="text-xs font-semibold text-white/95 leading-relaxed line-clamp-2 drop-shadow">
                      زیباترین جاذبه‌های گردشگری و اقامتی {story.title} (بخش {activeSubIndex + 1} از {currentImages.length}) در سفرنامه زروان تریپ.
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-6 lg:left-12 z-30 flex size-12 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition shadow-xl active:scale-95"
          aria-label="قبلی"
        >
          <ChevronRight className="size-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-6 lg:right-12 z-30 flex size-12 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition shadow-xl active:scale-95"
          aria-label="بعدی"
        >
          <ChevronLeft className="size-6" />
        </button>
      </div>
    </div>
  );
}
