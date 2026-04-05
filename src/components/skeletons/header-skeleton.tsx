import { AppLogo } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';

export function HeaderSkeleton() {
  return (
    <header className="w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-4xl mx-auto flex justify-between items-center py-3 px-4 rounded border-b">
        <div className="flex items-center gap-2">
          <AppLogo className="size-7" />
          <span className="font-medium">TMS Employee Monitoring</span>
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </nav>
    </header>
  );
}
