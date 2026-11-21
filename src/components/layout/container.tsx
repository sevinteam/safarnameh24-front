import { cn } from '@/utils';

import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const containerVariants = cva('mx-auto w-full px-4', {
  variants: {
    size: {
      default: 'max-w-7xl',
      narrow: 'max-w-4xl',
      wide: 'max-w-screen-2xl',
      full: 'max-w-none',
    },
    spacing: {
      none: '',
      page: 'mt-8 mb-24',
      section: 'py-10 md:py-14',
    },
  },
  defaultVariants: {
    size: 'default',
    spacing: 'none',
  },
});

type ContainerProps = ComponentProps<'div'> &
  VariantProps<typeof containerVariants> & {
    as?: 'div' | 'section' | 'article';
  };

// ------------------------------

export function Container({
  as: Component = 'div',
  size,
  spacing,
  className,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(containerVariants({ size, spacing }), className)}
      {...props}
    />
  );
}
