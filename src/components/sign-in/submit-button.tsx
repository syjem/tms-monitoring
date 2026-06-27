'use client';

import { Google } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="outline"
      className={cn('w-full', pending && 'animate-pulse')}
      disabled={pending}
    >
      {pending ? (
        <React.Fragment>
          <Loader2 className="size-4 animate-spin" />
          Signing in...
        </React.Fragment>
      ) : (
        <span className="flex gap-4 items-center">
          <Google />
          Sign in with Google
        </span>
      )}
    </Button>
  );
}
