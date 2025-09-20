const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/falling-upward';

// Workbook Schema (updated with template fields)
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
  isTemplate: { type: Boolean, default: true }, // Templates by default
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Workbook", default: null },
}, { timestamps: true });

const Workbook = mongoose.model('Workbook', workbookSchema);

async function importWorkbooksFromJson() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Read JSON file
    const jsonPath = path.join(__dirname, 'workbooks-template.json');
    console.log('📖 Reading workbooks from:', jsonPath);
    
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const workbooks = jsonData.workbooks;

    console.log(`📚 Found ${workbooks.length} workbooks to import`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (let i = 0; i < workbooks.length; i++) {
      const workbookData = workbooks[i];
      
      try {
        // Check if workbook already exists
        const existingWorkbook = await Workbook.findOne({ title: workbookData.title });
        
        if (existingWorkbook) {
          console.log(`⚠️  Workbook "${workbookData.title}" already exists - skipping`);
          skipCount++;
          continue;
        }

        // Create new template workbook
        const newWorkbook = new Workbook({
          title: workbookData.title,
          description: workbookData.description || workbookData.Psychoeducation || "",
          content: workbookData.content || "",
          questions: workbookData.questions || [],
          status: "assigned",
          isTemplate: true, // Mark as template
          assignedTo: null, // Templates are not assigned
          userResponse: "",
          adminFeedback: "",
          shareableLink: "",
        });

        await newWorkbook.save();
        successCount++;
        console.log(`✅ ${i + 1}/${workbooks.length}: Added "${workbookData.title}"`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error adding "${workbookData.title}":`, error.message);
      }
    }

    console.log('\n🎉 Import completed!');
    console.log(`✅ Successfully added: ${successCount} workbooks`);
    console.log(`⚠️  Skipped (already exist): ${skipCount} workbooks`);
    console.log(`❌ Errors: ${errorCount} workbooks`);
    console.log(`📊 Total processed: ${workbooks.length} workbooks`);

  } catch (error) {
    console.error('💥 Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the import
importWorkbooksFromJson();
