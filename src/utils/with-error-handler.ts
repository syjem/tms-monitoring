import { isAuthActionError } from '@/lib/errors/auth-action-error';

/**
 * Type-safe error response wrapper
 */
export type ErrorResponse<E = Record<string, unknown>> = {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: E;
  };
};

/**
 * Type-safe success response wrapper
 */
export type SuccessResponse<T> = {
  success: true;
  data: T;
};

/**
 * Combined result type for operations
 */
export type OperationResult<T, E = Record<string, unknown>> =
  | SuccessResponse<T>
  | ErrorResponse<E>;

/**
 * Wraps async/sync operations with error handling and typed responses.
 *
 * Executes an operation and returns a structured result object with success/error state.
 * Provides type safety for both success and error cases.
 *
 * @template T - The success data type
 * @template E - The error details type (defaults to Record<string, unknown>)
 * @param {() => Promise<T> | T} operation - The operation to execute
 * @param {object} options - Configuration options
 * @param {string} options.errorCode - Optional error code to include in response
 * @param {(error: Error) => E} options.errorTransform - Optional function to transform error details
 * @returns {Promise<OperationResult<T, E>>} Structured result with success or error state
 *
 * @example
 * // Basic usage
 * const result = await withErrorHandler(() => fetchUser(id));
 * if (result.success) {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error.message);
 * }
 *
 * @example
 * // With error transformation
 * const result = await withErrorHandler(
 *   () => validateAndSave(data),
 *   {
 *     errorCode: 'VALIDATION_ERROR',
 *     errorTransform: (error) => ({ field: error.field, code: error.code })
 *   }
 * );
 */
export async function withErrorHandler<
  T,
  E extends Record<string, unknown> = Record<string, unknown>,
>(
  operation: () => Promise<T> | T,
  options?: {
    errorCode?: string;
    errorTransform?: (error: unknown) => E;
  },
): Promise<OperationResult<T, E>> {
  try {
    const data = await Promise.resolve().then(() => operation());
    return {
      success: true,
      data,
    };
  } catch (error) {
    if (isNextControlFlowError(error)) throw error;

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    const errorCode = isAuthActionError(error)
      ? error.code
      : options?.errorCode;

    const errorDetails = options?.errorTransform
      ? options.errorTransform(error)
      : undefined;

    return {
      success: false,
      error: {
        message: errorMessage,
        code: errorCode,
        details: errorDetails,
      },
    };
  }
}

function isNextControlFlowError(error: unknown) {
  if (!error || typeof error !== 'object') return false;
  if (!('digest' in error)) return false;

  const digest = (error as { digest?: unknown }).digest;
  if (typeof digest !== 'string') return false;

  return (
    digest.startsWith('NEXT_REDIRECT') ||
    digest.startsWith('NEXT_HTTP_ERROR_FALLBACK')
  );
}
