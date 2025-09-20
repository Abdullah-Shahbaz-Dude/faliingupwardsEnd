import { useState, useMemo, useEffect } from "react";
import { FiSearch, FiFilter, FiUser, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import { SubmissionData, User, Workbook } from "../types";
import NoAssignmentsMessage from "./userAssignmentView/components/NoAssignmentsMessage";
import AssignmentList from "./userAssignmentView/components/AssignmentList";
import LoadMoreButton from "./userAssignmentView/components/LoadMoreButton";

import { API_BASE_URL } from "../utils/apiConfig";

// Main UserAssignmentsView Component
const UserAssignmentsView = ({
  workbooks,
  users,
  onDeleteAssignment,
  onDeleteUser,
  onPreviewWorkbook,
  submissionData,
  onRefreshData,
  setActiveTab,
}: {
  workbooks: Workbook[];
  users: User[];
  onDeleteAssignment: (workbookId: string, userName: string) => Promise<void>;
  onDeleteUser: (
    userId: string,
    userName: string,
    workbookCount: number
  ) => Promise<void>;
  onPreviewWorkbook: (workbook: Workbook) => void;
  submissionData: SubmissionData[];
  onRefreshData: () => void;
  setActiveTab?: (tab: string) => void;
}) => {
  const [deletingWorkbookId, setDeletingWorkbookId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [expandedWorkbook, setExpandedWorkbook] = useState<string | null>(null);
  const [workbookSubmissions, setWorkbookSubmissions] = useState<{
    [key: string]: SubmissionData;
  }>({});
  const [visibleCount, setVisibleCount] = useState(6);


  // NEW: Search and filter states (client-side for now)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  


  // Use the existing onDeleteAssignment prop - it already works!
  const handleDeleteAssignment = onDeleteAssignment;

  const handleDeleteUser = async (
    userId: string,
    userName: string,
    workbookCount: number
  ) => {
    try {
      setDeletingUserId(userId);
      await onDeleteUser(userId, userName, workbookCount);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setDeletingUserId(null);
    }
  };



  const handleWorkbookPreview = (workbookId: string) => {
    const workbook = workbooks.find(wb => wb._id === workbookId);
    if (workbook) {
      onPreviewWorkbook(workbook);
    }
  };

  const toggleWorkbookPreview = (workbookId: string) => {
    setExpandedWorkbook(expandedWorkbook === workbookId ? null : workbookId);
    
    // Load submission data if expanding and not already loaded
    if (expandedWorkbook !== workbookId && !workbookSubmissions[workbookId]) {
      loadWorkbookSubmission(workbookId);
    }
  };

  const loadWorkbookSubmission = async (workbookId: string) => {
    try {
      setWorkbookSubmissions(prev => ({
        ...prev,
        [workbookId]: { loading: true }
      }));

      const response = await fetch(`/api/workbook/${workbookId}/submission`);
      const data = await response.json();

      if (data.success) {
        setWorkbookSubmissions(prev => ({
          ...prev,
          [workbookId]: { data: data.data, loading: false }
        }));
      } else {
        setWorkbookSubmissions(prev => ({
          ...prev,
          [workbookId]: { error: data.message || 'Failed to load submission', loading: false }
        }));
      }
    } catch (error) {
      setWorkbookSubmissions(prev => ({
        ...prev,
        [workbookId]: { error: 'Network error loading submission', loading: false }
      }));
    }
  };

  // IMPROVED: Enhanced data processing with search and filtering
  const getUserAssignments = useMemo(() => {
    const assignedWorkbooks = workbooks.filter((wb) => wb.assignedTo);
    const userMap = new Map<string, User>(
      users.map((user) => [user._id, user])
    );
    const userAssignments: {
      [userId: string]: { user: User; workbooks: Workbook[] };
    } = {};

    assignedWorkbooks.forEach((workbook) => {
      let user = userMap.get(workbook.assignedTo || "");
      if (!user && workbook.userName) {
        user = users.find((u) => u.name === workbook.userName);
      }
      if (!user && workbook.userEmail) {
        user = users.find((u) => u.email === workbook.userEmail);
      }

      if (user) {
        if (!userAssignments[user._id]) {
          userAssignments[user._id] = { user, workbooks: [] };
        }
        userAssignments[user._id].workbooks.push(workbook);
      }
    });

    let assignments = Object.values(userAssignments);

    // Apply search filter
    if (searchTerm) {
      assignments = assignments.filter(assignment =>
        assignment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.workbooks.some(wb => 
          wb.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      assignments = assignments.filter(assignment => {
        const statuses = assignment.workbooks.map(wb => wb.status);
        switch (statusFilter) {
          case "submitted":
            return statuses.some(status => status === "submitted");
          case "in_progress":
            return statuses.some(status => status === "in_progress");
          case "waiting":
            return statuses.every(status => status === "assigned");
          default:
            return true;
        }
      });
    }

    // Apply sorting
    assignments.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.user.name.localeCompare(b.user.name);
        case "email":
          return a.user.email.localeCompare(b.user.email);
        case "workbooks":
          return b.workbooks.length - a.workbooks.length;
        case "recent":
        default:
          const getLatestTimestamp = (workbooks: Workbook[]) =>
            Math.max(
              ...workbooks.map((wb) => {
                const date = new Date(wb.updatedAt || wb.createdAt || Date.now());
                return date.getTime();
              })
            );
          const aLatest = getLatestTimestamp(a.workbooks);
          const bLatest = getLatestTimestamp(b.workbooks);
          return bLatest - aLatest;
      }
    });

    return assignments;
  }, [workbooks, users, searchTerm, statusFilter, sortBy]);

  // 🎯 NEW: Collapsible workbook lists state - START COLLAPSED for better performance
  const [collapsedUsers, setCollapsedUsers] = useState<Set<string>>(new Set());

  // Initialize collapsed state when assignments change - START ALL COLLAPSED
  useEffect(() => {
    const allUserIds = getUserAssignments.map(assignment => assignment.user._id);
    setCollapsedUsers(new Set(allUserIds)); // All users start collapsed
  }, [getUserAssignments]);

  // Toggle collapse/expand for a specific user
  const toggleUserCollapse = (userId: string) => {
    setCollapsedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  // Expand all users
  const expandAllUsers = () => {
    setCollapsedUsers(new Set());
  };

  // Collapse all users
  const collapseAllUsers = () => {
    const allUserIds = getUserAssignments.map(assignment => assignment.user._id);
    setCollapsedUsers(new Set(allUserIds));
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = getUserAssignments.length;
    const submitted = getUserAssignments.filter(assignment =>
      assignment.workbooks.some(wb => wb.status === "submitted")
    ).length;
    const inProgress = getUserAssignments.filter(assignment =>
      assignment.workbooks.some(wb => wb.status === "in_progress")
    ).length;
    const waiting = total - submitted - inProgress;

    return { total, submitted, inProgress, waiting };
  }, [getUserAssignments]);

  const visibleAssignments = getUserAssignments.slice(0, visibleCount);

  if (getUserAssignments.length === 0 && searchTerm === "" && statusFilter === "all") {
    return <NoAssignmentsMessage workbooks={workbooks} />;
  }

  return (
    <div className="space-y-6">
      {/* NEW: Enhanced Header with Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Assignments</h2>
            <p className="text-gray-600 mt-1">
              Manage workbook assignments for users. Click on any user to expand/collapse their workbook list.
            </p>
          </div>
          
          {/* NEW: Quick Stats */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="bg-blue-50 px-3 py-2 rounded-lg">
              <span className="text-blue-700 font-medium">
                {getUserAssignments.length} users with assignments
              </span>
            </div>
            <div className="bg-green-50 px-3 py-2 rounded-lg">
              <span className="text-green-700 font-medium">
                {getUserAssignments.reduce((sum, assignment) => sum + assignment.workbooks.length, 0)} total workbooks
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users, emails, or workbooks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4073] focus:border-transparent transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4073] focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting">Waiting</option>
            </select>
          </div>

          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4073] focus:border-transparent bg-white"
          >
            <option value="recent">Most Recent</option>
            <option value="name">Name A-Z</option>
            <option value="email">Email A-Z</option>
            <option value="workbooks">Most Workbooks</option>
          </select>
        </div>

        {/* Results Summary */}
        {(searchTerm || statusFilter !== "all") && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 text-sm">
              Showing {getUserAssignments.length} of {stats.total} users
              {searchTerm && ` matching "${searchTerm}"`}
              {statusFilter !== "all" && ` with ${statusFilter} status`}
            </p>
          </div>
        )}
      </div>

      {/* Results */}
      {getUserAssignments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <FiUser className="mx-auto w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <>
          <AssignmentList
            assignments={visibleAssignments}
            visibleCount={visibleCount}
            userWorkbooks={workbooks}
            deletingWorkbookId={deletingWorkbookId}
            deletingUserId={deletingUserId}
            expandedWorkbook={expandedWorkbook}
            workbookSubmissions={workbookSubmissions}
            onDeleteAssignment={handleDeleteAssignment}
            onDeleteUser={handleDeleteUser}
            handleWorkbookPreview={handleWorkbookPreview}
            toggleWorkbookPreview={toggleWorkbookPreview}
            collapsedUsers={collapsedUsers}
            toggleUserCollapse={toggleUserCollapse}
            expandAllUsers={expandAllUsers}
            collapseAllUsers={collapseAllUsers}
          />

          <LoadMoreButton
            assignments={getUserAssignments}
            visibleCount={visibleCount}
            setVisibleCount={setVisibleCount}
            setActiveTab={setActiveTab}
          />
        </>
      )}


    </div>
  );
};

export default UserAssignmentsView;
