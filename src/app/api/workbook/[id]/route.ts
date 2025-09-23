import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import Workbook from "@/models/Workbook";
import { IWorkbooks } from "@/models/Workbook";
import { Resend } from "resend";
import { render } from "@react-email/render";
import WorkbookSubmission from "@/emails/WorkbookSubmission";

// GET: Get specific workbook for user access (with ownership validation)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workbookId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user");

    // Validate workbook ID format
    if (!workbookId || !/^[0-9a-fA-F]{24}$/.test(workbookId)) {
      return NextResponse.json(
        { success: false, message: "Invalid workbook ID format" },
        { status: 400 }
      );
    }

    await connectMongo();

    // If userId is provided, validate user access
    if (userId) {
      // Validate user ID format
      if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
        return NextResponse.json(
          { success: false, message: "Invalid user ID format" },
          { status: 400 }
        );
      }

      // Verify user exists
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      // Check if user has already completed or link has expired
      const isLinkExpired = user.linkExpiresAt && 
        new Date().getTime() > new Date(user.linkExpiresAt).getTime();
      
      // First check if the specific workbook exists and is assigned to user
      const workbook = await Workbook.findOne({
        _id: workbookId,
        assignedTo: userId
      }).lean() as IWorkbooks | null;

      if (!workbook) {
        return NextResponse.json(
          { success: false, message: "Workbook not found or not assigned to user" },
          { status: 404 }
        );
      }

      // Check if this specific workbook is still active (not submitted/reviewed)
      const isWorkbookActive = workbook.status !== "submitted" && workbook.status !== "reviewed";
      
      // Only block access if user is expired AND this workbook is not active
      if ((user.isCompleted || user.dashboardExpired || isLinkExpired) && !isWorkbookActive) {
        const reason = isLinkExpired 
          ? "User link has expired" 
          : "User access has expired";
        
        return NextResponse.json(
          { success: false, message: reason },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { workbook }
      });
    } else {
      // No user ID provided - this should not happen for user access
      return NextResponse.json(
        { success: false, message: "User ID required for workbook access" },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Error fetching workbook:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch workbook"
      },
      { status: 500 }
    );
  }
}

// PUT: Update specific workbook for user access
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workbookId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user");
    const updateData = await request.json();

    // Validate workbook ID format
    if (!workbookId || !/^[0-9a-fA-F]{24}$/.test(workbookId)) {
      return NextResponse.json(
        { success: false, message: "Invalid workbook ID format" },
        { status: 400 }
      );
    }

    // Validate user ID
    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    await connectMongo();

    // Verify user exists and hasn't completed
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has already completed or link has expired
    const isLinkExpired = user.linkExpiresAt && new Date() > new Date(user.linkExpiresAt);
    
    // First check if the specific workbook exists and is assigned to user
    const workbook = await Workbook.findOne({
      _id: workbookId,
      assignedTo: userId
    }).lean() as IWorkbooks | null;

    if (!workbook) {
      return NextResponse.json(
        { success: false, message: "Workbook not found or not assigned to user" },
        { status: 404 }
      );
    }

    // Check if this specific workbook is still active (not submitted/reviewed)
    const isWorkbookActive = workbook.status !== "submitted" && workbook.status !== "reviewed";
    
    // Only block access if user is expired AND this workbook is not active
    if ((user.isCompleted || user.dashboardExpired || isLinkExpired) && !isWorkbookActive) {
      const reason = isLinkExpired 
        ? "User link has expired" 
        : "User access has expired";
      
      return NextResponse.json(
        { success: false, message: reason },
        { status: 403 }
      );
    }

    // Update workbook with ownership validation
    const updatedWorkbook = await Workbook.findOneAndUpdate(
      {
        _id: workbookId,
        assignedTo: userId // Verify ownership
      },
      {
        ...updateData,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedWorkbook) {
      return NextResponse.json(
        { success: false, message: "Workbook not found or not assigned to user" },
        { status: 404 }
      );
    }

    // Auto-update status based on progress (only if not manually submitted)
    if (updateData.status !== "submitted" && updatedWorkbook.questions) {
      const answeredQuestions = updatedWorkbook.questions.filter(
        (q: any) => q.answer && q.answer.trim() !== ""
      );
      const progress = (answeredQuestions.length / updatedWorkbook.questions.length) * 100;
      
      let newStatus = updatedWorkbook.status;
      if (progress === 0) {
        newStatus = "assigned"; // Not started
      } else if (progress === 100) {
        newStatus = "completed"; // Ready to submit
      } else {
        newStatus = "in_progress"; // Partially completed
      }

      // Update status if it changed
      if (newStatus !== updatedWorkbook.status) {
        await Workbook.findByIdAndUpdate(workbookId, { status: newStatus });
        updatedWorkbook.status = newStatus;
      }
    }

    // Auto-update status based on progress (only if not manually submitted)
    if (updateData.status !== "submitted" && updatedWorkbook.questions) {
      const answeredQuestions = updatedWorkbook.questions.filter(
        (q: any) => q.answer && q.answer.trim() !== ""
      );
      const progress = (answeredQuestions.length / updatedWorkbook.questions.length) * 100;
      
      let newStatus = updatedWorkbook.status;
      if (progress === 0) {
        newStatus = "assigned"; // Not started
      } else if (progress === 100) {
        newStatus = "completed"; // Ready to submit
      } else {
        newStatus = "in_progress"; // Partially completed
      }

      // Update status if it changed
      if (newStatus !== updatedWorkbook.status) {
        await Workbook.findByIdAndUpdate(workbookId, { status: newStatus });
        updatedWorkbook.status = newStatus;
      }
    }

    // Send email notification to admin when workbook is submitted
    if (updateData.status === "submitted") {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        // Calculate answered questions
        const questionsAnswered = updatedWorkbook.questions?.filter(
          (q: any) => q.answer && q.answer.trim() !== ""
        ).length || 0;
        const totalQuestions = updatedWorkbook.questions?.length || 0;

        // Format submission date
        const submissionDate = new Date().toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        // Render the WorkbookSubmission email template
        const emailHtml = await render(
          WorkbookSubmission({
            userName: user.name || "Unknown User",
            userEmail: user.email || "No email provided",
            workbookTitle: updatedWorkbook.title,
            workbookDescription: updatedWorkbook.description || "No description provided",
            questionsAnswered,
            totalQuestions,
            submissionDate,
            questions: updatedWorkbook.questions || [],
          })
        );

        // Send email to admin
        const recipientEmail = process.env.EMAIL_RECIPIENT;
        
        if (!recipientEmail) {
          console.warn('EMAIL_RECIPIENT not configured - email notification skipped');
          // Continue without failing the workbook submission
        } else {
          try {
            await resend.emails.send({
              from: process.env.EMAIL_FROM || `${process.env.ADMIN_NAME || "Fahad"} <onboarding@resend.dev>`,
              to: [recipientEmail],
              subject: `📋 Workbook Submitted: ${updatedWorkbook.title} - ${user.name}`,
              html: emailHtml,
            });

            // Email sent successfully - logging removed for performance
          } catch (emailError) {
            console.error("Error sending submission email:", emailError);
            // Don't fail the submission if email fails
          }
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Don't fail the submission if email fails
      }
    }

    return NextResponse.json({
      success: true,
      data: { workbook: updatedWorkbook }
    });

  } catch (error) {
    console.error("Error updating workbook:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update workbook"
      },
      { status: 500 }
    );
  }
}
