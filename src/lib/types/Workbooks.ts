// types/workbook.ts
import { Types } from "mongoose";

export interface IQuestion {
  question: string;
  answer: string;
}

export interface IWorkbooks {
  _id: Types.ObjectId | string;
  title: string;
  description: string;
  content?: string;
  link?: Types.ObjectId | string;
  questions: IQuestion[];
  assignedTo?: Types.ObjectId | string;
  status: "assigned" | "in_progress" | "submitted" | "reviewed";
  userResponse?: string;
  adminFeedback?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  shareableLink?: string;
}
