'use server';

import { getUser } from '@/app/actions/get-user';
import { ERRORS } from '@/constants/errors';
import { WorkLogsController } from '@/lib/controller/logs.controller';
import { db } from '@/lib/supabase';
import type { AttendanceData } from '@/types';
import { notFound } from 'next/navigation';

export async function getWorkLogById(id: string) {
  if (!id) throw new Error(ERRORS.MISSING_REQUIRED_FIELD);

  const user = await getUser();

  const controller = new WorkLogsController(db);
  const workLog = await controller.getLogById(id, user.id);

  if (!workLog) notFound();

  return { logs: workLog.logs as AttendanceData, id: workLog.id };
}
