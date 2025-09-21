"use client";

import { useEffect, useState, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import {
  FiBook,
  FiFileText,
  FiCheckCircle,
  FiEdit,
  FiEye,
  FiUser,
  FiCalendar,
  FiArrowRight,
  FiSend,
} from "react-icons/fi";

import Header from "./Header";

// TypeScript Interfaces
interface User {
  _id: string;
  name: string;
  workbooks?: string[];
  isCompleted?: boolean;
  completedAt?: string;
  dashboardExpired?: boolean;
}

interface Workbook {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  status: "assigned" | "in_progress" | "completed" | "submitted" | "reviewed";
  assignedTo?: string;
  shareableLink?: string;
  questions?: { question: string; answer: string }[];
  userResponse?: string;
  adminFeedback?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Enhanced StatusBadge Component
const StatusBadge = ({ status }: { status: string }) => {
  const badgeStyles = {
    assigned: "bg-gradient-to-r from-[#D6E2EA] to-[#e8f1f7] text-[#0B4073] border-[#0B4073]/30 shadow-sm",
    in_progress: "bg-gradient-to-r from-[#7094B7]/15 to-[#7094B7]/10 text-[#7094B7] border-[#7094B7]/40 shadow-sm",
    completed: "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-300 shadow-sm",
    submitted: "bg-gradient-to-r from-[#0B4073] to-[#1a5490] text-white border-[#0B4073] shadow-md",
    reviewed: "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-300 shadow-sm",
  };

  const icons = {
    assigned: <FiBook className="mr-2 text-sm" />,
    in_progress: <FiEdit className="mr-2 text-sm" />,
    completed: <FiCheckCircle className="mr-2 text-sm" />,
    submitted: <FiSend className="mr-2 text-sm" />,
    reviewed: <FiEye className="mr-2 text-sm" />,
  };

  const labels = {
    assigned: "Not Started",
    in_progress: "In Progress",
    completed: "Completed",
    submitted: "Submitted",
    reviewed: "Reviewed",
  };

  return (
    <span
      className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center border backdrop-blur-sm transition-all duration-200 hover:scale-105 ${
        badgeStyles[status as keyof typeof badgeStyles] ||
        "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300 shadow-sm"
      }`}
    >
      {icons[status as keyof typeof icons] || null}
      {labels[status as keyof typeof labels] ||
        status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
    </span>
  );
};

// 🚀 OPTIMIZED WORKBOOK CARD COMPONENT - Memoized to prevent unnecessary re-renders
const WorkbookCard = memo(({
  workbook,
  userId,
}: {
  workbook: Workbook;
  userId: string;
}) => {
  // 📊 MEMOIZED PROGRESS CALCULATION - Only recalculates when workbook changes
  const progressData = useMemo(() => {
    if (!workbook.questions || workbook.questions.length === 0) {
      return {
        totalQuestions: 0,
        answeredQuestions: 0,
        progressPercentage: 0,
      };
    }

    const totalQuestions = workbook.questions.length;
    const answeredQuestions = workbook.questions.filter(
      (q) => q.answer && q.answer.trim() !== ""
    ).length;
    
    const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100);

    return {
      totalQuestions,
      answeredQuestions,
      progressPercentage,
    };
  }, [workbook.questions]);

  // 🎯 MEMOIZED BUTTON TEXT
  const buttonText = useMemo(() => {
    switch (workbook.status) {
      case "assigned":
        return "Start Now";
      case "completed":
        return "Review & Submit";
      case "submitted":
        return "View Submitted";
      default:
        return "Continue";
    }
  }, [workbook.status]);

  // 🔗 MEMOIZED LINK
  const workbookLink = useMemo(() => {
    return `/workbook/${workbook._id}?user=${userId}&from=user-dashboard`;
  }, [workbook._id, userId]);

  // 📅 MEMOIZED DATE DISPLAY
  const displayDate = useMemo(() => {
    const dateStr = workbook.updatedAt || workbook.createdAt || "";
    return dateStr ? new Date(dateStr).toLocaleDateString() : "";
  }, [workbook.updatedAt, workbook.createdAt]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/50 hover:border-[#0B4073]/30 group relative">
      {/* Enhanced top accent */}
      <div className="h-2 bg-gradient-to-r from-[#0B4073] via-[#1a5490] to-[#7094B7] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
      
      {/* Subtle background pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#0B4073]/5 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
      
      <div className="p-8 relative z-10">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2 flex-1 mr-4 group-hover:text-[#0B4073] transition-colors duration-300">
            {workbook.title}
          </h3>
          <StatusBadge status={workbook.status} />
        </div>

        <p className="text-gray-600 text-base mb-6 line-clamp-3 leading-relaxed">
          {workbook.description || "No description available."}
        </p>

        {progressData.totalQuestions > 0 && (
          <div className="mb-8 bg-gray-50/80 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex justify-between text-sm font-semibold text-gray-700 mb-3">
              <span className="flex items-center">
                <FiFileText className="mr-2 text-[#0B4073]" />
                Progress
              </span>
              <span className="text-[#0B4073] text-base font-bold">{progressData.progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-300/60 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-[#0B4073] via-[#1a5490] to-[#7094B7] h-4 rounded-full transition-all duration-700 ease-out shadow-sm relative"
                style={{ width: `${progressData.progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3 font-medium flex items-center">
              <FiCheckCircle className="mr-2 text-green-500" />
              {progressData.answeredQuestions} of {progressData.totalQuestions} questions completed
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-gray-200/70">
          <div className="text-sm text-gray-500 flex items-center bg-gray-100/80 px-3 py-2 rounded-lg backdrop-blur-sm">
            <FiCalendar className="mr-2 text-[#0B4073]" />
            {displayDate}
          </div>

          <Link
            href={workbookLink}
            className="px-6 py-3 bg-gradient-to-r from-[#0B4073] via-[#1a5490] to-[#7094B7] text-white rounded-xl text-sm font-semibold hover:from-[#0B4073]/90 hover:to-[#7094B7]/90 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">{buttonText}</span>
            <FiArrowRight className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
});

// Add display name for debugging
WorkbookCard.displayName = 'WorkbookCard';

// Enhanced Stats Card Component
const StatsCard = ({
  icon,
  title,
  value,
  description,
  color = "bg-[#0B4073]",
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  description: string;
  color?: string;
}) => {
  const getCardGradient = () => {
    switch (color) {
      case "bg-[#7094B7]":
        return "from-[#7094B7]/10 via-white/90 to-[#7094B7]/5";
      case "bg-green-500":
        return "from-green-50/90 via-white/90 to-green-100/50";
      default:
        return "from-[#0B4073]/10 via-white/90 to-[#D6E2EA]/50";
    }
  };

  const getIconBg = () => {
    switch (color) {
      case "bg-[#7094B7]":
        return "bg-gradient-to-br from-[#7094B7] to-[#5a7ba8] shadow-lg";
      case "bg-green-500":
        return "bg-gradient-to-br from-green-500 to-green-600 shadow-lg";
      default:
        return "bg-gradient-to-br from-[#0B4073] to-[#1a5490] shadow-lg";
    }
  };

  const getBorderColor = () => {
    switch (color) {
      case "bg-[#7094B7]":
        return "border-[#7094B7]/20";
      case "bg-green-500":
        return "border-green-200";
      default:
        return "border-[#0B4073]/20";
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getCardGradient()} backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border ${getBorderColor()} p-8 transform hover:-translate-y-2 hover:scale-105 group relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
      
      <div className="flex items-center relative z-10">
        <div className={`rounded-2xl ${getIconBg()} p-5 mr-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          <div className="text-white text-2xl">{icon}</div>
        </div>
        <div>
          <h3 className="text-4xl font-bold bg-gradient-to-r from-[#0B4073] via-[#1a5490] to-[#7094B7] bg-clip-text text-transparent mb-1">
            {value}
          </h3>
          <p className="text-base font-bold text-gray-700 mb-1">{title}</p>
          <p className="text-sm text-gray-600 font-medium">{description}</p>
        </div>
      </div>
    </div>
  );
};

// Main UserDashboard Component
export default function UserDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [workbooks, setWorkbooks] = useState<Workbook[]>([]);
  const [welcomeMessage, setWelcomeMessage] = useState("");

  // 🚀 ULTRA-OPTIMIZED WORKBOOK STATISTICS - Single pass calculation
  const workbookStats = useMemo(() => {
    // Early return for empty workbooks
    if (!workbooks.length) {
      return {
        stats: {
          totalWorkbooks: 0,
          assigned: 0,
          inProgress: 0,
          completed: 0,
          submitted: 0,
          reviewed: 0,
        },
        categorizedWorkbooks: {
          active: [],
          unworked: [],
          incomplete: [],
        }
      };
    }

    const stats = {
      totalWorkbooks: workbooks.length,
      assigned: 0,
      inProgress: 0,
      completed: 0,
      submitted: 0,
      reviewed: 0,
    };

    const categorizedWorkbooks = {
      active: [] as Workbook[],
      unworked: [] as Workbook[],
      incomplete: [] as Workbook[],
    };

    // 🎯 OPTIMIZED SINGLE LOOP - Process each workbook only once
    for (let i = 0; i < workbooks.length; i++) {
      const workbook = workbooks[i];
      // Count by status
      switch (workbook.status) {
        case "assigned":
          stats.assigned++;
          categorizedWorkbooks.unworked.push(workbook);
          break;
        case "in_progress":
          stats.inProgress++;
          // Check if incomplete (has unanswered questions)
          if (workbook.questions) {
            const unansweredQuestions = workbook.questions.filter(
              (q) => !q.answer || q.answer.trim() === ""
            );
            if (unansweredQuestions.length > 0) {
              categorizedWorkbooks.incomplete.push(workbook);
            }
          }
          break;
        case "completed":
          stats.completed++;
          break;
        case "submitted":
          stats.submitted++;
          break;
        case "reviewed":
          stats.reviewed++;
          break;
      }

      // Track active workbooks (not submitted or reviewed)
      if (!["submitted", "reviewed"].includes(workbook.status)) {
        categorizedWorkbooks.active.push(workbook);
      }
    }

    return { stats, categorizedWorkbooks };
  }, [workbooks]);

  // 📊 MEMOIZED PROGRESS CALCULATIONS
  const progressMetrics = useMemo(() => {
    const { stats } = workbookStats;
    const totalCompleted = stats.completed + stats.submitted + stats.reviewed;
    const progressPercentage = stats.totalWorkbooks > 0 
      ? Math.round((totalCompleted / stats.totalWorkbooks) * 100) 
      : 0;
    
    const activeStats = {
      totalActive: workbookStats.categorizedWorkbooks.active.length,
      assigned: workbookStats.categorizedWorkbooks.active.filter(w => w.status === "assigned").length,
      inProgress: workbookStats.categorizedWorkbooks.active.filter(w => w.status === "in_progress").length,
      completed: workbookStats.categorizedWorkbooks.active.filter(w => w.status === "completed").length,
    };

    const canSubmitAll = activeStats.totalActive > 0;

    return { 
      progressPercentage, 
      totalCompleted, 
      activeStats, 
      canSubmitAll 
    };
  }, [workbookStats]);


  const fetchUserData = useCallback(async () => {
  setIsLoading(true);
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("user");

    if (!userId || userId === "null" || userId === "undefined" || userId.trim() === "") {
      console.warn(`Invalid user ID from URL: "${userId}"`);
      setError("No valid user specified. Please use the provided link.");
      setIsLoading(false);
      return;
    }

    console.log(`Fetching data for user ID: ${userId}`);
    const response = await fetch(`/api/user/${userId}/workbooks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Failed to fetch user data:", response.status, errorData);
      throw new Error(errorData.message || "Failed to load user information");
    }

    const responseData = await response.json();
    // API response logging removed for performance

    const responseUser = responseData.user || responseData.data?.user;
    const responseWorkbooks = responseData.workbooks || responseData.data?.workbooks || [];

    if (!responseUser) {
      console.error("User data not found in response:", responseData);
      throw new Error("User data not found in the response");
    }

    if (responseUser.isCompleted) {
      setWelcomeMessage(`Welcome back, ${responseUser.name}! You have completed all your workbooks.`);
      setTimeout(() => {
        window.location.href = `/thank-you?user=${responseUser._id}`;
      }, 3000);
      return;
    }

    setUser(responseUser);
    setWorkbooks(Array.isArray(responseWorkbooks) ? responseWorkbooks : []);
    setWelcomeMessage(`Welcome to your dashboard, ${responseUser.name}!`);
  } catch (error) {
    console.error("Error in fetchUserData:", error);
    setError(error instanceof Error ? error.message : "Failed to load dashboard data");
  } finally {
    setIsLoading(false);
  }
}, []);

  // 🎯 MEMOIZED SUBMIT HANDLER - Prevents recreation on every render
  const handleSubmitAll = useCallback(async () => {
    if (!user?._id) return;

    const { unworked, incomplete } = workbookStats.categorizedWorkbooks;
    const { activeStats } = progressMetrics;

    if (unworked.length > 0) {
      alert(
        `Please work on all workbooks before submitting. You have ${unworked.length} workbook(s) that haven't been started yet.`
      );
      return;
    }

    if (incomplete.length > 0) {
      if (
        !confirm(
          `You have ${incomplete.length} workbook(s) with unanswered questions. Do you want to submit anyway?`
        )
      ) {
        return;
      }
    }

    const activeCount = activeStats.totalActive;
    if (
      !confirm(
        `Are you sure you want to submit ${activeCount} active workbook${activeCount !== 1 ? 's' : ''}? Once submitted, you cannot make further changes.`
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Submit only active workbooks using secure user API
      const response = await fetch(`/api/user/${user._id}/workbooks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workbooks: workbookStats.categorizedWorkbooks.active,
        }),
      });

      if (response.ok) {
        // Redirect to thank you page
        window.location.href = `/thank-you?user=${user._id}`;
      } else {
        const errorData = await response.json();
        alert(
          `Failed to submit workbooks: ${errorData.message || "Please try again."}`
        );
      }
    } catch (err) {
      alert("Error submitting workbooks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [user, workbookStats.categorizedWorkbooks, progressMetrics.activeStats]);

  // 🔄 EFFECT FOR INITIAL DATA FETCH
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // 👀 EFFECT FOR WINDOW FOCUS REFRESH - Memoized to prevent unnecessary re-renders
  useEffect(() => {
    const handleFocus = () => {
      if (!isLoading) {
        fetchUserData();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isLoading, fetchUserData]);

  // 🎨 OPTIMIZED MEMOIZED VALUES - Performance enhanced
  const dashboardTitle = useMemo(() => {
    return user?.name ? `${user.name}'s Dashboard` : "Loading...";
  }, [user?.name]); // More specific dependency

  const displayMessage = useMemo(() => {
    return welcomeMessage || `Welcome back, ${user?.name || 'User'}!`;
  }, [welcomeMessage, user?.name]); // Added fallback to prevent undefined

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4073] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
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
            href="/login"
            className="inline-block px-4 py-2 bg-[#0B4073] text-white rounded hover:bg-[#0B4073]/90 transition"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1] min-h-screen font-[Roboto] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#0B4073]/5 to-transparent rounded-full transform -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#7094B7]/5 to-transparent rounded-full transform translate-x-48 translate-y-48"></div>
      
      <Header user={user} />

      <main className="container mx-auto px-6 py-10 relative z-10">
        {/* Enhanced Welcome Banner */}
        <div className="bg-gradient-to-r from-[#0B4073] via-[#0f4d84] to-[#1a5490] rounded-3xl shadow-2xl text-white p-10 mb-10 border border-white/20 relative overflow-hidden">
          {/* Background patterns */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full transform -translate-x-24 translate-y-24"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1">
              <h2 className="text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                {welcomeMessage || `Welcome back, ${user?.name}!`}
              </h2>
              <p className="text-blue-100/90 text-xl mb-4 font-medium leading-relaxed">
                You have {workbookStats.stats.totalWorkbooks} workbook
                {workbookStats.stats.totalWorkbooks !== 1 ? "s" : ""} assigned and ready to
                complete.
              </p>
              <div className="flex items-center space-x-4 text-blue-200/80">
                <div className="flex items-center">
                  <FiBook className="mr-2" />
                  <span className="text-sm font-medium">Learning Dashboard</span>
                </div>
                <div className="w-1 h-1 bg-blue-200/60 rounded-full"></div>
                <div className="flex items-center">
                  <FiCheckCircle className="mr-2" />
                  <span className="text-sm font-medium">Track Progress</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-28 h-28 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border border-white/30">
                <FiUser className="text-5xl text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatsCard
            icon={<FiBook />}
            title="Total Workbooks"
            value={workbookStats.stats.totalWorkbooks}
            description="Assigned to you"
          />
          <StatsCard
            icon={<FiEdit />}
            title="In Progress"
            value={workbookStats.stats.inProgress + workbookStats.stats.completed}
            description="Started or completed"
            color="bg-[#7094B7]"
          />
          <StatsCard
            icon={<FiSend />}
            title="Submitted"
            value={workbookStats.stats.submitted}
            description="Ready for review"
            color="bg-green-500"
          />
        </div>

        {/* Enhanced Progress Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-10 border border-gray-200/50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#0B4073]/5 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FiCheckCircle className="mr-3 text-[#0B4073]" />
                  Overall Progress
                </h3>
                <p className="text-gray-600 mt-1">Track your learning journey</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#0B4073] to-[#7094B7] bg-clip-text text-transparent">
                  {progressMetrics.progressPercentage}%
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {progressMetrics.totalCompleted} of {workbookStats.stats.totalWorkbooks} completed
                </span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200/80 rounded-full h-6 overflow-hidden shadow-inner backdrop-blur-sm">
              <div
                className="bg-gradient-to-r from-[#0B4073] via-[#1a5490] to-[#7094B7] h-6 rounded-full transition-all duration-1000 ease-out shadow-sm relative"
                style={{ width: `${progressMetrics.progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-gradient-to-r from-[#0B4073] to-[#7094B7] rounded-full mr-2"></div>
                Progress Bar
              </span>
              <span className="font-semibold">
                {workbookStats.stats.totalWorkbooks - progressMetrics.totalCompleted} remaining
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Workbooks Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-200/50 mb-10">
          <div className="bg-gradient-to-r from-[#0B4073] via-[#0f4d84] to-[#1a5490] px-8 py-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm border border-white/30">
                  <FiBook className="text-xl" />
                </div>
                Your Workbooks ({workbookStats.stats.totalWorkbooks})
              </h2>
              <p className="text-blue-100/80 mt-2 text-base font-medium">
                Manage and track your learning materials
              </p>
            </div>
          </div>

          {workbooks.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                <FiFileText className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">
                No Workbooks Assigned
              </h3>
              <p className="text-gray-500 text-lg leading-relaxed max-w-md mx-auto">
                Contact your administrator to get workbooks assigned to you and start your learning journey.
              </p>
            </div>
          ) : (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {workbooks.map((workbook) => (
                <WorkbookCard
                  key={workbook._id}
                  workbook={workbook}
                  userId={user?._id || ""}
                />
              ))}
            </div>
          )}
        </div>

        {/* Submit All Workbooks Section - Moved to Bottom */}
        {progressMetrics.canSubmitAll && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-xl p-10 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-100/50 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
            
            <div className="text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                <FiSend className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                Ready to Submit Your Work?
              </h3>

              <div className="text-base text-green-700 mb-8 max-w-2xl mx-auto">
                <p className="font-semibold mb-4 text-lg">Ready to submit {progressMetrics.activeStats.totalActive} active workbook(s):</p>
                <div className="space-y-2">
                  {progressMetrics.activeStats.completed > 0 && (
                    <p className="flex items-center justify-center">
                      <span className="text-2xl mr-2">✅</span>
                      {progressMetrics.activeStats.completed} workbook(s) completed and ready
                    </p>
                  )}
                  {progressMetrics.activeStats.inProgress > 0 && (
                    <p className="flex items-center justify-center">
                      <span className="text-2xl mr-2">📝</span>
                      {progressMetrics.activeStats.inProgress} workbook(s) saved as draft
                    </p>
                  )}
                  {progressMetrics.activeStats.assigned > 0 && (
                    <p className="flex items-center justify-center">
                      <span className="text-2xl mr-2">⚠️</span>
                      {progressMetrics.activeStats.assigned} workbook(s) haven't been started (will submit as blank)
                    </p>
                  )}
                  {workbookStats.stats.submitted > 0 && (
                    <p className="text-blue-700 flex items-center justify-center">
                      <span className="text-2xl mr-2">ℹ️</span>
                      {workbookStats.stats.submitted} workbook(s) already submitted (will be skipped)
                    </p>
                  )}
                </div>
              </div>
              
              <button
                onClick={handleSubmitAll}
                className="px-10 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl text-xl font-bold hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center mx-auto shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <FiSend className="mr-3 text-xl" />
                Submit {progressMetrics.activeStats.totalActive} Active Workbook{progressMetrics.activeStats.totalActive !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
