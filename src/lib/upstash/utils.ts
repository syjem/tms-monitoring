import { REDIS } from '@/lib/upstash/config';
import { getRedisClient } from '@/lib/upstash/redis';

function getCurrentMonthKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: REDIS.QUOTA_MONTH_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(date);

  const year = parts.find((part) => part.type === 'year')?.value ?? '';
  const month = parts.find((part) => part.type === 'month')?.value ?? '';

  if (!year || !month) {
    throw new Error('Failed to compute monthly quota key');
  }

  return `${year}-${month}`;
}

export async function checkMonthlyExtractionQuota(userId: string) {
  const redis = getRedisClient();
  const monthKey = getCurrentMonthKey();
  const key = `${REDIS.EXTRACTION_QUOTA_KEY_PREFIX}:${userId}:${monthKey}`;

  const currentCount = (await redis.get<number>(key)) ?? 0;

  return {
    usedCount: currentCount,
    remaining: Math.max(0, REDIS.MONTHLY_EXTRACTION_LIMIT - currentCount),
    allowed: currentCount < REDIS.MONTHLY_EXTRACTION_LIMIT,
  };
}

export async function consumeMonthlyExtractionQuota(userId: string) {
  const redis = getRedisClient();
  const monthKey = getCurrentMonthKey();
  const key = `${REDIS.EXTRACTION_QUOTA_KEY_PREFIX}:${userId}:${monthKey}`;

  const usedCount = await redis.incr(key);

  if (usedCount === 1) {
    await redis.expire(key, REDIS.QUOTA_KEY_TTL_SECONDS);
  }

  return {
    usedCount,
    remaining: Math.max(0, REDIS.MONTHLY_EXTRACTION_LIMIT - usedCount),
  };
}
