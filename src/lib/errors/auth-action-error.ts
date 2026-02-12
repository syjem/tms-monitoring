import { ERRORS } from '@/constants/errors';

export class AuthActionError extends Error {
  readonly code = 'UNAUTHORIZED';

  constructor(message = ERRORS.UNAUTHORIZED) {
    super(message);
    this.name = 'AuthActionError';
  }
}

export function isAuthActionError(error: unknown): error is AuthActionError {
  return error instanceof AuthActionError;
}
