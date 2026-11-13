'use client';

// import { StickySearchBar } from '../../sticky-search-bar/sticky-search-bar';

import Menu from '../molecules/menu';
import Navbar from '../molecules/navbar';

import AuthHandler from '../molecules/auth-handler';
import Brand from '@/components/common/brand';
import { Button } from '@/components/ui/button';

import { ClipboardCheck, Headphones } from 'lucide-react';
import { ThemeSwitcher } from '@/components/common/theme-switcher';

import { useSmartScrollHeader } from '@/lib/hooks/use-smart-scroll-header';

import dynamic from 'next/dynamic';

const StickySearchBar = dynamic(
  () => import('../../sticky-search-bar/sticky-search-bar'),
  {
    ssr: false,
    // loader:'',
    loading: () => null,
  },
);

// ------------------------------

export const SmartHeader: React.FC = () => {
  const { isCollapsed } = useSmartScrollHeader({
    scrollDownThreshold: 35,
    scrollUpThreshold: 15,
  });

  return (
    <header
      className={`bg-sidebar sticky inset-x-0 top-0 z-50 w-full border-b transition-transform duration-300 ease-in-out will-change-transform ${
        isCollapsed ? '-translate-y-20' : 'translate-y-0'
      }`}
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex h-20 items-center gap-6 xl:gap-8">
          <Brand showTitle />
          <Navbar />

          <div className="flex-center mr-auto gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <Button variant={'ghost'} className={'font-semibold'}>
                <ClipboardCheck />
                <span>پیگیری رزرو</span>
              </Button>

              <Button variant={'ghost'} className={'font-semibold'}>
                <Headphones />
                <span>پشتیبانی</span>
              </Button>
            </div>

            <div className="hidden lg:block">
              <ThemeSwitcher className="rounded-xl" />
            </div>

            <AuthHandler />
            <Menu />
          </div>
        </div>

        <StickySearchBar />
      </div>
    </header>
  );
};
