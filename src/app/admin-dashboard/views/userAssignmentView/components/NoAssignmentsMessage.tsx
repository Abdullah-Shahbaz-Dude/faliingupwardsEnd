import { FiUsers } from "react-icons/fi";
import { Workbook } from "../../../types";

const NoAssignmentsMessage = ({ workbooks }: { workbooks: Workbook[] }) => (
  <div className="text-center py-8">
    <FiUsers
      className="mx-auto text-gray-400 text-4xl mb-4"
      aria-label="No users assigned"
    />
    <p className="text-gray-500">
      No workbooks have been assigned to users yet.
    </p>
    {process.env.NODE_ENV === "development" && (
      <div className="mt-4 text-xs text-gray-400">
        <p>
          Debug: {workbooks.length} total workbooks,
          {workbooks.filter((wb) => wb.assignedTo).length} assigned
        </p>
      </div>
    )}
  </div>
);

export default NoAssignmentsMessage;
