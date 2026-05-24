export function isNextRedirectError(err: unknown): boolean {
  return (
    (err instanceof Error && err.message.includes('NEXT_REDIRECT')) ||
    (typeof err === 'object' &&
      err !== null &&
      'digest' in err &&
      typeof err.digest === 'string' &&
      err.digest.includes('NEXT_REDIRECT'))
  );
}
