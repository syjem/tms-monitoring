import HeroSection from '@/components/hero-section';
import HomeTabs from '@/components/home-tabs';
import { Header } from '@/components/shared/header';
import { HeaderSkeleton } from '@/components/skeletons/header';
import { BackgroundBottom } from '@/components/ui/background';
import React, { Suspense } from 'react';

export default async function Home() {
  return (
    <React.Fragment>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <main>
        <HeroSection />
        <Suspense>
          <HomeTabs />
        </Suspense>
      </main>
      <BackgroundBottom />
    </React.Fragment>
  );
}
