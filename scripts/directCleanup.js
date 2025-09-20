const { MongoClient } = require('mongodb');
require('dotenv').config();

async function directCleanup() {
  let client;
  
  try {
    // Try different environment variable names
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
    
    if (!uri) {
      console.log('❌ No MongoDB URI found in environment variables');
      console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('MONGO') || key.includes('DATABASE')));
      return;
    }

    console.log('🔗 Connecting to MongoDB...');
    client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const workbooksCollection = db.collection('workbooks');

    // Get initial counts
    const totalCount = await workbooksCollection.countDocuments({});
    const templateCount = await workbooksCollection.countDocuments({ isTemplate: true });
    
    console.log(`📊 Before cleanup: ${totalCount} total workbooks, ${templateCount} templates`);

    // Find orphaned workbooks
    const orphanedWorkbooks = await workbooksCollection.find({
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
    }).toArray();

    console.log(`🗑️ Found ${orphanedWorkbooks.length} orphaned workbooks to delete`);

    if (orphanedWorkbooks.length > 0) {
      // Show some examples
      console.log('Examples of orphaned workbooks:');
      orphanedWorkbooks.slice(0, 3).forEach(wb => {
        console.log(`  - ${wb.title} (assignedTo: ${wb.assignedTo}, templateId: ${wb.templateId})`);
      });

      // Delete orphaned workbooks
      const deleteResult = await workbooksCollection.deleteMany({
        _id: { $in: orphanedWorkbooks.map(wb => wb._id) }
      });

      console.log(`✅ Deleted ${deleteResult.deletedCount} orphaned workbooks`);

      // Get final counts
      const finalTotal = await workbooksCollection.countDocuments({});
      const finalTemplates = await workbooksCollection.countDocuments({ isTemplate: true });

      console.log(`📊 After cleanup: ${finalTotal} total workbooks, ${finalTemplates} templates`);

      if (finalTemplates !== 28) {
        console.log(`⚠️ Warning: Expected 28 templates, found ${finalTemplates}`);
      } else {
        console.log('✅ Template count is correct (28)');
      }
    } else {
      console.log('✅ No orphaned workbooks found');
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}

// Run the cleanup
directCleanup();
