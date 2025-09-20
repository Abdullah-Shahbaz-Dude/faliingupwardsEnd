const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

// Connection URI - update this to match your MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';

// Workbook Schema (matching your existing structure)
const workbookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, default: "" },
  link: { type: String, default: null },
  questions: [{
    question: { type: String, required: true },
    answer: { type: String, default: "" },
  }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: {
    type: String,
    enum: ["assigned", "in_progress", "submitted", "reviewed"],
    default: "assigned",
  },
  userResponse: { type: String, default: "" },
  adminFeedback: { type: String, default: "" },
  shareableLink: { type: String, default: "" },
}, { timestamps: true });

const Workbook = mongoose.model('Workbook', workbookSchema);

// YOUR 29 WORKBOOKS DATA
// EDIT THIS SECTION - Replace with your actual workbooks
const newWorkbooks = [
  {
    title: "Workbook Title 1",
    description: "Description for workbook 1. This explains what the workbook covers and its purpose.",
    questions: [
      {
        question: "Your first question here?",
        answer: ""
      },
      {
        question: "Your second question here?",
        answer: ""
      },
      {
        question: "Your third question here?",
        answer: ""
      }
    ]
  },
  {
    title: "Workbook Title 2",
    description: "Description for workbook 2. Another explanation of the workbook's purpose.",
    questions: [
      {
        question: "Question 1 for workbook 2?",
        answer: ""
      },
      {
        question: "Question 2 for workbook 2?",
        answer: ""
      }
    ]
  },
  // ADD YOUR REMAINING 27 WORKBOOKS HERE
  // Copy the structure above and paste your workbook data
  
  // TEMPLATE FOR EASY COPYING:
  /*
  {
    title: "Your Workbook Title Here",
    description: "Your workbook description here.",
    questions: [
      {
        question: "Your question 1?",
        answer: ""
      },
      {
        question: "Your question 2?",
        answer: ""
      },
      // Add more questions as needed
    ]
  },
  */
];

async function addBulkWorkbooks() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log(`📚 Adding ${newWorkbooks.length} workbooks...`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < newWorkbooks.length; i++) {
      const workbookData = newWorkbooks[i];
      
      try {
        // Check if workbook with same title already exists
        const existingWorkbook = await Workbook.findOne({ title: workbookData.title });
        
        if (existingWorkbook) {
          console.log(`⚠️  Workbook "${workbookData.title}" already exists - skipping`);
          continue;
        }

        // Create new workbook
        const newWorkbook = new Workbook({
          title: workbookData.title,
          description: workbookData.description,
          content: workbookData.content || "",
          questions: workbookData.questions || [],
          status: "assigned", // Default status for new workbooks
          userResponse: "",
          adminFeedback: "",
          shareableLink: "",
        });

        await newWorkbook.save();
        successCount++;
        console.log(`✅ Added workbook ${i + 1}/${newWorkbooks.length}: "${workbookData.title}"`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error adding workbook "${workbookData.title}":`, error.message);
      }
    }

    console.log('\n🎉 Bulk import completed!');
    console.log(`✅ Successfully added: ${successCount} workbooks`);
    console.log(`❌ Errors: ${errorCount} workbooks`);
    console.log(`📊 Total processed: ${newWorkbooks.length} workbooks`);

  } catch (error) {
    console.error('💥 Database connection error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the import
addBulkWorkbooks();
