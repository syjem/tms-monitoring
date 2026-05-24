'use server';

import { ProfilesController } from '@/controllers/profiles.controller';
import { db } from '@/db';
import { type Signatory } from '@/db/schema/profile';
import { getSession } from '@/lib/get-session';
import { updateTag } from 'next/cache';
import { withErrorHandler } from '@/utils/error-handler';

export async function setSignatories(signatories: Signatory[]) {
  const result = await withErrorHandler(async () => {
    const session = await getSession();
    const user = session?.user;

    const controller = new ProfilesController(db);
    const result = await controller.setSignatories(user.id, signatories);
    updateTag(`profile:${user.id}`);
    return result;
  });

  return result;
}
