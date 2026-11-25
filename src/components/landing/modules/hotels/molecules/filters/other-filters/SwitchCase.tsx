'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useQueryState, parseAsStringEnum } from 'nuqs';

const parseAsShowToggle = parseAsStringEnum(['show', 'hide']).withDefault(
  'hide',
);

type Props = {
  id: string;
  title: string;
  labelClassName?: string;
};

// -------------------------

export default function SwitchCase(props: Props) {
  const { id, title, labelClassName } = props;

  const [state, setState] = useQueryState(id, parseAsShowToggle);
  const isActive = state === 'show';

  return (
    <div className="flex-between cursor-pointer select-none">
      <Label
        htmlFor={id}
        className={`flex min-h-7 flex-1 cursor-pointer items-center text-[0.8rem] font-bold ${
          labelClassName ?? 'text-zinc-700'
        }`}
      >
        {title}
      </Label>

      <Switch
        dir="ltr"
        id={id}
        checked={isActive}
        onCheckedChange={(checked) => setState(checked ? 'show' : null)}
      />
    </div>
  );
}