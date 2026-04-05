import { getUserForRender } from '@/app/actions/get-user';
import { CurrentUserAvatar } from '@/components/current-user-avatar';
import { AppLogo } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export async function Header() {
  const user = await getUserForRender();

  return (
    <header className="w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-4xl mx-auto flex justify-between items-center py-3 px-4 rounded border-b">
        <Link href="/" className="flex items-center gap-2 cursor-default">
          <AppLogo className="size-7" />
          <span className="font-medium cursor-default">
            TMS Employee Monitoring
          </span>
        </Link>
        {user ? (
          <CurrentUserAvatar user={user} />
        ) : (
          <Skeleton className="h-8 w-8 rounded-full" />
        )}
      </nav>
    </header>
  );
}
