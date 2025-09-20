import { User, Workbook } from "../types";

export interface WorkbookWithStatus extends Workbook {
  isAssigned?: boolean;
  isAvailable?: boolean;
}

/**
 * Simple assignment status service - matches UsersView.tsx logic exactly
 */
export class AssignmentStatusService {
  /**
   * Get user workbooks - same as UsersView.tsx
   */
  static getUserWorkbooks(userId: string, allWorkbooks: Workbook[]): Workbook[] {
    return allWorkbooks.filter((wb) => {
      const assignedTo = String(wb.assignedTo || '');
      const targetUserId = String(userId || '');
      return assignedTo === targetUserId;
    });
  }

  /**
   * Check if template is assigned to user
   */
  static isWorkbookAssignedToUser(templateId: string, userId: string, allWorkbooks: Workbook[]): boolean {
    const userWorkbooks = this.getUserWorkbooks(userId, allWorkbooks);
    
    // Robust comparison - handle ObjectId vs string issues
    const isAssigned = userWorkbooks.some(wb => {
      const wbTemplateId = String(wb.templateId || '');
      const targetTemplateId = String(templateId || '');
      return wbTemplateId === targetTemplateId;
    });
    
    return isAssigned;
  }

  /**
   * Get workbooks with assignment status
   */
  static getWorkbooksWithStatus(
    templateWorkbooks: Workbook[],
    userId: string | null,
    allWorkbooks: Workbook[]
  ): WorkbookWithStatus[] {
    if (!userId) {
      return templateWorkbooks.map(wb => ({ ...wb, isAssigned: false, isAvailable: true }));
    }

    const result = templateWorkbooks.map((template) => {
      const isAssigned = this.isWorkbookAssignedToUser(template._id, userId, allWorkbooks);
      
      return {
        ...template,
        isAssigned,
        isAvailable: !isAssigned,
      };
    });

    return result;
  }

  /**
   * Validate assignments before API calls to prevent duplicates
   */
  static validateAssignments(
    userId: string,
    workbookIds: string[],
    allWorkbooks: Workbook[]
  ): { validIds: string[]; invalidIds: string[]; reasons: { [key: string]: string } } {
    const validIds: string[] = [];
    const invalidIds: string[] = [];
    const reasons: { [key: string]: string } = {};

    workbookIds.forEach((workbookId) => {
      if (this.isWorkbookAssignedToUser(workbookId, userId, allWorkbooks)) {
        invalidIds.push(workbookId);
        reasons[workbookId] = "Already assigned to this user";
      } else {
        validIds.push(workbookId);
      }
    });

    return { validIds, invalidIds, reasons };
  }

  /**
   * Check if user can be assigned a workbook
   */
  static canAssignWorkbookToUser(
    templateId: string,
    userId: string,
    allWorkbooks: Workbook[]
  ): { canAssign: boolean; reason?: string } {
    const isAssigned = this.isWorkbookAssignedToUser(templateId, userId, allWorkbooks);
    
    if (isAssigned) {
      return { canAssign: false, reason: "Workbook is already assigned to this user" };
    }

    return { canAssign: true };
  }
}
