const mongoose = require('mongoose');

// 🔒 SECURITY: Use environment variable instead of hardcoded credentials
const MONGODB_URI = process.env.MONGODB_URI || (() => {
  console.error('❌ MONGODB_URI environment variable is required');
  process.exit(1);
})();

// Define Workbook schema
const workbookSchema = new mongoose.Schema({
  title: String,
  description: String,
  questions: Array,
  assignedTo: mongoose.Schema.Types.ObjectId,
  status: String,
  isTemplate: Boolean,
  templateId: mongoose.Schema.Types.ObjectId,
  shareableLink: String,
  userResponses: Array,
  adminFeedback: String,
  submittedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Workbook = mongoose.model('Workbook', workbookSchema);

async function cleanupOrphanedWorkbooks() {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get initial counts
    const totalWorkbooks = await Workbook.countDocuments({});
    const templateCount = await Workbook.countDocuments({ isTemplate: true });
    
    console.log(`📊 Before cleanup: ${totalWorkbooks} total workbooks, ${templateCount} templates`);

    // Find orphaned workbooks (user copies without proper assignment)
    const orphanedWorkbooks = await Workbook.find({
      $and: [
        { isTemplate: { $ne: true } }, // Not a template
        { 
          $or: [
            { assignedTo: { $exists: false } }, // No assignedTo field
            { assignedTo: null }, // Null assignedTo
            { templateId: { $exists: false } }, // No templateId field
            { templateId: null } // Null templateId
          ]
        }
      ]
    });

    console.log(`🗑️ Found ${orphanedWorkbooks.length} orphaned workbooks to delete`);

    if (orphanedWorkbooks.length > 0) {
      console.log('Examples of orphaned workbooks:');
      orphanedWorkbooks.slice(0, 3).forEach(wb => {
        console.log(`  - ${wb.title} (assignedTo: ${wb.assignedTo}, templateId: ${wb.templateId})`);
      });

      // Delete orphaned workbooks
      const deleteResult = await Workbook.deleteMany({
        _id: { $in: orphanedWorkbooks.map(wb => wb._id) }
      });

      console.log(`✅ Deleted ${deleteResult.deletedCount} orphaned workbooks`);

      // Get final counts
      const finalTotal = await Workbook.countDocuments({});
      const finalTemplates = await Workbook.countDocuments({ isTemplate: true });

      console.log(`📊 After cleanup: ${finalTotal} total workbooks, ${finalTemplates} templates`);

      if (finalTemplates !== 28) {
        console.log(`⚠️ Warning: Expected 28 templates, found ${finalTemplates}`);
      } else {
        console.log('✅ Template count is correct (28)');
      }
    } else {
      console.log('✅ No orphaned workbooks found to clean up');
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the cleanup
cleanupOrphanedWorkbooks();
