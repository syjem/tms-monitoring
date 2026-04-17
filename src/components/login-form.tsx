'use client';

import { Google } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { emailSchema } from '@/lib/zod/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, Mail } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type EmailFormData = z.infer<typeof emailSchema>;

interface EmailStepProps {
  onSubmit: (email: string) => void;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: EmailStepProps) {
  const [error, setError] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<'google' | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const onFormSubmit = (data: EmailFormData) => {
    onSubmit(data.email);
  };

  const handleSocialLogin = async (provider: 'google') => {
    const supabase = createClient();
    setLoadingProvider(provider);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setLoadingProvider(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            disabled={isLoading}
            placeholder="me@example.com"
            className="pl-10 border-gray-400"
            {...register('email')}
          />
        </div>
      </div>
      {errors.email && (
        <p className="text-sm text-destructive">{errors.email.message}</p>
      )}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full shadow-sm cursor-pointer"
      >
        {isLoading ? (
          <React.Fragment>
            <Loader className="animate-spin ml-1" />
            Signing in...
          </React.Fragment>
        ) : (
          'Sign in'
        )}
      </Button>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-300">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or
        </span>
      </div>
      <Button
        type="button"
        disabled={loadingProvider !== null}
        variant="outline"
        className="w-full border-gray-300 shadow-sm cursor-pointer"
        onClick={() => handleSocialLogin('google')}
      >
        {loadingProvider === 'google' ? (
          <React.Fragment>
            <Loader className="animate-spin ml-1" />
            Continuing...
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Google />
            Continue with Google
          </React.Fragment>
        )}
      </Button>
      {error && (
        <div className="text-sm text-destructive text-center">{error}</div>
      )}
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:text-sky-500 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By continuing, you agree to our{' '}
        <Link href="/terms-of-service">Terms of Service</Link> and{' '}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </div>
    </form>
  );
}
