"use client";

import { FiPlus, FiTrash2, FiUsers, FiBookOpen } from "react-icons/fi";
import ModernWorkbookAssignModal from "../models/ModernWorkbookAssignModal";
import { User, Workbook } from "../types";
import { useDashboard } from "../context/DashboardContext";
import { useState } from "react";
import * as Sentry from "@sentry/react";
import { fetchWithTimeout } from "../utils/api";
import ConfirmModal from "./userAssignmentView/components/ConfirmModal";
import { API_BASE_URL } from "../utils/apiConfig";

const UsersView = ({
  setShowCreateUserModal,
  showToast,

  refreshDashboardData,
}: {
  setShowCreateUserModal: (value: boolean) => void;
  setShowAssignModal: (value: boolean) => void;
  setWorkbookToAssign: (workbook: Workbook | null) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  updateUsers: (users: User[]) => void;
  refreshDashboardData: () => Promise<void>;
}) => {
  const { users, workbooks } = useDashboard();
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [showAssignWorkbookModal, setShowAssignWorkbookModal] = useState(false);
  const [userForAssignment, setUserForAssignment] = useState<User | null>(null);
  const [showConfirm, setShowConfirm] = useState<{
    userId: string;
    userName: string;
    workbookCount: number;
  } | null>(null);

  const getUserWorkbooks = (userId: string) => {
    return workbooks.filter((wb) => wb.assignedTo === userId);
  };

  const handleDeleteUser = async (
    userId: string,
    userName: string,
    workbookCount: number
  ) => {
    setShowConfirm({ userId, userName, workbookCount });
  };

  const confirmDeleteUser = async () => {
    if (!showConfirm) return;

    const { userId, userName, workbookCount } = showConfirm;
    setDeletingUserId(userId);
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/admin/users/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        showToast(
          `${userName} and ${workbookCount} workbook assignments removed`,
          "success"
        );
        await refreshDashboardData();
      } else {
        const errorData = await response.json();
        showToast(errorData.message || "Failed to remove user", "error");
      }
    } catch (err) {
      console.error("Delete user error:", err);
      Sentry.captureException(err);
      showToast("Error removing user", "error");
    } finally {
      setDeletingUserId(null);
      setShowConfirm(null);
    }
  };

  const handleAssignMoreWorkbooks = (user: User) => {
    setUserForAssignment(user);
    setShowAssignWorkbookModal(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FiUsers className="mr-2 text-[#0B4073]" />
          User Management
        </h2>
        <button
          className="px-4 py-2 bg-[#0B4073] text-white rounded-lg text-sm hover:bg-[#0B4073]/90 transition flex items-center"
          onClick={() => setShowCreateUserModal(true)}
        >
          <FiPlus className="mr-2" />
          Add New User
        </button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <FiUsers className="mx-auto text-gray-400 text-4xl mb-4" />
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workbooks
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users
                .filter((user) => user.role !== "admin")
                .map((user) => {
                  const userWorkbooks = getUserWorkbooks(user._id);
                  return (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {userWorkbooks.length} workbook
                              {userWorkbooks.length !== 1 ? "s" : ""}
                            </span>
                            {userWorkbooks.length > 0 && (
                              <button
                                onClick={() => handleAssignMoreWorkbooks(user)}
                                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
                                title="Assign more workbooks"
                              >
                                + Assign More
                              </button>
                            )}
                          </div>
                          {userWorkbooks.length > 0 && (
                            <div className="text-xs text-gray-500 space-y-1">
                              {userWorkbooks.slice(0, 2).map((wb) => (
                                <div
                                  key={wb._id}
                                  className="flex items-center space-x-1"
                                >
                                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                  <span
                                    className="truncate max-w-[200px]"
                                    title={wb.title}
                                  >
                                    {wb.title}
                                  </span>
                                </div>
                              ))}
                              {userWorkbooks.length > 2 && (
                                <div className="text-xs text-gray-400 italic">
                                  +{userWorkbooks.length - 2} more...
                                </div>
                              )}
                            </div>
                          )}
                          {userWorkbooks.length === 0 && (
                            <button
                              onClick={() => handleAssignMoreWorkbooks(user)}
                              className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition flex items-center space-x-1"
                            >
                              <FiBookOpen className="w-3 h-3" />
                              <span>Assign Workbooks</span>
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-3">
                          <button
                            onClick={() =>
                              handleDeleteUser(
                                user._id,
                                user.name,
                                userWorkbooks.length
                              )
                            }
                            disabled={deletingUserId === user._id}
                            className={`text-lg ${
                              deletingUserId === user._id
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-600 hover:text-red-800"
                            } transition`}
                            title="Delete user"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {showAssignWorkbookModal && userForAssignment && (
        <div
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="assign-workbook-modal"
        >
          <ModernWorkbookAssignModal
            user={userForAssignment}
            onAssign={async (user: User) => {
              await refreshDashboardData();
            }}
            onClose={() => {
              setShowAssignWorkbookModal(false);
              setUserForAssignment(null);
            }}
            showToast={showToast}
          />
        </div>
      )}

      {showConfirm && (
        <ConfirmModal
          title="Confirm Delete User"
          message={`Delete ${showConfirm.userName} and ${showConfirm.workbookCount} assignments? This action cannot be undone.`}
          onConfirm={confirmDeleteUser}
          onCancel={() => setShowConfirm(null)}
        />
      )}
    </div>
  );
};

export default UsersView;
