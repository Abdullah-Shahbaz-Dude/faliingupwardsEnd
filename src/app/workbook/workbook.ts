import { Workbook } from "../admin-dashboard/types";

// services/workbook.ts
export async function fetchWorkbook(workbookId: string, userId?: string) {
  // If userId is provided, use user API with ownership validation, otherwise use admin API
  const endpoint = userId 
    ? `/api/workbook/${workbookId}?user=${userId}`
    : `/api/admin/workbooks/${workbookId}`;
    
  const response = await fetch(endpoint, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to load workbook");
  return response.json();
}

export async function updateWorkbook(
  workbookId: string,
  data: Partial<Workbook>,
  userId?: string
) {
  // If userId is provided, use user API with ownership validation, otherwise use admin API
  const endpoint = userId 
    ? `/api/workbook/${workbookId}?user=${userId}`
    : `/api/admin/workbooks/${workbookId}`;
    
  const response = await fetch(endpoint, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to update workbook");
  return response.json();
}
