"use client";
import { useState, useMemo } from "react";
import { User, Workbook } from "../types";
import { FiCheckCircle, FiCopy, FiAlertCircle } from "react-icons/fi";
import * as Sentry from "@sentry/react";
import { API_BASE_URL } from "../utils/apiConfig";
import { copyToClipboard } from "../utils/copyToClipboard";
import { useDashboard } from "../context/DashboardContext";
import { AssignmentStatusService } from "../utils/assignmentStatus";

interface AssignWorkbookModalProps {
  workbook: Workbook | null;
  users: User[];
  onAssign: (user: User) => void;
  onClose: () => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

const AssignWorkbookModal = ({
  workbook,
  users,
  onAssign,
  onClose,
  showToast,
}: AssignWorkbookModalProps) => {
  const { workbooks } = useDashboard();
  const [isLoading, setIsLoading] = useState(false);
  const [assignedUser, setAssignedUser] = useState<User | null>(null);
  const [shareableLink, setShareableLink] = useState<string>("");

  // 🎯 NEW: Get users with assignment status for this workbook
  const usersWithStatus = useMemo(() => {
    if (!workbook) return [];
    
    return users.map(user => {
      const canAssign = AssignmentStatusService.canAssignWorkbookToUser(
        workbook._id,
        user._id,
        workbooks
      );
      
      return {
        ...user,
        canAssign: canAssign.canAssign,
        assignmentReason: canAssign.reason
      };
    });
  }, [workbook, users, workbooks]);

  const handleAssign = async (user: User) => {
    if (!workbook) {
      showToast("No workbook selected", "error");
      return;
    }

    // 🎯 NEW: Pre-validate assignment to prevent duplicates
    const canAssign = AssignmentStatusService.canAssignWorkbookToUser(
      workbook._id,
      user._id,
      workbooks
    );
    
    if (!canAssign.canAssign) {
      showToast(canAssign.reason || "Cannot assign workbook to this user", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/workbooks/assign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workbookId: workbook._id, userId: user._id }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        setAssignedUser(user);
        setShareableLink(data.shareableLink || data.data?.shareableLink || "");
        onAssign(user);
        showToast(`Workbook assigned to ${user.name}`, "success");
      } else {
        showToast(data.message || "Failed to assign workbook", "error");
      }
    } catch (err) {
      Sentry.captureException(err);
      showToast("Error assigning workbook", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboardHandler = () => {
    copyToClipboard(shareableLink, () =>
      showToast("Link copied to clipboard!", "success")
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        {!assignedUser ? (
          <>
            <h3 className="text-lg font-semibold mb-4">
              Assign "{workbook?.title}" to User
            </h3>

            {users.length === 0 ? (
              <p className="text-gray-500 mb-4">No users available to assign</p>
            ) : (
              <div className="max-h-60 overflow-y-auto mb-4">
                {/* 🎯 NEW: Use users with status instead of plain users */}
                {usersWithStatus.map((user) => {
                  const isDisabled = !user.canAssign || isLoading;
                  
                  return (
                    <div
                      key={user._id}
                      className={`p-3 border rounded-lg mb-2 transition-all duration-200 ${
                        user.canAssign 
                          ? "hover:bg-gray-50 border-gray-200" 
                          : "bg-gray-50 border-gray-300 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            user.canAssign ? "text-gray-900" : "text-gray-500"
                          }`}>
                            {user.name}
                          </h4>
                          <p className={`text-sm ${
                            user.canAssign ? "text-gray-600" : "text-gray-400"
                          }`}>
                            {user.email}
                          </p>
                          {!user.canAssign && user.assignmentReason && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-orange-600">
                              <FiAlertCircle className="w-3 h-3" />
                              <span>{user.assignmentReason}</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          {!user.canAssign && (
                            <div className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                              Already Assigned
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        className={`mt-2 px-3 py-1 text-sm rounded transition-colors ${
                          isDisabled
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#0B4073] text-white hover:bg-[#0B4073]/90"
                        }`}
                        onClick={() => handleAssign(user)}
                        disabled={isDisabled}
                      >
                        {isLoading ? "Assigning..." : user.canAssign ? "Assign" : "Cannot Assign"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg text-gray-800 hover:bg-gray-300"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Workbook Assigned Successfully!
              </h3>
              <p className="text-gray-600">
                "{workbook?.title}" has been assigned to {assignedUser.name}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shareable Link for {assignedUser.name}:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareableLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                />
                <button
                  onClick={copyToClipboardHandler}
                  className="px-3 py-2 bg-[#0B4073] text-white rounded-md hover:bg-[#0B4073]/90 text-sm flex items-center"
                >
                  <FiCopy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Send this link to {assignedUser.name} to access their workbook
              </p>
            </div>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-[#0B4073] text-white rounded-lg hover:bg-[#0B4073]/90"
                onClick={onClose}
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignWorkbookModal;
