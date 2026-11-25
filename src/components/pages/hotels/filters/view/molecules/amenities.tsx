import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

import { ClearableInput } from '@/components/common/clearable-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { toggleArrayItem } from '@/utils/array';
import { cn } from '@/utils';

import {
  AMENITY_OPTIONS,
  getAmenityIcon,
  type AmenityApiItem,
} from '../../constants';

import { FilterSection } from './filter-section';

type AmenitiesFilterProps = {
  selectedAmenities: number[];
  onChange: (amenities: number[]) => void;
  amenities?: readonly AmenityApiItem[]; // Optional: pass API data when ready
};

const INITIAL_VISIBLE_COUNT = 6;

// ------------------------------

export function Amenities({
  selectedAmenities,
  onChange,
  amenities = AMENITY_OPTIONS,
}: AmenitiesFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Ensure amenities follow backend priority order
  const sortedAmenities = useMemo(() => {
    return [...amenities].sort(
      (a, b) =>
        (a.priority ?? Number.MAX_SAFE_INTEGER) -
        (b.priority ?? Number.MAX_SAFE_INTEGER),
    );
  }, [amenities]);

  // Auto-expand on mount if any collapsed amenity is already selected in URL
  const [isExpanded, setIsExpanded] = useState(() =>
    sortedAmenities
      .slice(INITIAL_VISIBLE_COUNT)
      .some((item) => selectedAmenities.includes(item.id)),
  );

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const isSearching = normalizedSearch.length > 0;

  const filteredAmenities = useMemo(() => {
    if (!isSearching) return sortedAmenities;

    return sortedAmenities.filter((item) =>
      item.label.toLowerCase().includes(normalizedSearch),
    );
  }, [isSearching, normalizedSearch, sortedAmenities]);

  const primaryItems = isSearching
    ? filteredAmenities
    : filteredAmenities.slice(0, INITIAL_VISIBLE_COUNT);

  const collapsibleItems = isSearching
    ? []
    : filteredAmenities.slice(INITIAL_VISIBLE_COUNT);

  const renderAmenityItem = (item: AmenityApiItem) => {
    const id = `filter-amenity-${item.id}`;
    const isChecked = selectedAmenities.includes(item.id);
    const Icon = getAmenityIcon(item.slug);

    return (
      <Label
        key={item.id}
        htmlFor={id}
        className="flex cursor-pointer items-center gap-3 py-2.5"
      >
        <Checkbox
          id={id}
          checked={isChecked}
          onCheckedChange={() =>
            onChange(toggleArrayItem(selectedAmenities, item.id))
          }
        />

        <span className="truncate">{item.label}</span>
        <Icon className="text-muted-foreground mr-auto size-4.5 shrink-0" />
      </Label>
    );
  };

  return (
    <FilterSection
      title="امکانات هتل"
      hasSelection={selectedAmenities.length > 0}
      onClear={() => onChange([])}
    >
      <ClearableInput
        value={searchTerm}
        startIcon={<Search />}
        onValueChange={setSearchTerm}
        aria-label="جستجو در امکانات هتل"
        placeholder="جستجو در امکانات ..."
      />

      {filteredAmenities.length === 0 ? (
        <p className="text-muted-foreground py-3 text-center text-xs font-medium">
          امکاناتی با این عنوان یافت نشد !
        </p>
      ) : (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className={cn('flex flex-col')}>
            {primaryItems.map(renderAmenityItem)}

            {collapsibleItems.length > 0 && (
              <CollapsibleContent className="flex flex-col">
                {collapsibleItems.map(renderAmenityItem)}
              </CollapsibleContent>
            )}
          </div>

          {collapsibleItems.length > 0 && (
            <CollapsibleTrigger
              render={
                <Button
                  size="xs"
                  type="button"
                  variant="ghost"
                  className="mt-3 h-8 w-full justify-between rounded-lg px-2.5"
                />
              }
            >
              <span>
                {isExpanded
                  ? 'نمایش کمتر'
                  : `مشاهده همه (${sortedAmenities.length})`}
              </span>

              <ChevronDown
                className={cn('size-4', isExpanded && 'rotate-180')}
              />
            </CollapsibleTrigger>
          )}
        </Collapsible>
      )}
    </FilterSection>
  );
}
