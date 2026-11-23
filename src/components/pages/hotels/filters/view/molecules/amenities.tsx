'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toggleArrayItem } from '@/utils/array';
import { cn } from '@/utils';

import { AMENITY_OPTIONS } from '../../constants';
import { FilterSection } from './filter-section';

type Props = {
  selectedAmenities: string[];
  onChange: (amenities: string[]) => void;
};

const INITIAL_VISIBLE_COUNT = 5;

// ------------------------------

export function Amenities({ selectedAmenities, onChange }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  // Auto-expand on mount if any collapsed amenity is already active in URL
  const [isExpanded, setIsExpanded] = useState(() =>
    AMENITY_OPTIONS.slice(INITIAL_VISIBLE_COUNT).some((item) =>
      selectedAmenities.includes(item.value),
    ),
  );

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const isSearching = normalizedSearch.length > 0;

  const filteredAmenities = useMemo(() => {
    if (!isSearching) return AMENITY_OPTIONS;

    return AMENITY_OPTIONS.filter((item) =>
      item.label.toLowerCase().includes(normalizedSearch),
    );
  }, [isSearching, normalizedSearch]);

  const primaryItems = isSearching
    ? filteredAmenities
    : filteredAmenities.slice(0, INITIAL_VISIBLE_COUNT);

  const collapsibleItems = isSearching
    ? []
    : filteredAmenities.slice(INITIAL_VISIBLE_COUNT);

  const renderAmenityItem = (value: string, label: string) => {
    const id = `filter-amenity-${value}`;
    const isChecked = selectedAmenities.includes(value);

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
            onChange(toggleArrayItem(selectedAmenities, value))
          }
        />
        <span>{label}</span>
      </Label>
    );
  };

  return (
    <FilterSection
      onClear={() => onChange([])}
      hasSelection={selectedAmenities.length > 0}
      title={`امکانات هتل (${AMENITY_OPTIONS.length})`}
    >
      {/* Quick local search inside amenities */}
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />

        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="جستجو در امکانات ..."
          aria-label="جستجو در امکانات هتل"
          className="h-10 px-10"
        />

        {isSearching && (
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            onClick={() => setSearchTerm('')}
            aria-label="پاک کردن جستجوی امکانات"
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {filteredAmenities.length === 0 ? (
        <p className="text-muted-foreground py-3 text-center text-sm font-medium">
          امکاناتی با این عنوان یافت نشد .
        </p>
      ) : (
        <div className="flex flex-col">
          {primaryItems.map((item) =>
            renderAmenityItem(item.value, item.label),
          )}

          {collapsibleItems.length > 0 && (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleContent className="flex flex-col gap-1.5 pt-1.5">
                {collapsibleItems.map((item) =>
                  renderAmenityItem(item.value, item.label),
                )}
              </CollapsibleContent>

              <CollapsibleTrigger
                render={
                  <Button
                    size="sm"
                    type="button"
                    variant="ghost"
                    className="text-muted-foreground mt-2 w-full justify-between text-xs"
                  />
                }
              >
                <span>{isExpanded ? 'مشاهده کمتر' : 'مشاهده بیشتر'}</span>

                <ChevronDown
                  className={cn('size-4', isExpanded && 'rotate-180')}
                />
              </CollapsibleTrigger>
            </Collapsible>
          )}
        </div>
      )}
    </FilterSection>
  );
}
