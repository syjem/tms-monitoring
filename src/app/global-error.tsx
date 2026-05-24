'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="grid min-h-dvh place-items-center bg-black px-6 text-white">
        <main className="w-full max-w-md space-y-5">
          <AlertTriangle className="size-8 text-white/80" />
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              This page couldn&apos;t load
            </h1>
            <p className="text-white/65">
              {error.message || 'A server error occurred. Reload to try again.'}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => unstable_retry()}
          >
            Reload
          </Button>
          {error.digest ? (
            <p className="pt-16 text-xs tracking-wider text-white/55">
              ERROR {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
