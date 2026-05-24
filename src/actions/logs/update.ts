'use server';

import { ERRORS } from '@/constants/errors';
import { db } from '@/db';
import { workLogs } from '@/db/schema/work-logs';
import { getSession } from '@/lib/get-session';
import { AttendanceData } from '@/types';
import { withErrorHandler } from '@/utils/error-handler';
import { and, eq } from 'drizzle-orm';
import { updateTag } from 'next/cache';

export async function updateLog(id: string, logs: AttendanceData) {
  const result = await withErrorHandler(async () => {
    if (!id || !logs) throw new Error(ERRORS.MISSING_REQUIRED_FIELD);

    const session = await getSession();
    const user = session?.user;

    if (!user) throw new Error(ERRORS.UNAUTHORIZED);

    await db
      .update(workLogs)
      .set({ logs })
      .where(and(eq(workLogs.id, id), eq(workLogs.user_id, user.id)));

    updateTag(`log:${user.id}`);
    return { success: true };
  });

  return result;
}
