// export const generateDashboardLink = (userId: string): string =>
//   `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/user-dashboard?user=${userId}`;

export const generateDashboardLink = (userId: string): string =>
  `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/user-dashboard?user=${userId}`;
