'use server';

import { ERRORS } from '@/constants/errors';
import { createClient } from '@/lib/supabase/server';
import { isTransientAuthError } from '@/utils/is-transient-auth-error';
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

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      if (isTransientAuthError(error)) throw new Error(ERRORS.NETWORK_ERROR);
      throw new Error(ERRORS.UNAUTHORIZED);
    }

    if (!data.user) throw new Error(ERRORS.UNAUTHORIZED);

    return data.user;
  } catch (error) {
    if (error instanceof Error && error.message === ERRORS.NETWORK_ERROR) {
      throw error;
    }

    if (isTransientAuthError(error)) throw new Error(ERRORS.NETWORK_ERROR);
    throw new Error(ERRORS.UNAUTHORIZED);
  }
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
