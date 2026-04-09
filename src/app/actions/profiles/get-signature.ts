'use server';

import { getUser } from '@/app/actions/get-user';
import { ProfilesController } from '@/lib/controller/profiles.controller';
import { db } from '@/lib/supabase';
import { withErrorHandler } from '@/utils/with-error-handler';

export async function getEngineerSignature() {
  const result = await withErrorHandler(async () => {
    const user = await getUser();

    const controller = new ProfilesController(db);
    const profile = await controller.getSignatureByUserId(user.id);

    return profile?.signature;
  });

  return result;
}
