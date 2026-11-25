'use client';

import type {
  ComponentProps,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react';

import { cn } from '@/utils';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

type BaseInputProps = ComponentProps<typeof Input>;

type ClearableInputProps = BaseInputProps & {
  startIcon?: ReactNode;
  clearable?: boolean;
  clearOnEscape?: boolean;
  isLoading?: boolean;
  clearLabel?: string;
  showStartIcon?: boolean;
  wrapperClassName?: string;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
};

// ------------------------------

export function ClearableInput({
  startIcon,
  showStartIcon = true,
  clearable = true,
  clearOnEscape = true,
  isLoading = false,
  clearLabel = 'پاک کردن متن',
  wrapperClassName,
  className,
  value,
  defaultValue,
  disabled,
  readOnly,
  ref,
  onChange,
  onValueChange,
  onClear,
  onKeyDown,
  ...restProps
}: ClearableInputProps) {
  const innerRef = useRef<HTMLInputElement>(null);
  const isControlled = value !== undefined;

  const [uncontrolledHasValue, setUncontrolledHasValue] = useState(() =>
    Boolean(defaultValue && String(defaultValue).length > 0),
  );

  // Merge internal ref with external React 19 ref prop
  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      innerRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  const hasValue = isControlled
    ? String(value).length > 0
    : uncontrolledHasValue;

  const showClearButton =
    clearable && hasValue && !disabled && !readOnly && !isLoading;

  const handleInputChange: BaseInputProps['onChange'] = (event) => {
    const nextValue = event.target.value;

    if (!isControlled) {
      setUncontrolledHasValue(nextValue.length > 0);
    }

    onChange?.(event);
    onValueChange?.(nextValue);
  };

  const triggerClear = useCallback(() => {
    if (disabled || readOnly) return;

    const input = innerRef.current;

    if (!isControlled) {
      setUncontrolledHasValue(false);
    }

    // If controlled with dedicated callbacks, notify parent directly
    if (isControlled && (onClear || onValueChange)) {
      onClear?.();
      onValueChange?.('');
    } else if (input) {
      // Otherwise update native value & dispatch input event (supports RHF / uncontrolled forms)
      const nativeValueSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value',
      )?.set;

      nativeValueSetter?.call(input, '');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      onClear?.();
    }

    input?.focus();
  }, [disabled, isControlled, onClear, onValueChange, readOnly]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (clearOnEscape && event.key === 'Escape' && hasValue) {
      event.preventDefault();
      triggerClear();
    }

    onKeyDown?.(event);
  };

  // Prevent input blur before click fires (keeps focus & open search popovers intact)
  const handleClearMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div className={cn('relative w-full', wrapperClassName)}>
      {showStartIcon && (
        <span
          aria-hidden="true"
          className="text-muted-foreground pointer-events-none absolute inset-s-4 top-1/2 -translate-y-1/2 [&_svg]:size-4 [&_svg]:shrink-0"
        >
          {startIcon ? startIcon : <Search />}
        </span>
      )}

      <Input
        ref={setRefs}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        defaultValue={defaultValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={cn(
          'h-10',
          showStartIcon && 'ps-10',
          (showClearButton || isLoading) && 'pe-10',
          className,
        )}
        {...restProps}
      />

      {isLoading && (
        <span
          aria-hidden="true"
          className="text-muted-foreground pointer-events-none absolute inset-e-4 top-1/2 -translate-y-1/2"
        >
          <Loader2 className="size-4 animate-spin" />
        </span>
      )}

      {showClearButton && (
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          onMouseDown={handleClearMouseDown}
          onClick={triggerClear}
          aria-label={clearLabel}
          className="text-muted-foreground hover:text-foreground absolute inset-e-3 top-1/2 -translate-y-1/2"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
