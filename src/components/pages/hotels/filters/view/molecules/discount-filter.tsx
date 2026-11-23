import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type DiscountFilterProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

// ------------------------------

export function DiscountFilter({ checked, onChange }: DiscountFilterProps) {
  return (
    <div className="space-y-5">
      <Label
        htmlFor="filter-discount-only"
        className="flex cursor-pointer items-center gap-2"
      >
        <span className="text-foreground text-sm font-semibold">
          اقامتگاه‌های دارای تخفیف
        </span>

        <Switch
          checked={checked}
          className={'mr-auto'}
          id="filter-discount-only"
          onCheckedChange={onChange}
        />
      </Label>

      <Label
        htmlFor="filter-discount-only"
        className="flex cursor-pointer items-center gap-2"
      >
        <span className="text-foreground text-sm font-semibold">
          حذف تکمیل ظرفیت ها
        </span>

        <Switch
          checked={checked}
          className={'mr-auto'}
          id="filter-discount-only"
          onCheckedChange={onChange}
        />
      </Label>
    </div>
  );
}
