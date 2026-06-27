import { handleSignIn } from '@/actions/auth/sign-in';
import { AppLogo } from '@/components/shared/logo';
import { SubmitButton } from '@/components/sign-in/submit-button';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default function SignInPage() {
  return (
    <main className="min-h-svh flex justify-center px-6 py-20 md:py-40">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="w-full flex items-center justify-center">
          <AppLogo className="size-9" />
        </div>
        <div className="text-center mb-8">
          <h1 className="doc-title text-2xl md:text-3xl text-center">
            Employee Monitoring
          </h1>
          <p className="doc-body mt-3 text-sm">
            Use your Google account to continue.
          </p>
        </div>

        <form className="mt-6" action={handleSignIn}>
          <SubmitButton />
        </form>
      </div>
    </main>
  );
}
