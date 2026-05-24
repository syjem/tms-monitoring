'use server';

import { ERRORS } from '@/constants/errors';
import { db } from '@/db';
import { workLogs } from '@/db/schema/work-logs';
import { getSession } from '@/lib/get-session';
import type { AttendanceData } from '@/types';
import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createLog(period: string, logs: AttendanceData) {
  if (!period || !logs) throw new Error(ERRORS.MISSING_REQUIRED_FIELD);

  const session = await getSession();
  const user = session?.user;

  if (!user) throw new Error(ERRORS.UNAUTHORIZED);

  const new_log = await db
    .insert(workLogs)
    .values({
      user_id: user.id,
      period,
      logs,
    })
    .returning({ id: workLogs.id });

  if (!new_log) throw new Error(ERRORS.NOT_ALLOWED);
  updateTag(`logs:${user.id}`);

  redirect(`/logs/${new_log[0].id}`);
}
