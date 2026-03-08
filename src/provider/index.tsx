'use client';

import { NetworkStatusBanner } from '@/components/network-status-banner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkStatusBanner />
      {children}
    </QueryClientProvider>
  );
}

export default AppProvider;
