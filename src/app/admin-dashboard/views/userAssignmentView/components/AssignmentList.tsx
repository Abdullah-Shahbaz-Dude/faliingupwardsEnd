import { SubmissionData, User, Workbook } from "../../../types";
import AssignmentStats from "../AssignmentStats";
import UserHeader from "../UserHeader";
import WorkbookItem from "../WorkbookItem";
import { FiChevronDown, FiChevronUp, FiMaximize2, FiMinimize2 } from "react-icons/fi";

type UserAssignment = {
  user: User;
  workbooks: Workbook[];
};

const AssignmentList = ({
  assignments,
  visibleCount,
  userWorkbooks,
  expandedWorkbook,
  workbookSubmissions,
  deletingWorkbookId,
  deletingUserId,
  onDeleteAssignment,
  onDeleteUser,
  handleWorkbookPreview,
  toggleWorkbookPreview,
  collapsedUsers,
  toggleUserCollapse,
  expandAllUsers,
  collapseAllUsers,
}: {
  assignments: UserAssignment[];
  visibleCount: number;
  userWorkbooks: Workbook[];
  expandedWorkbook: string | null;
  workbookSubmissions: { [key: string]: SubmissionData };
  deletingWorkbookId: string | null;
  deletingUserId: string | null;
  onDeleteAssignment: (workbookId: string, userName: string) => Promise<void>;
  onDeleteUser: (
    userId: string,
    userName: string,
    workbookCount: number
  ) => Promise<void>;
  handleWorkbookPreview: (workbookId: string) => void;
  toggleWorkbookPreview: (workbookId: string) => void;
  collapsedUsers: Set<string>;
  toggleUserCollapse: (userId: string) => void;
  expandAllUsers: () => void;
  collapseAllUsers: () => void;
}) => (
  <div className="space-y-4">
    {/* Bulk Expand/Collapse Controls */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 rounded-lg p-3 border gap-3 sm:gap-0">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
        <span className="text-sm font-medium text-gray-700">
          {assignments.length} User{assignments.length !== 1 ? 's' : ''} with Assignments
        </span>
        <span className="text-xs text-gray-500">
          ({collapsedUsers.size} collapsed, {assignments.length - collapsedUsers.size} expanded)
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={expandAllUsers}
          className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          title="Expand all user assignments"
        >
          <FiMaximize2 className="w-3 h-3" />
          <span className="hidden sm:inline">Expand All</span>
          <span className="sm:hidden">Expand</span>
        </button>
        <button
          onClick={collapseAllUsers}
          className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          title="Collapse all user assignments"
        >
          <FiMinimize2 className="w-3 h-3" />
          <span className="hidden sm:inline">Collapse All</span>
          <span className="sm:hidden">Collapse</span>
        </button>
      </div>
    </div>

    {assignments
      .slice(0, visibleCount)
      .map(({ user, workbooks: userWorkbooks }) => {
        const isCollapsed = collapsedUsers.has(user._id);
        
        return (
          <div
            key={user._id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-all duration-200"
            role="region"
            aria-expanded={!isCollapsed}
            aria-label={`Assignments for ${user.name}`}
          >
            {/* ENHANCED: Clickable User Header with Collapse Toggle */}
            <div 
              className="bg-white p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
              onClick={() => toggleUserCollapse(user._id)}
            >
              <div className="flex items-center justify-between">
                <UserHeader
                  user={user}
                  userWorkbooks={userWorkbooks}
                  onDeleteUser={onDeleteUser}
                  deletingUserId={deletingUserId}
                  isCollapsible={true}
                  isCollapsed={isCollapsed}
                />
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{userWorkbooks.length}</span> workbook{userWorkbooks.length !== 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400">
                    {isCollapsed ? (
                      <FiChevronDown className="w-4 h-4" />
                    ) : (
                      <FiChevronUp className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* COLLAPSIBLE: Workbook List with Smooth Animation */}
            <div className={`transition-all duration-300 ease-in-out ${
              isCollapsed 
                ? 'max-h-0 opacity-0 overflow-hidden' 
                : 'max-h-[2000px] opacity-100'
            }`}>
              <div className="p-3 sm:p-4 bg-gray-50 space-y-2">
                {userWorkbooks.map((workbook) => (
                  <WorkbookItem
                    key={workbook._id}
                    workbook={workbook}
                    user={user}
                    expandedWorkbook={expandedWorkbook}
                    workbookSubmissions={workbookSubmissions}
                    deletingWorkbookId={deletingWorkbookId}
                    onDeleteAssignment={onDeleteAssignment}
                    handleWorkbookPreview={handleWorkbookPreview}
                    toggleWorkbookPreview={toggleWorkbookPreview}
                  />
                ))}
                
                <AssignmentStats
                  user={user}
                  userWorkbooks={userWorkbooks}
                  onDeleteUser={onDeleteUser}
                  deletingUserId={deletingUserId}
                />
              </div>
            </div>
          </div>
        );
      })}
  </div>
);
export default AssignmentList;
