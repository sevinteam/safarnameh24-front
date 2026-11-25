import { Label } from '@/components/ui/label';
import { toggleArrayItem } from '@/utils/array';

import { FilterSection } from './filter-section';
import { Checkbox } from '@/components/ui/checkbox';
import { PROPERTY_TYPE_OPTIONS } from '../../constants';

type Props = {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
};

// ------------------------------

export function PropertyType({ selectedTypes, onChange }: Props) {
  return (
    <FilterSection
      title="نوع اقامتگاه"
      hasSelection={selectedTypes.length > 0}
      onClear={() => onChange([])}
    >
      <div className="flex flex-col">
        {PROPERTY_TYPE_OPTIONS.map(({ value, label, count, icon }) => {
          const isChecked = selectedTypes.includes(value);
          const id = `filter-type-${value}`;
          const Icon = icon;

          return (
            <Label
              key={value}
              htmlFor={id}
              className="text-foreground flex cursor-pointer items-center gap-3 py-2.5 text-sm"
            >
              <Checkbox
                id={id}
                checked={isChecked}
                onCheckedChange={() =>
                  onChange(toggleArrayItem(selectedTypes, value))
                }
              />
              <span>{label}</span>

              {count !== undefined && (
                <span className="text-muted-foreground mr-auto text-xs">
                  ({count})
                </span>
              )}

              <Icon className="text-muted-foreground mr-auto size-4.5 shrink-0" />
            </Label>
          );
        })}
      </div>
    </FilterSection>
  );
}
