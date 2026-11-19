'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  HiMiniExclamationCircle,
  HiChevronRight,
  HiChevronLeft,
} from 'react-icons/hi2';

import { Section } from './molecules/Section';
import { HotelCustomerReview } from '@/types';
import { generalInstance } from '@/utils/services';
import Reviews from './molecules/customer-reviews/Reviews';
import ReviewsAverage from './molecules/customer-reviews/ReviewsAverage';
import { Skeleton } from '@/components/ui/skeleton';

type Props = { hotelSlug: string };
type ApiResponse = HotelCustomerReview[] | { data: HotelCustomerReview[] };

const COMMENTS_PER_PAGE = 4;

// --------------------------------------

export function CustomerReviews(props: Props) {
  const { hotelSlug } = props;
  const [currentPage, setCurrentPage] = useState(1);

  const { data, status } = useQuery<ApiResponse>({
    queryKey: ['hotel-comments-list', hotelSlug],
    enabled: Boolean(hotelSlug),
    queryFn: () => generalInstance(`/hotel/hotels/${hotelSlug}/comments`),
  });

  const reviewsList: HotelCustomerReview[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  const totalPages = Math.max(
    1,
    Math.ceil(reviewsList.length / COMMENTS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * COMMENTS_PER_PAGE;
  const paginatedReviews = reviewsList.slice(
    startIndex,
    startIndex + COMMENTS_PER_PAGE,
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <Section sectionID="customer-reviews" className="relative">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-gray-800 lg:text-xl">
            نظرات محبت آمیز مشتریان
          </h2>
          {reviewsList.length > 0 && (
            <p className="text-xs font-medium text-gray-500 lg:text-sm">
              {reviewsList.length} نظر ثبت شده
              {totalPages > 1 ? ` • صفحه ${safePage} از ${totalPages}` : ''}
            </p>
          )}
        </div>

        {reviewsList.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={safePage <= 1}
              aria-label="صفحه قبلی"
              className="flex size-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <HiChevronRight className="size-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNumber = idx + 1;
                const isActive = pageNumber === safePage;
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    aria-label={`صفحه ${pageNumber}`}
                    className={`rounded-full transition-all ${
                      isActive
                        ? 'size-2.5 bg-zinc-900'
                        : 'size-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={safePage >= totalPages}
              aria-label="صفحه بعدی"
              className="flex size-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <HiChevronLeft className="size-4" />
            </button>
          </div>
        )}
      </div>

      {/* Data-Content */}
      {status === 'pending' ? (
        <div className="grid gap-6 lg:grid lg:h-[30rem] lg:grid-cols-[1fr_2fr] lg:gap-8">
          <Skeleton className="h-[30rem] rounded-xl lg:h-auto" />
          <Skeleton className="h-96 rounded-xl lg:h-auto" />
        </div>
      ) : reviewsList.length ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-8">
          <div className="min-w-0 lg:h-[30rem]">
            <ReviewsAverage hotelSlug={hotelSlug} />
          </div>
          <div className="min-w-0">
            <Reviews reviews={paginatedReviews} />
          </div>
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