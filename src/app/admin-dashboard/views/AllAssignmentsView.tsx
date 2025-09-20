import { FiBook } from "react-icons/fi";
import UserAssignmentsView from "./UserAssignmentsView";
import { User, Workbook } from "../types";
import {
  handleDeleteAssignment,
  handleDeleteUser,
} from "../utils/handleButtons";
import RefreshControls from "../components/RefreshControls";

const AllAssignmentsView = ({
  workbooks,
  users,
  showToast,
  refreshData,
}: {
  workbooks: Workbook[];
  users: User[];
  onDeleteAssignment: (workbookId: string, userName: string) => Promise<void>;
  onDeleteUser: (
    userId: string,
    userName: string,
    workbookCount: number
  ) => Promise<void>;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  refreshData: () => Promise<void>; // 📝 LEGACY: Keeping for backward compatibility
}) => {
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FiBook className="mr-2 text-[#0B4073]" />
          All User Assignments
        </h2>
        
        <RefreshControls pageRefresh={refreshData} />
        
      </div>

      <UserAssignmentsView
        workbooks={workbooks}
        users={users}
        onDeleteAssignment={(workbookId, userName) =>
          // Use page-level refresh for consistency with manual refresh button
          handleDeleteAssignment(workbookId, userName, showToast, refreshData)
        }
        onDeleteUser={(userId, userName, workbookCount) =>
          // Use page-level refresh for consistency with manual refresh button
          handleDeleteUser(
            userId,
            userName,
            workbookCount,
            showToast,
            refreshData
          )
        }
        onPreviewWorkbook={(workbook) => {
          // Handle workbook preview - could open in new tab or modal
          console.log('Preview workbook:', workbook);
        }}
        submissionData={[]}
        onRefreshData={refreshData}
        setActiveTab={undefined} // No need for tab switching in full view
      />
    </div>
  );
};
export default AllAssignmentsView;
