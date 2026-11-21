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
import { Container } from '@/components/layout/container';

// ------------------------------

export default function Home() {
  return (
    <Container className="space-y-20 lg:space-y-24" spacing={'page'}>
      <Suspense>
        <HeroSection />
      </Suspense>

      <Features />
      <TopCities />
      <RecommendedHotels />
      <DiscountedHotels />
      <TopHotels />
      <FAQ />
    </Container>
  );
}
