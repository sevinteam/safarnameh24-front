import { FilterSection } from './filter-section';
import { useEffect, useRef, useState } from 'react';

import { ClearableInput } from '@/components/common/clearable-input';
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
      <ClearableInput
        value={localValue}
        onClear={handleClear}
        clearLabel="پاک کردن جستجو"
        onValueChange={handleInputChange}
        aria-label="جستجو بر اساس نام هتل"
        placeholder="برای مثال : اسپیناس پالاس"
      />
    </FilterSection>
  );
}
