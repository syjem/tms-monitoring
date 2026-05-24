import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export async function getSession() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/sign-in');
  }

  return session as typeof session & { user: { id: string } };
}
