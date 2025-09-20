import { Resend } from 'resend';

// Read API key from command line
const apiKey = process.argv[2];
if (!apiKey) {
  console.error('Please provide the Resend API key as an argument');
  console.error('Usage: node resend-test.mjs YOUR_API_KEY');
  process.exit(1);
}

// Read recipient email from command line
const recipient = process.argv[3] || 'fahadamjad778@gmail.com';

// Initialize Resend with API key
const resend = new Resend(apiKey);

async function main() {
  console.log('Testing Resend email API...');
  console.log(`Using API key starting with: ${apiKey.substring(0, 5)}...`);
  console.log(`Sending to: ${recipient}`);
  
  try {
    // Send a test email
    const { data, error } = await resend.emails.send({
      from: 'Falling Upward <onboarding@resend.dev>',
      to: [recipient],
      subject: 'Resend API Test',
      html: '<p>This is a test email to verify that Resend API is working properly.</p>',
    });
    
    if (error) {
      console.error('❌ Error sending email:', error);
      return;
    }
    
    console.log('✅ Email sent successfully!');
    console.log('Email ID:', data.id);
  } catch (error) {
    console.error('❌ Exception during API call:', error);
  }
}

main(); 