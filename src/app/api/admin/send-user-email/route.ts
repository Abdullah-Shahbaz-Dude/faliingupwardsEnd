import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
// UPDATED: Use NextAuth helper instead of commented-out custom auth
// import { verifyAdminAccess } from "@/lib/auth";
import { verifyAdminAccess } from "@/lib/nextauth-helpers";
import UserDashboardAccess from "@/emails/UserDashboardAccess";

const resend = new Resend(
  process.env.RESEND_API_KEY || "dummy_key_for_development"
);

export async function POST(request: NextRequest) {
  try {
    // Verify admin access using NextAuth
    const auth = await verifyAdminAccess();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }

    const { userName, userEmail, dashboardLink, workbookTitles, adminName } =
      await request.json();

    // Validate required fields
    if (!userName || !userEmail || !dashboardLink || !workbookTitles) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: userName, userEmail, dashboardLink, workbookTitles",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Render email template
    const emailHtml = await render(
      UserDashboardAccess({
        userName,
        userEmail,
        dashboardLink,
        workbookTitles,
        adminName: adminName || process.env.ADMIN_NAME || "Alex",
      })
    );

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Falling Upward <onboarding@resend.dev>",
      to: [userEmail], // Send to actual user email
      subject: `Your Falling Upward Dashboard is Ready - ${workbookTitles.length} Workbook${workbookTitles.length !== 1 ? "s" : ""} Assigned`,
      html: emailHtml,
    });

    if (emailResult.error) {
      console.error("Email sending error:", emailResult.error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send email",
          error: emailResult.error,
        },
        { status: 500 }
      );
    }

    // Email sent successfully
    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      data: {
        emailId: emailResult.data?.id,
        recipient: userEmail,
        workbookCount: workbookTitles.length,
      },
    });
  } catch (error) {
    console.error("Error sending user dashboard email:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
