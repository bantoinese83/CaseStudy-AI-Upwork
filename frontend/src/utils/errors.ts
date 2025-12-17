/** Error handling utilities. */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Extracts error message from various error types.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

/**
 * Checks if error is a network error.
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.statusCode === undefined;
  }
  return error instanceof TypeError && error.message.includes('fetch');
}

/**
 * Checks if error is a timeout error.
 */
export function isTimeoutError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('timeout') || error.message.includes('Timeout');
  }
  return false;
}
