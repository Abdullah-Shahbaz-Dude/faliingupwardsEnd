export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isDeleting?: boolean;
  workbooks?: Workbook[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Workbook {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  status: WorkbookStatus;
  assignedTo?: string;
  userName?: string;
  userEmail?: string;
  submittedDate?: string;
  assignedDate?: string;
  shareableLink?: string;
  questions?: { question: string; answer: string }[];
  userResponse?: string;
  adminFeedback?: string;
  isTemplate?: boolean;
  templateId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type WorkbookStatus =
  | "submitted"
  | "in_progress"
  | "assigned"
  | "reviewed"
  | "unknown";



export interface SubmissionData {
  loading?: boolean;
  data?: {
    workbookId: string;
    title: string;
    status: string;
    submittedAt?: string;
    completedQuestions: number;
    totalQuestions: number;
    responses: Array<{ question: string; answer: string }>;
    userResponse?: string;
    assignedTo?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  submittedAt?: string;
  completedQuestions?: number;
  responses?: Array<{ question: string; answer: string }>;
  error?: string;
}

export interface UserAssignment {
  user: User;
  workbooks: Workbook[];
}

export interface DashboardState {
  user: User | null;
  users: User[];
  workbooks: Workbook[];
  templateWorkbooks: Workbook[];
  isRefreshing: boolean;
  lastRefreshTime: Date | null;
  setUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
  setWorkbooks: (workbooks: Workbook[]) => void;
  setTemplateWorkbooks: (workbooks: Workbook[]) => void;
  // Simple refresh functions to update UI after actions
  refreshTemplateWorkbooks: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  refreshWorkbooks: () => Promise<void>;
  refreshAllData: () => Promise<void>;
}
