import { getUserUploadCredits } from '@/actions/get-user-upload-credits';
import { UserAvatar } from '@/components/header/user-avatar';
import { AppLogo } from '@/components/shared/logo';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export async function Header() {
  const { user, credits } = await getUserUploadCredits();

  return (
    <header className="w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-4xl mx-auto flex justify-between items-center py-3 rounded border-b">
        <Link href="/" className="flex items-center gap-2 cursor-default">
          <AppLogo className="size-8" />
          <span className="sr-only">Home</span>
        </Link>
        {user ? (
          <UserAvatar user={user} credits={credits} />
        ) : (
          <Skeleton className="h-8 w-8 rounded-full" />
        )}
      </nav>
    </header>
  );
}
