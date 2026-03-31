'use server';

import { ERRORS } from '@/constants/errors';
import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

export async function getUser(): Promise<User> {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (!data.user) throw new Error(ERRORS.UNAUTHORIZED);

  return data.user;
}

/**
 * Render-safe auth lookup for server components.
 *
 * Returns null on transient network issues so UI can degrade gracefully.
 */
export async function getUserForRender(): Promise<User | null> {
  try {
    return await getUser();
  } catch (error) {
    if (error instanceof Error && error.message === ERRORS.NETWORK_ERROR) {
      return null;
    }
    throw error;
  }
}
