'use client';

import { Google } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';
import React from 'react';
import { useFormStatus } from 'react-dom';

export function SignInSubmitButton() {
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
          <Loader className="size-4 animate-spin" />
          Signing in...
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Google />
          Sign in with Google
        </React.Fragment>
      )}
    </Button>
  );
}
