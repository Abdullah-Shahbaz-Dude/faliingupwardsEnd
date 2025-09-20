import { User, Workbook } from "../../types";
import { FiUser, FiMail, FiCalendar, FiTrash } from "react-icons/fi";

const UserHeader = ({
  user,
  userWorkbooks,
  onDeleteUser,
  deletingUserId,
  isCollapsible = false,
  isCollapsed = false,
}: {
  user: User;
  userWorkbooks: Workbook[];
  onDeleteUser: (
    userId: string,
    userName: string,
    workbookCount: number
  ) => Promise<void>;
  deletingUserId: string | null;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
}) => {
  const latestUpdate = new Date(
    Math.max(
      ...userWorkbooks.map((wb) =>
        new Date(wb.updatedAt || wb.createdAt || "").getTime()
      )
    )
  ).toLocaleDateString();

  // Calculate workbook status counts
  const statusCounts = userWorkbooks.reduce((acc, wb) => {
    acc[wb.status] = (acc[wb.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const submittedCount = statusCounts.submitted || 0;
  const inProgressCount = statusCounts.in_progress || 0;
  const waitingCount = statusCounts.assigned || 0;

  return (
    <div className={`flex items-center ${isCollapsible ? 'flex-1' : 'justify-between mb-3'}`}>
      <div className="flex items-center space-x-3">
        {/* User Avatar */}
        <div className="w-10 h-10 bg-gradient-to-br from-[#0B4073] to-[#1a5490] rounded-full flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        
        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{user.name}</h3>
            {isCollapsible && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
                <span className="hidden sm:inline">{userWorkbooks.length} workbook{userWorkbooks.length !== 1 ? 's' : ''}</span>
                <span className="sm:hidden">{userWorkbooks.length}</span>
              </span>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 space-y-1 sm:space-y-0">
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <FiMail className="w-3 h-3" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500 flex-shrink-0">
              <FiCalendar className="w-3 h-3" />
              <span className="hidden sm:inline">Updated {latestUpdate}</span>
              <span className="sm:hidden">Upd {latestUpdate}</span>
            </div>
          </div>
          
          {/* Status Summary (only when collapsible/collapsed) */}
          {isCollapsible && (
            <div className="flex items-center space-x-2 sm:space-x-3 mt-2 flex-wrap">
              {submittedCount > 0 && (
                <div className="flex items-center space-x-1 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">{submittedCount} submitted</span>
                </div>
              )}
              {inProgressCount > 0 && (
                <div className="flex items-center space-x-1 text-xs">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-yellow-700 font-medium">{inProgressCount} in progress</span>
                </div>
              )}
              {waitingCount > 0 && (
                <div className="flex items-center space-x-1 text-xs">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-700 font-medium">{waitingCount} waiting</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete User Button (only show when not in collapsible header) */}
      {!isCollapsible && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent collapse toggle
            onDeleteUser(user._id, user.name, userWorkbooks.length);
          }}
          disabled={deletingUserId === user._id}
          className={`flex items-center space-x-1 px-3 py-1 text-xs rounded transition-colors ${
            deletingUserId === user._id
              ? "text-gray-400 cursor-not-allowed"
              : "text-red-600 hover:text-red-800 hover:bg-red-50"
          }`}
          title={`Delete ${user.name} and remove all workbook assignments`}
        >
          <FiTrash className="w-3 h-3" />
          <span>Delete User</span>
        </button>
      )}
    </div>
  );
};

export default UserHeader;
