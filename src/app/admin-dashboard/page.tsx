"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { DashboardProvider } from "./context/DashboardContext";
import Link from "next/link";
import { debounce } from "lodash";
import * as Sentry from "@sentry/react";
import { unstable_batchedUpdates } from "react-dom";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import AdminHeader from "./components/AdminHeader";
import NavTabs from "./components/NavTabs";
import Toast from "./components/Toast";
import { User, Workbook } from "./types";
import CreateUserModal from "./models/CreateUserModal";
import AssignWorkbookModal from "./models/AssignWorkbookModal";
import UsersView from "./views/UsersView";
import WorkbooksView from "./views/WorkbooksView";
import AllAssignmentsView from "./views/AllAssignmentsView";
import DashboardView from "./views/DashboardView";
import { signOut } from "next-auth/react";
import { fetchWithTimeout } from "./utils/api";
import { API_BASE_URL } from "./utils/apiConfig";
import {
  handleDeleteAssignment,
  handleDeleteUser,
} from "./utils/handleButtons";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
interface UserResponse {
  users: User[];
}
interface WorkbookResponse {
  workbooks: Workbook[];
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-4 sm:p-6">
          <h2 className="text-red-500 text-lg sm:text-xl">
            Something went wrong
          </h2>
          <p className="text-sm sm:text-base">
            {this.state.error?.message || "Unknown error"}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deletingWorkbookId, setDeletingWorkbookId] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get("tab");
    const validTabs = ["dashboard", "users", "workbooks", "assignments"];
    return validTabs.includes(tabParam || "") ? tabParam! : "dashboard";
  });
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [preSelectedWorkbooks, setPreSelectedWorkbooks] = useState<string[]>(
    []
  );
  const [workbookToAssign, setWorkbookToAssign] = useState<Workbook | null>(
    null
  );
  const [confirmConfig, setConfirmConfig] = useState<{
    userId?: string;
    userName?: string;
    workbookCount?: number;
    workbookId?: string;
  } | null>(null);
  const [toasts, setToasts] = useState<
    { id: number; message: string; type: "success" | "error" | "info" }[]
  >([]);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
    });
  }, []);

  const fetchData = async (endpoints: string[]): Promise<any[]> => {
    try {
      const responses = await Promise.all(
        endpoints.map((url) =>
          fetchWithTimeout(`${API_BASE_URL}${url}`, {
            credentials: "include",
          }).then(async (res) => {
            if (!res.ok)
              throw new Error(
                `Fetch failed: ${res.status} ${await res.text()}`
              );
            return res.json();
          })
        )
      );
      return responses;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  };

  const setUser = useCallback((user: User | null) => {
    setInternalState((prev) => ({ ...prev, user }));
  }, []);

  const setUsers = useCallback((users: User[]) => {
    setInternalState((prev) => ({ ...prev, users }));
  }, []);

  const setWorkbooks = useCallback((workbooks: Workbook[]) => {
    setInternalState((prev) => ({ ...prev, workbooks }));
  }, []);

  const [internalState, setInternalState] = useState({
    user: null as User | null,
    users: [] as User[],
    workbooks: [] as Workbook[],
  });

  const contextValue = useMemo(
    () => ({
      ...internalState,
      setUser,
      setUsers,
      setWorkbooks,
    }),
    [internalState, setUser, setUsers, setWorkbooks]
  );

  const showToast = (message: string, type: "success" | "error" | "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      5000
    );
  };

  const debouncedSetActiveTab = useCallback(debounce(setActiveTab, 300), []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const logDebug = (msg: string, data?: unknown) =>
          process.env.NODE_ENV === "development" && console.log(msg, data);

        logDebug("Admin Dashboard: Starting NextAuth session check");

        if (status === "loading") {
          logDebug("Admin Dashboard: Session loading...");
          return;
        }

        if (status === "unauthenticated" || !session) {
          logDebug("Admin Dashboard: No session found, redirecting to login");
          router.push("/login");
          return;
        }

        if (session.user?.role !== "admin") {
          logDebug("Admin Dashboard: User is not admin, redirecting to login");
          router.push("/login");
          return;
        }

        logDebug("Admin Dashboard: Admin session verified successfully");

        setUser({
          _id: session.user.id,
          name: session.user.name || session.user.email,
          email: session.user.email,
          role: session.user.role,
        });

        logDebug("Admin Dashboard: Fetching dashboard data");
        await fetchDashboardData();
        logDebug("Admin Dashboard: Dashboard data fetched successfully");
      } catch (error) {
        console.error("Admin Dashboard: Error checking authentication:", error);
        Sentry.captureException(error);
        router.push("/login");
      }
    };

    const fetchDashboardData = async (page = 1, limit = 20) => {
      setIsLoading(true);
      try {
        const [usersData, workbooksData] = await fetchData([
          `/api/admin/users?page=${page}&limit=${limit}`,
          `/api/admin/workbooks?all=true&page=${page}&limit=${limit}`,
        ]);

        unstable_batchedUpdates(() => {
          setUsers((usersData as ApiResponse<UserResponse>).data?.users || []);
          setWorkbooks(
            (workbooksData as ApiResponse<WorkbookResponse>).data?.workbooks ||
              []
          );
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message.includes("fetch failed")
              ? "Failed to connect to the server. Please check your network."
              : error.message
            : "An unexpected error occurred";
        console.error("Error fetching dashboard data:", error);
        setError(message);
        showToast(message, "error");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [session, status, router, setUser, setUsers, setWorkbooks]);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Logout error:", error);
      Sentry.captureException(error);
    }
  };

  const refreshDashboardData = async () => {
    try {
      const lastUpdated = localStorage.getItem("lastUpdated");
      const [usersData, workbooksData] = await fetchData([
        `/api/admin/users${lastUpdated ? `?since=${lastUpdated}` : ""}`,
        `/api/admin/workbooks?all=true${lastUpdated ? `&since=${lastUpdated}` : ""}`,
      ]);

      unstable_batchedUpdates(() => {
        const extractedUsers =
          (usersData as ApiResponse<UserResponse>).data?.users || [];
        const extractedWorkbooks =
          (workbooksData as ApiResponse<WorkbookResponse>).data?.workbooks ||
          [];
        setUsers(extractedUsers);
        setWorkbooks(extractedWorkbooks);
      });

      localStorage.setItem("lastUpdated", new Date().toISOString());
      showToast("Data refreshed successfully!", "success");
    } catch (error) {
      console.error("Error refreshing dashboard data:", error);
      Sentry.captureException(error);
      showToast("Failed to refresh data", "error");
    }
  };

  const handleUserCreated = async () => {
    try {
      const [usersData, workbooksData] = await fetchData([
        `/api/admin/users`,
        `/api/admin/workbooks?all=true`,
      ]);

      unstable_batchedUpdates(() => {
        setUsers((usersData as ApiResponse<UserResponse>).data?.users || []);
        setWorkbooks(
          (workbooksData as ApiResponse<WorkbookResponse>).data?.workbooks || []
        );
      });

      showToast("User created successfully!", "success");
    } catch (error) {
      Sentry.captureException(error);
      showToast("Failed to refresh data after user creation", "error");
    }
  };

  const handleWorkbookAssigned = async (user: User) => {
    try {
      const res = await fetchWithTimeout(
        `${API_BASE_URL}/api/admin/workbooks?all=true`,
        { credentials: "include" }
      );
      const data = (await res.json()) as ApiResponse<WorkbookResponse>;
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch workbooks");
      }
      setWorkbooks(data.data?.workbooks || []);
      showToast(`Workbook assigned to ${user.name}!`, "success");
    } catch (error) {
      console.error("Error after workbook assignment:", error);
      Sentry.captureException(error);
      showToast("Failed to refresh data after assignment", "error");
    } finally {
      setShowAssignModal(false);
      setWorkbookToAssign(null);
    }
  };

  useEffect(() => {
    if (showCreateUserModal || showAssignModal) {
      modalRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setShowCreateUserModal(false);
          setShowAssignModal(false);
          setWorkbookToAssign(null);
          setPreSelectedWorkbooks([]);
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [showCreateUserModal, showAssignModal]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#0B4073] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
        <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-4xl sm:text-5xl mb-4">⚠️</div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
            Error
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-4">{error}</p>
          <Link
            href="/login"
            className="inline-block px-4 py-2 bg-[#0B4073] text-white rounded hover:bg-[#0B4073]/90 transition text-sm sm:text-base"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DashboardProvider value={contextValue}>
      <div className="bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1] min-h-screen font-[Roboto]">
        <AdminHeader user={internalState.user} onLogout={handleLogout} />
        <main className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <NavTabs activeTab={activeTab} onTabChange={debouncedSetActiveTab} />

          {activeTab === "dashboard" && (
            <ErrorBoundary>
              <DashboardView
                setShowCreateUserModal={setShowCreateUserModal}
                setActiveTab={debouncedSetActiveTab}
                refreshDashboardData={refreshDashboardData}
                showToast={showToast}
              />
            </ErrorBoundary>
          )}

          {activeTab === "users" && (
            <ErrorBoundary>
              <UsersView
                setShowCreateUserModal={setShowCreateUserModal}
                showToast={showToast}
                updateUsers={setUsers}
                refreshDashboardData={refreshDashboardData}
                setShowAssignModal={setShowAssignModal}
                setWorkbookToAssign={setWorkbookToAssign}
              />
            </ErrorBoundary>
          )}

          {activeTab === "workbooks" && (
            <ErrorBoundary>
              <WorkbooksView
                showToast={showToast}
                refreshData={refreshDashboardData}
              />
            </ErrorBoundary>
          )}

          {activeTab === "assignments" && (
            <ErrorBoundary>
              <AllAssignmentsView
                workbooks={internalState.workbooks}
                users={internalState.users}
                onDeleteAssignment={(workbookId, userName) =>
                  handleDeleteAssignment(
                    workbookId,
                    userName,
                    showToast,
                    refreshDashboardData,
                    setConfirmConfig,
                    setDeletingWorkbookId
                  )
                }
                onDeleteUser={(userId, userName, workbookCount) =>
                  handleDeleteUser(
                    userId,
                    userName,
                    workbookCount,
                    showToast,
                    refreshDashboardData,
                    setConfirmConfig,
                    setDeletingUserId
                  )
                }
                showToast={showToast}
                refreshData={refreshDashboardData}
              />
            </ErrorBoundary>
          )}
        </main>

        {showCreateUserModal && (
          <div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-user-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 sm:bg-black/70 px-4 sm:px-0"
          >
            <div className="w-full max-w-md sm:max-w-lg max-h-[90vh] sm:max-h-[80vh] overflow-y-auto bg-white rounded-lg">
              <CreateUserModal
                onClose={() => {
                  setShowCreateUserModal(false);
                  setPreSelectedWorkbooks([]);
                }}
                onUserCreated={handleUserCreated}
                preSelectedWorkbooks={preSelectedWorkbooks}
                showToast={showToast}
              />
            </div>
          </div>
        )}

        {showAssignModal && workbookToAssign && (
          <div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="assign-workbook-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 sm:bg-black/70 px-4 sm:px-0"
          >
            <div className="w-full max-w-md sm:max-w-lg max-h-[90vh] sm:max-h-[80vh] overflow-y-auto bg-white rounded-lg">
              <AssignWorkbookModal
                workbook={workbookToAssign}
                users={internalState.users.filter((u) => u.role === "user")}
                onAssign={handleWorkbookAssigned}
                onClose={() => {
                  setShowAssignModal(false);
                  setWorkbookToAssign(null);
                }}
                showToast={showToast}
              />
            </div>
          </div>
        )}

        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 space-y-2 z-50">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
            />
          ))}
        </div>
      </div>
    </DashboardProvider>
  );
}
