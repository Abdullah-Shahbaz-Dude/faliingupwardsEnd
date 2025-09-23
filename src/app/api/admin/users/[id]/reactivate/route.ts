import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import { verifyAdminAccess } from "@/lib/nextauth-helpers";
import User from "@/models/User";

// POST: Reactivate expired user
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAdminAccess();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }

    const { id: userId } = await params;
    const { extendDays = 30 } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    await connectMongo();

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Reactivate user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isCompleted: false,
        dashboardExpired: false,
        linkExpiresAt: new Date(Date.now() + extendDays * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: `User ${user.name} reactivated successfully. Dashboard access extended by ${extendDays} days.`,
      data: {
        user: updatedUser,
        dashboardLink: `${process.env.NEXT_PUBLIC_API_URL || "https://fallinupwards-backup-fullstack-mg7k.vercel.app"}/user-dashboard?user=${userId}`,
        expiresAt: updatedUser.linkExpiresAt,
      },
    });
  } catch (error) {
    console.error("Error reactivating user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reactivate user" },
      { status: 500 }
    );
  }
}
