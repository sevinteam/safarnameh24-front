import { cn } from '@/utils';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  title: string;
  className?: string;
  children: ReactNode;
  onClear?: () => void;
  hasSelection?: boolean;
};

// ------------------------------

export function FilterSection(props: Props) {
  const { title, onClear, children, className, hasSelection = false } = props;

  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-b p-5 last:border-b-0',
        className,
      )}
    >
      <div className="flex h-6 items-center justify-between">
        <span className="text-foreground text-sm font-semibold">{title}</span>

        {hasSelection && onClear && (
          <Button
            size="xs"
            type="button"
            onClick={onClear}
            variant="destructive"
          >
            پاک کردن
          </Button>
        )}
      </div>

      {children}
    </div>
  );
}
