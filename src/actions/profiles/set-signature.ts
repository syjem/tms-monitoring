'use server';

import { ProfilesController } from '@/controllers/profiles.controller';
import { db } from '@/db';
import { getSession } from '@/lib/get-session';
import { updateTag } from 'next/cache';
import { withErrorHandler } from '@/utils/error-handler';

export async function setSignature(data: string) {
  const result = await withErrorHandler(async () => {
    const session = await getSession();
    const user = session?.user;

    const controller = new ProfilesController(db);
    const result = await controller.setSignature(user.id, data);
    updateTag(`profile:${user.id}`);

    return result;
  });

  return result;
}
