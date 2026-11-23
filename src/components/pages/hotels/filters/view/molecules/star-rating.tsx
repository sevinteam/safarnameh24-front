import { Star } from 'lucide-react';
import { STAR_OPTIONS } from '../../constants';
import { FilterSection } from './filter-section';

import { Label } from '@/components/ui/label';
import { toggleArrayItem } from '@/utils/array';
import { Checkbox } from '@/components/ui/checkbox';

type StarRatingFilterProps = {
  selectedStars: number[];
  onChange: (stars: number[]) => void;
};

// ------------------------------

export function StarRating({ selectedStars, onChange }: StarRatingFilterProps) {
  return (
    <FilterSection
      title="ستاره هتل"
      onClear={() => onChange([])}
      hasSelection={selectedStars.length > 0}
    >
      <div className="flex flex-col">
        {STAR_OPTIONS.map(({ value, label, count }) => {
          const isChecked = selectedStars.includes(value);
          const id = `filter-star-${value}`;

          return (
            <Label
              key={value}
              htmlFor={id}
              className="text-foreground flex cursor-pointer items-center gap-3 py-2 text-sm"
            >
              <Checkbox
                id={id}
                checked={isChecked}
                onCheckedChange={() =>
                  onChange(toggleArrayItem(selectedStars, value))
                }
              />

              <span>{label}</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: value }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="size-4 fill-amber-500 text-amber-500"
                  />
                ))}
              </div>

              {count !== undefined && (
                <span className="text-muted-foreground mr-auto text-xs font-medium">
                  ({count})
                </span>
              )}
            </Label>
          );
        })}
      </div>
    </FilterSection>
  );
}
