import { UserAssignment } from "../../../types";
import { FiChevronLeft, FiChevronRight, FiEye } from "react-icons/fi";

const USERS_PER_PAGE = 6;

const LoadMoreButton = ({
  assignments,
  visibleCount,
  setVisibleCount,
  setActiveTab,
}: {
  assignments: UserAssignment[];
  visibleCount: number;
  setVisibleCount: (count: number) => void;
  setActiveTab?: (tab: string) => void;
}) => {
  const currentPage = Math.ceil(visibleCount / USERS_PER_PAGE);
  const totalPages = Math.ceil(assignments.length / USERS_PER_PAGE);
  const hasNextPage = visibleCount < assignments.length;
  const hasPrevPage = visibleCount > USERS_PER_PAGE;

  const goToNextPage = () => {
    if (hasNextPage) {
      setVisibleCount(Math.min(visibleCount + USERS_PER_PAGE, assignments.length));
    }
  };

  const goToPrevPage = () => {
    if (hasPrevPage) {
      setVisibleCount(Math.max(visibleCount - USERS_PER_PAGE, USERS_PER_PAGE));
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Pagination Controls */}
      {assignments.length > USERS_PER_PAGE && (
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">
            Showing {Math.min(visibleCount, assignments.length)} of {assignments.length} users
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={!hasPrevPage}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                hasPrevPage
                  ? "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              }`}
            >
              <FiChevronLeft className="mr-1" />
              Previous
            </button>
            
            <span className="px-3 py-2 text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={goToNextPage}
              disabled={!hasNextPage}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                hasNextPage
                  ? "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              }`}
            >
              Next
              <FiChevronRight className="ml-1" />
            </button>
          </div>
        </div>
      )}
      
      {/* View All Assignments Button */}
      {setActiveTab && (
        <div className="text-center">
          <button
            onClick={() => setActiveTab("assignments")}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0B4073] to-[#7094B7] text-white rounded-lg hover:from-[#0B4073]/90 hover:to-[#7094B7]/90 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            <FiEye className="mr-2" />
            View All Assignments
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Access full search, filtering, and bulk operations
          </p>
        </div>
      )}
    </div>
  );
};
export default LoadMoreButton;
