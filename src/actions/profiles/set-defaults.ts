'use server';

import { ERRORS } from '@/constants/errors';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { getSession } from '@/lib/get-session';
import { updateTag } from 'next/cache';

type AttendanceDefaults = {
  destination: string;
  remarks: string;
};

export async function setDefaults(defaults: AttendanceDefaults) {
  const session = await getSession();
  const user = session?.user;
  if (!user) throw new Error(ERRORS.UNAUTHORIZED);

  try {
    const result = await db
      .insert(profiles)
      .values({
        userId: user.id,
        defaultDestination: defaults.destination,
        defaultRemarks: defaults.remarks,
      })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: {
          defaultDestination: defaults.destination,
          defaultRemarks: defaults.remarks,
        },
      })
      .returning({
        id: profiles.id,
        defaultDestination: profiles.defaultDestination,
        defaultRemarks: profiles.defaultRemarks,
        updatedAt: profiles.updatedAt,
      });

    updateTag(`defaults:${user.id}`);
    updateTag(`profile:${user.id}`);
    return result[0];
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`[setAttendanceDefaults] Error: ${e.message}`);
    }
  }
}
