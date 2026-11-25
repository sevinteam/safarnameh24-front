'use client';

import {
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { useMemo, useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import { IoChevronDown, IoChevronUp, IoClose } from 'react-icons/io5';

import FacilitiesItem from './FacilitiesItem';
import { useQuery } from '@tanstack/react-query';
import { generalInstance } from '@/utils/services';

type Facility = {
  id: number;
  title: string;
  icon?: { link?: string | null } | null;
};

type ApiResponse = {
  data: Facility[];
};

const INITIAL_VISIBLE_COUNT = 5;

// ------------------------------

export function RoomFacilities() {
  const [input, setInput] = useState('');
  const [showAll, setShowAll] = useState(false);

  const { data, isLoading } = useQuery<ApiResponse | Facility[]>({
    queryKey: ['room-facilities'],
    queryFn: () => generalInstance('hotel/hotels/room-facilities'),
  });

  // استخراج آرایه با اطمینان از هر دو ساختار ممکن (چه data.data باشد و چه مستقیماً خود data)
  const facilities: Facility[] = useMemo(() => {
    if (Array.isArray((data as ApiResponse)?.data)) {
      return (data as ApiResponse).data;
    }
    if (Array.isArray(data)) {
      return data as Facility[];
    }
    return [];
  }, [data]);

  const filteredFacilities = useMemo(() => {
    const keyword = input.trim().toLowerCase();
    if (!keyword) return facilities;
    return facilities.filter((item) =>
      item?.title?.toLowerCase().includes(keyword),
    );
  }, [facilities, input]);

  // اگر در حال لود است یا هیچ آیتمی از سرور نیامده، کل فیلتر مخفی شود
  if (isLoading || facilities.length === 0) {
    return null;
  }

  const isSearching = input.trim().length > 0;
  const hasMore = !isSearching && filteredFacilities.length > INITIAL_VISIBLE_COUNT;
  const visibleFacilities =
    isSearching || showAll
      ? filteredFacilities
      : filteredFacilities.slice(0, INITIAL_VISIBLE_COUNT);

  return (
    <AccordionItem value="room-facilities" className="px-5">
      <AccordionTrigger className="text-[0.9rem] font-bold text-zinc-900">
        امکانات اتاق
      </AccordionTrigger>

      <AccordionContent className="pb-4">
        {/* === Search === */}
        <div className="rounded-cs-10 mb-3 flex h-10 items-center bg-zinc-100/80">
          <div className="flex-center w-11 shrink-0">
            <LuSearch color="#999" size={18} />
          </div>

          <input
            type="text"
            value={input}
            placeholder="جستجوی امکانات ..."
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent pl-3 text-[0.8rem] text-zinc-800 outline-none placeholder:font-medium placeholder:text-zinc-400"
          />

          {input && (
            <button
              type="button"
              onClick={() => setInput('')}
              className="flex-center pl-3 text-zinc-400 hover:text-zinc-600"
              aria-label="پاک کردن جستجو"
            >
              <IoClose size={16} />
            </button>
          )}
        </div>

        {/* === List === */}
        <div className="-mx-5">
          {visibleFacilities.length > 0 ? (
            visibleFacilities.map((item) => (
              <FacilitiesItem key={item.id} {...item} type="room" />
            ))
          ) : (
            <p className="px-5 py-3 text-center text-xs text-zinc-400">
              امکاناتی با این عنوان یافت نشد
            </p>
          )}
        </div>

        {/* === دکمه موارد بیشتر / نمایش کمتر === */}
        {hasMore && (
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="text-cs-blue hover:text-cs-dark-blue mt-2 flex items-center gap-1.5 text-xs font-bold transition-colors"
          >
            <span>
              {showAll
                ? 'نمایش کمتر'
                : `موارد بیشتر (${filteredFacilities.length - INITIAL_VISIBLE_COUNT})`}
            </span>
            {showAll ? <IoChevronUp size={14} /> : <IoChevronDown size={14} />}
          </button>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}