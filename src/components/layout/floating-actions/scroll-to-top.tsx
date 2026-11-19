'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from 'cn';

import { ArrowUp } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';

type ButtonProps = ComponentProps<typeof Button>;

type Props = ButtonProps & {
  tooltipText?: string;
};

// ------------------------------

export function ScrollToTop(props: Props) {
  const {
    className,
    children,
    onClick,
    type = 'button',
    size = 'icon-lg',
    variant = 'outline',
    tooltipText = 'بازگشت به بالای صفحه',
    ...restProps
  } = props;

  const handleClick: ButtonProps['onClick'] = (event) => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    // Preserve external onClick handler if passed from parent
    onClick?.(event);
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type={type}
            size={size}
            variant={variant}
            onClick={handleClick}
            aria-label={tooltipText}
            className={cn(className)}
            {...restProps}
          />
        }
      >
        {children ?? <ArrowUp className="size-4 lg:size-5" />}
      </TooltipTrigger>

      <TooltipContent side="left">{tooltipText}</TooltipContent>
    </Tooltip>
  );
}
