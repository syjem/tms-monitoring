'use server';

import { ERRORS } from '@/constants/errors';
import { db } from '@/db';
import { workLogs } from '@/db/schema/work-logs';
import { getSession } from '@/lib/get-session';
import { desc, eq } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';

async function getLogsByUserId(userId: string) {
  'use cache';
  cacheLife('days');
  cacheTag(`logs:${userId}`);

  const logs = await db
    .select({
      id: workLogs.id,
      period: workLogs.period,
      updated_at: workLogs.updated_at,
    })
    .from(workLogs)
    .where(eq(workLogs.user_id, userId))
    .orderBy(desc(workLogs.updated_at));

  return logs;
}

export async function getLogs() {
  const session = await getSession();
  const user = session?.user;

  if (!user) throw new Error(ERRORS.UNAUTHORIZED);

  const logs = await getLogsByUserId(user.id);
  return logs;
}
