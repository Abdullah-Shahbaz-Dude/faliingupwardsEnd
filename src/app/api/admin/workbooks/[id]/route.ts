import { NextRequest, NextResponse } from "next/server";
import Workbook, { IWorkbooks } from "@/models/Workbook"; // Import IWorkbooks
import { Resend } from "resend";
import { render } from "@react-email/render";
import WorkbookSubmission from "@/emails/WorkbookSubmission";
import { verifyAdminAccess } from "@/lib/nextauth-helpers";
import connectMongo from "@/lib/mongoose";

// GET: Get specific workbook
export async function GET(
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
    const workbook = await Workbook.findById(id).lean<IWorkbooks>(); // Explicitly type as IWorkbooks
    if (!workbook) {
      return NextResponse.json(
        { success: false, message: "Workbook not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { workbook },
    });
  } catch (error) {
    console.error("Error fetching workbook:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch workbook",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

// PUT: Update workbook
export async function PUT(
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

    const body = await request.json();
    await connectMongo();

    const { id } = await params;

    // Get the current workbook to check status change
    const currentWorkbook = await Workbook.findById(id)
      .populate("assignedTo")
      .lean<IWorkbooks>(); // Explicitly type as IWorkbooks
    if (!currentWorkbook) {
      return NextResponse.json(
        { success: false, message: "Workbook not found" },
        { status: 404 }
      );
    }

    const workbook = await Workbook.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate("assignedTo")
      .lean<IWorkbooks>(); // Explicitly type as IWorkbooks

    if (!workbook) {
      return NextResponse.json(
        { success: false, message: "Workbook not found" },
        { status: 404 }
      );
    }

    // Check if status changed to "submitted" and send email notification
    if (body.status === "submitted" && currentWorkbook.status !== "submitted") {
      try {
        await sendWorkbookSubmissionEmail(workbook);
      } catch (emailError) {
        console.error("Error sending workbook submission email:", emailError);
        // Don't fail the whole request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Workbook updated successfully",
      data: { workbook },
    });
  } catch (error) {
    console.error("Error updating workbook:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update workbook",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete workbook
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
    const workbook = await Workbook.findByIdAndDelete(id).lean<IWorkbooks>(); // Explicitly type as IWorkbooks
    if (!workbook) {
      return NextResponse.json(
        { success: false, message: "Workbook not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Workbook deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting workbook:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete workbook",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

// Email notification function
async function sendWorkbookSubmissionEmail(workbook: IWorkbooks) {
  // Type as IWorkbooks
  // Initialize Resend with API key
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY not configured");
  }

  const resend = new Resend(resendApiKey);

  // Get user information
  const user = workbook.assignedTo as any; // You may need to type this properly based on your User model
  if (!user) {
    throw new Error("No user assigned to workbook");
  }

  // Calculate answered questions
  const questionsAnswered =
    workbook.questions?.filter((q) => q.answer && q.answer.trim() !== "")
      .length || 0;
  const totalQuestions = workbook.questions?.length || 0;

  // Format submission date
  const submissionDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Render the email template to HTML string

  let emailHtml: string;

  try {
    emailHtml = await render(
      WorkbookSubmission({
        userName: user.name || "Unknown User",
        userEmail: user.email || "No email provided",
        workbookTitle: workbook.title,
        workbookDescription: workbook.description,
        questionsAnswered,
        totalQuestions,
        submissionDate,
        questions: workbook.questions || [],
      })
    );


    if (typeof emailHtml !== "string") {
      throw new Error("Render function did not return a string");
    }
  } catch (renderError) {
    throw new Error("React Email render failed", { cause: renderError });
  }

  // Determine recipient email (admin email from environment or fallback)
  const recipientEmail = process.env.EMAIL_RECIPIENT || process.env.ADMIN_EMAIL;
  if (!recipientEmail) {
    throw new Error("No admin email configured for notifications");
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || `${process.env.ADMIN_NAME || "Fahad"} <onboarding@resend.dev>`,
      to: [recipientEmail],
      subject: `New Workbook Submission: ${workbook.title}`,
      html: emailHtml,
    });

    if (error) {
      throw new Error("Failed to send workbook submission email", { cause: error });
    }
  } catch (emailError: any) {
    throw new Error("Exception during workbook submission email sending", { cause: emailError });
  }
}
