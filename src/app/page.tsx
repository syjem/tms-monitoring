import { getUser } from '@/app/actions/get-user';
import { BackgroundBottom, BackgroundTop } from '@/components/backgrounds';
import { Header } from '@/components/header';
import { HeaderSkeleton } from '@/components/skeletons/header-skeleton';
import { HeroSectionSkeleton } from '@/components/skeletons/hero-section';
import { TabsSection } from '@/components/tabs-section';
import React, { Suspense } from 'react';

export default async function Home() {
  return (
    <React.Fragment>
      <BackgroundTop />
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection />
      </Suspense>
      <Suspense>
        <TabsSection />
      </Suspense>
      <BackgroundBottom />
    </React.Fragment>
  );
}

async function HeroSection() {
  const user = await getUser();

  return (
    <div className="w-full max-w-4xl mx-auto text-center py-8 md:pt-10 px-4 sm:px-6 lg:px-8">
      <p className="font-semibold text-base text-gray-700 mb-6 font-mono">
        Welcome,{' '}
        <span className="text-primary">{user.user_metadata.full_name}~</span>
      </p>
      <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 font-sans">
        TMS Employee Monitoring
      </h1>
    </div>
  );
}
