"use client";

import { useState, FormEvent } from "react";
import {
  FiArrowRight,
  FiArrowLeft,
  FiMail,
  FiCheckCircle,
} from "react-icons/fi";
import { useDashboard } from "../context/DashboardContext";
import { API_BASE_URL } from "../utils/apiConfig";
import * as Sentry from "@sentry/react";
import { useWorkbookAssignment } from "./useWorkbookAssignment";
import { User } from "../types";

interface CreateUserModalProps {
  onClose: () => void;
  onUserCreated: () => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  preSelectedWorkbooks?: string[];
}

const CreateUserModal = ({
  onClose,
  onUserCreated,
  showToast,
  preSelectedWorkbooks = [],
}: CreateUserModalProps) => {
  const { templateWorkbooks } = useDashboard();
  const {
    assignWorkbooks,
    sendAssignmentEmail,
    copyDashboardLink,
    isAssigning,
    isSendingEmail,
  } = useWorkbookAssignment(showToast);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [createdUser, setCreatedUser] = useState<User | null>(null);
  const [showWorkbookSelection, setShowWorkbookSelection] = useState(
    preSelectedWorkbooks.length === 0
  );
  const [selectedWorkbooks, setSelectedWorkbooks] =
    useState<string[]>(preSelectedWorkbooks);
  const [dashboardLink, setDashboardLink] = useState<string>("");
  const [workbookTitles, setWorkbookTitles] = useState<string[]>([]);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !isValidEmail(email)) {
      setError("Please provide a valid name and email");
      showToast("Please provide a valid name and email", "error");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role: "user" }),
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        // Validate that data.user matches the User interface
        const user: User = {
          _id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role || "user", // Fallback to "user" if role is missing
          ...(data.user.workbooks && { workbooks: data.user.workbooks }),
          ...(data.user.createdAt && { createdAt: data.user.createdAt }),
          ...(data.user.updatedAt && { updatedAt: data.user.updatedAt }),
        };
        setCreatedUser(user);
        if (preSelectedWorkbooks.length > 0) {
          const { dashboardLink, workbookTitles } = await assignWorkbooks(
            user,
            preSelectedWorkbooks
          );
          setDashboardLink(dashboardLink);
          setWorkbookTitles(workbookTitles);
        } else {
          setShowWorkbookSelection(true);
        }
      } else {
        setError(data.message || "Failed to create user");
        showToast(data.message || "Failed to create user", "error");
      }
    } catch (err) {
      Sentry.captureException(err);
      setError("An error occurred while creating the user");
      showToast("An error occurred while creating the user", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignWorkbooks = async () => {
    if (!createdUser || selectedWorkbooks.length === 0) {
      showToast("Please select at least one workbook", "error");
      return;
    }
    try {
      const { dashboardLink, workbookTitles } = await assignWorkbooks(
        createdUser,
        selectedWorkbooks
      );
      setDashboardLink(dashboardLink);
      setWorkbookTitles(workbookTitles);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleSendEmail = async () => {
    if (!createdUser || !dashboardLink) {
      showToast("Please provide a valid email and assigned workbooks", "error");
      return;
    }
    try {
      await sendAssignmentEmail(createdUser, dashboardLink, workbookTitles);
      setEmailSent(true);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleWorkbookToggle = (workbookId: string) => {
    setSelectedWorkbooks((prev) =>
      prev.includes(workbookId)
        ? prev.filter((id) => id !== workbookId)
        : [...prev, workbookId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!createdUser ? (
          <>
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Create New User
            </h3>
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0B4073] focus:border-[#0B4073]"
                  placeholder="Enter user's name"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0B4073] focus:border-[#0B4073]"
                  placeholder="Enter user's email"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#0B4073] text-white rounded-lg hover:bg-[#0B4073]/90 disabled:opacity-50 flex items-center"
                >
                  {isLoading ? "Creating..." : "Create User"}
                  {!isLoading && <FiArrowRight className="ml-2" />}
                </button>
              </div>
            </form>
          </>
        ) : showWorkbookSelection && !dashboardLink ? (
          <>
            <div className="bg-gradient-to-r from-[#0B4073] to-[#1a5490] p-6 rounded-2xl mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Assign Workbooks to {name}
              </h3>
              <p className="text-white/80 text-sm">
                Select one or more workbooks to assign to this user
              </p>
            </div>
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-medium text-gray-700">
                {selectedWorkbooks.length} of {templateWorkbooks.length}{" "}
                selected
              </span>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedWorkbooks(templateWorkbooks.map((wb) => wb._id))
                  }
                  className="px-4 py-2 bg-gradient-to-r from-[#7094B7] to-[#1a5490] text-white font-medium rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedWorkbooks([])}
                  className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto mb-6 space-y-3 pr-2">
              {/* 🎯 NOTE: CreateUserModal shows ALL workbooks since this is for NEW users (no existing assignments) */}
              {templateWorkbooks.map((workbook) => (
                <label
                  key={workbook._id}
                  className={`group flex items-start p-5 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg border rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                    selectedWorkbooks.includes(workbook._id)
                      ? "border-[#0B4073] ring-2 ring-[#0B4073]/20 bg-gradient-to-br from-blue-50/90 to-blue-100/70"
                      : "border-white/20 hover:border-[#7094B7]/30"
                  }`}
                >
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      checked={selectedWorkbooks.includes(workbook._id)}
                      onChange={() => handleWorkbookToggle(workbook._id)}
                      className="h-5 w-5 text-[#0B4073] bg-white border-2 border-gray-300 rounded-lg focus:ring-[#0B4073] focus:ring-2 focus:ring-offset-0 transition-all duration-200"
                    />
                    {selectedWorkbooks.includes(workbook._id) && (
                      <div className="ml-2 px-2 py-1 bg-gradient-to-r from-[#0B4073] to-[#1a5490] text-white text-xs font-medium rounded-full">
                        Selected
                      </div>
                    )}
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-800 group-hover:text-[#0B4073] transition-colors duration-200">
                        {workbook.title}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {workbook.description?.substring(0, 120) ||
                        "No description"}
                      ...
                    </p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-between space-x-4">
              <button
                type="button"
                onClick={() => setShowWorkbookSelection(false)}
                disabled={isAssigning}
                className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center"
              >
                <FiArrowLeft className="mr-2" />
                Back
              </button>
              <button
                type="button"
                onClick={handleAssignWorkbooks}
                disabled={isAssigning || selectedWorkbooks.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-[#0B4073] to-[#1a5490] text-white font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center"
              >
                {isAssigning ? "Assigning..." : "Assign Workbooks"}
                {!isAssigning && <FiArrowRight className="ml-2" />}
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
                User Created Successfully!
              </h3>
              <p className="text-gray-600">
                {name} has been created with {selectedWorkbooks.length} workbook
                {selectedWorkbooks.length === 1 ? "" : "s"} assigned
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dashboard Link for {name}:
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
                  Copy
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Send this link to {name} to access their dashboard with all
                assigned workbooks
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleSendEmail}
                disabled={isSendingEmail || emailSent}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center"
              >
                <FiMail className="mr-2" />
                {isSendingEmail
                  ? "Sending Email..."
                  : emailSent
                    ? "Email Sent"
                    : "Send Email"}
              </button>
              <button
                onClick={() => {
                  onUserCreated();
                  onClose();
                }}
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

export default CreateUserModal;
