'use client';

import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

import { TopBarConfig } from '../../shared';
import { Section } from './molecules/Section';
import { HotelCustomerReview } from '@/types';
import { generalInstance } from '@/utils/services';
import { HiMiniExclamationCircle } from 'react-icons/hi2';

import { Swiper as SwiperType } from 'swiper/types';

import Reviews from './molecules/customer-reviews/Reviews';
import ReviewsAverage from './molecules/customer-reviews/ReviewsAverage';

import { Skeleton } from '@/components/ui/skeleton';

type Props = { hotelSlug: string };
type ApiResponse = { data: HotelCustomerReview[] };

// --------------------------------------

export function CustomerReviews(props: Props) {
  const { hotelSlug } = props;
  const swiperRef = useRef<SwiperType>(null);

  const { data, status } = useQuery<ApiResponse>({
    queryKey: ['hotel-comments-list', hotelSlug],
    enabled: Boolean(hotelSlug),
    queryFn: () => generalInstance(`/hotel/hotels/${hotelSlug}/comments`),
  });

  const reviewsList = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  return (
    <Section sectionID="customer-reviews" className="relative">
      <TopBarConfig
        maxLength={1}
        arraylength={reviewsList.length}
        subtitle={
          reviewsList.length
            ? `${reviewsList.length} دیدگاه از سوی کاربران به ثبت رسیده است`
            : undefined
        }
        title={{ type: 'single', text: 'نظرات محبت آمیز مشتریان' }}
        prevClickFunc={() => swiperRef.current?.slidePrev()}
        nextClickFunc={() => swiperRef.current?.slideNext()}
      />

      {/* === Data-Content */}
      {status === 'pending' ? (
        <div className="grid gap-6 lg:grid lg:h-[30rem] lg:grid-cols-[1fr_2fr] lg:gap-8">
          <Skeleton className="h-[30rem] rounded-xl lg:h-auto" />
          <Skeleton className="h-96 rounded-xl lg:h-auto" />
        </div>
      ) : reviewsList.length ? (
        <div className="grid gap-6 overflow-hidden lg:h-[30rem] lg:grid-cols-[1fr_2fr] lg:gap-8 [&>*]:min-w-0">
          <ReviewsAverage hotelSlug={hotelSlug} />
          <Reviews hotelSlug={hotelSlug} ref={swiperRef} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-cs-blue/10 p-6 text-cs85/6 font-semibold text-cs-blue lg:p-8 lg:text-cs09/5">
          <div className="flex-center gap-1.5">
            <HiMiniExclamationCircle
              color="#4b5bce"
              className="size-5 lg:size-6"
            />

            <p className="font-bold">
              تاکنون دیدگاهی برای این هتل به ثبت نرسیده است !
            </p>
          </div>

          <div className="w-[90%] border-b border-dashed border-cs-blue/20 md:w-1/3" />

          <p className="text-center text-cs08/6 lg:text-cs85/6">
            دیدگاه‌ها و امتیازات مسافران پس از بررسی در این بخش نمایش داده
            می‌شوند.
          </p>
        </div>
      )}
    </Section>
  );
}