/** Validation utilities. */

/**
 * Validates if a question string is non-empty after trimming.
 */
export function isValidQuestion(question: string): boolean {
  return question.trim().length > 0;
}

/**
 * Validates if a question is not too long (prevent abuse).
 */
export function isQuestionLengthValid(question: string, maxLength = 1000): boolean {
  return question.length <= maxLength;
}

/**
 * Validates a question for query submission.
 */
export function validateQuestion(question: string): {
  valid: boolean;
  error?: string;
} {
  if (!isValidQuestion(question)) {
    return { valid: false, error: 'Question cannot be empty' };
  }

  if (!isQuestionLengthValid(question)) {
    return {
      valid: false,
      error: `Question is too long (max ${1000} characters)`,
    };
  }

  return { valid: true };
}
