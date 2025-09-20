// src/app/admin-dashboard/components/WorkbookSelection.tsx
import { Workbook } from "../types";

interface WorkbookSelectionProps {
  workbooks: Workbook[];
  selectedWorkbooks: string[];
  onToggle: (workbookId: string) => void;
  className?: string;
}

const WorkbookSelection = ({
  workbooks,
  selectedWorkbooks,
  onToggle,
  className,
}: WorkbookSelectionProps) => (
  <div className={`max-h-80 overflow-y-auto space-y-3 pr-2 ${className}`}>
    {workbooks.map((workbook) => (
      <label
        key={workbook._id}
        className={`group flex items-start p-5 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg border rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
          selectedWorkbooks.includes(workbook._id)
            ? "border-[#0B4073] ring-2 ring-[#0B4073]/20 bg-gradient-to-br from-blue-50/90 to-blue-100/70"
            : "border-white/20 hover:border-[#7094B7]/30"
        }`}
      >
        <div className="flex items-center mt-1">
          <input
            type="checkbox"
            checked={selectedWorkbooks.includes(workbook._id)}
            onChange={() => onToggle(workbook._id)}
            className="h-5 w-5 text-[#0B4073] bg-white border-2 border-gray-300 rounded-lg focus:ring-[#0B4073] focus:ring-2 focus:ring-offset-0 transition-all duration-200"
          />
          {selectedWorkbooks.includes(workbook._id) && (
            <div className="ml-2 px-2 py-1 bg-gradient-to-r from-[#0B4073] to-[#1a5490] text-white text-xs font-medium rounded-full">
              Selected
            </div>
          )}
        </div>
        <div className="flex-1 ml-4">
          <h4 className="font-bold text-gray-800 group-hover:text-[#0B4073] transition-colors duration-200">
            {workbook.title}
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {workbook.description?.substring(0, 120) || "No description"}
            {workbook.description && workbook.description.length > 120 && "..."}
          </p>
        </div>
      </label>
    ))}
  </div>
);

export default WorkbookSelection;
