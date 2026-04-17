import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'Monitoring Sheet Not Found',
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-500">
          Work Log Not Found!
        </h1>{' '}
        <p className="mb-6 text-gray-600">
          The work log you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have permission to view it.
        </p>
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
