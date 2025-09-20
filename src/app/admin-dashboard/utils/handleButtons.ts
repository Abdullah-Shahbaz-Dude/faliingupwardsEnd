import * as Sentry from "@sentry/nextjs";
import { fetchWithTimeout } from "./api";

export async function handleDeleteUser(
  userId: string,
  userName: string,
  workbookCount: number,
  showToast: (message: string, type: "success" | "error" | "info") => void,
  refreshDashboardData: () => Promise<void>,
  setShowConfirm?: (
    config: { userId: string; userName: string; workbookCount: number } | null
  ) => void,
  setDeletingUserId?: (id: string | null) => void
) {
  // Show confirmation dialog first
  if (setShowConfirm) {
    setShowConfirm({ userId, userName, workbookCount });
    return;
  } else if (
    !window.confirm(`Delete ${userName} and ${workbookCount} assignments?`)
  ) {
    return;
  }

  // Set loading state to prevent multiple clicks
  if (setDeletingUserId) {
    setDeletingUserId(userId);
  }

  try {
    const response = await fetchWithTimeout(`/api/admin/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      showToast(
        `${userName} and ${workbookCount} assignments removed`,
        "success"
      );
      await refreshDashboardData();
    } else {
      const errorData = await response.json();
      // Handle specific "not found" error more gracefully
      if (response.status === 404) {
        showToast(`${userName} was already removed`, "info");
        await refreshDashboardData(); // Still refresh to update UI
      } else {
        showToast(errorData.message || "Failed to remove user", "error");
      }
    }
  } catch (err) {
    console.error("Delete user error:", err);
    Sentry.captureException(err);
    showToast("Error removing user", "error");
  } finally {
    // Always clear loading state
    if (setDeletingUserId) {
      setDeletingUserId(null);
    }
  }
}

export async function handleDeleteAssignment(
  workbookId: string,
  userName: string,
  showToast: (message: string, type: "success" | "error" | "info") => void,
  refreshDashboardData: () => Promise<void>,
  setShowConfirm?: (
    config: { workbookId: string; userName: string } | null
  ) => void,
  setDeletingWorkbookId?: (id: string | null) => void
) {
  // Show confirmation dialog first
  if (setShowConfirm) {
    setShowConfirm({ workbookId, userName });
    return;
  } else if (!window.confirm(`Remove workbook from ${userName}?`)) {
    return;
  }

  // Set loading state to prevent multiple clicks
  if (setDeletingWorkbookId) {
    setDeletingWorkbookId(workbookId);
  }

  try {
    const response = await fetchWithTimeout(
      `/api/admin/workbooks/${workbookId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (response.ok) {
      showToast(`Workbook removed from ${userName}`, "success");
      await refreshDashboardData();
    } else {
      const errorData = await response.json();
      // Handle specific "not found" error more gracefully
      if (response.status === 404) {
        showToast(`Workbook was already removed from ${userName}`, "info");
        await refreshDashboardData(); // Still refresh to update UI
      } else {
        showToast(errorData.message || "Failed to remove workbook", "error");
      }
    }
  } catch (err) {
    console.error("Delete assignment error:", err);
    Sentry.captureException(err);
    showToast("Error removing workbook assignment", "error");
  } finally {
    // Always clear loading state
    if (setDeletingWorkbookId) {
      setDeletingWorkbookId(null);
    }
  }
}
