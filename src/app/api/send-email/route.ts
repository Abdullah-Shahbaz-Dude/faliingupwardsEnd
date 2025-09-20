import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import BookingConfirmation from '@/emails/BookingConfirmation';
import { formatValue } from '@/utils/formatting';

// Initialize Resend with API key, with fallback for development
const resendApiKey = process.env.RESEND_API_KEY || 'dummy_key_for_development';
const resend = new Resend(resendApiKey);

// Define a type for booking form data
type BookingFormData = {
  name: string;
  email: string;
  phone: string;
  formType?: string;
  consultationTypeLabel?: string;
  message?: string;
  [key: string]: any; // Allow for additional properties
};

// Handle OPTIONS requests (preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: Request) {
  try {
    // Check if the request has a JSON Content-Type
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Parse the JSON data safely
    let formData: BookingFormData;
    try {
      formData = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON format in request body' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Log the form data (for development purposes)
    console.log('Form submission received:', formData);
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, email, and phone are required' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Extract form type
    const formType = formData.formType || 'consultation';
    const consultationTypeLabel = formData.consultationTypeLabel || 'Consultation';
    
    // Filter out standard fields to identify additional fields
    const standardFields = ['name', 'email', 'phone', 'formType', 'consultationTypeLabel', 'message', '__displayFormat'];
    const additionalFields = Object.fromEntries(
      Object.entries(formData)
        .filter(([key]) => !standardFields.includes(key))
        .map(([key, value]) => {
          // Format boolean values to display as "Yes" or "No"
          if (typeof value === 'boolean') {
            return [key, formatValue(value)];
          }
          return [key, value];
        })
    );
    
    // Create the email content with the email component
    const emailContent = BookingConfirmation({
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      consultationType: consultationTypeLabel,
      additionalFields: additionalFields,
      message: formData.message || undefined, // Pass the custom message if provided
    });
    
    // Convert the React component to HTML string (with await since render returns a Promise)
    const emailHtml = await render(emailContent);
    
    // Get recipient email from environment variable (with fallback)
    const recipientEmail = process.env.EMAIL_RECIPIENT || formData.email;
    
    try {
      // Send email via Resend
      console.log(`Sending email to: ${recipientEmail}`);
      const { data, error } = await resend.emails.send({
        from: 'Falling Upward <onboarding@resend.dev>', // Using Resend's default domain
        to: [recipientEmail],
        subject: `New Booking Request: ${consultationTypeLabel}`,
        html: emailHtml,
        // Add reply-to so recipients can reply directly to the customer
        replyTo: formData.email,
      });
      
      if (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
          { success: false, error: error.message || 'Failed to send email' },
          { status: 500 }
        );
      }
      
      console.log('Email sent successfully:', data);
    } catch (emailError: any) {
      console.error('Exception during email sending:', emailError);
      return NextResponse.json(
        { success: false, error: emailError.message || 'Error sending email' },
        { status: 500 }
      );
    }
    
    // Return a success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Form submitted successfully. Email notification has been sent.',
        data: {
          name: formData.name,
          email: formData.email,
          type: consultationTypeLabel
        }
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error: any) {
    console.error('Error in form submission:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error processing form submission' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 