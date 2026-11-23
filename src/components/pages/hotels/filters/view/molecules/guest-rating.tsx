import { Label } from '@/components/ui/label';
import { FilterSection } from './filter-section';
import { GUEST_RATING_OPTIONS } from '../../constants';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type GuestRatingFilterProps = {
  value: number | null;
  onChange: (rating: number | null) => void;
};

const ALL_RATINGS_VALUE = 'all';

// ------------------------------

export function GuestRating({ value, onChange }: GuestRatingFilterProps) {
  const stringValue = value !== null ? String(value) : ALL_RATINGS_VALUE;

  const handleValueChange = (nextValue: unknown) => {
    if (typeof nextValue !== 'string') return;

    if (nextValue === ALL_RATINGS_VALUE) {
      onChange(null);
      return;
    }

    const parsed = Number(nextValue);
    if (!Number.isNaN(parsed)) {
      onChange(parsed);
    }
  };

  return (
    <FilterSection
      title="امتیاز مسافران (از ۱۰)"
      hasSelection={value !== null}
      onClear={() => onChange(null)}
    >
      <RadioGroup
        className="gap-0"
        value={stringValue}
        onValueChange={handleValueChange}
      >
        <Label
          htmlFor="filter-rating-all"
          className="flex cursor-pointer items-center gap-2.5 py-2 text-sm font-normal"
        >
          <RadioGroupItem value={ALL_RATINGS_VALUE} id="filter-rating-all" />
          <span>همه امتیازها</span>
        </Label>

        {GUEST_RATING_OPTIONS.map((option) => {
          const id = `filter-rating-${option.value}`;

          return (
            <Label
              key={option.value}
              htmlFor={id}
              className="flex cursor-pointer items-center justify-between gap-2 py-2 text-sm font-medium"
            >
              <div className="flex items-center gap-2.5">
                <RadioGroupItem value={String(option.value)} id={id} />
                <span>{option.label}</span>
              </div>

              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
                {option.badge}
              </span>
            </Label>
          );
        })}
      </RadioGroup>
    </FilterSection>
  );
}
