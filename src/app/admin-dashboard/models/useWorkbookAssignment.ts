import { useCallback, useState } from "react";
import * as Sentry from "@sentry/react";
import { API_BASE_URL } from "../utils/apiConfig";
import { generateDashboardLink } from "../utils/links";
import { copyToClipboard } from "../utils/copyToClipboard";
import { useDashboard } from "../context/DashboardContext";
import { User, Workbook } from "../types";
import { AssignmentStatusService } from "../utils/assignmentStatus";

interface UseWorkbookAssignment {
  assignWorkbooks: (
    user: User,
    workbookIds: string[]
  ) => Promise<{ dashboardLink: string; workbookTitles: string[] }>;
  sendAssignmentEmail: (
    user: User,
    dashboardLink: string,
    workbookTitles: string[]
  ) => Promise<void>;
  copyDashboardLink: (dashboardLink: string) => void;
  isAssigning: boolean;
  isSendingEmail: boolean;
}

export const useWorkbookAssignment = (
  showToast: (message: string, type: "success" | "error" | "info") => void
): UseWorkbookAssignment => {
  const { 
    templateWorkbooks, 
    workbooks, // Add access to all workbooks for status checking
    refreshAllData 
  } = useDashboard();
  const [isAssigning, setIsAssigning] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const assignWorkbooks = useCallback(
    async (user: User, workbookIds: string[]) => {
      if (workbookIds.length === 0) {
        showToast("Please select at least one workbook", "error");
        throw new Error("No workbooks selected");
      }

      // 🎯 NEW: Pre-validate assignments to prevent duplicates
      const validation = AssignmentStatusService.validateAssignments(
        user._id,
        workbookIds,
        workbooks
      );

      // Show info about skipped duplicates
      if (validation.invalidIds.length > 0) {
        const skippedTitles = validation.invalidIds
          .map(id => templateWorkbooks.find(wb => wb._id === id)?.title || "Unknown")
          .join(", ");
        showToast(
          `Skipping ${validation.invalidIds.length} already assigned workbook(s): ${skippedTitles}`,
          "info"
        );
      }

      // If no valid assignments, don't proceed
      if (validation.validIds.length === 0) {
        showToast("All selected workbooks are already assigned to this user", "info");
        return {
          dashboardLink: generateDashboardLink(user._id),
          workbookTitles: []
        };
      }

      setIsAssigning(true);
      try {
        // Only assign valid (non-duplicate) workbooks
        for (const workbookId of validation.validIds) {
          const response = await fetch(
            `${API_BASE_URL}/api/admin/workbooks/assign`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ workbookId, userId: user._id }),
              credentials: "include",
            }
          );
          const data = await response.json();
          if (!data.success) {
            const errorMessage =
              data.message || `Failed to assign workbook ${workbookId}`;
            showToast(errorMessage, "error");
            throw new Error(errorMessage);
          }
        }
        
      
        await refreshAllData();
        
        // 🎯 NEW: Use only successfully assigned workbooks for feedback
        const dashboardLink = generateDashboardLink(user._id);
        const workbookTitles = validation.validIds.map(
          (id) =>
            templateWorkbooks.find((wb: Workbook) => wb._id === id)?.title ||
            "Untitled Workbook"
        );
        
        const assignedCount = validation.validIds.length;
        const totalSelected = workbookIds.length;
        
        if (assignedCount === totalSelected) {
          showToast(
            `${assignedCount} workbook${assignedCount === 1 ? "" : "s"} assigned successfully`,
            "success"
          );
        } else {
          showToast(
            `${assignedCount} of ${totalSelected} workbook${totalSelected === 1 ? "" : "s"} assigned successfully`,
            "success"
          );
        }
        return { dashboardLink, workbookTitles };
      } catch (error) {
        Sentry.captureException(error);
        showToast("Error assigning workbooks", "error");
        throw error;
      } finally {
        setIsAssigning(false);
      }
    },
    [showToast, templateWorkbooks, workbooks, refreshAllData]
  );

  const sendAssignmentEmail = useCallback(
    async (user: User, dashboardLink: string, workbookTitles: string[]) => {
      if (!dashboardLink) {
        showToast("No workbooks assigned to send email", "error");
        throw new Error("No dashboard link provided");
      }

      setIsSendingEmail(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/admin/send-user-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userName: user.name,
              userEmail: user.email,
              dashboardLink,
              workbookTitles,
              adminName: "Falling Upward Admin",
            }),
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.success) {
          showToast(`Email sent to fahadamjad778@gmail.com (intended for ${user.email})`, "success");
        } else {
          const errorMessage = data.message || "Failed to send email";
          showToast(errorMessage, "error");
          throw new Error(errorMessage);
        }
      } catch (error) {
        Sentry.captureException(error);
        showToast("Error sending email", "error");
        throw error;
      } finally {
        setIsSendingEmail(false);
      }
    },
    [showToast]
  );

  const copyDashboardLink = useCallback(
    (dashboardLink: string) => {
      copyToClipboard(dashboardLink, () => {
        showToast("Link copied to clipboard!", "success");
      }).catch((err) => {
        Sentry.captureException(err);
        showToast("Failed to copy link to clipboard", "error");
      });
    },
    [showToast]
  );

  return {
    assignWorkbooks,
    sendAssignmentEmail,
    copyDashboardLink,
    isAssigning,
    isSendingEmail,
  };
};
