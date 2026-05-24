'use server';

import { ERRORS } from '@/constants/errors';
import { ProfilesController } from '@/controllers/profiles.controller';
import { db } from '@/db';
import { getSession } from '@/lib/get-session';
import { withErrorHandler } from '@/utils/error-handler';
import { cacheLife, cacheTag } from 'next/cache';

async function getProfileByUserId(userId: string) {
  'use cache';
  cacheLife('days');
  cacheTag(`profile:${userId}`);

  const controller = new ProfilesController(db);
  const profile = await controller.getProfile(userId);
  return profile;
}

export async function getProfile(userId?: string) {
  const result = await withErrorHandler(async () => {
    let resolvedUserId = userId;

    if (!resolvedUserId) {
      const session = await getSession();
      const user = session?.user;
      if (!user) throw new Error(ERRORS.UNAUTHORIZED);
      resolvedUserId = user.id;
    }

    const profile = await getProfileByUserId(resolvedUserId);

    return profile;
  });

  return result;
}
