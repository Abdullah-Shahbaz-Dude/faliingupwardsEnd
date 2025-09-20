"use client";

import { useState, useMemo } from "react";
import { FiCheckCircle, FiCopy, FiMail, FiInfo } from "react-icons/fi";
import { useDashboard } from "../context/DashboardContext";
import { User } from "../types";
import { useWorkbookAssignment } from "./useWorkbookAssignment";
import { AssignmentStatusService, WorkbookWithStatus } from "../utils/assignmentStatus";

interface ModernWorkbookAssignModalProps {
  user: User;
  onClose: () => void;
  onAssign: (user: User) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

const ModernWorkbookAssignModal = ({
  user,
  onClose,
  onAssign,
  showToast,
}: ModernWorkbookAssignModalProps) => {
  const { templateWorkbooks, workbooks } = useDashboard();
  const {
    assignWorkbooks,
    sendAssignmentEmail,
    copyDashboardLink,
    isAssigning,
    isSendingEmail,
  } = useWorkbookAssignment(showToast);
  const [selectedWorkbooks, setSelectedWorkbooks] = useState<string[]>([]);

  // 🎯 NEW: Get workbooks with assignment status
  const workbooksWithStatus = useMemo<WorkbookWithStatus[]>(() => {
    return AssignmentStatusService.getWorkbooksWithStatus(
      templateWorkbooks,
      user._id,
      workbooks
    );
  }, [templateWorkbooks, user._id, workbooks]);

  // 🎯 NEW: Get counts for UI feedback
  const assignmentCounts = useMemo(() => {
    const assigned = workbooksWithStatus.filter(wb => wb.isAssigned).length;
    const available = workbooksWithStatus.filter(wb => wb.isAvailable).length;
    return { assigned, available, total: workbooksWithStatus.length };
  }, [workbooksWithStatus]);
  const [dashboardLink, setDashboardLink] = useState<string>("");
  const [workbookTitles, setWorkbookTitles] = useState<string[]>([]);

  const handleWorkbookToggle = (workbookId: string) => {
    setSelectedWorkbooks((prev) =>
      prev.includes(workbookId)
        ? prev.filter((id) => id !== workbookId)
        : [...prev, workbookId]
    );
  };

  const handleAssign = async () => {
    try {
      const { dashboardLink, workbookTitles } = await assignWorkbooks(
        user,
        selectedWorkbooks
      );
      setDashboardLink(dashboardLink);
      setWorkbookTitles(workbookTitles);
      onAssign(user);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleSendEmail = async () => {
    try {
      await sendAssignmentEmail(user, dashboardLink, workbookTitles);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!dashboardLink ? (
          <>
            <div className="bg-gradient-to-r from-[#0B4073] to-[#1a5490] p-6 rounded-2xl mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Assign Workbooks to {user.name}
              </h3>
              <p className="text-white/80 text-sm">
                Select workbooks to assign to this user
              </p>
              {/* 🎯 NEW: Assignment status summary */}
              <div className="mt-4 flex items-center gap-4 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <FiInfo className="text-white/70" />
                  <span>{assignmentCounts.assigned} already assigned</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-300" />
                  <span>{assignmentCounts.available} available</span>
                </div>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto mb-6 space-y-3 pr-2">
              {/* 🎯 NEW: Use workbooks with status instead of plain templates */}
              {workbooksWithStatus.map((workbook) => {
                const isAssigned = workbook.isAssigned;
                const isDisabled = isAssigned;
                
                return (
                  <label
                    key={workbook._id}
                    className={`group flex items-start p-5 bg-gradient-to-br backdrop-blur-lg border rounded-2xl shadow-lg transition-all duration-300 ${
                      isDisabled
                        ? "from-gray-100/90 to-gray-200/70 border-gray-200 cursor-not-allowed opacity-60"
                        : selectedWorkbooks.includes(workbook._id)
                        ? "from-blue-50/90 to-blue-100/70 border-[#0B4073] ring-2 ring-[#0B4073]/20 cursor-pointer hover:shadow-xl transform hover:-translate-y-1"
                        : "from-white/90 to-white/70 border-white/20 hover:border-[#7094B7]/30 cursor-pointer hover:shadow-xl transform hover:-translate-y-1"
                    }`}
                  >
                    <div className="flex items-center mt-1">
                      <input
                        type="checkbox"
                        checked={selectedWorkbooks.includes(workbook._id)}
                        onChange={() => !isDisabled && handleWorkbookToggle(workbook._id)}
                        disabled={isDisabled}
                        className={`h-5 w-5 text-[#0B4073] bg-white border-2 rounded-lg focus:ring-[#0B4073] focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                          isDisabled ? "border-gray-300 cursor-not-allowed" : "border-gray-300"
                        }`}
                      />
                      {selectedWorkbooks.includes(workbook._id) && !isDisabled && (
                        <div className="ml-2 px-2 py-1 bg-gradient-to-r from-[#0B4073] to-[#1a5490] text-white text-xs font-medium rounded-full">
                          Selected
                        </div>
                      )}
                      {isAssigned && (
                        <div className="ml-2 px-2 py-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs font-medium rounded-full">
                          Already Assigned
                        </div>
                      )}
                    </div>
                    <div className="flex-1 ml-4">
                      <h4 className={`font-bold transition-colors duration-200 ${
                        isDisabled ? "text-gray-500" : "text-gray-800 group-hover:text-[#0B4073]"
                      }`}>
                        {workbook.title}
                      </h4>
                      <p className={`text-sm leading-relaxed ${
                        isDisabled ? "text-gray-400" : "text-gray-600"
                      }`}>
                        {workbook.description?.substring(0, 120) ||
                          "No description"}
                        ...
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                disabled={isAssigning}
                className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={isAssigning || selectedWorkbooks.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-[#0B4073] to-[#1a5490] text-white font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
              >
                {isAssigning ? "Assigning..." : "Assign Workbooks"}
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
                Workbooks Assigned Successfully!
              </h3>
              <p className="text-gray-600">
                {selectedWorkbooks.length} workbook
                {selectedWorkbooks.length === 1 ? "" : "s"} assigned to{" "}
                {user.name}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dashboard Link for {user.name}:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={dashboardLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                />
                <button
                  onClick={() => copyDashboardLink(dashboardLink)}
                  className="px-3 py-2 bg-[#0B4073] text-white rounded-md hover:bg-[#0B4073]/90 text-sm flex items-center"
                >
                  <FiCopy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Send this link to {user.name} to access their dashboard with all
                assigned workbooks
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleSendEmail}
                disabled={isSendingEmail}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
              >
                <FiMail className="inline mr-2" />
                {isSendingEmail ? "Sending Email..." : "Send Email"}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-[#0B4073] to-[#1a5490] text-white font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
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

export default ModernWorkbookAssignModal;
