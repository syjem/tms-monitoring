export const ERRORS = {
  // Authentication & Authorization
  NOT_ALLOWED: 'You are not allowed to perform this action',
  UNAUTHORIZED: 'Authentication required. Please log in.',
  INVALID_CREDENTIALS: 'Invalid email or password',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  PERMISSION_DENIED: 'You do not have permission to access this resource',

  // Validation
  INVALID_INPUT: 'Invalid input provided',
  MISSING_REQUIRED_FIELD: 'A required field is missing',
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',

  // User & Account
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  ACCOUNT_DISABLED: 'This account has been disabled',
  ACCOUNT_NOT_VERIFIED: 'Please verify your email address',

  // Server Errors
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred. Please try again.',
  SERVICE_UNAVAILABLE:
    'Service temporarily unavailable. Please try again later.',
  DATABASE_ERROR: 'Database operation failed',

  // Resource Errors
  NOT_FOUND: 'Resource not found',
  RESOURCE_DELETED: 'This resource has been deleted',
  CONFLICT: 'This resource already exists',

  // Network & Request
  NETWORK_ERROR: 'Network error. Please check your connection.',
  REQUEST_TIMEOUT: 'Request timed out. Please try again.',
  BAD_REQUEST: 'Invalid request',
  RATE_LIMITED: 'Too many requests. Please try again later.',

  // File Operations
  FILE_NOT_FOUND: 'File not found',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit',
  INVALID_FILE_TYPE: 'Invalid file type',
  UPLOAD_FAILED: 'File upload failed',

  // API & Integration
  API_ERROR: 'API request failed',
  EXTERNAL_SERVICE_ERROR: 'External service error',
  PAYMENT_FAILED: 'Payment processing failed',

  // Misc
  SOMETHING_WENT_WRONG: 'Something went wrong',
  TRY_AGAIN_LATER: 'Please try again later',
} as const;

// Type for error keys
export type ErrorKey = keyof typeof ERRORS;

// Helper function to get error message
export const getErrorMessage = (key: ErrorKey): string => {
  return ERRORS[key] || ERRORS.SOMETHING_WENT_WRONG;
};
