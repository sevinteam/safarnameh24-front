'use client';

import { usePathname } from 'next/navigation';

import Brand from '@/components/common/brand';

import { cn } from '@/utils';
import { Container } from '../../../container';
import AuthHandler from '../molecules/auth-handler';
import CombineActions from '../molecules/combine-actions';
import Menu from '../molecules/menu';
import Navbar from '../molecules/navbar';
import { checkIsStickyHeader } from '../../model/utils';
import { ThemeSwitcher } from '@/components/common/theme-switcher';

// ------------------------------

export function Header() {
  const pathname = usePathname();
  const isSticky = checkIsStickyHeader(pathname);

  return (
    <header
      className={cn(
        'bg-sidebar w-full border-b',
        isSticky &&
          'sticky inset-x-0 top-0 z-50 transition-transform duration-300 ease-in-out will-change-transform',
      )}
    >
      <Container>
        <div className="flex h-20 items-center gap-6 xl:gap-8">
          <Brand showTitle />
          <Navbar />

          <div className="flex-center mr-auto gap-2 sm:gap-3">
            <CombineActions />

            <div className="hidden lg:block">
              <ThemeSwitcher className="rounded-xl" />
            </div>

            <AuthHandler />
            <Menu />
          </div>
        </div>
      </Container>
    </header>
  );
}
