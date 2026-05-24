'use server';

import { getSession } from '@/lib/get-session';
import { checkMonthlyExtractionQuota } from '@/lib/upstash';
import { cacheLife, cacheTag } from 'next/cache';

async function getRemainingCreditsForUser(userId: string) {
  'use cache';
  cacheLife('days');
  cacheTag(`quota:${userId}`);

  const { remaining } = await checkMonthlyExtractionQuota(userId);
  return remaining;
}

export async function getUserUploadCredits() {
  const { user } = await getSession();
  const remaining = await getRemainingCreditsForUser(user.id);

  return { user, credits: remaining };
}
