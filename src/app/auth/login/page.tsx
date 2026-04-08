'use client';

import { signInWithEmail } from '@/app/actions/auth/sign-in-with-email';
import { AppLogo } from '@/components/icons';
import { LoginForm } from '@/components/login-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

export type AuthStep = 'email' | 'email-sent';

export default function Page() {
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (submittedEmail: string) => {
    try {
      setEmail(submittedEmail);
      setIsLoading(true);

      const { success, error } = await signInWithEmail(submittedEmail);

      if (!success) {
        toast.error(
          error?.message || 'Failed to send login link. Please try again.',
        );
        return;
      }

      toast.success('Check your email for the login link!');
      setStep('email-sent');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('email');
  };

  return (
    <main className="min-h-svh flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        {step === 'email' && (
          <>
            <div className="text-center mb-8 space-y-4">
              <div className="w-full flex items-center justify-center">
                <AppLogo className="size-10" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-center">
                {step === 'email' && (
                  <React.Fragment>Employee Monitoring</React.Fragment>
                )}
              </h1>
            </div>
            <LoginForm onSubmit={handleEmailSubmit} isLoading={isLoading} />
          </>
        )}
        {step === 'email-sent' && (
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Check your email
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm">
                    We sent a magic link to{' '}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="w-full" onClick={handleBack}>
                Use a different email
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
  );
}
