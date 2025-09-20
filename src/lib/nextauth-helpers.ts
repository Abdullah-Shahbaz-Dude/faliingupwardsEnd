import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";

export async function verifyAdminAccess() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { authorized: false, message: "No session found" };
  }
  if (session.user?.role !== "admin") {
    return { authorized: false, message: "Admin access required" };
  }
  return { authorized: true, user: session.user };
}

export async function verifyUserAccess(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { authorized: false, message: "No session found" };
  }
  if (session.user.id !== userId) {
    return { authorized: false, message: "Unauthorized user" };
  }
  return { authorized: true, user: session.user };
}
