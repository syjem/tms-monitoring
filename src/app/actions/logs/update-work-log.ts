'use server';

import { getUser } from '@/app/actions/get-user';
import { ERRORS } from '@/constants/errors';
import { WorkLogsController } from '@/lib/controller/logs.controller';
import { db } from '@/lib/supabase';
import type { AttendanceData } from '@/types';
import { withErrorHandler } from '@/utils/with-error-handler';

export async function updateWorkLog(id: string, logs: AttendanceData) {
  const result = await withErrorHandler(async () => {
    if (!id || !logs) throw new Error(ERRORS.MISSING_REQUIRED_FIELD);

    const user = await getUser();

    const controller = new WorkLogsController(db);
    const result = await controller.updateLogById(id, user.id, logs);

    if (!result) {
      throw new Error(ERRORS.NOT_FOUND);
    }
    return { success: true, data: result };
  });

  return result;
}
