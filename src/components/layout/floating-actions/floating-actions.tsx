'use client';

import { cn } from '@/utils';

import { PhoneCall } from 'lucide-react';
import { SupportArea } from './support-area';
import { ScrollToTop } from './/scroll-to-top';

import { useSmartScrollHeader } from '@/hooks/use-smart-scroll-header';

type Props = {
  className?: string;
};

// ------------------------------

export const FloatingActions = ({ className }: Props) => {
  const { isCollapsed } = useSmartScrollHeader({
    scrollDownThreshold: 35,
    scrollUpThreshold: 15,
  });

  return (
    <aside
      aria-label="دسترسی سریع"
      className={cn(
        'bg-background/50 fixed bottom-4 z-40 grid gap-2 rounded-full border p-2 backdrop-blur-lg lg:bottom-6',
        'transition-all duration-300 ease-in-out',
        isCollapsed
          ? 'invisible -right-20 opacity-0'
          : 'visible right-4 opacity-100 lg:right-6',
        className,
      )}
    >
      <SupportArea
        variant={'default'}
        tooltipText="تماس با ما"
        className={
          'bg-emerald-600 text-white hover:bg-emerald-500/90 lg:size-11'
        }
      >
        <PhoneCall />
      </SupportArea>

      <SupportArea className={'text-white lg:size-11'} />
      <ScrollToTop variant={'default'} className={'rounded-full lg:size-11'} />
    </aside>
  );
};
