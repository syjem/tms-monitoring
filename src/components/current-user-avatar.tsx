'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/lib/supabase/client';
import { REDIS } from '@/lib/upstash/config';
import { cn } from '@/lib/utils';
import { User } from '@supabase/supabase-js';
import {
  FolderCheck,
  FolderLock,
  Loader,
  LogOut,
  Settings2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export function CurrentUserAvatar({
  user,
  remaining,
}: {
  user: User;
  remaining: number;
}) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const userName = user.user_metadata.full_name as string;
  const email = user.email;
  const avatarUrl = user.user_metadata.avatar_url;

  const initials = userName
    ?.split(' ')
    ?.map((word) => word[0])
    ?.join('')
    ?.toUpperCase();

  const handleSignout = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut({ scope: 'local' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const Icon = remaining > 0 ? FolderCheck : FolderLock;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={initials} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <span>{userName}</span>
            <address className="text-muted-foreground">{email}</address>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <div
            className={cn(
              'flex gap-2 items-center text-rose-500',
              remaining === 0 && 'text-rose-500/40',
            )}
          >
            <Icon className="size-4 shrink-0 text-inherit" />
            Credits
            {remaining === 0 ? (
              <span className="block ms-auto">{remaining}</span>
            ) : (
              <span className="block ms-auto">
                {remaining}/{REDIS.MONTHLY_EXTRACTION_LIMIT}
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="font-medium">
          <Link href="/settings">
            <Settings2 />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignout} className="font-medium">
          {loading ? (
            <React.Fragment>
              <Loader className="animate-spin" />
              Signing out...
            </React.Fragment>
          ) : (
            <React.Fragment>
              <LogOut />
              Sign out
            </React.Fragment>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
