import { Schema, model, models, Document, Types } from "mongoose";

interface IQuestion {
  question: string;
  answer: string;
}

interface IWorkbooks extends Document {
  _id: string;
  title: string;
  description: string;
  content: string;
  link?: string;
  questions: IQuestion[];
  assignedTo?: string;
  // Status workflow: assigned -> in_progress -> completed (user done) -> submitted (final) -> reviewed (admin done)
  // "completed" = user finished answering but can still edit
  // "submitted" = final submission, no more edits allowed
  status: "assigned" | "in_progress" | "completed" | "submitted" | "reviewed";
  userResponse: string;
  adminFeedback: string;
  shareableLink: string;
  isTemplate?: boolean;
  templateId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type { IQuestion, IWorkbooks };

const workbooksSchema = new Schema<IWorkbooks>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, default: "" },
    link: { type: String, default: null },
    questions: [
      {
        question: { type: String, required: true },
        answer: { type: String, default: "" },
      },
    ],
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      enum: ["assigned", "in_progress", "completed", "submitted", "reviewed"],
      default: "assigned",
    },
    userResponse: { type: String, default: "" },
    adminFeedback: { type: String, default: "" },
    shareableLink: { type: String, default: "" },
    isTemplate: { type: Boolean, default: true }, // Templates by default
    templateId: { type: Schema.Types.ObjectId, ref: "Workbook", default: null },
  },
  { timestamps: true }
);

// CRITICAL INDEXES - Based on actual query patterns in codebase
// 1. User dashboard loading: Workbook.find({ assignedTo: userId })
workbooksSchema.index({ assignedTo: 1 });

// 2. Admin template filtering: Workbook.find({ isTemplate: true })
workbooksSchema.index({ isTemplate: 1 });

// 3. Assignment validation: Workbook.findOne({ templateId: X, assignedTo: Y })
workbooksSchema.index({ templateId: 1, assignedTo: 1 });

// 4. Status filtering for admin dashboard
workbooksSchema.index({ status: 1 });

// 5. PERFORMANCE: Compound index for user workbook queries with status
workbooksSchema.index({ assignedTo: 1, status: 1 });

// 6. PERFORMANCE: Admin dashboard filtering by template and status
workbooksSchema.index({ isTemplate: 1, status: 1 });

// 7. Recent activity sorting
workbooksSchema.index({ updatedAt: 1 });
workbooksSchema.index({ createdAt: 1 });

const Workbook =
  models.Workbook || model<IWorkbooks>("Workbook", workbooksSchema);
export default Workbook;
