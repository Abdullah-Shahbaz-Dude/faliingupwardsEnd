export const API_ROUTES = {
  USERS: "/api/admin/users",
  WORKBOOKS: "/api/admin/workbooks",
  WORKBOOK_ASSIGN: "/api/admin/workbooks/assign",
  WORKBOOK_SUBMISSION: (workbookId: string) =>
    `/api/workbook/${workbookId}/submission`,
  USER_WORKBOOKS: "/api/user/workbooks",
  USER_APPOINTMENTS: "/api/user/appointments",
  REGISTER: "/api/auth/register",
};

export const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout = 10000
) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...options.headers,
        "X-CSRF-Token": await getCsrfToken(),
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
};

export async function getCsrfToken(): Promise<string> {
  // Replace with actual CSRF token fetching logic
  return "mock-csrf-token";
}
