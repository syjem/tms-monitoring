'use server';

import { getUser } from '@/app/actions/get-user';
import { ERRORS } from '@/constants/errors';
import { WorkLogsController } from '@/lib/controller/logs.controller';
import { db } from '@/lib/supabase';
import type { AttendanceData } from '@/types';
import { redirect } from 'next/navigation';

export async function createLog(period: string, logs: AttendanceData) {
  if (!period || !logs) throw new Error(ERRORS.MISSING_REQUIRED_FIELD);

  const user = await getUser();

  const controller = new WorkLogsController(db);
  const createdLog = await controller.createLog(user.id, period, logs);

  if (!createdLog) throw new Error(ERRORS.NOT_ALLOWED);

  redirect(`/monitoring/${createdLog.id}`);
}
