import zxcvbn from 'zxcvbn';

interface PasswordValidationResult {
  isValid: boolean;
  score: number;
  feedback?: string;
}

export function validatePassword(password: string): PasswordValidationResult {
  const result = zxcvbn(password);

  return {
    isValid: result.score >= 2,
    score: result.score,
    feedback: result.feedback.warning || result.feedback.suggestions[0],
  };
}