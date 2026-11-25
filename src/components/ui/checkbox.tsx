'use client';

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { CheckIcon } from 'lucide-react';

import { cn } from 'cn';

// ------------------------------

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base box & expanded hit area
        'peer border-input relative flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm border shadow-xs outline-none',
        'after:absolute after:-inset-x-3 after:-inset-y-2',

        // Smooth color & tactile press animations
        'transition-[background-color,border-color,box-shadow,transform] duration-200 active:scale-90',
        'motion-reduce:transition-none motion-reduce:active:scale-100',

        // Checked & dark mode states
        'dark:bg-input/30 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary',

        // Focus & invalid states
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary aria-invalid:ring-3',
        'dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',

        // Disabled & canonical Tailwind v4 Field integration (zero IntelliSense warnings)
        'group-has-disabled/field:opacity-50 disabled:cursor-not-allowed disabled:opacity-50',
        'group-has-focus-visible/field-label:not-data-checked:border-input group-has-focus-visible/field-label:data-checked:border-primary group-has-focus-visible/field-label:ring-0',

        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        keepMounted
        data-slot="checkbox-indicator"
        className={cn(
          'grid place-content-center text-current [&>svg]:size-3.5',
          'transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none',
          'data-checked:scale-100 data-checked:opacity-100 data-unchecked:scale-50 data-unchecked:opacity-0',
        )}
      >
        <CheckIcon className="stroke-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
