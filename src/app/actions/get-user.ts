'use server';

import { ERRORS } from '@/constants/errors';
import { createClient } from '@/lib/supabase/server';
import { checkMonthlyExtractionQuota } from '@/lib/upstash/utils';
import type { User } from '@supabase/supabase-js';

export async function getUser(): Promise<User> {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (!data.user) throw new Error(ERRORS.UNAUTHORIZED);

  return data.user;
}

export async function getUserForHeader(): Promise<{
  user: User;
  remaining: number;
} | null> {
  try {
    const user = await getUser();
    const { remaining } = await checkMonthlyExtractionQuota(user.id);
    return {
      user,
      remaining,
    };
  } catch (error) {
    if (error instanceof Error && error.message === ERRORS.NETWORK_ERROR) {
      return null;
    }
    throw error;
  }
}
