export const generateDashboardLink = (userId: string): string =>
  `${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard?user=${userId}`;
