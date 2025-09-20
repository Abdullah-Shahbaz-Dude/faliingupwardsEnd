import { IUser } from "@/models/User";

/**
 * Utility functions for user validation and link expiration checks
 */

export interface UserValidationResult {
  isValid: boolean;
  reason?: string;
  isLinkExpired?: boolean;
  isCompleted?: boolean;
  isDashboardExpired?: boolean;
}

/**
 * Validates if a user can access their dashboard and workbooks
 * @param user - User object from database
 * @returns Validation result with detailed information
 */
export function validateUserAccess(user: any): UserValidationResult {
  if (!user) {
    return {
      isValid: false,
      reason: "User not found"
    };
  }

  // Check time-based link expiration (timezone-safe UTC comparison)
  const isLinkExpired = user.linkExpiresAt && 
    new Date().getTime() > new Date(user.linkExpiresAt).getTime();
  
  // Check completion status
  const isCompleted = user.isCompleted === true;
  
  // Check dashboard expiration
  const isDashboardExpired = user.dashboardExpired === true;

  if (isLinkExpired) {
    return {
      isValid: false,
      reason: "User link has expired. Please contact your administrator for a new link.",
      isLinkExpired: true,
      isCompleted,
      isDashboardExpired
    };
  }

  if (isCompleted || isDashboardExpired) {
    return {
      isValid: false,
      reason: "User has already completed their workbooks and dashboard access has expired.",
      isLinkExpired: false,
      isCompleted,
      isDashboardExpired
    };
  }

  return {
    isValid: true,
    isLinkExpired: false,
    isCompleted: false,
    isDashboardExpired: false
  };
}

/**
 * Validates if workbooks are properly completed and ready for submission
 * @param workbooks - Array of workbook objects
 * @returns Validation result
 */
export function validateWorkbooksForSubmission(workbooks: any[]): {
  isValid: boolean;
  incompleteWorkbooks: string[];
  reason?: string;
} {
  const incompleteWorkbooks: string[] = [];

  for (const workbook of workbooks) {
    // Check if workbook has questions
    if (!workbook.questions || workbook.questions.length === 0) {
      incompleteWorkbooks.push(workbook._id);
      continue;
    }

    // Check if all questions are answered with sufficient quality
    const unansweredQuestions = workbook.questions.filter(
      (q: any) => {
        if (!q.answer || q.answer.trim() === '') return true;
        // Minimum answer length of 10 characters (configurable)
        if (q.answer.trim().length < 10) return true;
        // Check for placeholder text or low-quality answers
        const lowQualityPatterns = /^(test|n\/a|na|none|idk|i don't know|\.\.\.|---)$/i;
        if (lowQualityPatterns.test(q.answer.trim())) return true;
        return false;
      }
    );

    if (unansweredQuestions.length > 0) {
      incompleteWorkbooks.push(workbook._id);
    }

    // Check if workbook is in valid status for submission
    const validStatuses = ['assigned', 'in_progress', 'completed'];
    if (!validStatuses.includes(workbook.status)) {
      incompleteWorkbooks.push(workbook._id);
    }
  }

  if (incompleteWorkbooks.length > 0) {
    return {
      isValid: false,
      incompleteWorkbooks,
      reason: `Cannot submit incomplete workbooks: ${incompleteWorkbooks.join(', ')}. All questions must be answered and workbooks must be in valid status.`
    };
  }

  return {
    isValid: true,
    incompleteWorkbooks: []
  };
}

/**
 * Gets user-friendly expiration message based on validation result
 * @param validation - Result from validateUserAccess
 * @returns User-friendly message
 */
export function getUserExpirationMessage(validation: UserValidationResult): string {
  if (validation.isLinkExpired) {
    return "Your dashboard link has expired. Please contact your administrator for a new link.";
  }
  
  if (validation.isCompleted || validation.isDashboardExpired) {
    return "Your dashboard access has expired. You have already completed your workbooks.";
  }
  
  return validation.reason || "Access denied";
}
