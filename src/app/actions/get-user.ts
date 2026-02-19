'use server';

import { ERRORS } from '@/constants/errors';
import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

/**
 * Retrieves the currently authenticated user from Supabase.
 *
 * This function validates authentication and returns user details.
 * It must be called from a server context only (marked with 'use server').
 *
 * @async
 * @returns {Promise<User>} The authenticated user object
 * @throws {Error} If authentication fails or no user is available
 *
 * @example
 * const user = await getUser();
 * console.log(user.email);
 *
 */
export async function getUser(): Promise<User> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error(ERRORS.UNAUTHORIZED);

  return data.user;
}
