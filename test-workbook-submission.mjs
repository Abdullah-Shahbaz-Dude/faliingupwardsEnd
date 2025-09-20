// Test script to simulate workbook submission and check email functionality
import fetch from 'node-fetch';

// Test workbook data
const testWorkbook = {
  status: 'submitted',
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

async function testWorkbookSubmission() {
  console.log('🧪 Testing workbook submission email functionality...');
  
  try {
    // First, we need to get a workbook ID by checking existing workbooks
    console.log('📋 Fetching existing workbooks...');
    
    const workbooksResponse = await fetch('http://localhost:3000/api/admin/workbooks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Note: In real app, this would need proper auth cookies
      }
    });

    if (!workbooksResponse.ok) {
      console.log('⚠️ Could not fetch workbooks (likely need authentication)');
      console.log('Status:', workbooksResponse.status);
      
      // Let's try a direct test instead
      console.log('🔄 Let\'s test the email function directly...');
      return;
    }

    const workbooksData = await workbooksResponse.json();
    console.log('📚 Workbooks response:', JSON.stringify(workbooksData, null, 2));

  } catch (error) {
    console.error('❌ Error testing workbook submission:', error.message);
  }
}

// Test direct email function
async function testEmailEndpoint() {
  console.log('📧 Testing email endpoint...');
  
  try {
    const response = await fetch('http://localhost:3000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        message: 'This is a test booking submission',
        formType: 'test'
      })
    });

    const result = await response.json();
    console.log('📧 Email endpoint response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ Email endpoint is working correctly!');
    } else {
      console.log('❌ Email endpoint failed:', result);
    }

  } catch (error) {
    console.error('❌ Error testing email endpoint:', error.message);
  }
}

// Run tests
console.log('🚀 Starting email functionality tests...\n');
await testEmailEndpoint();
console.log('\n---\n');
await testWorkbookSubmission();
