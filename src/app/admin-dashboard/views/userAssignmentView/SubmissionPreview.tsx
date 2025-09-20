import { FiExternalLink, FiEye } from "react-icons/fi";
import { Workbook } from "../../types";

const SubmissionPreview = ({
  workbook,
  workbookSubmissions,
}: {
  workbook: Workbook;
  workbookSubmissions: { [key: string]: any };
}) => {
  return (
    <div className="mt-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
      {/* Mobile Layout - Stacked */}
      <div className="block sm:hidden mb-3">
        <h5 className="font-semibold text-gray-800 flex items-center mb-2 text-sm">
          <FiEye className="mr-2 text-[#0B4073]" />
          <span className="truncate">Preview - {workbook.title}</span>
        </h5>
        <a
          href={`/workbook/${workbook._id}?from=admin-assignments`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-[#0B4073] text-white px-3 py-2 rounded hover:bg-[#1a5490] transition-colors flex items-center justify-center w-full"
        >
          <FiExternalLink className="mr-1" />
          Full Review
        </a>
      </div>

      {/* Desktop Layout - Horizontal */}
      <div className="hidden sm:flex justify-between items-start mb-3">
        <h5 className="font-semibold text-gray-800 flex items-center">
          <FiEye className="mr-2 text-[#0B4073]" />
          Submission Preview - {workbook.title}
        </h5>
        <a
          href={`/workbook/${workbook._id}?from=admin-assignments`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-[#0B4073] text-white px-3 py-1 rounded hover:bg-[#1a5490] transition-colors flex items-center"
        >
          <FiExternalLink className="mr-1" />
          Full Review
        </a>
      </div>

      {workbookSubmissions[workbook._id] ? (
        workbookSubmissions[workbook._id].error ? (
          <div className="text-center py-4">
            <div className="text-amber-600 bg-amber-50 p-3 rounded border">
              <p className="text-sm font-medium">
                Unable to load submission preview
              </p>
              <p className="text-xs text-amber-700 mt-1">
                {workbookSubmissions[workbook._id].error}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Use "Full Review" button above to view complete submission.
              </p>
            </div>
          </div>
        ) : workbookSubmissions[workbook._id].data ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Submitted:</span>
                <p className="text-gray-800">
                  {new Date(
                    workbookSubmissions[workbook._id].data!.submittedAt ||
                      workbookSubmissions[workbook._id].data!.updatedAt ||
                      workbook.updatedAt
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Progress:</span>
                <p className="text-gray-800">
                  {workbookSubmissions[workbook._id].data!.completedQuestions || 0} of{" "}
                  {workbookSubmissions[workbook._id].data!.totalQuestions || 0} questions completed
                </p>
              </div>
            </div>

            {workbookSubmissions[workbook._id].data!.responses && 
             workbookSubmissions[workbook._id].data!.responses.length > 0 ? (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Recent Responses:
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {workbookSubmissions[workbook._id].data!.responses
                    .filter((r: any) => r.answer && r.answer.trim() !== "" && r.answer !== "No response")
                    .slice(0, 3)
                    .map((response: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-2 rounded text-xs"
                      >
                        <p className="font-medium text-gray-700 mb-1">
                          {response.question}
                        </p>
                        <p className="text-gray-600 line-clamp-2">
                          {response.answer}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500 italic">
                  No response data available for preview
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Use "Full Review" button above for complete details
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0B4073]"></div>
            <span className="ml-2 text-sm text-gray-600">
              Loading submission details...
            </span>
          </div>
        )
      ) : (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0B4073]"></div>
          <span className="ml-2 text-sm text-gray-600">
            Loading submission details...
          </span>
        </div>
      )}
    </div>
  );
};
export default SubmissionPreview;
