'use server';

import { getUser } from '@/app/actions/get-user';
import { WorkLogsController } from '@/lib/controller/logs.controller';
import { db } from '@/lib/supabase';

export async function getWorkLogs() {
  const user = await getUser();

  const controller = new WorkLogsController(db);
  const work_logs = await controller.getLogsByUserId(user.id);

  return work_logs;
}
