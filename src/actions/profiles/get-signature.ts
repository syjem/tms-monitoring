'use server';

import { ERRORS } from '@/constants/errors';
import { ProfilesController } from '@/controllers/profiles.controller';
import { db } from '@/db';
import { getSession } from '@/lib/get-session';
import { withErrorHandler } from '@/utils/error-handler';

export async function getSignature() {
  const result = await withErrorHandler(async () => {
    const session = await getSession();
    const user = session?.user;

    if (!user) throw new Error(ERRORS.UNAUTHORIZED);

    const controller = new ProfilesController(db);
    const profile = await controller.getSignature(user.id);

    return profile?.signature;
  });

  return result;
}
