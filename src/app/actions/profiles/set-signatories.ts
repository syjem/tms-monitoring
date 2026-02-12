'use server';

import { getUser } from '@/app/actions/get-user';
import { ERRORS } from '@/constants/errors';
import { ProfilesController } from '@/lib/controller/profiles.controller';
import { db } from '@/lib/supabase';
import { signatoriesSchema } from '@/lib/zod/schema';
import { withErrorHandler } from '@/utils/with-error-handler';

export async function setSignatories(signatories: unknown) {
  const result = await withErrorHandler(async () => {
    const user = await getUser();

    // Zod validation
    const parsed = signatoriesSchema.safeParse(signatories);

    if (!parsed.success) throw new Error(ERRORS.INVALID_INPUT);

    const controller = new ProfilesController(db);
    return controller.setSignatories(user.id, parsed.data);
  });

  return result;
}
