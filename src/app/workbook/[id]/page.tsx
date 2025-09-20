
"use client";

import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Toaster, toast } from "react-hot-toast";
import {
  FiArrowLeft,
  FiSave,
  FiSend,
  FiCheckCircle,
  FiEdit,
  FiEye,
  FiBook,
  FiUser,
  FiFileText,
  FiAlertCircle,
} from "react-icons/fi";
import { fetchWorkbook, updateWorkbook } from "../workbook";
// import { fetchWorkbook, updateWorkbook } from "../services/workbook";

// TypeScript Interfaces
interface Question {
  question: string;
  answer: string;
}

interface Workbook {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  status: "assigned" | "in_progress" | "completed" | "submitted" | "reviewed";
  assignedTo?: string;
  questions?: Question[];
  userResponse?: string;
  adminFeedback?: string;
  shareableLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Header Component
const WorkbookHeader = ({
  workbook,
  onSave,
  onCompleteAndSave,
  isSaving,
  hasUnsavedChanges,
  isAdmin,
  backUrl,
  from,
}: {
  workbook: Workbook | null;
  onSave: () => void;
  onCompleteAndSave: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  isAdmin: boolean;
  userId: string | null;
  backUrl: string;
  from: string | null;
}) => {
  const router = useRouter();

  const getStatusInfo = () => {
    if (!workbook)
      return { icon: <FiBook />, text: "Loading...", color: "text-gray-500" };

    switch (workbook.status) {
      case "assigned":
        return {
          icon: <FiBook />,
          text: "Not Started",
          color: "text-blue-600",
        };
      case "in_progress":
        return {
          icon: <FiEdit />,
          text: "In Progress",
          color: "text-yellow-600",
        };
      case "completed":
        return {
          icon: <FiCheckCircle />,
          text: "Completed",
          color: "text-green-600",
        };
      case "submitted":
        return { icon: <FiSend />, text: "Submitted", color: "text-blue-600" };
      case "reviewed":
        return { icon: <FiEye />, text: "Reviewed", color: "text-purple-600" };
      default:
        return {
          icon: <FiBook />,
          text: workbook.status,
          color: "text-gray-600",
        };
    }
  };

  const statusInfo = getStatusInfo();

  const getBackButtonText = () => {
    if (from === "admin-workbooks") {
      return "Back to Workbooks";
    } else if (from === "admin-assignments") {
      return "Back to Assignments";
    } else if (from === "admin-dashboard") {
      return "Back to Dashboard";
    } else if (from === "user-dashboard") {
      return "Back to Dashboard";
    }
    return isAdmin ? "Back to Admin Dashboard" : "Back to Dashboard";
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (
        confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        router.push(backUrl);
      }
    } else {
      router.push(backUrl);
    }
  };

  return (
    <header className="bg-primary shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-white line-clamp-1">
                {workbook?.title || "Loading Workbook..."}
              </h1>
              <div className="flex items-center space-x-3 mt-2">
                <div
                  className={`flex items-center text-sm px-3 py-1.5 rounded-full border ${
                    workbook?.status === "submitted"
                      ? "bg-white text-[#0B4073] border-white"
                      : workbook?.status === "completed"
                        ? "bg-green-500 text-white border-green-500"
                        : workbook?.status === "in_progress"
                          ? "bg-yellow-500 text-white border-yellow-500"
                          : "bg-white/20 text-white border-white/30"
                  }`}
                >
                  {statusInfo.icon}
                  <span className="ml-1.5 font-medium">{statusInfo.text}</span>
                </div>
                {hasUnsavedChanges && (
                  <div className="flex items-center text-sm text-yellow-200 bg-yellow-600/20 px-3 py-1.5 rounded-full border border-yellow-400/30">
                    <FiAlertCircle className="mr-1.5" />
                    <span className="font-medium">Unsaved changes</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleBack}
              className="px-4 py-2.5 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30 transition-all duration-200 flex items-center border border-white/30 font-medium"
            >
              <FiArrowLeft className="mr-2" />
              {getBackButtonText()}
            </button>

            {workbook?.status !== "completed" &&
              workbook?.status !== "submitted" &&
              workbook?.status !== "reviewed" && (
                <>
                  <button
                    onClick={onSave}
                    disabled={isSaving || !hasUnsavedChanges}
                    className="px-5 py-2.5 bg-white text-[#0B4073] rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0B4073] mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" />
                        Save Progress
                      </>
                    )}
                  </button>

                  <button
                    onClick={onCompleteAndSave}
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Completing...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="mr-2" />
                        Complete & Save
                      </>
                    )}
                  </button>
                </>
              )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Progress Bar Component
