import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
// UPDATED: Use NextAuth helper instead of commented-out custom auth
// import { verifyAdminAccess } from "@/lib/auth";
import { verifyAdminAccess } from "@/lib/nextauth-helpers";
import UserDashboardAccess from "@/emails/UserDashboardAccess";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: process.env.EMAIL_FROM || `${process.env.ADMIN_NAME || "Fahad"} <onboarding@resend.dev>`,
      to: ["fahadamjad778@gmail.com"], // Development: Send to verified email
      subject: `Your Falling Upward Dashboard is Ready - ${workbookTitles.length} Workbook${workbookTitles.length !== 1 ? "s" : ""} Assigned`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0B4073;">Dashboard Access from ${process.env.ADMIN_NAME || "Fahad"}</h1>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>I've assigned ${workbookTitles.length} workbook${workbookTitles.length !== 1 ? 's' : ''} to you. Please access your dashboard using the link below:</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Assigned Workbooks:</h3>
            <ul>
              ${workbookTitles.map((title: string) => `<li>${title}</li>`).join('')}
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardLink}" style="background: #0B4073; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Access Your Dashboard
            </a>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;"><strong>Development Note:</strong> This email was intended for: ${userEmail}</p>
          <p>Best regards,<br><strong>${process.env.ADMIN_NAME || "Fahad"}</strong><br>Falling Upward</p>
        </div>
      `,
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
