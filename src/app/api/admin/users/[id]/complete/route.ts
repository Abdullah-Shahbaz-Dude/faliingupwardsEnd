import { NextRequest, NextResponse } from "next/server";
// UPDATED: Use NextAuth helper instead of local JWT auth
// import { verify } from "jsonwebtoken";
import mongoose from "mongoose";
import User from "@/models/User";
import { verifyAdminAccess } from "@/lib/nextauth-helpers";
import connectMongo from "@/lib/mongoose";

// POST: Mark user as completed and expire their dashboard access
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

    await connectMongo();

    const { id } = await params;

    // Update user to mark as completed
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        isCompleted: true,
        completedAt: new Date(),
        dashboardExpired: true,
        updatedAt: new Date(),
      },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User marked as completed successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error("Error completing user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to complete user",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
