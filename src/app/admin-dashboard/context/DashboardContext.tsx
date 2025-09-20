"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
} from "react";
import { DashboardState, Workbook } from "../types";
import { API_BASE_URL } from "../utils/apiConfig";

const DashboardContext = createContext<DashboardState | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
  value?: Partial<DashboardState>;
  showToast?: (message: string, type: "success" | "error" | "info") => void;
}

export const DashboardProvider = ({
  children,
  value,
  showToast,
}: DashboardProviderProps) => {
  const [state, setState] = useState({
    user: null as DashboardState["user"],
    users: [] as DashboardState["users"],
    workbooks: [] as DashboardState["workbooks"],
    templateWorkbooks: [] as Workbook[],
    isRefreshing: false,
    lastRefreshTime: null as Date | null,
  });

  const setUser = useCallback((user: DashboardState["user"]) => {
    setState((prev) => ({ ...prev, user }));
  }, []);

  const setUsers = useCallback((users: DashboardState["users"]) => {
    setState((prev) => ({ ...prev, users }));
  }, []);

  const setWorkbooks = useCallback((workbooks: DashboardState["workbooks"]) => {
    setState((prev) => ({ ...prev, workbooks }));
  }, []);

  const setTemplateWorkbooks = useCallback((templateWorkbooks: Workbook[]) => {
    setState((prev) => ({ ...prev, templateWorkbooks }));
  }, []);

  const setIsRefreshing = useCallback((isRefreshing: boolean) => {
    setState((prev) => ({ ...prev, isRefreshing }));
  }, []);

  const setLastRefreshTime = useCallback((lastRefreshTime: Date | null) => {
    setState((prev) => ({ ...prev, lastRefreshTime }));
  }, []);

  // 🚀 OPTIMIZED: Enhanced refresh functions with pagination support
  const refreshUsers = useCallback(
    async (page = 1, limit = 20, search = "", filters = {}) => {
      try {
        setState((prev) => ({ ...prev, isRefreshing: true }));

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...filters,
        });

        const response = await fetch(
          `${API_BASE_URL}/api/admin/users?${params}`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUsers(data.data?.users || []);
          return data.data; // Return pagination info
        }
      } catch (error) {
        console.error("Failed to refresh users:", error);
        if (showToast) {
          showToast("Failed to refresh users", "error");
        }
      } finally {
        setState((prev) => ({
          ...prev,
          isRefreshing: false,
          lastRefreshTime: new Date(),
        }));
      }
    },
    [setUsers, showToast]
  );

  const refreshWorkbooks = useCallback(
    async (includeUserCopies = true) => {
      try {
        setState((prev) => ({ ...prev, isRefreshing: true }));

        const url = includeUserCopies
          ? `${API_BASE_URL}/api/admin/workbooks?all=true`
          : `${API_BASE_URL}/api/admin/workbooks`;

        const response = await fetch(url, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setWorkbooks(data.data?.workbooks || []);
          return data.data;
        }
      } catch (error) {
        console.error("Failed to refresh workbooks:", error);
        if (showToast) {
          showToast("Failed to refresh workbooks", "error");
        }
      } finally {
        setState((prev) => ({
          ...prev,
          isRefreshing: false,
          lastRefreshTime: new Date(),
        }));
      }
    },
    [setWorkbooks, showToast]
  );

  const refreshTemplateWorkbooks = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/workbooks`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setTemplateWorkbooks(data.data?.workbooks || []);
        return data.data;
      }
    } catch (error) {
      console.error("Failed to refresh template workbooks:", error);
      if (showToast) {
        showToast("Failed to refresh templates", "error");
      }
    }
  }, [setTemplateWorkbooks, showToast]);

  // 🎯 OPTIMIZED: Batch refresh with better error handling
  const refreshAllData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isRefreshing: true }));

      // Execute all refreshes in parallel for better performance
      const [usersResult, workbooksResult, templatesResult] =
        await Promise.allSettled([
          fetch(`${API_BASE_URL}/api/admin/users`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/admin/workbooks?all=true`, {
            credentials: "include",
          }),
          fetch(`${API_BASE_URL}/api/admin/workbooks`, {
            credentials: "include",
          }),
        ]);

      // Process users
      if (usersResult.status === "fulfilled" && usersResult.value.ok) {
        const userData = await usersResult.value.json();
        setUsers(userData.data?.users || []);
      }

      // Process all workbooks
      if (workbooksResult.status === "fulfilled" && workbooksResult.value.ok) {
        const workbookData = await workbooksResult.value.json();
        setWorkbooks(workbookData.data?.workbooks || []);
      }

      // Process template workbooks
      if (templatesResult.status === "fulfilled" && templatesResult.value.ok) {
        const templateData = await templatesResult.value.json();
        setTemplateWorkbooks(templateData.data?.workbooks || []);
      }

      // Check for any failures
      const failures = [usersResult, workbooksResult, templatesResult].filter(
        (result) => result.status === "rejected"
      );

      if (failures.length > 0 && showToast) {
        showToast(
          `Failed to refresh ${failures.length} data source(s)`,
          "error"
        );
      }
    } catch (error) {
      console.error("Failed to refresh all data:", error);
      if (showToast) {
        showToast("Failed to refresh dashboard data", "error");
      }
    } finally {
      setState((prev) => ({
        ...prev,
        isRefreshing: false,
        lastRefreshTime: new Date(),
      }));
    }
  }, [setUsers, setWorkbooks, setTemplateWorkbooks, showToast]);

  useEffect(() => {
    refreshTemplateWorkbooks();
  }, [refreshTemplateWorkbooks]);

  const contextValue: DashboardState = {
    user: value?.user ?? state.user,
    users: value?.users ?? state.users,
    workbooks: value?.workbooks ?? state.workbooks,
    templateWorkbooks: state.templateWorkbooks,
    isRefreshing: state.isRefreshing,
    lastRefreshTime: state.lastRefreshTime,
    setUser,
    setUsers,
    setWorkbooks,
    setTemplateWorkbooks,
    // Simple refresh functions
    refreshTemplateWorkbooks,
    refreshUsers,
    refreshWorkbooks,
    refreshAllData,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context)
    throw new Error("useDashboard must be used within DashboardProvider");
  return context;
};

export default DashboardContext;
