'use client';

import { usePathname } from 'next/navigation';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';
import TourismMagazineHeader from './TourismMagazineHeader';

// --------------------------------------------

export function Header() {
  const pathname = usePathname();
  const isTourismMagazine =
    pathname?.startsWith('/tourism-magazine') || pathname?.startsWith('/blog');

  if (isTourismMagazine) {
    return <TourismMagazineHeader />;
  }

  return (
    <>
      <MobileHeader />
      <DesktopHeader />
    </>
  );
}
