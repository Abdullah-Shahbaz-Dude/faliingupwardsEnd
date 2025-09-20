"use client";

import { useState, useCallback, useMemo } from "react";
import {
  FiUserPlus,
  FiBook,
  FiArrowRight,
  FiEye,
  FiInfo,
  FiCheckCircle,
} from "react-icons/fi";
import { useDashboard } from "../context/DashboardContext";
import * as Sentry from "@sentry/react";
import { API_BASE_URL } from "../utils/apiConfig";
import CreateUserModal from "../models/CreateUserModal";
import Link from "next/link";
import { AssignmentStatusService, WorkbookWithStatus } from "../utils/assignmentStatus";


interface WorkbooksViewProps {
  showToast: (message: string, type: "success" | "error" | "info") => void;
  refreshData?: () => Promise<void>; // Optional page-level refresh function
}

// Simple WorkbooksView Component
const WorkbooksView = ({ showToast, refreshData }: WorkbooksViewProps) => {
  const { 
    templateWorkbooks, 
    workbooks, // All workbooks (templates + user copies)
    users, 
    refreshAllData, // Simple refresh function for after actions
  } = useDashboard();
  const [selectedWorkbooks, setSelectedWorkbooks] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  // 🎯 NEW: Get workbooks with assignment status for selected user
  const workbooksWithStatus = useMemo<WorkbookWithStatus[]>(() => {
    return AssignmentStatusService.getWorkbooksWithStatus(
      templateWorkbooks,
      selectedUser,
      workbooks
    );
  }, [templateWorkbooks, selectedUser, workbooks]);

  // 🎯 NEW: Get assignment counts for UI feedback
  const assignmentCounts = useMemo(() => {
    if (!selectedUser) {
      return { assigned: 0, available: templateWorkbooks.length };
    }
    const assigned = workbooksWithStatus.filter(wb => wb.isAssigned).length;
    const available = workbooksWithStatus.filter(wb => wb.isAvailable).length;
    return { assigned, available };
  }, [workbooksWithStatus, selectedUser, templateWorkbooks.length]);

  const toggleWorkbookSelection = useCallback((workbookId: string) => {
    setSelectedWorkbooks((prev) =>
      prev.includes(workbookId)
        ? prev.filter((id) => id !== workbookId)
        : [...prev, workbookId]
    );
  }, []);

  // No manual refresh needed - UI updates automatically after actions

  const handleAssignSelected = async () => {
    if (!selectedUser || selectedWorkbooks.length === 0) {
      showToast("Please select a user and at least one workbook", "error");
      return;
    }
    
    setIsAssigning(true);
    const totalWorkbooks = selectedWorkbooks.length;
    let completedCount = 0;
    let successCount = 0;
    
    try {
      // Process in batches of 3 to avoid overwhelming the server
      const batchSize = 3;
      const batches = [];
      
      for (let i = 0; i < selectedWorkbooks.length; i += batchSize) {
        batches.push(selectedWorkbooks.slice(i, i + batchSize));
      }
      
      // Process each batch sequentially
      for (const batch of batches) {
        const batchPromises = batch.map(async (workbookId) => {
          try {
            const response = await fetch(
              `${API_BASE_URL}/api/admin/workbooks/assign`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ workbookId, userId: selectedUser }),
                credentials: "include",
              }
            );
            
            completedCount++;
            if (response.ok) {
              successCount++;
            }
            
            // Update progress
            const progress = Math.round((completedCount / totalWorkbooks) * 100);
            showToast(`Assigning workbooks... ${progress}% (${completedCount}/${totalWorkbooks})`, "info");
            
            return { success: response.ok, workbookId, error: null };
          } catch (error) {
            completedCount++;
            return { success: false, workbookId, error: error instanceof Error ? error.message : 'Unknown error' };
          }
        });
        
        // Wait for current batch to complete before starting next batch
        await Promise.allSettled(batchPromises);
        
        // Small delay between batches to prevent server overload
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      // Final result
      if (successCount === totalWorkbooks) {
        showToast(`All ${totalWorkbooks} workbooks assigned successfully! 🎉`, "success");
        setSelectedWorkbooks([]);
        if (refreshData) {
          await refreshData();
        }
      } else if (successCount > 0) {
        showToast(`${successCount}/${totalWorkbooks} workbooks assigned successfully`, "success");
        if (refreshData) {
          await refreshData();
        }
      } else {
        showToast("Failed to assign workbooks. Please try again.", "error");
      }
    } catch (error) {
      Sentry.captureException(error);
      showToast("Error assigning workbooks", "error");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {showCreateUserModal && (
        <CreateUserModal
          onClose={() => setShowCreateUserModal(false)}
          onUserCreated={refreshAllData}
          showToast={showToast}
          preSelectedWorkbooks={selectedWorkbooks}
        />
      )}

      {templateWorkbooks.length === 0 ? (
        <div className="text-center py-12">
          <FiBook className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No workbooks
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new workbook.
          </p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Workbook Management
            </h2>
            <div className="text-sm text-gray-600">
              {selectedWorkbooks.length} of {templateWorkbooks.length} selected
            </div>
          </div>

          {/* User Selection */}
          <div className="mb-6 space-y-3">
            <select
              value={selectedUser || ""}
              onChange={(e) => {
                setSelectedUser(e.target.value || null);
                setSelectedWorkbooks([]);
              }}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4073] focus:border-transparent bg-white text-sm"
            >
              <option value="">Select a user</option>
              {users
                .filter((u) => u.role === "user")
                .map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
            </select>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleAssignSelected}
                disabled={isAssigning || !selectedUser || selectedWorkbooks.length === 0}
                className="flex-1 px-4 py-2.5 bg-[#0B4073] text-white rounded-lg hover:bg-[#1a5490] transition disabled:opacity-50 flex items-center justify-center text-sm font-medium"
              >
                {isAssigning ? "Assigning..." : "Confirm Assignment"}
                {!isAssigning && <FiArrowRight className="ml-2 w-4 h-4" />}
              </button>
              <button
                onClick={() => setShowCreateUserModal(true)}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center text-sm font-medium"
              >
                <FiUserPlus className="mr-2 w-4 h-4" />
                <span className="hidden sm:inline">Create & Assign to New User</span>
                <span className="sm:hidden">New User</span>
              </button>
            </div>
          </div>

          {/* Selection Controls */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              type="button"
              onClick={() => {
                if (selectedUser) {
                  const availableIds = workbooksWithStatus
                    .filter(wb => wb.isAvailable)
                    .map(wb => wb._id);
                  setSelectedWorkbooks(availableIds);
                } else {
                  setSelectedWorkbooks(templateWorkbooks.map((wb) => wb._id));
                }
              }}
              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => setSelectedWorkbooks([])}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm"
            >
              Clear All
            </button>
          </div>
          {/* Workbooks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workbooksWithStatus.map((workbook) => {
              const isAssigned = workbook.isAssigned;
              const isDisabled = selectedUser && isAssigned;
              
              return (
                <div
                  key={workbook._id}
                  className={`border rounded-lg p-4 transition-all cursor-pointer ${
                    isDisabled
                      ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                      : selectedWorkbooks.includes(workbook._id)
                      ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200"
                      : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                  onClick={() => !isDisabled && toggleWorkbookSelection(workbook._id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <input
                      type="checkbox"
                      checked={selectedWorkbooks.includes(workbook._id)}
                      onChange={() => toggleWorkbookSelection(workbook._id)}
                      disabled={!!isDisabled}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex flex-wrap gap-1">
                      {isAssigned && selectedUser && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                          Assigned
                        </span>
                      )}
                      {selectedWorkbooks.includes(workbook._id) && !isDisabled && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          Selected
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h3 className={`font-semibold mb-2 ${
                    isDisabled ? "text-gray-500" : "text-gray-900"
                  }`}>
                    {workbook.title}
                  </h3>
                  
                  <p className={`text-sm mb-3 line-clamp-2 ${
                    isDisabled ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {workbook.description || "No description"}
                  </p>
                  
                  <Link
                    href={`/workbook/${workbook._id}?from=admin-dashboard`}
                    className={`inline-flex items-center text-sm px-3 py-1.5 rounded transition ${
                      isDisabled
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiEye className="mr-1 w-4 h-4" />
                    View
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkbooksView;
