'use client';

import { Button } from '@/components/ui/button';
import { isAuthError } from '@/utils/is-auth-error';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const authError = isAuthError(error.message);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold text-red-600">
          {authError ? 'Session expired' : 'Something went wrong!'}
        </h2>
        <p className="mb-6 text-gray-600">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex gap-4 justify-center">
          {authError ? (
            <Button onClick={() => router.replace('/auth/login')}>
              Go to login
            </Button>
          ) : (
            <Button onClick={() => reset()}>Try again</Button>
          )}
          <Button variant="outline" onClick={() => router.back()}>
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
}
