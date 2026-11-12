'use client';

import { cn } from 'cn';

import SubmitButton from './submit-button';
import { DatePicker } from '@/features/date-picker';

import DestinationSearch from '@/features/destination-search/view/organisms/destination-search';

// ------------------------------

export default function HeroSearch() {
  return (
    <div
      className={cn(
        'relative z-10 grid w-full gap-6 px-4 py-8 sm:rounded-4xl sm:p-8',
        'bg-sidebar mx-auto shadow-xl/5',
        'sm:-mt-28 sm:max-lg:max-w-10/12 lg:mx-auto lg:-mt-16 lg:max-w-[95%] lg:grid-cols-[1fr_1.4fr_auto] lg:items-center lg:gap-4 xl:max-w-10/12 xl:rounded-[1.5rem]',
      )}
    >
      <DestinationSearch />
      <DatePicker />

      <SubmitButton />
    </div>
  );
}
