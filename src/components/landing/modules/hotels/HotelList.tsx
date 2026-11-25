'use client';

import {
  useHotelQuery,
  useDatePickerContext,
  usePassengersContext,
  useHotelOrCityContext,
} from '@/context';

import {
  getDates,
  ApiResponse,
  parseAsShowToggle,
} from './helpers/hotel-list';

import { HotelListContent } from './HotelListContent';
import { axiosInstance } from '@/utils/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { useQueryState, parseAsArrayOf, parseAsInteger } from 'nuqs';

export function HotelList() {
  const { handleSetQueryState } = useHotelQuery();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // فیلترها از URL (بدون page چون اسکرول بی‌نهایت است)
  const [star] = useQueryState('star', parseAsArrayOf(parseAsInteger));
  const [amazingHotels] = useQueryState('amazing-hotels', parseAsShowToggle);
  const [suggestedHotels] = useQueryState('suggested-hotels', parseAsShowToggle);
  const [lastMinute] = useQueryState('last-minute', parseAsShowToggle);
  const [minPrice] = useQueryState('min-price', parseAsInteger.withDefault(0));
  const [maxPrice] = useQueryState('max-price', parseAsInteger.withDefault(0));
  const [residenceType] = useQueryState('residence-type', parseAsArrayOf(parseAsInteger));
  const [hotelFacilities] = useQueryState('hotel-facilities', parseAsArrayOf(parseAsInteger));
  const [roomFacilities] = useQueryState('room-facilities', parseAsArrayOf(parseAsInteger));

  // کانتکست‌ها
  const { confirmedValue: dates } = useDatePickerContext();
  const { confirmedValue: hotelOrCity } = useHotelOrCityContext();
  const { rooms, confirmedPassengers: passengers } = usePassengersContext();

  // استخراج مقادیر Primitive برای جلوگیری از تغییر رفرنس آبجکت‌ها
  const { startDate = '', endDate = '' } = getDates(dates) || {};
  const city = hotelOrCity?.city ?? '';
  const province = hotelOrCity?.province ?? '';
  const starString = star?.join(',') ?? '';
  const residenceTypeString = residenceType?.join(',') ?? '';
  const hotelFacilitiesString = hotelFacilities?.join(',') ?? '';
  const roomFacilitiesString = roomFacilities?.join(',') ?? '';

  const queryPassengers = useMemo(() => {
    if (!passengers?.rooms || !rooms) return '0';
    return rooms.map((item) => item.adults + item.children).toString();
  }, [passengers?.rooms, rooms]);

  // ۱. ساخت queryString فیلترها (بدون شماره صفحه)
  const queryStringWithoutPage = useMemo(() => {
    const params = new URLSearchParams();

    if (startDate && startDate !== 'undefined') params.set('start-date', startDate);
    if (endDate && endDate !== 'undefined') params.set('end-date', endDate);
    if (city) params.set('city', city);
    if (province) params.set('province', province);
    if (queryPassengers) params.set('passengers', queryPassengers);
    if (starString) params.set('star', starString);
    if (minPrice) params.set('min-price', minPrice.toString());
    if (maxPrice) params.set('max-price', maxPrice.toString());
    if (residenceTypeString) params.set('residence-type', residenceTypeString);
    if (hotelFacilitiesString) params.set('hotel-facilities', hotelFacilitiesString);
    if (roomFacilitiesString) params.set('room-facilities', roomFacilitiesString);
    if (amazingHotels === 'show') params.set('amazing-hotels', 'show');
    if (suggestedHotels === 'show') params.set('suggested-hotels', 'show');
    if (lastMinute === 'show') params.set('last-minute', 'show');

    return params.toString();
  }, [
    startDate,
    endDate,
    city,
    province,
    queryPassengers,
    starString,
    minPrice,
    maxPrice,
    residenceTypeString,
    hotelFacilitiesString,
    roomFacilitiesString,
    amazingHotels,
    suggestedHotels,
    lastMinute,
  ]);

  // ۲. فراخوانی API به صورت صفحه‌بندی پشت‌صحنه (Infinite Scroll)
  const {
    data,
    status,
    isFetching,
    isPlaceholderData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ApiResponse>({
    queryKey: ['hotel-list', queryStringWithoutPage],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams(queryStringWithoutPage);
      params.set('page', String(pageParam));
      return axiosInstance(`/hotel/hotels/best-filter/?${params.toString()}`);
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage?.data?.total_pages ?? 0;
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    placeholderData: (previousData) => previousData,
  });

  // یکپارچه‌سازی لیست همه صفحات لود شده زیر هم
  const hotels = useMemo(() => {
    if (!data?.pages) return undefined;
    return data.pages.flatMap((pageItem) => pageItem?.data?.results ?? []);
  }, [data?.pages]);

  const isPending = status === 'pending';
  const totalCount =
    (data?.pages?.[0]?.data as { count?: number } | undefined)?.count ??
    hotels?.length ??
    null;

  // ۳. آپدیت کانتکست
  useEffect(() => {
    handleSetQueryState(isPending, totalCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, totalCount]);

  // ۴. تشخیص رسیدن کاربر به پایین لیست و لود خودکار صفحه بعد
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !isPlaceholderData
        ) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isPlaceholderData, fetchNextPage]);

  return (
    <>
      <HotelListContent
        status={status}
        city={city}
        // هنگام لود صفحه بعدی لیست قبلی پرش نداشته باشد
        isFetching={isFetching && !isFetchingNextPage}
        data={hotels}
        // صفر گذاشته شد تا دکمه‌های شماره‌صفحه داخل HotelListContent مخفی شوند
        totalPages={0}
      />

      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="flex items-center justify-center gap-2 py-6 text-sm font-medium text-neutral-600"
        >
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-300" />
          </span>
          <span>
            {isFetchingNextPage
              ? 'در حال بارگذاری هتل‌های بیشتر...'
              : 'در حال نمایش نتایج بیشتر'}
          </span>
        </div>
      )}
    </>
  );
}