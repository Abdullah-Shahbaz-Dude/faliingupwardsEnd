import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess } from "@/lib/nextauth-helpers";
import mongoose from "mongoose";
import Workbook from "@/models/Workbook";
import connectMongo from "@/lib/mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access using NextAuth
    const authResult = await verifyAdminAccess();
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    const workbookId = params.id;

    // Validate workbook ID
    if (!workbookId || workbookId === "null" || workbookId === "undefined") {
      return NextResponse.json(
        { success: false, message: "Invalid workbook ID" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectMongo();

    // Fetch the workbook with submission data
    const workbook = (await Workbook.findById(workbookId).lean()) as any;

    if (!workbook) {
      return NextResponse.json(
        { success: false, message: "Workbook not found" },
        { status: 404 }
      );
    }

    // Allow preview of workbooks in various states (not just submitted)
    const allowedStatuses = ["in_progress", "completed", "submitted", "reviewed", "draft"];
    if (!allowedStatuses.includes(workbook.status)) {
      return NextResponse.json(
        { success: false, message: `Workbook is ${workbook.status} - no preview available` },
        { status: 400 }
      );
    }

    // Extract submission data
    const questions = workbook.questions || [];
    const completedQuestions = questions.filter(
      (q: any) => q.answer && q.answer.trim() !== ""
    ).length;

    const submissionData = {
      workbookId: workbook._id,
      title: workbook.title,
      status: workbook.status,
      submittedAt: workbook.submittedAt || workbook.updatedAt,
      completedQuestions: completedQuestions,
      totalQuestions: questions.length,
      responses: questions.map((q: any) => ({
        question: q.question,
        answer: q.answer || "No response",
      })),
      userResponse: workbook.userResponse || "",
      assignedTo: workbook.assignedTo,
      createdAt: workbook.createdAt,
      updatedAt: workbook.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: submissionData,
    });
  } catch (error) {
    console.error("Error fetching workbook submission:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
