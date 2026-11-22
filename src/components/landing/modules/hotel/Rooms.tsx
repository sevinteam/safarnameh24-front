'use client';

import { Room } from '@/types/landing';
import { usePathname, useRouter } from 'next/navigation';

import { axiosInstance } from '@/utils/axios';
import { Section } from './molecules/Section';
import { useQuery } from '@tanstack/react-query';

import { DateObject } from 'react-multi-date-picker';
import { useEffect, useMemo, useState } from 'react';
import { RoomsContent } from './molecules/rooms/RoomsContent';

import persianCalendar from 'react-date-object/calendars/persian';
import persianLanguage from 'react-date-object/locales/persian_en';
import { useDatePickerContext } from '@/context';

type Props = { hotelSlug: string };

const dateInfo = {
  calendar: persianCalendar,
  locale: persianLanguage,
};

const buildQueryString = (options: {
  endDate: string;
  startDate: string;
  passengers: string;
}) => {
  return `start-date=${options.startDate}&end-date=${options.endDate}&passengers=${options.passengers}`;
};

export function Rooms({ hotelSlug }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { confirmedValue: dates } = useDatePickerContext();

  const [queryOptions, setQueryOptions] = useState({
    endDate: '',
    startDate: '',
    passengers: '0',
  });

  const queryString = useMemo(
    () => buildQueryString(queryOptions),
    [queryOptions],
  );

  const { data, status } = useQuery<{ data: Room[] }>({
    queryKey: ['hotel-rooms', hotelSlug, queryString],
    enabled: Boolean(queryOptions.startDate && queryOptions.endDate),
    queryFn: () =>
      axiosInstance(`/hotel/hotels/${hotelSlug}/rooms?${queryString}`),
  });

  useEffect(() => {
    const startDate =
      dates?.[0]
        ?.convert(dateInfo.calendar, dateInfo.locale)
        .format('YYYY-MM-DD') || new DateObject(dateInfo).format('YYYY-MM-DD');

    const endDate =
      dates?.[1]
        ?.convert(dateInfo.calendar, dateInfo.locale)
        .format('YYYY-MM-DD') ||
      new DateObject(dateInfo).add(1, 'days').format('YYYY-MM-DD');

    // همیشه مسافران برابر با 0 ارسال می‌شود تا فیلتر ظرفیت اعمال نشود و همه اتاق‌ها نمایش یابند
    setQueryOptions({
      endDate,
      startDate,
      passengers: '0',
    });

    // مسیر فعلی (شامل شهر و اسلاگ هتل) حفظ می‌شود و فقط تاریخ در URL آپدیت می‌شود
    if (pathname) {
      router.replace(
        `${pathname}?start-date=${startDate}&end-date=${endDate}`,
        { scroll: false },
      );
    }
  }, [dates, router, pathname]);

  return (
    <Section sectionID="rooms">
      <RoomsContent data={data?.data} status={status} />
    </Section>
  );
}