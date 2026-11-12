import { SmartHeader } from '@/features/smart-header/header-wrapper';
import {
  FAQ,
  Features,
  TopHotels,
  TopCities,
  HeroSection,
  DiscountedHotels,
  RecommendedHotels,
} from '@/components/pages/home';

import { Suspense } from 'react';

// ------------------------------

export default function Home() {
  return (
    <div className="space-y-20 lg:space-y-24">
      {/* <SmartHeader /> */}

      <Suspense>
        <HeroSection />
      </Suspense>

      <Features />
      <TopCities />
      <RecommendedHotels />
      <DiscountedHotels />
      <TopHotels />
      <FAQ />
    </div>
  );
}
