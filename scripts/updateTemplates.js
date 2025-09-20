const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/falling-upward';

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
    enum: ["assigned", "in_progress", "completed", "submitted", "reviewed"],
    default: "assigned",
  },
  userResponse: { type: String, default: "" },
  adminFeedback: { type: String, default: "" },
  shareableLink: { type: String, default: "" },
  isTemplate: { type: Boolean, default: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Workbook", default: null },
}, { timestamps: true });

const Workbook = mongoose.model('Workbook', workbookSchema);

async function updateTemplates() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Choose your source:
    // Option 1: Load from JSON file
    const jsonPath = path.join(__dirname, 'workbooks-template.json');
    if (fs.existsSync(jsonPath)) {
      console.log('📖 Loading templates from workbooks-template.json...');
      const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      var templatesData = jsonData.workbooks;
    } else {
      console.log('❌ workbooks-template.json not found. Please create it or add templates below.');
      process.exit(1);
    }

    console.log(`📚 Processing ${templatesData.length} template workbooks...`);

    // Get current template count
    const existingTemplates = await Workbook.find({ isTemplate: true });
    console.log(`📊 Current template count: ${existingTemplates.length}`);

    // Clear existing templates ONLY
    console.log('🗑️  Clearing existing template workbooks...');
    const deleteResult = await Workbook.deleteMany({ isTemplate: true });
    console.log(`✅ Cleared ${deleteResult.deletedCount} template workbooks`);

    // Add new templates
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < templatesData.length; i++) {
      const templateData = templatesData[i];
      
      try {
        const newTemplate = new Workbook({
          title: templateData.title,
          description: templateData.description,
          content: templateData.content || "",
          questions: templateData.questions || [],
          status: "assigned",
          isTemplate: true, // Mark as template
          assignedTo: null, // Templates are not assigned to anyone
          userResponse: "",
          adminFeedback: "",
          shareableLink: "",
        });

        await newTemplate.save();
        successCount++;
        console.log(`✅ ${i + 1}/${templatesData.length}: Added "${templateData.title}"`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error adding "${templateData.title}":`, error.message);
      }
    }

    // Final count check
    const finalTemplates = await Workbook.find({ isTemplate: true });
    const userWorkbooks = await Workbook.find({ isTemplate: false });
    const totalWorkbooks = await Workbook.countDocuments();

    console.log('\n🎉 Template update completed!');
    console.log(`✅ Successfully added: ${successCount} templates`);
    console.log(`❌ Errors: ${errorCount} templates`);
    console.log(`📊 Final counts:`);
    console.log(`   📝 Template workbooks: ${finalTemplates.length}`);
    console.log(`   👤 User workbooks: ${userWorkbooks.length}`);
    console.log(`   📚 Total workbooks: ${totalWorkbooks}`);

  } catch (error) {
    console.error('💥 Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

console.log('🚀 Starting template update...');
console.log('⚠️  This will update ONLY template workbooks (preserves user progress)');
console.log('📝 Loading from: scripts/workbooks-template.json');
console.log('');

updateTemplates();
