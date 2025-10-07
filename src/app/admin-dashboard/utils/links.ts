export const generateDashboardLink = (userId: string): string =>
  `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.fallingupwards.co.uk/"}/user-dashboard?user=${userId}`;
