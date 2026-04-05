'use server';

import { getUser } from '@/app/actions/get-user';
import { ERRORS } from '@/constants/errors';
import { ProfilesController } from '@/lib/controller/profiles.controller';
import { db } from '@/lib/supabase';
import { attendanceDefaultsSchema } from '@/lib/zod/schema';
import { withErrorHandler } from '@/utils/with-error-handler';

export async function setAttendanceDefaults(defaults: unknown) {
  const result = await withErrorHandler(async () => {
    const user = await getUser();

    const parsed = attendanceDefaultsSchema.safeParse(defaults);

    if (!parsed.success) throw new Error(ERRORS.INVALID_INPUT);

    const controller = new ProfilesController(db);
    return controller.setAttendanceDefaults(user.id, parsed.data);
  });

  return result;
}
