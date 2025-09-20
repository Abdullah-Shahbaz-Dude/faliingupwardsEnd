import { useState } from "react";
import { FiEye, FiTrash, FiCheck, FiX, FiClock } from "react-icons/fi";
import SubmissionPreview from "./SubmissionPreview";
import ConfirmModal from "./components/ConfirmModal";
import { User, Workbook } from "../../types";

const WorkbookItem = ({
  workbook,
  user,
  expandedWorkbook,
  workbookSubmissions,
  deletingWorkbookId,
  onDeleteAssignment,
  handleWorkbookPreview,
  toggleWorkbookPreview,
}: {
  workbook: Workbook;
  user: User;
  expandedWorkbook: string | null;
  workbookSubmissions: { [key: string]: any };
  deletingWorkbookId: string | null;
  onDeleteAssignment: (workbookId: string, userName: string) => Promise<void>;
  handleWorkbookPreview: (workbookId: string) => void;
  toggleWorkbookPreview: (workbookId: string) => void;
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowModal(true);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "text-green-600 bg-green-100";
      case "in_progress":
        return "text-yellow-600 bg-yellow-100";
      case "assigned":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "submitted":
        return "Submitted";
      case "in_progress":
        return "In Progress";
      case "assigned":
        return "Waiting for Response";
      default:
        return status;
    }
  };

  return (
    <div className="bg-gray-50 rounded border p-3">
      {/* Mobile Layout - Stacked */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-800 text-sm truncate flex-1 mr-2">{workbook.title}</h4>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(workbook.status)}`}
          >
            {getStatusText(workbook.status)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          {workbook.status === "submitted" ? (
            <button
              onClick={() => toggleWorkbookPreview(workbook._id)}
              className="text-xs bg-[#0B4073] text-white px-3 py-1 rounded hover:bg-[#1a5490] flex items-center transition-colors flex-1 mr-2"
            >
              <FiEye className="mr-1" />
              {expandedWorkbook === workbook._id ? "Hide" : "Preview"}
            </button>
          ) : (
            <span className="text-xs text-gray-500 px-3 py-1 flex-1">Pending</span>
          )}
          
          {!showDeleteConfirm ? (
            <button
              onClick={handleDeleteClick}
              disabled={deletingWorkbookId === workbook._id}
              className={`text-xs px-2 py-1 rounded flex items-center justify-center flex-shrink-0 ${
                deletingWorkbookId === workbook._id
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-400 hover:text-red-600 hover:bg-red-50"
              }`}
              title="Remove workbook from user"
            >
              <FiTrash className="w-3 h-3" />
            </button>
          ) : (
            <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 rounded px-2 py-1 flex-shrink-0">
              <span className="text-xs text-amber-700 font-medium">Remove?</span>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingWorkbookId === workbook._id}
                className="text-xs px-1 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                title="Confirm removal"
              >
                Y
              </button>
              <button
                onClick={handleCancelDelete}
                className="text-xs px-1 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                title="Cancel"
              >
                N
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout - Horizontal */}
      <div className="hidden sm:flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 text-sm truncate">{workbook.title}</h4>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workbook.status)}`}
          >
            {getStatusText(workbook.status)}
          </span>
          <div className="flex items-center space-x-2">
          {workbook.status === "submitted" ? (
            <button
              onClick={() => toggleWorkbookPreview(workbook._id)}
              className="text-xs bg-[#0B4073] text-white px-3 py-1 rounded hover:bg-[#1a5490] flex items-center transition-colors"
            >
              <FiEye className="mr-1" />
              <span className="hidden sm:inline">
                {expandedWorkbook === workbook._id
                  ? "Hide Preview"
                  : "Quick Preview"}
              </span>
              <span className="sm:hidden">
                {expandedWorkbook === workbook._id ? "Hide" : "Preview"}
              </span>
            </button>
          ) : (
            <span className="text-xs text-gray-500 px-3 py-1">Pending</span>
          )}
          {!showDeleteConfirm ? (
            <button
              onClick={handleDeleteClick}
              disabled={deletingWorkbookId === workbook._id}
              className={`text-xs px-2 py-1 rounded flex items-center justify-center ${
                deletingWorkbookId === workbook._id
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-400 hover:text-red-600 hover:bg-red-50"
              }`}
              title="Remove workbook from user"
            >
              <FiTrash className="w-3 h-3" />
            </button>
          ) : (
            <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 rounded px-2 py-1">
              <span className="text-xs text-amber-700 font-medium">Remove?</span>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingWorkbookId === workbook._id}
                className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                title="Confirm removal"
              >
                Yes
              </button>
              <button
                onClick={handleCancelDelete}
                className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                title="Cancel"
              >
                No
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
      
      {expandedWorkbook === workbook._id && (
        <SubmissionPreview
          workbook={workbook}
          workbookSubmissions={workbookSubmissions}
        />
      )}
      
      {showModal && (
        <ConfirmModal
          title="Confirm Remove Assignment"
          message={`Remove "${workbook.title}" from ${user.name}? This action cannot be undone.`}
          onConfirm={async () => {
            await onDeleteAssignment(workbook._id, user.name);
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default WorkbookItem;
