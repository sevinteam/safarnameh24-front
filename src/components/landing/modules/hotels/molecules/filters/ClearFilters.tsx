'use client';

import {
  useDatePickerContext,
  usePassengersContext,
  useHotelOrCityContext,
} from '@/context';

import { Trash } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { DateObject } from 'react-multi-date-picker';

import persianCalendar from 'react-date-object/calendars/persian';
import persianLanguage from 'react-date-object/locales/persian_en';

type Rooms = { adults: number; children: number }[];

const dateInfo = {
  locale: persianLanguage,
  calendar: persianCalendar,
};

// ------------------------------

export function ClearFilters() {
  const router = useRouter();

  const { confirmedValue: dates } = useDatePickerContext();
  const { confirmedValue: hotelOrCity } = useHotelOrCityContext();
  const { rooms, confirmedPassengers: passengers } = usePassengersContext();

  function encodeRooms(roomList: Rooms) {
    return roomList.map((r) => `${r.adults},${r.children}`).join('-');
  }

  function handleClearFilters() {
    const startDate = dates?.[0]
      ? new DateObject(dates[0])
          .convert(dateInfo.calendar, dateInfo.locale)
          .format('YYYY-MM-DD')
      : new DateObject(dateInfo).format('YYYY-MM-DD');

    const endDate = dates?.[1]
      ? new DateObject(dates[1])
          .convert(dateInfo.calendar, dateInfo.locale)
          .format('YYYY-MM-DD')
      : new DateObject(dateInfo).add(1, 'days').format('YYYY-MM-DD');

    const params = new URLSearchParams();
    params.set('start-date', startDate);
    params.set('end-date', endDate);

    if (hotelOrCity?.city) params.set('city', hotelOrCity.city);
    if (hotelOrCity?.province) params.set('province', hotelOrCity.province);
    if (passengers?.rooms && rooms?.length) {
      params.set('passengers', encodeRooms(rooms));
    }

    router.replace(`/hotel?${params.toString()}`, {
      scroll: true,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClearFilters}
      className="bg-cs-red/10 text-cs-red text-cs75 flex-center h-10 gap-1.5 rounded-lg px-3.5 font-bold lg:h-9"
    >
      <span>حذف فیلترها</span>
      <Trash size={18} color="currentColor" className="text-cs-red" />
    </button>
  );
}