'use server';

import { ERRORS } from '@/constants/errors';
import { db } from '@/db';
import { workLogs } from '@/db/schema/work-logs';
import { getSession } from '@/lib/get-session';
import { AttendanceData } from '@/types';
import { and, eq } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';

async function getLogByIdAndUserId(userId: string, id: string) {
  'use cache';
  cacheLife('days');
  cacheTag(`log:${userId}`);

  const log = await db
    .select({
      id: workLogs.id,
      logs: workLogs.logs,
    })
    .from(workLogs)
    .where(and(eq(workLogs.user_id, userId), eq(workLogs.id, id)));

  return log[0] ?? null;
}

export async function getLog(id: string, userId?: string) {
  let resolvedUserId = userId;

  if (!resolvedUserId) {
    const session = await getSession();
    const user = session?.user;

    if (!user) throw new Error(ERRORS.UNAUTHORIZED);
    resolvedUserId = user.id;
  }

  const data = await getLogByIdAndUserId(resolvedUserId, id);

  if (!data) notFound();

  return { id: data.id, logs: data.logs as AttendanceData };
}
