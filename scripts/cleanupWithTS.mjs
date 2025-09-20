import connectMongo from '../src/lib/mongoose.js';
import Workbook from '../src/models/Workbook.js';

async function cleanupOrphanedWorkbooks() {
  try {
    // Use your existing MongoDB connection utility
    console.log('🔗 Connecting to MongoDB using your utility...');
    await connectMongo();
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
        console.log(`  - ${wb.title} (ID: ${wb._id}, assignedTo: ${wb.assignedTo}, templateId: ${wb.templateId})`);
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
    console.error('❌ Error during cleanup:', error);
  } finally {
    // Close the connection
    process.exit(0);
  }
}

// Run the cleanup
cleanupOrphanedWorkbooks();
