'use server';

import { FALLBACK_ATTENDANCE_DEFAULTS } from '@/constants/attendance-defults';
import { ERRORS } from '@/constants/errors';
import { db } from '@/db';
import { profiles } from '@/db/schema/profile';
import { getSession } from '@/lib/get-session';
import { eq } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';

async function getDefaultsByUserId(userId: string) {
  'use cache';
  cacheLife('days');
  cacheTag(`defaults:${userId}`);

  const defaults = await db
    .select({
      destination: profiles.defaultDestination,
      remarks: profiles.defaultRemarks,
    })
    .from(profiles)
    .where(eq(profiles.userId, userId));

  return defaults;
}

export async function getDefaults() {
  const session = await getSession();
  const user = session?.user;

  if (!user) throw new Error(ERRORS.UNAUTHORIZED);

  const defaults = await getDefaultsByUserId(user.id);

  return {
    destination:
      defaults[0]?.destination ?? FALLBACK_ATTENDANCE_DEFAULTS.destination,
    remarks: defaults[0]?.remarks ?? FALLBACK_ATTENDANCE_DEFAULTS.remarks,
  };
}
