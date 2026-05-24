'use server';

import { ERRORS } from '@/constants/errors';
import { db } from '@/db';
import { workLogs } from '@/db/schema';
import { getSession } from '@/lib/get-session';
import { and, eq } from 'drizzle-orm';
import { updateTag } from 'next/cache';

export async function deleteLog(id: string) {
  if (!id) throw new Error(ERRORS.MISSING_REQUIRED_FIELD);

  const session = await getSession();
  const user = session?.user;

  if (!user) throw new Error(ERRORS.UNAUTHORIZED);

  const deletedLog = await db
    .delete(workLogs)
    .where(and(eq(workLogs.id, id), eq(workLogs.user_id, user.id)))
    .returning({ id: workLogs.id });

  updateTag(`logs:${user.id}`);

  return { success: true, deletedLog };
}
