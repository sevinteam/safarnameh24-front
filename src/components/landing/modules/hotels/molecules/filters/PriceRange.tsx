'use client';

import {
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useQueryState, parseAsInteger } from 'nuqs';

import { numberSeparation } from '@/utils';
import { axiosInstance } from '@/utils/axios';
import { getDates } from '../../helpers/hotel-list';
import { useDatePickerContext, usePassengersContext } from '@/context';

type ApiResponse = {
  data: {
    min_price: number;
    max_price: number;
  };
};

const PRICE_STEP = 100_000;

function formatMaxMillionLabel(price: number) {
  if (!price || price <= 0) return null;
  if (price >= 1_000_000) {
    const millions = Math.round((price / 1_000_000) * 10) / 10;
    return {
      amount: `+ ${millions.toLocaleString('fa-IR')}`,
      unit: 'میلیون تومان',
    };
  }
  return {
    amount: `+ ${numberSeparation(price)}`,
    unit: 'تومان',
  };
}

// -------------------------------------

export function PriceRange() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const { confirmedValue: dates } = useDatePickerContext();
  const { rooms, confirmedPassengers: passengers } = usePassengersContext();

  const { startDate = '', endDate = '' } = getDates(dates) || {};

  const queryPassengers = useMemo(() => {
    if (!passengers?.rooms || !rooms?.length) return '0';
    return rooms.map((item) => item.adults + item.children).toString();
  }, [passengers?.rooms, rooms]);

  // ساخت امن کوئری‌استرینگ (جلوگیری از ارسال start-date=undefined و خطای 400)
  const priceRangeQueryString = useMemo(() => {
    const params = new URLSearchParams();
    if (startDate && startDate !== 'undefined') {
      params.set('start-date', startDate);
    }
    if (endDate && endDate !== 'undefined') {
      params.set('end-date', endDate);
    }
    params.set('passengers', queryPassengers || '0');
    return params.toString();
  }, [startDate, endDate, queryPassengers]);

  const { data } = useQuery<ApiResponse>({
    queryKey: ['hotel-price-range', priceRangeQueryString],
    queryFn: () =>
      axiosInstance(`/hotel/hotels/price-range?${priceRangeQueryString}`),
  });

  const [minPrice, setMinPrice] = useQueryState(
    'min-price',
    parseAsInteger.withDefault(0),
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    'max-price',
    parseAsInteger.withDefault(0),
  );

  const [localRange, setLocalRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);
  const latestRangeRef = useRef<[number, number]>(localRange);
  latestRangeRef.current = localRange;

  const apiMin = data?.data?.min_price ?? 0;
  const apiMax = data?.data?.max_price ?? 0;
  const safeMax = apiMax > apiMin ? apiMax : apiMin + PRICE_STEP;

  useEffect(() => {
    if (!data?.data) return;

    const nextMin =
      minPrice > 0 ? Math.max(apiMin, Math.min(minPrice, apiMax)) : apiMin;
    const nextMax =
      maxPrice > 0 ? Math.min(apiMax, Math.max(maxPrice, nextMin)) : apiMax;

    setLocalRange([nextMin, nextMax]);
  }, [data, apiMin, apiMax, minPrice, maxPrice]);

  const getValueFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return apiMin;

      const rect = track.getBoundingClientRect();
      if (rect.width <= 0) return apiMin;

      const rawRatio = (rect.right - clientX) / rect.width;
      const clampedRatio = Math.min(1, Math.max(0, rawRatio));

      if (clampedRatio <= 0.01) return apiMin;
      if (clampedRatio >= 0.99) return apiMax;

      const rawValue = apiMin + clampedRatio * (safeMax - apiMin);
      const snapped =
        Math.round((rawValue - apiMin) / PRICE_STEP) * PRICE_STEP + apiMin;

      return Math.min(apiMax, Math.max(apiMin, snapped));
    },
    [apiMin, apiMax, safeMax],
  );

  const startDrag = useCallback(
    (thumb: 'min' | 'max') => {
      const handleMove = (e: PointerEvent) => {
        const val = getValueFromClientX(e.clientX);
        setLocalRange((prev) => {
          if (thumb === 'min') {
            const clampedMin = Math.min(val, prev[1]);
            const next: [number, number] = [clampedMin, prev[1]];
            latestRangeRef.current = next;
            return next;
          } else {
            const clampedMax = Math.max(val, prev[0]);
            const next: [number, number] = [prev[0], clampedMax];
            latestRangeRef.current = next;
            return next;
          }
        });
      };

      const handleUp = () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
        window.removeEventListener('pointercancel', handleUp);

        const [finalMin, finalMax] = latestRangeRef.current;
        setMinPrice(finalMin);
        setMaxPrice(finalMax);
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
      window.addEventListener('pointercancel', handleUp);
    },
    [getValueFromClientX, setMinPrice, setMaxPrice],
  );

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const val = getValueFromClientX(e.clientX);
    const [curMin, curMax] = latestRangeRef.current;
    const distToMin = Math.abs(val - curMin);
    const distToMax = Math.abs(val - curMax);
    const activeThumb = distToMin <= distToMax ? 'min' : 'max';

    setLocalRange((prev) => {
      const next: [number, number] =
        activeThumb === 'min'
          ? [Math.min(val, prev[1]), prev[1]]
          : [prev[0], Math.max(val, prev[0])];
      latestRangeRef.current = next;
      return next;
    });

    startDrag(activeThumb);
  };

  const minPct =
    safeMax > apiMin
      ? Math.min(100, Math.max(0, ((localRange[0] - apiMin) / (safeMax - apiMin)) * 100))
      : 0;

  const maxPct =
    safeMax > apiMin
      ? Math.min(100, Math.max(0, ((localRange[1] - apiMin) / (safeMax - apiMin)) * 100))
      : 100;

  const ratio = maxPct / 100;
  const tooltipAlignClass =
    ratio > 0.72
      ? 'left-0'
      : ratio < 0.28
        ? 'right-0'
        : 'left-1/2 -translate-x-1/2';

  const arrowAlignClass =
    ratio > 0.72
      ? 'left-3.5'
      : ratio < 0.28
        ? 'right-3.5'
        : 'left-1/2 -translate-x-1/2';

  const maxLabel = useMemo(() => formatMaxMillionLabel(apiMax), [apiMax]);

  return (
    <AccordionItem value="price-range" className="px-5">
      <AccordionTrigger className="text-[0.9rem] font-bold text-zinc-900">
        رنج قیمتی هتل
      </AccordionTrigger>

      <AccordionContent className="pt-10 pb-5">
        {data?.data ? (
          <>
            <div className="px-2.5">
              <div
                ref={trackRef}
                onPointerDown={handleTrackPointerDown}
                className="relative h-1.5 w-full cursor-pointer touch-none select-none rounded-full bg-zinc-200"
              >
                <div
                  className="pointer-events-none absolute inset-y-0 rounded-full bg-red-600"
                  style={{
                    right: `${minPct}%`,
                    left: `${100 - maxPct}%`,
                  }}
                />

                <div
                  role="slider"
                  aria-label="حداقل قیمت"
                  aria-valuemin={apiMin}
                  aria-valuemax={apiMax}
                  aria-valuenow={localRange[0]}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    startDrag('min');
                  }}
                  style={{ right: `${minPct}%` }}
                  className="absolute top-1/2 z-10 flex h-5 w-5 translate-x-1/2 -translate-y-1/2 cursor-grab touch-none items-center justify-center rounded-full bg-red-500/20 outline-none active:cursor-grabbing"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                </div>

                <div
                  role="slider"
                  aria-label="حداکثر قیمت"
                  aria-valuemin={apiMin}
                  aria-valuemax={apiMax}
                  aria-valuenow={localRange[1]}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    startDrag('max');
                  }}
                  style={{ right: `${maxPct}%` }}
                  className="absolute top-1/2 z-20 flex h-5 w-5 translate-x-1/2 -translate-y-1/2 cursor-grab touch-none items-center justify-center outline-none active:cursor-grabbing"
                >
                  <div
                    className={`pointer-events-none absolute bottom-full mb-1 flex items-center justify-center whitespace-nowrap rounded-xl bg-red-50 px-3 py-1 text-[11px] font-bold text-red-600 shadow-sm ${tooltipAlignClass}`}
                  >
                    {localRange[1] ? numberSeparation(localRange[1]) : '۰'}{' '}
                    تومان
                    <span
                      className={`absolute -bottom-1 h-2 w-2 rotate-45 bg-red-50 ${arrowAlignClass}`}
                    />
                  </div>

                  <svg
                    viewBox="0 0 16 14"
                    className="mt-7 h-3 w-3.5 text-red-600"
                    fill="currentColor"
                  >
                    <path d="M6.268 1.5c.77-1.333 2.694-1.333 3.464 0l4.866 8.428c.77 1.333-.192 3.001-1.732 3.001H3.134c-1.54 0-2.502-1.668-1.732-3.001L6.268 1.5z" />
                  </svg>
                </div>
              </div>
            </div>

            {maxLabel && (
              <div className="mt-3 flex justify-start text-right">
                <div className="flex flex-col text-[11px] leading-4">
                  <span className="font-bold text-zinc-800">
                    {maxLabel.amount}
                  </span>
                  <span className="font-medium text-zinc-600">
                    {maxLabel.unit}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-1.5">
              <div className="flex h-11 items-center justify-center gap-1 rounded-xl bg-zinc-100 px-1 text-[9.5px] font-bold text-zinc-800 overflow-hidden">
                <span className="flex-shrink-0">حداقل:</span>
                <span className="truncate">
                  {localRange[0] ? numberSeparation(localRange[0]) : '۰'}
                </span>
                <span className="flex-shrink-0">تومان</span>
              </div>
              <div className="flex h-11 items-center justify-center gap-1 rounded-xl bg-zinc-100 px-1 text-[9.5px] font-bold text-zinc-800 overflow-hidden">
                <span className="flex-shrink-0">حداکثر:</span>
                <span className="truncate">
                  {localRange[1] ? numberSeparation(localRange[1]) : '۰'}
                </span>
                <span className="flex-shrink-0">تومان</span>
              </div>
            </div>
          </>
        ) : (
          <div className="h-28 w-full animate-pulse rounded-xl bg-zinc-100" />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}