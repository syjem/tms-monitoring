'use server';

import { getUser } from '@/app/actions/get-user';
import { ERRORS } from '@/constants/errors';
import { WorkLogsController } from '@/lib/controller/logs.controller';
import { db } from '@/lib/supabase';
import { withErrorHandler } from '@/utils/with-error-handler';
import { revalidatePath } from 'next/cache';

export async function deleteWorkLog(id: string) {
  const result = await withErrorHandler(async () => {
    if (!id) throw new Error(ERRORS.MISSING_REQUIRED_FIELD);

    const user = await getUser();

    const controller = new WorkLogsController(db);
    const result = await controller.deleteLogById(id, user.id);

    if (!result) throw new Error(ERRORS.NOT_ALLOWED);

    revalidatePath('/');

    return {
      success: true,
    };
  });

  return result;
}