const ProgressBar = ({ workbook }: { workbook: Workbook | null }) => {
  if (!workbook?.questions || workbook.questions.length === 0) return null;

  const answeredQuestions = workbook.questions.filter(
    (q) => q.answer && q.answer.trim() !== ""
  );
  const progress = Math.round(
    (answeredQuestions.length / workbook.questions.length) * 100
  );

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded h-2">
          <div
            className="bg-[#0B4073] h-2 rounded transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>
            {answeredQuestions.length} of {workbook.questions.length} completed
          </span>
          <span>
            {workbook.questions.length - answeredQuestions.length} remaining
          </span>
        </div>
      </div>
    </div>
  );
};

// Worksheet Question Component
const QuestionItem = ({
  question,
  index,
  answer,
  onAnswerChange,
  isReadOnly,
}: {
  question: string;
  index: number;
  answer: string;
  onAnswerChange: (value: string) => void;
  isReadOnly: boolean;
}) => {
  const hasAnswer = answer && answer.trim() !== "";
  const wordCount = answer
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return (
    <div className="mb-8 pb-6 border-b border-gray-200 last:border-b-0">
      <div className="mb-4">
        <div className="flex items-start space-x-3">
          <div
            className="w-8 h-8 bg-[#0B4073] text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1"
            aria-label={`Question ${index + 1}`}
          >
            {index + 1}
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 font-medium text-lg leading-relaxed">
              {question}
            </h3>
            {isReadOnly && (
              <span
                className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded mt-2 ${
                  hasAnswer
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
                aria-live="polite"
              >
                {hasAnswer ? "✓ Answered" : "No Answer"}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="ml-11">
        {isReadOnly ? (
          <div
            className={`p-4 rounded-lg min-h-[100px] border ${
              hasAnswer
                ? "bg-gray-50 border-gray-200"
                : "bg-gray-50 border-gray-300 border-dashed"
            }`}
            aria-describedby={`question-${index}-answer`}
          >
            {hasAnswer ? (
              <p
                id={`question-${index}-answer`}
                className="text-gray-800 whitespace-pre-wrap leading-relaxed"
              >
                {answer}
              </p>
            ) : (
              <p
                id={`question-${index}-answer`}
                className="text-gray-500 italic text-center py-4"
              >
                No response provided
              </p>
            )}
          </div>
        ) : (
          <textarea
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4073] focus:border-[#0B4073] resize-vertical"
            placeholder="Enter your answer here..."
            aria-label={`Answer for question ${index + 1}`}
            aria-describedby={`question-${index}-stats`}
          />
        )}
        <div
          id={`question-${index}-stats`}
          className="flex justify-between text-xs text-gray-500 mt-2"
        >
          <span>
            {answer.length} characters • {wordCount} words
          </span>
          {!isReadOnly && (
            <span
              className={hasAnswer ? "text-green-600" : "text-gray-400"}
              aria-live="polite"
            >
              {hasAnswer ? "✓ Answered" : "Not answered"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Admin Feedback Component
const AdminFeedback = ({ feedback }: { feedback?: string }) => {
  if (!feedback || feedback.trim() === "") return null;

  return (
    <div className="bg-white shadow-lg rounded-lg mb-8 border border-gray-200">
      <div className="bg-[#0B4073] px-6 py-4">
        <div className="flex items-center space-x-3">
          <FiUser className="text-white text-lg" />
          <h4 className="text-xl font-semibold text-white">Admin Feedback</h4>
        </div>
      </div>
      <div className="p-6">
        <div className="bg-blue-50 border-l-4 border-[#0B4073] rounded-r p-4">
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {feedback}
          </p>
        </div>
      </div>
    </div>
  );
};

// Main WorkbookViewer Component
export default function WorkbookViewer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const workbookId = params.id as string;
  const userId = searchParams.get("user");
  const from = searchParams.get("from");
  const { data: session } = useSession();

  const [workbook, setWorkbook] = useState<Workbook | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const isAdmin = session?.user?.role === "admin";

  const getBackUrl = () => {
    if (from === "admin-workbooks") {
      return "/admin-dashboard?tab=workbooks";
    } else if (from === "admin-assignments") {
      return "/admin-dashboard?tab=assignments";
    } else if (from === "admin-dashboard") {
      return "/admin-dashboard";
    } else if (from === "user-dashboard") {
      return userId ? `/user-dashboard?user=${userId}` : "/user-dashboard";
    }
    return isAdmin
      ? "/admin-dashboard"
      : userId
        ? `/user-dashboard?user=${userId}`
        : "/user-dashboard";
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!workbookId) return;
      setIsLoading(true);
      try {
        const data = await fetchWorkbook(workbookId, userId || undefined);
        setWorkbook(data.data.workbook);
        if (data.data.workbook.questions) {
          const initialAnswers: { [key: number]: string } = {};
          data.data.workbook.questions.forEach((q: Question, index: number) => {
            initialAnswers[index] = q.answer || "";
          });
          setAnswers(initialAnswers);
        }
      } catch (err) {
        setError("Error loading workbook");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [workbookId]);

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev, [index]: value };
      setHasUnsavedChanges(true);
      return newAnswers;
    });
  };

  const handleSave = async () => {
    if (!workbook) return;
    setIsSaving(true);
    try {
      const updatedQuestions =
        workbook.questions?.map((q, index) => ({
          question: q.question,
          answer: answers[index] || "",
        })) || [];
      await updateWorkbook(workbookId, {
        questions: updatedQuestions,
        status: "in_progress",
      }, userId || undefined);
      setHasUnsavedChanges(false);
      setWorkbook((prev) =>
        prev
          ? { ...prev, questions: updatedQuestions, status: "in_progress" }
          : null
      );
      toast.success("Progress saved successfully!");
    } catch (err) {
      toast.error("Error saving workbook");
    } finally {
      setIsSaving(false);
    }
  };

  const debouncedSave = useCallback(debounce(handleSave, 2000), [
    workbook,
    isSaving,
  ]);

  useEffect(() => {
    if (hasUnsavedChanges && workbook && !isSaving) {
      debouncedSave();
    }
    return () => debouncedSave.cancel();
  }, [answers, hasUnsavedChanges, workbook, isSaving, debouncedSave]);

  const handleCompleteAndSave = async () => {
    if (!workbook) return;

    const unansweredQuestions =
      workbook.questions?.filter(
        (q, index) => !answers[index] || answers[index].trim() === ""
      ) || [];

    if (unansweredQuestions.length > 0) {
      if (
        !confirm(
          `You have ${unansweredQuestions.length} unanswered question(s). Do you want to complete anyway?`
        )
      ) {
        return;
      }
    }

    setIsSaving(true);
    try {
      const updatedQuestions =
        workbook.questions?.map((q, index) => ({
          question: q.question,
          answer: answers[index] || "",
        })) || [];
      await updateWorkbook(workbookId, {
        questions: updatedQuestions,
        // status: "completed",
      }, userId || undefined);
      setHasUnsavedChanges(false);
      setWorkbook((prev) =>
        prev
          ? { ...prev, questions: updatedQuestions, status: "completed" }
          : null
      );
      toast.success("Workbook completed successfully!");
      router.push(getBackUrl());
    } catch (err) {
      toast.error("Error completing workbook");
    } finally {
      setIsSaving(false);
    }
  };

  const isReadOnly =
    workbook?.status === "submitted" || workbook?.status === "reviewed";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4073] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workbook...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href={getBackUrl()}
            className="inline-block px-4 py-2 bg-[#0B4073] text-white rounded hover:bg-[#0B4073]/90 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-[Roboto]">
      <Toaster position="top-right" />
      <WorkbookHeader
        workbook={workbook}
        onSave={handleSave}
        onCompleteAndSave={handleCompleteAndSave}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        isAdmin={isAdmin}
        userId={userId}
        backUrl={getBackUrl()}
        from={from}
      />
      <ProgressBar workbook={workbook} />
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 border border-gray-200">
          <div className="bg-[#0B4073] px-6 py-5">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded flex items-center justify-center">
                <FiFileText className="text-white text-lg" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  {workbook?.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-blue-100 text-sm">
                  <div className="flex items-center space-x-2">
                    <FiBook className="w-4 h-4" />
                    <span>
                      {workbook?.status === "submitted"
                        ? "Submitted for Review"
                        : "In Progress"}
                    </span>
                  </div>
                  {workbook?.questions && (
                    <div className="flex items-center space-x-2">
                      <FiFileText className="w-4 h-4" />
                      <span>{workbook.questions.length} Questions</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            {workbook?.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FiBook className="mr-2 text-[#0B4073]" />
                  Description
                </h3>
                <div className="border-l-4 rounded-r p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {workbook.description}
                  </p>
                </div>
              </div>
            )}
            {workbook?.content && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FiEdit className="mr-2 text-[#0B4073]" />
                  Instructions
                </h3>
                <div className="bg-gray-50 border-l-4 border-[#7094B7] rounded-r p-4">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {workbook.content}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <AdminFeedback feedback={workbook?.adminFeedback} />
        {workbook?.questions && workbook.questions.length > 0 ? (
          <div className="bg-white shadow-lg rounded-lg border border-gray-200">
            <div className="bg-[#0B4073] px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <FiFileText className="mr-3" />
                  Reflection Questions ({workbook.questions.length})
                </h3>
                {isReadOnly && (
                  <div className="text-blue-100 text-sm font-medium bg-white/10 px-3 py-1.5 rounded">
                    Progress:{" "}
                    {Math.round(
                      (workbook.questions.filter(
                        (q) => q.answer && q.answer.trim()
                      ).length /
                        workbook.questions.length) *
                        100
                    )}
                    % Complete
                  </div>
                )}
              </div>
            </div>
            <div className="p-6">
              {workbook.questions.map((question, index) => (
                <QuestionItem
                  key={index}
                  question={question.question}
                  index={index}
                  answer={answers[index] || ""}
                  onAnswerChange={(value) => handleAnswerChange(index, value)}
                  isReadOnly={isReadOnly}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-12 text-center">
            <FiFileText className="mx-auto text-gray-400 text-4xl mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">
              No Questions Available
            </h4>
            <p className="text-gray-500">
              This workbook doesn't have any questions to answer.
            </p>
          </div>
        )}
        {workbook?.status === "submitted" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
            <div className="flex items-center">
              <FiCheckCircle className="text-green-600 mr-3" />
              <div>
                <h4 className="text-base font-medium text-green-800">
                  Workbook Submitted
                </h4>
                <p className="text-green-700 text-sm">
                  Your workbook has been submitted for review. You will be
                  notified when feedback is available.
                </p>
              </div>
            </div>
          </div>
        )}
        {workbook?.status === "reviewed" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <div className="flex items-center">
              <FiEye className="text-blue-600 mr-3" />
              <div>
                <h4 className="text-base font-medium text-blue-800">
                  Workbook Reviewed
                </h4>
                <p className="text-blue-700 text-sm">
                  Your workbook has been reviewed by an administrator. Check the
                  feedback above.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
