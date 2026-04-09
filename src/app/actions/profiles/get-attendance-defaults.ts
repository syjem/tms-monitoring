'use server';

import { getUser } from '@/app/actions/get-user';
import { FALLBACK_ATTENDANCE_DEFAULTS } from '@/constants/attendance-defaults';
import { ProfilesController } from '@/lib/controller/profiles.controller';
import { db } from '@/lib/supabase';
import { withErrorHandler } from '@/utils/with-error-handler';

export async function getAttendanceDefaults() {
  const result = await withErrorHandler(async () => {
    const user = await getUser();

    const controller = new ProfilesController(db);
    const profile = await controller.getDefaultsByUserId(user.id);

    return {
      destination:
        profile?.default_destination ??
        FALLBACK_ATTENDANCE_DEFAULTS.destination,
      remarks: profile?.default_remarks ?? FALLBACK_ATTENDANCE_DEFAULTS.remarks,
    };
  });

  return result;
}
