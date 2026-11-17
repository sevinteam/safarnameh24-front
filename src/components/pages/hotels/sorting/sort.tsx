'use client';

import { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { useSortQuery } from './use-sort-query';
import { SortOptionButton } from './sort-option-button';
import { SortValue } from './types';
import { SORT_OPTIONS } from './constants';
import { isValidSortValue } from './utils';

type Props = {
  className?: string;
  onSortChange?: (sort: SortValue) => void;
};

// ------------------------------

export const Sort = ({ onSortChange, className }: Props) => {
  const { activeSort, setSort } = useSortQuery({ onSortChange });

  const { primaryOptions, overflowOptions, overflowSelectItems } =
    useMemo(() => {
      const primary = SORT_OPTIONS.filter((opt) => opt.isPrimary);
      const overflow = SORT_OPTIONS.filter((opt) => !opt.isPrimary);

      // Base UI Select requires `items` on Root to resolve selected labels in SelectValue
      const items = overflow.map((opt) => ({
        value: opt.value,
        label: opt.label,
      }));

      return {
        primaryOptions: primary,
        overflowOptions: overflow,
        overflowSelectItems: items,
      };
    }, []);

  const isOverflowActive = useMemo(
    () => overflowOptions.some((opt) => opt.value === activeSort),
    [overflowOptions, activeSort],
  );

  // Base UI passes `string | null` to onValueChange
  const handleSelectChange = (value: string | null) => {
    if (!isValidSortValue(value)) return;
    setSort(value);
  };

  return (
    <div
      role="region"
      aria-label="مرتب‌سازی نتایج"
      className={cn('flex flex-wrap items-center gap-2', className)}
    >
      <span className="me-1 text-sm font-medium">مرتب‌ سازی :</span>

      {primaryOptions.map((option) => (
        <SortOptionButton
          option={option}
          key={option.label}
          onSelect={setSort}
          isActive={activeSort === option.value}
        />
      ))}

      {/* Controlled Base UI Select: `null` resets trigger back to placeholder */}
      <Select
        items={overflowSelectItems}
        onValueChange={handleSelectChange}
        value={isOverflowActive ? activeSort : null}
      >
        <SelectTrigger
          size="sm"
          className="min-w-36"
          aria-label="سایر گزینه‌های مرتب‌سازی"
        >
          <SelectValue placeholder="سایر موارد" className="text-start" />
        </SelectTrigger>

        <SelectContent
          align="start"
          className="min-w-44"
          alignItemWithTrigger={false}
        >
          <SelectGroup>
            {overflowOptions.map((option) => {
              const Icon = option.icon;

              return (
                <SelectItem key={option.value} value={option.value}>
                  <span className="flex items-center gap-2">
                    {Icon && <Icon className="size-4.5" />}
                    <span>{option.label}</span>
                  </span>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
