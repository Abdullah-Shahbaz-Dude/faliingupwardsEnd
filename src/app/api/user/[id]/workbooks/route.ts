import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import Workbook from "@/models/Workbook";
import mongoose from "mongoose";
import { logger } from "@/lib/logger";
import { Resend } from "resend";
import { render } from "@react-email/render";
import WorkbookSubmission from "@/emails/WorkbookSubmission";

// GET: Get workbooks for a specific user (public endpoint for user dashboard)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    // Validate user ID - check for null, undefined, empty string, or "null" string
    if (
      !userId ||
      userId === "null" ||
      userId === "undefined" ||
      userId.trim() === ""
    ) {
      logger.warn('Invalid user ID received', {
        endpoint: '/api/user/[id]/workbooks',
        method: 'GET',
        userId: userId || 'undefined',
        ip: 'masked'
      });
      return NextResponse.json(
        { success: false, message: "Invalid user ID provided" },
        { status: 400 }
      );
    }

    // Validate ObjectId format (24 character hex string)
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      logger.warn('Invalid ObjectId format for user ID', {
        endpoint: '/api/user/[id]/workbooks',
        method: 'GET',
        userId: userId ? `${userId.substring(0, 8)}...` : 'undefined',
        ip: 'masked'
      });
      return NextResponse.json(
        { success: false, message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    await connectMongo();

    // Fetch the user to get their assigned workbooks
    const user = (await User.findById(userId).lean()) as any;
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // If user has no workbooks assigned, return empty array
    if (!user.workbooks || user.workbooks.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isCompleted: user.isCompleted || false,
            dashboardExpired: user.dashboardExpired || false,
          },
          workbooks: [],
        },
      });
    }

    // Fetch the actual workbooks assigned to this user with ownership validation
    const workbooks = await Workbook.find({
      _id: { $in: user.workbooks },
      assignedTo: userId // Verify ownership
    }).lean();

    // Return user info and their workbooks
    return NextResponse.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isCompleted: user.isCompleted || false,
          dashboardExpired: user.dashboardExpired || false,
        },
        workbooks: workbooks,
      },
    });
  } catch (error) {
    logger.error('Failed to fetch user workbooks', {
      endpoint: '/api/user/[id]/workbooks',
      method: 'GET',
      userId: 'masked'
    }, error instanceof Error ? error : new Error('Unknown error'));
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user workbooks"
      },
      { status: 500 }
    );
  }
}

