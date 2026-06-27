'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { NetworkStatusBanner } from '@/provider/network-status';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkStatusBanner />
      <TooltipProvider>{children}</TooltipProvider>
    </QueryClientProvider>
  );
}

export default AppProvider;
