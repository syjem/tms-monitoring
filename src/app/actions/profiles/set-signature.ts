'use server';

import { getUser } from '@/app/actions/get-user';
import { ProfilesController } from '@/lib/controller/profiles.controller';
import { db } from '@/lib/supabase';
import { withErrorHandler } from '@/utils/with-error-handler';

export const setEngineerSignature = async (signatureData: string) => {
  const result = await withErrorHandler(async () => {
    const user = await getUser();

    const controller = new ProfilesController(db);

    return controller.setSignature(user.id, signatureData);
  });

  return result;
};
