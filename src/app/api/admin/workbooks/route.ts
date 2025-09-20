import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import Workbook from "@/models/Workbook";
import User from "@/models/User";
import { verifyAdminAccess } from "@/lib/nextauth-helpers";
import connectMongo from "@/lib/mongoose";

// Shared interface for Workbooks (plain object, not Mongoose Document)
interface IWorkbooks {
  _id: Types.ObjectId | string;
  title: string;
  description: string;
  content?: string;
  link?: Types.ObjectId | string;
  questions: { question: string; answer: string }[];
  assignedTo?: Types.ObjectId | string;
  status: "assigned" | "in_progress" | "submitted" | "reviewed";
  userResponse?: string;
  adminFeedback?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  shareableLink?: string;
  templateId?: Types.ObjectId | string;
  isTemplate?: boolean;
}

// POST: Create new workbook (admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminAccess();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, content, questions } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "Title and description are required" },
        { status: 400 }
      );
    }

    // Ensure MongoDB connection
    await connectMongo();

    // Create new workbook template
    const newWorkbook = new Workbook({
      title,
      description,
      content: content || "",
      questions: questions || [],
      status: "assigned", // Default status for new workbooks
      userResponse: "",
      adminFeedback: "",
      shareableLink: "",
      isTemplate: true, // Mark as template
      assignedTo: null, // Templates are not assigned to anyone
    });

    const savedWorkbook = await newWorkbook.save();

    // Workbook created successfully

    return NextResponse.json({
      success: true,
      message: "Workbook created successfully",
      data: { workbook: savedWorkbook },
    });
  } catch (error) {
    console.error("Error creating workbook:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create workbook",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

// GET: Get all workbooks (admin only) - Enhanced with industry-level improvements
export async function GET(request: NextRequest) {
  try {
    // Fetching workbooks

    // Verify admin access using NextAuth
    const auth = await verifyAdminAccess();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }

    // Ensure MongoDB connection
    await connectMongo();

    // Check if all workbooks are requested (including user copies)
    const { searchParams } = new URL(request.url);
    const showAllWorkbooks = searchParams.get("all") === "true";

    // Get workbooks from MongoDB
    let query = {};
    if (showAllWorkbooks) {
      // Get ALL workbooks (templates + user copies)
      query = {}; // No filter - get everything
    } else {
      // DEFAULT: Get only template workbooks for admin dashboard (your 28 templates)
      query = {
        $or: [
          { isTemplate: true },
          // Legacy templates (no isTemplate field but not assigned to anyone)
          {
            isTemplate: { $exists: false },
            assignedTo: null,
            templateId: { $exists: false },
          },
        ],
      };
    }

    const workbooks = await Workbook.find(query).lean<IWorkbooks[]>();
    // Successfully fetched workbooks

    // Enrich workbooks with user info
    type WorkbookWithUser = IWorkbooks & {
      userName: string;
      userEmail: string;
    };

    const workbooksWithUserInfo: WorkbookWithUser[] = await Promise.all(
      workbooks.map(async (workbook) => {
        // Explicitly pick fields to match IWorkbooks
        const cleanWorkbook: IWorkbooks = {
          _id: workbook._id,
          title: workbook.title,
          description: workbook.description,
          content: workbook.content,
          link: workbook.link,
          questions: workbook.questions,
          assignedTo: workbook.assignedTo,
          status: workbook.status,
          userResponse: workbook.userResponse,
          adminFeedback: workbook.adminFeedback,
          createdAt: workbook.createdAt,
          updatedAt: workbook.updatedAt,
          shareableLink: workbook.shareableLink,
          templateId: workbook.templateId,
          isTemplate: workbook.isTemplate,
        };

        try {
          if (workbook.assignedTo) {
            const user = await User.findById(workbook.assignedTo)
              .select("name email")
              .lean<{ name: string; email: string } | null>();
            if (user) {
              return {
                ...cleanWorkbook,
                userName: user.name || "Unknown",
                userEmail: user.email || "",
              };
            }
          }
          return {
            ...cleanWorkbook,
            userName: "Unassigned",
            userEmail: "",
          };
        } catch (err) {
          console.error(
            `Error fetching user for workbook ${workbook._id}:`,
            err
          );
          return {
            ...cleanWorkbook,
            userName: "Error",
            userEmail: "",
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      data: { workbooks: workbooksWithUserInfo },
    });
  } catch (error) {
    console.error("Error fetching workbooks:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch workbooks",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
