'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from 'cn';

import { Headset } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';

type ButtonProps = ComponentProps<typeof Button>;

type Props = ButtonProps & {
  tooltipText?: string;
};

// ------------------------------

export function SupportArea(props: Props) {
  const {
    className,
    children,
    onClick,
    type = 'button',
    size = 'icon-lg',
    variant = 'link',
    tooltipText = 'ارتباط با پشتیبانی',
    ...restProps
  } = props;

  const handleClick: ButtonProps['onClick'] = (event) => {
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
            className={cn('rounded-full', className)}
            {...restProps}
          />
        }
      >
        {children ?? <Headset className="size-4 lg:size-5" />}
      </TooltipTrigger>

      <TooltipContent side="left">{tooltipText}</TooltipContent>
    </Tooltip>
  );
}
