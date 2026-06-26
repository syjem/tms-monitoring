import HeroSection from '@/components/hero-section';
import HomeTabs from '@/components/home-tabs';
import HomeTabsSkeleton from '@/components/skeletons/home-tabs';
import { Suspense } from 'react';

export default async function Home() {
  return (
    <main>
      <HeroSection />
      <Suspense fallback={<HomeTabsSkeleton />}>
        <HomeTabs />
      </Suspense>
    </main>
  );
}
