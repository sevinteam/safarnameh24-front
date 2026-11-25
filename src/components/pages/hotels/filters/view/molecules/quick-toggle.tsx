import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type QuickToggleKey = 'discount' | 'availableOnly' | 'freeCancellation';

type QuickToggleOption = {
  key: QuickToggleKey;
  label: string;
};

const QUICK_TOGGLE_OPTIONS: readonly QuickToggleOption[] = [
  {
    key: 'discount',
    label: 'اقامتگاه‌های دارای تخفیف',
  },
  {
    key: 'availableOnly',
    label: 'حذف تکمیل‌ ظرفیت‌ها',
  },
  {
    key: 'freeCancellation',
    label: 'کنسلی بدون جریمه',
  },
] as const;

type QuickToggleFiltersProps = {
  values: Record<QuickToggleKey, boolean>;
  onChange: (key: QuickToggleKey, checked: boolean) => void;
};

// ------------------------------

export function QuickToggle({ values, onChange }: QuickToggleFiltersProps) {
  return (
    <div className="border-b p-5">
      {QUICK_TOGGLE_OPTIONS.map(({ key, label }) => {
        const id = `filter-toggle-${key}`;

        return (
          <Label
            key={key}
            htmlFor={id}
            className="flex cursor-pointer items-center justify-between gap-2 py-2"
          >
            <span className="text-foreground text-sm font-medium">{label}</span>

            <Switch
              id={id}
              checked={values[key]}
              onCheckedChange={(checked) => onChange(key, checked)}
            />
          </Label>
        );
      })}
    </div>
  );
}
