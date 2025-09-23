export const generateDashboardLink = (userId: string): string =>
  `${process.env.NEXT_PUBLIC_BASE_URL || "https://fallinupwards-backup-fullstack-mg7k.vercel.app"}/user-dashboard?user=${userId}`;
