import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import { verifyAdminAccess } from "@/lib/nextauth-helpers";
import User from "@/models/User";
import Workbook, { IQuestion } from "@/models/Workbook";
import mongoose from "mongoose";

// POST: Assign workbook to user
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminAccess();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }

    const { workbookId, userId } = await request.json();

    if (!workbookId || !userId) {
      return NextResponse.json(
        { success: false, message: "Workbook ID and User ID are required" },
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

    // Check if workbook template exists
    const templateWorkbook = await Workbook.findById(workbookId);
    if (!templateWorkbook) {
      return NextResponse.json(
        { success: false, message: "Workbook template not found" },
        { status: 404 }
      );
    }

    if (!templateWorkbook.isTemplate) {
      return NextResponse.json(
        { success: false, message: "Selected workbook is not a template" },
        { status: 400 }
      );
    }

    // Check if user already has this workbook assigned
    const existingAssignment = await Workbook.findOne({
      templateId: workbookId,
      assignedTo: userId,
    });

    if (existingAssignment) {
      return NextResponse.json(
        { success: false, message: "Workbook already assigned to this user" },
        { status: 409 }
      );
    }

    // Generate consistent dashboard link
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    // Fallback to request origin if NEXT_PUBLIC_BASE_URL is not set
    if (!baseUrl) {
      const origin = request.headers.get('origin') || 
                    request.headers.get('host') ? 
                    `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host')}` : 
                    'http://localhost:3000';
      baseUrl = origin;
      // Using fallback URL - warning removed for performance
    }
    
    const dashboardLink = `${baseUrl}/user-dashboard?user=${userId}`;

    // Use transaction to ensure atomic workbook assignment
    const session = await mongoose.startSession();
    
    try {
      const result = await session.withTransaction(async () => {
        // Create a new workbook instance for the user
        const newWorkbook = new Workbook({
          title: templateWorkbook.title,
          description: templateWorkbook.description,
          questions: templateWorkbook.questions?.map((q: IQuestion) => ({
            question: q.question,
            answer: ''
          })) || [],
          assignedTo: userId,
          status: 'assigned',
          isTemplate: false,
          templateId: workbookId,
          shareableLink: dashboardLink,
        });

        const savedWorkbook = await newWorkbook.save({ session });

        // Add workbook to user's workbooks array AND reactivate user
        await User.findByIdAndUpdate(userId, {
          $addToSet: { workbooks: savedWorkbook._id },
          // REACTIVATE USER: Reset completion flags when new workbooks assigned
          isCompleted: false,
          dashboardExpired: false,
          // Extend link expiration by 30 days from now
          linkExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }, { session });

        return savedWorkbook;
      });

      const savedWorkbook = result;

      return NextResponse.json({
        success: true,
        message: "Workbook assigned successfully",
        data: {
          workbook: savedWorkbook,
          shareableLink: dashboardLink
        }
      });

    } catch (transactionError) {
      console.error('Transaction failed during workbook assignment:', transactionError);
      return NextResponse.json(
        { success: false, message: "Failed to assign workbook" },
        { status: 500 }
      );
    } finally {
      await session.endSession();
    }

  } catch (error) {
    console.error("Error in workbook assignment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to assign workbook" },
      { status: 500 }
    );
  }
}

// DELETE: Unassign workbook from user
export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAdminAccess();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }

    const { workbookId, userId } = await request.json();

    if (!workbookId || !userId) {
      return NextResponse.json(
        { success: false, message: "Workbook ID and User ID are required" },
        { status: 400 }
      );
    }

    await connectMongo();

    // Find and delete the assigned workbook
    const deletedWorkbook = await Workbook.findOneAndDelete({
      _id: workbookId,
      assignedTo: userId,
      isTemplate: false
    });

    if (!deletedWorkbook) {
      return NextResponse.json(
        { success: false, message: "Assigned workbook not found" },
        { status: 404 }
      );
    }

    // Remove workbook from user's workbooks array
    await User.findByIdAndUpdate(userId, {
      $pull: { workbooks: workbookId }
    });

    return NextResponse.json({
      success: true,
      message: "Workbook unassigned successfully"
    });

  } catch (error) {
    console.error("Error unassigning workbook:", error);
    return NextResponse.json(
      { success: false, message: "Failed to unassign workbook" },
      { status: 500 }
    );
  }
}
