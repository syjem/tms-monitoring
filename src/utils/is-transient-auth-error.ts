import { TRANSIENT_AUTH_ERROR_PATTERNS } from '@/constants/errors';

export type AuthErrorLike = {
  message?: string;
  name?: string;
  status?: number;
};

export function isTransientAuthError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const authError = error as AuthErrorLike;
  if (
    authError.status === 500 ||
    authError.status === 502 ||
    authError.status === 503 ||
    authError.status === 504
  ) {
    return true;
  }

  const raw = `${authError.name ?? ''} ${authError.message ?? ''}`
    .toLowerCase()
    .trim();

  return TRANSIENT_AUTH_ERROR_PATTERNS.some((pattern) => raw.includes(pattern));
}
