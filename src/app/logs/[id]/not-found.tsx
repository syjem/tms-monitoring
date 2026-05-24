import { Button } from '@/components/ui/button';
import { FileExclamationPoint } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Logs Not Found',
};

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-black px-6 text-white">
      <div className="w-full max-w-md space-y-5">
        <FileExclamationPoint className="size-8 text-white/80" />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Logs Not Found!
          </h1>
          <p className="text-white/65">
            The logs you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have permission to view it.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/">Back to home</Link>
        </Button>

        <p className="pt-16 text-xs tracking-wider text-white/55">ERROR 404</p>
      </div>
    </main>
  );
}
