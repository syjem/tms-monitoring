'use client';

import { Button } from '@/components/ui/button';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { useRouter } from 'next/navigation';

export function NetworkStatusBanner() {
  const router = useRouter();
  const { status } = useNetworkStatus();

  if (status === 'online') return null;

  const isOffline = status === 'offline';
  const message = isOffline
    ? 'You are offline. Some features may not work until your connection returns.'
    : 'Your connection looks unstable. Requests might fail occasionally.';

  return (
    <div className="sticky top-0 z-5 w-full border-b border-amber-300 bg-amber-50 text-amber-900">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <p className="text-sm font-medium">{message}</p>
        <Button
          size="sm"
          variant="outline"
          className="border-amber-400 bg-amber-100 text-amber-900 hover:bg-amber-200"
          onClick={() => router.refresh()}
        >
          Retry
        </Button>
      </div>
    </div>
  );
}
