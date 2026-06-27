import HeroSection from '@/components/home/hero-section';
import HomeTabs from '@/components/home/home-tabs';
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
