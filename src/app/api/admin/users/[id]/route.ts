import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import Workbook from "@/models/Workbook";
import { verifyAdminAccess } from "@/lib/nextauth-helpers";
import connectMongo from "@/lib/mongoose";

// GET: Get specific user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const auth = await verifyAdminAccess();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }

    await connectMongo();

    const user = await User.findById(id).select("-password").lean();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

// PUT: Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const auth = await verifyAdminAccess();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }

    const body = await request.json();
    await connectMongo();

    // Don't allow updating password through this endpoint
    const { password, ...updateData } = body;

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: { user },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete user
export async function DELETE(
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
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Prevent deletion of admin users
    if (user.role === "admin") {
      return NextResponse.json(
        { success: false, message: "Cannot delete admin users" },
        { status: 403 }
      );
    }

    const deletedWorkbooks = await Workbook.deleteMany({
      assignedTo: id,
      isTemplate: { $ne: true }, // Ensure we NEVER delete templates
    });



    // Remove workbook references from user's workbooks array
    await User.findByIdAndUpdate(id, {
      $set: { workbooks: [] },
    });

    // Delete the user
    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete user",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