// PUT: Submit all workbooks for a user and mark as completed
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const { workbooks: updatedWorkbooks } = await request.json();

    // Validate user ID format
    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    await connectMongo();

    // Verify user exists and hasn't already completed
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has already completed or link has expired (timezone-safe)
    const isLinkExpired = user.linkExpiresAt && 
      new Date().getTime() > new Date(user.linkExpiresAt).getTime();
    
    // Get user's workbooks to check if any are still active
    const userWorkbooks = await Workbook.find({ assignedTo: userId });
    const hasActiveWorkbooks = userWorkbooks.some(
      (wb: any) => wb.status !== "submitted" && wb.status !== "reviewed"
    );
    
    // Only block if user is expired AND has no active workbooks
    if ((user.isCompleted || user.dashboardExpired || isLinkExpired) && !hasActiveWorkbooks) {
      const reason = isLinkExpired 
        ? "User link has expired" 
        : "User has already completed their workbooks";
      
      return NextResponse.json(
        { success: false, message: reason },
        { status: 400 }
      );
    }

    // Start MongoDB transaction for atomic operation
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Validate all workbooks belong to user and are in valid state for submission
        const workbookIds = updatedWorkbooks.map((wb: any) => wb._id);
        const userWorkbooks = await Workbook.find({
          _id: { $in: workbookIds },
          assignedTo: userId,
          status: { $in: ['assigned', 'in_progress', 'completed'] } // Only allow non-submitted workbooks
        }).session(session);

        if (userWorkbooks.length !== updatedWorkbooks.length) {
          const foundIds = userWorkbooks.map(wb => wb._id.toString());
          const missingIds = workbookIds.filter((id: string) => !foundIds.includes(id));
          throw new Error(`Invalid workbooks found: ${missingIds.join(', ')}. They may not belong to this user or are already submitted.`);
        }

        // Validate workbook completion status (all questions must be answered)
        const incompleteWorkbooks = [];
        for (const workbook of updatedWorkbooks) {
          if (!workbook.questions || workbook.questions.length === 0) {
            incompleteWorkbooks.push(workbook._id);
            continue;
          }
          
          const unansweredQuestions = workbook.questions.filter(
            (q: any) => !q.answer || q.answer.trim() === ''
          );
          
          if (unansweredQuestions.length > 0) {
            incompleteWorkbooks.push(workbook._id);
          }
        }

        if (incompleteWorkbooks.length > 0) {
          throw new Error(`Cannot submit incomplete workbooks: ${incompleteWorkbooks.join(', ')}. All questions must be answered.`);
        }

        // Update all workbooks atomically
        const bulkOps = updatedWorkbooks.map((workbook: any) => ({
          updateOne: {
            filter: { 
              _id: workbook._id, 
              assignedTo: userId,
              status: { $in: ['assigned', 'in_progress', 'completed'] }
            },
            update: {
              $set: {
                status: 'submitted',
                questions: workbook.questions,
                updatedAt: new Date()
              }
            }
          }
        }));

        const bulkResult = await Workbook.bulkWrite(bulkOps, { session });
        
        if (bulkResult.modifiedCount !== updatedWorkbooks.length) {
          throw new Error(`Failed to update all workbooks. Expected: ${updatedWorkbooks.length}, Updated: ${bulkResult.modifiedCount}`);
        }

        // Mark user as completed and expire dashboard atomically
        const completedUser = await User.findByIdAndUpdate(
          userId,
          {
            $set: {
              isCompleted: true,
              completedAt: new Date(),
              dashboardExpired: true,
              updatedAt: new Date()
            }
          },
          { new: true, session }
        );

        if (!completedUser) {
          throw new Error('Failed to mark user as completed');
        }

        return { completedUser, workbookCount: bulkResult.modifiedCount };
      });

      // Get updated workbooks after transaction
      const finalWorkbooks = await Workbook.find({
        _id: { $in: updatedWorkbooks.map((wb: any) => wb._id) },
        assignedTo: userId
      });

      const finalUser = await User.findById(userId);

      // Send email notification to admin for each submitted workbook
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const recipientEmail = process.env.EMAIL_RECIPIENT || "fahadamjad778@gmail.com";

        // Send one comprehensive email with all submitted workbooks
        const totalQuestions = finalWorkbooks.reduce((total, wb) => total + (wb.questions?.length || 0), 0);
        const totalAnswered = finalWorkbooks.reduce((total, wb) => {
          return total + (wb.questions?.filter((q: any) => q.answer && q.answer.trim() !== "").length || 0);
        }, 0);

        // Combine all questions from all workbooks
        const allQuestions = finalWorkbooks.flatMap((wb, workbookIndex) => 
          (wb.questions || []).map((q: any, questionIndex: number) => ({
            question: `[${wb.title}] ${q.question}`,
            answer: q.answer || "No answer provided"
          }))
        );

        const submissionDate = new Date().toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        const emailHtml = await render(
          WorkbookSubmission({
            userName: finalUser?.name || "Unknown User",
            userEmail: finalUser?.email || "No email provided",
            workbookTitle: `${finalWorkbooks.length} Workbook${finalWorkbooks.length > 1 ? 's' : ''} Submitted`,
            workbookDescription: `User has completed and submitted ${finalWorkbooks.length} workbook(s): ${finalWorkbooks.map(wb => wb.title).join(', ')}`,
            questionsAnswered: totalAnswered,
            totalQuestions: totalQuestions,
            submissionDate,
            questions: allQuestions,
          })
        );

        await resend.emails.send({
          from: process.env.EMAIL_FROM || `${process.env.ADMIN_NAME || "Fahad"} <onboarding@resend.dev>`,
          to: [recipientEmail],
          subject: `🎉 All Workbooks Submitted: ${finalUser?.name} - ${finalWorkbooks.length} workbook${finalWorkbooks.length > 1 ? 's' : ''}`,
          html: emailHtml,
        });

        console.log(`✅ Bulk submission email sent to ${recipientEmail} for user: ${finalUser?.name} (${finalWorkbooks.length} workbooks)`);
      } catch (emailError) {
        console.error("Error sending bulk submission email:", emailError);
        // Don't fail the submission if email fails
      }

      return NextResponse.json({
        success: true,
        message: "All workbooks submitted successfully",
        data: {
          user: finalUser,
          workbooks: finalWorkbooks
        }
      });

    } catch (transactionError) {
      console.error('Transaction failed:', transactionError);
      
      return NextResponse.json({
        success: false,
        message: transactionError instanceof Error ? transactionError.message : 'Transaction failed during workbook submission'
      }, { status: 400 });
    } finally {
      // Ensure session is always cleaned up
      if (session) {
        await session.endSession();
      }
    }

  } catch (error) {
    logger.error('Failed to submit workbooks', {
      endpoint: '/api/user/[id]/workbooks',
      method: 'PUT',
      userId: 'masked'
    }, error instanceof Error ? error : new Error('Unknown error'));
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit workbooks"
      },
      { status: 500 }
    );
  }
}
