"use client";

import { useEffect, useState } from "react";
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
import { IMAGE_PATHS, LOGO } from "@/config/images";
import Image from "next/image";

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

// Modern Professional Header Component
const Header = ({ user }: { user: User | null }) => (
  <header className="bg-gradient-to-r from-[#0B4073] to-[#1a5490] text-white shadow-xl border-b border-[#7094B7]/20">
    <div className="container mx-auto px-6">
      <div className="flex justify-between items-center py-5">
        <div className="flex items-center space-x-5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center ">
            <Image
              src={LOGO}
              alt="Falling Upward"
              width={60}
              height={60}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Dashboard</h1>
            <p className="text-blue-100/80 text-sm font-medium">
              Track your learning progress
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <div className="w-8 h-8 bg-[#7094B7] rounded-full flex items-center justify-center">
              <FiUser className="text-white text-sm" />
            </div>
            <span className="text-sm font-medium">{user?.name || "User"}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
);

// StatusBadge Component
const StatusBadge = ({ status }: { status: string }) => {
  const badgeStyles = {
    assigned: "bg-[#D6E2EA] text-[#0B4073] border-[#0B4073]/20",
    in_progress: "bg-[#7094B7]/10 text-[#7094B7] border-[#7094B7]/30",
    completed: "bg-green-50 text-green-700 border-green-200",
    submitted: "bg-[#0B4073] text-white border-[#0B4073]",
    reviewed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const icons = {
    assigned: <FiBook className="mr-1.5" />,
    in_progress: <FiEdit className="mr-1.5" />,
    completed: <FiCheckCircle className="mr-1.5" />,
    submitted: <FiSend className="mr-1.5" />,
    reviewed: <FiEye className="mr-1.5" />,
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
      className={`px-3 py-2 rounded-full text-xs font-semibold flex items-center border ${
        badgeStyles[status as keyof typeof badgeStyles] ||
        "bg-gray-100 text-gray-800 border-gray-200"
      }`}
    >
      {icons[status as keyof typeof icons] || null}
      {labels[status as keyof typeof labels] ||
        status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
    </span>
  );
};

// WorkbookCard Component
const WorkbookCard = ({
  workbook,
  userId,
}: {
  workbook: Workbook;
  userId: string;
}) => {
  const getProgressPercentage = () => {
    if (!workbook.questions || workbook.questions.length === 0) return 0;
    const answeredQuestions = workbook.questions.filter(
      (q) => q.answer && q.answer.trim() !== ""
    );
    return Math.round(
      (answeredQuestions.length / workbook.questions.length) * 100
    );
  };

  const progress = getProgressPercentage();

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#0B4073]/20">
      <div className="h-1 bg-gradient-to-r from-[#0B4073] to-[#7094B7]"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2 flex-1 mr-3">
            {workbook.title}
          </h3>
          <StatusBadge status={workbook.status} />
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {workbook.description || "No description available."}
        </p>

        {workbook.questions && workbook.questions.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>Progress</span>
              <span className="text-[#0B4073]">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#0B4073] to-[#7094B7] h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-medium">
              {
                workbook.questions.filter(
                  (q) => q.answer && q.answer.trim() !== ""
                ).length
              }{" "}
              of {workbook.questions.length} questions completed
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 flex items-center">
            <FiCalendar className="mr-1.5" />
            {new Date(
              workbook.updatedAt || workbook.createdAt || ""
            ).toLocaleDateString()}
          </div>

          <Link
            href={`/workbook/${workbook._id}?user=${userId}&from=user-dashboard`}
            className="px-5 py-2.5 bg-gradient-to-r from-[#0B4073] to-[#7094B7] text-white rounded-lg text-sm font-medium hover:from-[#0B4073]/90 hover:to-[#7094B7]/90 transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
          >
            {workbook.status === "assigned"
              ? "Start Now"
              : workbook.status === "completed"
              ? "Review & Submit"
              : workbook.status === "submitted"
              ? "View Submitted"
              : "Continue"}
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
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
  const getIconBg = () => {
    switch (color) {
      case "bg-[#7094B7]":
        return "bg-[#7094B7]/20";
      case "bg-green-500":
        return "bg-green-100";
      default:
        return "bg-[#D6E2EA]";
    }
  };

  const getIconColor = () => {
    switch (color) {
      case "bg-[#7094B7]":
        return "text-[#7094B7]";
      case "bg-green-500":
        return "text-green-600";
      default:
        return "text-[#0B4073]";
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 p-6 transform hover:-translate-y-1">
      <div className="flex items-center">
        <div className={`rounded-2xl ${getIconBg()} p-4 mr-4 shadow-lg`}>
          <div className={`${getIconColor()} text-xl`}>{icon}</div>
        </div>
        <div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-[#0B4073] to-[#1a5490] bg-clip-text text-transparent">
            {value}
          </h3>
          <p className="text-sm font-semibold text-gray-700">{title}</p>
          <p className="text-xs text-gray-500 font-medium">{description}</p>
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

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Get user ID from URL query parameter
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("user");

      // Validate user ID - check for null, undefined, empty string, or "null" string
      if (
        !userId ||
        userId === "null" ||
        userId === "undefined" ||
        userId.trim() === ""
      ) {
        console.warn(`Invalid user ID from URL: "${userId}"`);
        setError("No valid user specified. Please use the provided link.");
        setIsLoading(false);
        return;
      }

      // Validate ObjectId format (24 character hex string)
      if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
        console.warn(`Invalid ObjectId format for user ID: "${userId}"`);
        setError(
          "Invalid user link format. Please use the correct link provided."
        );
        setIsLoading(false);
        return;
      }

      // Fetching user data

      // Fetch user details and workbooks using the secure endpoint
      const userResponse = await fetch(`/api/user/${userId}/workbooks`);

      if (userResponse.ok) {
        const userData = await userResponse.json();
        const currentUser = userData.data.user;
        const userWorkbooks = userData.data.workbooks;

        if (!currentUser) {
          setError("User not found");
          setIsLoading(false);
          return;
        }

        // Check if user has completed all workbooks, dashboard is expired, or link has expired
        const isLinkExpired =
          currentUser.linkExpiresAt &&
          new Date().getTime() > new Date(currentUser.linkExpiresAt).getTime();

        // Check if user has any active (non-submitted) workbooks
        const hasActiveWorkbooks = userWorkbooks.some(
          (wb: Workbook) => wb.status !== "submitted" && wb.status !== "reviewed"
        );

        // Only show expired if user has NO active workbooks AND is marked as completed/expired
        if (
          (currentUser.isCompleted ||
          currentUser.dashboardExpired ||
          isLinkExpired) &&
          !hasActiveWorkbooks
        ) {
          // Add user feedback before redirect
          const expiredReason = isLinkExpired
            ? "Your dashboard link has expired. Please contact your administrator for a new link."
            : "Your dashboard access has expired. You have already completed your workbooks.";

          // User dashboard has expired
          setError(expiredReason);
          setTimeout(() => {
            window.location.href = `/thank-you?user=${userId}`;
          }, 3000); // Give user time to see the message
          return;
        }

        setUser(currentUser);
        setWorkbooks(userWorkbooks);
        setWelcomeMessage(`Welcome to your dashboard, ${currentUser.name}!`);
      } else {
        console.error("Failed to fetch user data:", userResponse.status);
        setError("Failed to load user information");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Refresh data when page comes back into focus (user returns from workbook)
  useEffect(() => {
    const handleFocus = () => {
      fetchUserData();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleSubmitAll = async () => {
    if (!user?._id) return;

    // Check if all workbooks have been worked on (assigned workbooks that haven't been touched)
    const unworkedWorkbooks = workbooks.filter((w) => w.status === "assigned");

    // Check for incomplete workbooks (in_progress but with unanswered questions)
    const incompleteWorkbooks = workbooks.filter((w) => {
      if (w.status !== "in_progress") return false; // Only check in_progress workbooks
      if (!w.questions || w.questions.length === 0) return false;
      const unansweredQuestions = w.questions.filter(
        (q) => !q.answer || q.answer.trim() === ""
      );
      return unansweredQuestions.length > 0;
    });

    // Count completed workbooks
    const completedWorkbooks = workbooks.filter(
      (w) => w.status === "completed"
    );

    if (unworkedWorkbooks.length > 0) {
      alert(
        `Please work on all workbooks before submitting. You have ${unworkedWorkbooks.length} workbook(s) that haven't been started yet.`
      );
      return;
    }

    if (incompleteWorkbooks.length > 0) {
      if (
        !confirm(
          `You have ${incompleteWorkbooks.length} workbook(s) with unanswered questions. Do you want to submit anyway?`
        )
      ) {
        return;
      }
    }

    const activeCount = activeWorkbooks.length;
    if (
      !confirm(
        `Are you sure you want to submit ${activeCount} active workbook${activeCount !== 1 ? 's' : ''}? Once submitted, you cannot make further changes.`
      )
    ) {
      return;
    }

    try {
      // Submit only active workbooks using secure user API
      const response = await fetch(`/api/user/${user._id}/workbooks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workbooks: activeWorkbooks, // Only submit active workbooks
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
    }
  };

  // Calculate stats
  const stats = {
    totalWorkbooks: workbooks.length,
    assigned: workbooks.filter((w) => w.status === "assigned").length,
    inProgress: workbooks.filter((w) => w.status === "in_progress").length,
    completed: workbooks.filter((w) => w.status === "completed").length,
    submitted: workbooks.filter((w) => w.status === "submitted").length,
    reviewed: workbooks.filter((w) => w.status === "reviewed").length,
  };

  // Enhanced validation: Allow submission of active workbooks even if some are already submitted
  const activeWorkbooks = workbooks.filter(w => 
    w.status === "assigned" || w.status === "in_progress" || w.status === "completed"
  );
  
  const canSubmitAll =
    activeWorkbooks.length > 0; // Show submit button if there are any active workbooks

  // Also calculate stats for active workbooks only
  const activeStats = {
    totalActive: activeWorkbooks.length,
    assigned: activeWorkbooks.filter((w) => w.status === "assigned").length,
    inProgress: activeWorkbooks.filter((w) => w.status === "in_progress").length,
    completed: activeWorkbooks.filter((w) => w.status === "completed").length,
  };

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
    <div className="bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1] min-h-screen font-[Roboto]">
      <Header user={user} />

      <main className="container mx-auto px-6 py-8">
        {/* Modern Welcome Banner */}
        <div className="bg-gradient-to-r from-[#0B4073] to-[#1a5490] rounded-2xl shadow-2xl text-white p-8 mb-8 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold mb-3 tracking-tight">
                {welcomeMessage || `Welcome back, ${user?.name}!`}
              </h2>
              <p className="text-blue-100/90 text-lg mb-2 font-medium">
                You have {stats.totalWorkbooks} workbook
                {stats.totalWorkbooks !== 1 ? "s" : ""} assigned and ready to
                complete.
              </p>
            </div>
            <div className="text-right">
              <Image
                src={LOGO}
                alt="favicon"
                width={60}
                height={60}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={<FiBook />}
            title="Total Workbooks"
            value={stats.totalWorkbooks}
            description="Assigned to you"
          />
          <StatsCard
            icon={<FiEdit />}
            title="In Progress"
            value={stats.inProgress + stats.completed}
            description="Started or completed"
            color="bg-[#7094B7]"
          />
          <StatsCard
            icon={<FiSend />}
            title="Submitted"
            value={stats.submitted}
            description="Ready for review"
            color="bg-green-500"
          />
        </div>

        {/* Workbooks Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
              <FiFileText className="mr-3 text-[#0B4073]" />
              My Workbooks
            </h3>
          </div>

          {workbooks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <FiBook className="mx-auto text-gray-400 text-6xl mb-4" />
              <h4 className="text-xl font-semibold text-gray-600 mb-2">
                No Workbooks Assigned
              </h4>
              <p className="text-gray-500">
                You don't have any workbooks assigned yet. Check back later or
                contact your administrator.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        {/* Submit All Workbooks Section */}
        {canSubmitAll && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FiSend className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                Ready to Submit!
              </h3>

              <div className="text-sm text-green-600 mb-6">
                <p className="font-semibold mb-2">Ready to submit {activeStats.totalActive} active workbook(s):</p>
                {activeStats.completed > 0 && (
                  <p>✅ {activeStats.completed} workbook(s) completed and ready</p>
                )}
                {activeStats.inProgress > 0 && (
                  <p>📝 {activeStats.inProgress} workbook(s) saved as draft</p>
                )}
                {activeStats.assigned > 0 && (
                  <p>
                    ⚠️ {activeStats.assigned} workbook(s) haven't been started (will
                    submit as blank)
                  </p>
                )}
                {stats.submitted > 0 && (
                  <p className="text-blue-600">ℹ️ {stats.submitted} workbook(s) already submitted (will be skipped)</p>
                )}
              </div>
              <button
                onClick={handleSubmitAll}
                className="px-8 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center mx-auto"
              >
                <FiSend className="mr-2" />
                Submit {activeStats.totalActive} Active Workbook{activeStats.totalActive !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
