import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FilterSection } from './filter-section';
import { useEffect, useRef, useState } from 'react';

import { useDebouncedCallback } from '@/hooks/use-debounced-callback';

type HotelSearchFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

// ------------------------------

export function HotelSearch({ value, onChange }: HotelSearchFilterProps) {
  const [localValue, setLocalValue] = useState(value);
  const lastCommittedRef = useRef(value);

  const { debouncedFn: debouncedCommit, cancel } = useDebouncedCallback(
    (nextValue: string) => {
      const normalized = nextValue.trim();
      lastCommittedRef.current = normalized;
      onChange(normalized);
    },
    350,
  );

  // Sync input only when URL changes externally (e.g. Reset All or Browser Back)
  useEffect(() => {
    if (value !== lastCommittedRef.current) {
      cancel();
      setLocalValue(value);
      lastCommittedRef.current = value;
    }
  }, [value, cancel]);

  const handleInputChange = (nextValue: string) => {
    setLocalValue(nextValue);
    debouncedCommit(nextValue);
  };

  const handleClear = () => {
    cancel();
    setLocalValue('');
    lastCommittedRef.current = '';
    onChange('');
  };

  return (
    <FilterSection title="جستجوی نام هتل">
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />

        <Input
          type="text"
          className="h-10 px-10"
          value={localValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="برای مثال : اسپیناس پالاس"
          aria-label="جستجو بر اساس نام هتل"
        />

        {localValue.length > 0 && (
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            onClick={handleClear}
            aria-label="پاک کردن جستجو"
            className="text-muted-foreground hover:text-foreground absolute top-1/2 left-3 -translate-y-1/2"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    </FilterSection>
  );
}
