import { ERRORS } from '@/constants/errors';

export function isAuthError(message: string) {
  return (
    message === ERRORS.UNAUTHORIZED ||
    /auth|session|unauthorized/i.test(message)
  );
}
