'use client';

import { formatNumber } from '@/utils';
import { useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';

import { FilterSection } from './filter-section';
import { PRICE_RANGE_BOUNDS } from '../../constants';

type PriceRangeFilterProps = {
  minPrice: number | null;
  maxPrice: number | null;
  onCommit: (min: number | null, max: number | null) => void;
};

// ------------------------------

export function PriceRange({
  minPrice,
  maxPrice,
  onCommit,
}: PriceRangeFilterProps) {
  const { min: minBound, max: maxBound, step } = PRICE_RANGE_BOUNDS;

  const currentMin = minPrice ?? minBound;
  const currentMax = maxPrice ?? maxBound;

  // Keep local state while dragging to avoid spamming URL/API on every pixel
  const [localRange, setLocalRange] = useState<[number, number]>([
    currentMin,
    currentMax,
  ]);

  useEffect(() => {
    setLocalRange([currentMin, currentMax]);
  }, [currentMin, currentMax]);

  const hasSelection = minPrice !== null || maxPrice !== null;

  const handleSliderChange = (value: number | readonly number[]) => {
    if (!Array.isArray(value) || value.length < 2) return;
    setLocalRange([value[0], value[1]]);
  };

  const handleSliderCommit = (value: number | readonly number[]) => {
    if (!Array.isArray(value) || value.length < 2) return;

    const [nextMin, nextMax] = value;
    onCommit(
      nextMin <= minBound ? null : nextMin,
      nextMax >= maxBound ? null : nextMax,
    );
  };

  return (
    <FilterSection
      title="محدوده قیمت"
      hasSelection={hasSelection}
      onClear={() => onCommit(null, null)}
    >
      <div className="mt-2 flex flex-col gap-4">
        <Slider
          step={step}
          min={minBound}
          max={maxBound}
          value={localRange}
          onValueChange={handleSliderChange}
          onValueCommitted={handleSliderCommit}
        />

        <div className="text-muted-foreground flex items-center justify-between text-xs font-semibold">
          <span>حداقل</span>
          <span>حداکثر</span>
        </div>

        <div className="text-foreground flex h-10 justify-between gap-3 text-sm font-semibold">
          <span className="bg-secondary flex-center flex-1 rounded-lg">
            {formatNumber(localRange[0])}
          </span>

          <span className="text-muted-foreground self-center text-xs font-bold">
            تومان
          </span>

          <span className="bg-secondary flex-center flex-1 rounded-lg">
            {formatNumber(localRange[1])}
          </span>
        </div>
      </div>
    </FilterSection>
  );
}
