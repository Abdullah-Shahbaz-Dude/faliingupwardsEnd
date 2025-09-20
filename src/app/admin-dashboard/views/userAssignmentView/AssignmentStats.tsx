import { FiExternalLink, FiTrash } from "react-icons/fi";
import { User, Workbook } from "../../types";

const AssignmentStats = ({
  user,
  userWorkbooks,
  onDeleteUser,
  deletingUserId,
}: {
  user: User;
  userWorkbooks: Workbook[];
  onDeleteUser: (
    userId: string,
    userName: string,
    workbookCount: number
  ) => Promise<void>;
  deletingUserId: string | null;
}) => {
  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      {/* Mobile Layout - Stacked */}
      <div className="block sm:hidden space-y-3">
        <div className="text-xs text-gray-600 text-center">
          {userWorkbooks.filter((wb) => wb.status === "submitted").length}{" "}
          submitted • {userWorkbooks.filter((wb) => wb.status === "in_progress").length} in
          progress • {userWorkbooks.filter((wb) => wb.status === "assigned").length}{" "}
          waiting
        </div>
        <div className="flex flex-col space-y-2">
          <a
            href={`/user-dashboard?user=${user._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0B4073] hover:underline flex items-center justify-center text-sm bg-blue-50 py-2 px-3 rounded"
          >
            <FiExternalLink className="mr-1 w-3 h-3" />
            View Full Dashboard
          </a>
          <button
            onClick={() =>
              onDeleteUser(user._id, user.name, userWorkbooks.length)
            }
            className="text-red-600 hover:text-red-800 hover:bg-red-50 flex items-center justify-center py-2 px-3 rounded border border-red-200"
            title="Remove user and all assignments"
            disabled={deletingUserId === user._id}
          >
            <FiTrash className="w-3 h-3 mr-1" />
            {deletingUserId === user._id ? "Removing..." : "Remove User"}
          </button>
        </div>
      </div>

      {/* Desktop Layout - Horizontal */}
      <div className="hidden sm:flex justify-between items-center text-xs text-gray-600">
        <span>
          {userWorkbooks.filter((wb) => wb.status === "submitted").length}{" "}
          submitted •{" "}
          {userWorkbooks.filter((wb) => wb.status === "in_progress").length} in
          progress •{" "}
          {userWorkbooks.filter((wb) => wb.status === "assigned").length}{" "}
          waiting
        </span>
        <div className="flex items-center space-x-2">
          <a
            href={`/user-dashboard?user=${user._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0B4073] hover:underline flex items-center text-sm"
          >
            <FiExternalLink className="mr-1 w-3 h-3" />
            View Full Dashboard
          </a>
          <span className="text-gray-300">|</span>
          <button
            onClick={() =>
              onDeleteUser(user._id, user.name, userWorkbooks.length)
            }
            className="text-red-600 hover:text-red-800 hover:underline flex items-center"
            title="Remove user and all assignments"
            disabled={deletingUserId === user._id}
          >
            <FiTrash className="w-3 h-3 mr-1" />
            {deletingUserId === user._id ? "Removing..." : "Remove User"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AssignmentStats;
