import {
  FiBook,
  FiCheckCircle,
  FiEdit,
  FiFileText,
  FiPlus,
  FiUsers, 
} from "react-icons/fi";
import { useState } from "react";
import UserAssignmentsView from "./UserAssignmentsView";
import { useDashboard } from "../context/DashboardContext";
import { handleDeleteUser } from "../utils/handleButtons";
import RefreshControls from "../components/RefreshControls";
import ConfirmModal from "./userAssignmentView/components/ConfirmModal";

const DashboardView = ({
  setShowCreateUserModal,
  setActiveTab,
  refreshDashboardData,
  showToast,
}: {
  setShowCreateUserModal: (value: boolean) => void;
  setActiveTab: (tab: string) => void;
  refreshDashboardData: () => Promise<void>;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}) => {
  const { 
    workbooks, 
    users, 
  } = useDashboard();

  // Modal state for user deletion confirmation
  const [showConfirm, setShowConfirm] = useState<{
    userId: string;
    userName: string;
    workbookCount: number;
  } | null>(null);

  // Mock submission data for now
  const submissionData: any[] = [];

  const handleWorkbookPreview = (workbook: any) => {
    // Always navigate back to main dashboard regardless of current tab
    window.location.href = `/workbook/${workbook._id}?from=admin-dashboard`;
  };

  const handleDeleteAssignment = async (
    workbookId: string,
    userName: string
  ) => {
    try {
      const response = await fetch(`/api/admin/workbooks/${workbookId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        showToast(`Workbook removed from ${userName}`, "success");
        // Use page-level refresh for consistency with manual refresh button
        await refreshDashboardData();
      } else {
        const errorData = await response.json();
        showToast(
          errorData.message || "Failed to remove workbook assignment",
          "error"
        );
      }
    } catch (err) {
      showToast("Error removing workbook assignment", "error");
    }
  };

  const templateWorkbooks = workbooks.filter((w) => w.isTemplate === true);

  // Count user-assigned workbooks (copies of templates)
  const assignedWorkbooks = workbooks.filter(
    (w) => w.assignedTo && w.isTemplate !== true
  );
  const submittedWorkbooks = assignedWorkbooks.filter(
    (w) => w.status === "submitted"
  );

  // Data integrity check - can be removed in production
  const noTemplateField = workbooks.filter(wb => wb.isTemplate === undefined);
  if (noTemplateField.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn(`Found ${noTemplateField.length} workbooks without isTemplate field`);
  }

  const stats = {
    totalUsers: users.filter((u) => u.role === "user").length,
    totalWorkbooks: templateWorkbooks.length, // Always 28 master templates
    assignedWorkbooks: assignedWorkbooks.length, // Only user copies
    submittedWorkbooks: submittedWorkbooks.length, // Only submitted user copies
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Modern Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 p-4 sm:p-6 flex flex-col sm:flex-row items-center transform hover:-translate-y-1">
          <div className="rounded-2xl bg-gradient-to-br from-[#D6E2EA] to-[#b8cdd9] p-3 sm:p-4 mb-2 sm:mb-0 sm:mr-4 shadow-lg">
            <FiUsers className="text-[#0B4073] text-lg sm:text-xl" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#0B4073] to-[#1a5490] bg-clip-text text-transparent">
              {stats.totalUsers}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Total Users</p>
            <p className="text-xs text-gray-500 font-medium hidden sm:block">
              Active in system
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 p-4 sm:p-6 flex flex-col sm:flex-row items-center transform hover:-translate-y-1">
          <div className="rounded-2xl bg-gradient-to-br from-[#7094B7]/30 to-[#7094B7]/20 p-3 sm:p-4 mb-2 sm:mb-0 sm:mr-4 shadow-lg">
            <FiFileText className="text-[#7094B7] text-lg sm:text-xl" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#0B4073] to-[#1a5490] bg-clip-text text-transparent">
              {stats.totalWorkbooks}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">
              Workbooks
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 p-4 sm:p-6 flex flex-col sm:flex-row items-center transform hover:-translate-y-1">
          <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 p-3 sm:p-4 mb-2 sm:mb-0 sm:mr-4 shadow-lg">
            <FiBook className="text-blue-600 text-lg sm:text-xl" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#0B4073] to-[#1a5490] bg-clip-text text-transparent">
              {stats.assignedWorkbooks}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Assigned</p>
            <p className="text-xs text-gray-500 font-medium hidden sm:block">
              Currently active
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 p-4 sm:p-6 flex flex-col sm:flex-row items-center transform hover:-translate-y-1">
          <div className="rounded-2xl bg-gradient-to-br from-green-100 to-green-200 p-3 sm:p-4 mb-2 sm:mb-0 sm:mr-4 shadow-lg">
            <FiCheckCircle className="text-green-600 text-lg sm:text-xl" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#0B4073] to-[#1a5490] bg-clip-text text-transparent">
              {stats.submittedWorkbooks}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Submitted</p>
            <p className="text-xs text-gray-500 font-medium hidden sm:block">
              Awaiting review
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        {/* Modern User Assignments */}
        <div className="xl:col-span-2 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#0B4073] to-[#1a5490] bg-clip-text text-transparent flex items-center">
              <FiUsers className="mr-3 text-[#0B4073]" />
              User Assignments
            </h2>
            <RefreshControls pageRefresh={refreshDashboardData} />
          </div>

        <UserAssignmentsView
          workbooks={workbooks}
          users={users}
          onDeleteAssignment={handleDeleteAssignment}
          onDeleteUser={async (id, name, count) => {
            setShowConfirm({ userId: id, userName: name, workbookCount: count });
          }}
          onPreviewWorkbook={handleWorkbookPreview}
          submissionData={submissionData}
          onRefreshData={refreshDashboardData}
          setActiveTab={setActiveTab}
        />
        </div>

        {/* Quick Actions */}
        <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FiEdit className="mr-3 text-[#0B4073]" />
              Quick Actions
            </h2>
          </div>

          <div className="space-y-4">
            <button
              className="w-full p-4 bg-gradient-to-r from-[#0B4073] to-[#7094B7] text-white rounded-lg hover:from-[#0B4073]/90 hover:to-[#7094B7]/90 flex items-center justify-center transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              onClick={() => setShowCreateUserModal(true)}
            >
              <FiPlus className="mr-2" />
              Create New User
            </button>

            <button
              className="w-full p-4 bg-gradient-to-r from-[#7094B7] to-[#0B4073] text-white rounded-lg hover:from-[#7094B7]/90 hover:to-[#0B4073]/90 flex items-center justify-center transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              onClick={() => setActiveTab("workbooks")}
            >
              <FiFileText className="mr-2" />
              Manage Workbooks
            </button>

            <div className="border-t border-gray-200 pt-5 mt-6">
              <div className="text-center p-4 bg-gradient-to-br from-[#0B4073]/5 to-[#7094B7]/5 rounded-lg border border-[#0B4073]/20">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Pending Review
                </h4>
                <p className="text-3xl font-bold text-[#0B4073] mb-1">
                  {workbooks.filter((wb) => wb.status === "submitted").length}
                </p>
                <p className="text-xs text-gray-500">Workbooks awaiting review</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      {/* User Deletion Confirmation Modal */}
      {showConfirm && (
        <ConfirmModal
          title="Confirm Delete User"
          message={`Delete ${showConfirm.userName} and ${showConfirm.workbookCount} assignments? This action cannot be undone.`}
          onConfirm={async () => {
            await handleDeleteUser(
              showConfirm.userId,
              showConfirm.userName,
              showConfirm.workbookCount,
              showToast,
              refreshDashboardData
            );
            setShowConfirm(null);
          }}
          onCancel={() => setShowConfirm(null)}
        />
      )}
    </div>
  );
};

export default DashboardView;
