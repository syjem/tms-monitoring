'use client';

import { handleSignOut } from '@/actions/auth/sign-out';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { FolderCheck, FolderLock, LogOut, Settings2 } from 'lucide-react';
import { User } from 'next-auth';
import Link from 'next/link';
import { useRef } from 'react';

export function UserAvatar({ user, credits }: { user: User; credits: number }) {
  const formRef = useRef<HTMLFormElement>(null);

  const userName = user.name as string;
  const email = user.email;
  const avatarUrl = user.image as string;

  const initials = userName
    ?.split(' ')
    ?.map((word) => word[0])
    ?.join('')
    ?.toUpperCase();

  const Icon = credits > 0 ? FolderCheck : FolderLock;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={initials} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="center">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <span className="doc-subtitle text-sm">{userName}</span>
            <address className="doc-caption truncate italic">{email}</address>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <div
            className={cn(
              'flex gap-2 items-center text-rose-500',
              credits === 0 && 'text-rose-500/40',
            )}
          >
            <Icon className="size-4 shrink-0 text-inherit" />
            Credits ({credits})
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="font-medium">
          <Link href="/settings">
            <Settings2 />
            Settings
          </Link>
        </DropdownMenuItem>
        <form action={handleSignOut} ref={formRef}>
          <DropdownMenuItem
            onSelect={() => formRef.current?.requestSubmit()}
            className="font-medium"
          >
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
