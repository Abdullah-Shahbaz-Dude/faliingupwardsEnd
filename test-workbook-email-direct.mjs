// Direct test of workbook email functionality
import { Resend } from 'resend';
import { render } from '@react-email/render';

// Note: This is a simplified test - in the real app the WorkbookSubmission component would be imported
// For testing, we'll create a simple HTML template

async function testWorkbookEmailDirect() {
  console.log('🧪 Testing workbook email functionality directly...');
  
  // Test data
  const workbookData = {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    assignedTo: {
      name: "Test User", 
      email: "test@example.com"
    },
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: "I struggle with prioritizing tasks and often get distracted by unimportant activities."
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?", 
        answer: "I usually check my phone first thing which makes me lose track of time. Coffee helps me focus though."
      }
    ]
  };

  // Initialize Resend with API key from environment
  const apiKey = 're_eCV35fFa_DmjCsRnQuXZfy4YidAG5JCPy';
  const recipientEmail = 'fahadamjad778@gmail.com';
  
  const resend = new Resend(apiKey);

  // Calculate answered questions
  const questionsAnswered = workbookData.questions.filter(q => q.answer && q.answer.trim() !== '').length;
  const totalQuestions = workbookData.questions.length;

  // Create simple HTML email template for testing
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Workbook Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0B4073; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .question { margin-bottom: 20px; padding: 15px; background-color: white; border-radius: 5px; }
          .question h4 { color: #0B4073; margin-bottom: 10px; }
          .answer { background-color: #f8f9fa; padding: 10px; border-radius: 3px; }
          .stats { background-color: #e6f7ee; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Workbook Submission Received</h1>
          </div>
          <div class="content">
            <div class="stats">
              <h3>📊 Submission Summary</h3>
              <p><strong>User:</strong> ${workbookData.assignedTo.name} (${workbookData.assignedTo.email})</p>
              <p><strong>Workbook:</strong> ${workbookData.title}</p>
              <p><strong>Questions Answered:</strong> ${questionsAnswered}/${totalQuestions}</p>
              <p><strong>Submission Date:</strong> ${new Date().toLocaleDateString('en-GB', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}</p>
            </div>
            
            <h3>📝 Description</h3>
            <p>${workbookData.description}</p>
            
            <h3>💬 Questions & Answers</h3>
            ${workbookData.questions.map((qa, index) => `
              <div class="question">
                <h4>Q${index + 1}: ${qa.question}</h4>
                <div class="answer">
                  <strong>Answer:</strong> ${qa.answer || '<em>No answer provided</em>'}
                </div>
              </div>
            `).join('')}
            
            <p style="text-align: center; margin-top: 30px;">
              <a href="mailto:${workbookData.assignedTo.email}?subject=RE: ${workbookData.title} Workbook Submission" 
                 style="background-color: #0B4073; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                📧 Respond to User
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    console.log('📤 Sending workbook submission email...');
    console.log(`📧 To: ${recipientEmail}`);
    console.log(`👤 User: ${workbookData.assignedTo.name}`);
    console.log(`📚 Workbook: ${workbookData.title}`);
    console.log(`📊 Questions: ${questionsAnswered}/${totalQuestions} answered`);

    const { data, error } = await resend.emails.send({
      from: 'Falling Upward <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: `Workbook Submission: ${workbookData.title} - ${workbookData.assignedTo.name}`,
      html: emailHtml,
      replyTo: workbookData.assignedTo.email,
    });

    if (error) {
      console.error('❌ Resend API error:', error);
      return;
    }

    console.log('✅ Workbook submission email sent successfully!');
    console.log('📬 Email ID:', data.id);
    console.log('📧 Check your email at:', recipientEmail);
    
  } catch (error) {
    console.error('💥 Exception during email sending:', error);
  }
}

// Run the test
testWorkbookEmailDirect();
