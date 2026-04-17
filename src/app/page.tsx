import { BackgroundBottom } from '@/components/backgrounds';
import { Header } from '@/components/header';
import { HeaderSkeleton } from '@/components/skeletons/header-skeleton';
import { TabsSection } from '@/components/tabs-section';
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
          <TabsSection />
        </Suspense>
      </main>
      <BackgroundBottom />
    </React.Fragment>
  );
}

async function HeroSection() {
  return (
    <div className="w-full max-w-4xl mx-auto text-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Employee Monitoring
        </h1>
        <p className="text-sm leading-6 text-muted-foreground md:text-base">
          Upload your daily logs PDF and simplify your monitoring process with
          an AI-powered solution.
        </p>
      </div>
    </div>
  );
}
