import { Header } from '@/components/shared/header';
import { HeaderSkeleton } from '@/components/skeletons/header';
import { BackgroundBottom } from '@/components/ui/background';
import React, { Suspense } from 'react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      {children}
      <BackgroundBottom />
    </React.Fragment>
  );
}
