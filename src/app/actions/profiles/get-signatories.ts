'use server';

import { getUser } from '@/app/actions/get-user';
import { ProfilesController } from '@/lib/controller/profiles.controller';
import { db } from '@/lib/supabase';
import { withErrorHandler } from '@/utils/with-error-handler';

export async function getSignatories() {
  const result = await withErrorHandler(async () => {
    const user = await getUser();

    const controller = new ProfilesController(db);
    const profile = await controller.getSignatoriesByUserId(user.id);
    return profile?.signatories ?? [];
  });

  return result;
}
