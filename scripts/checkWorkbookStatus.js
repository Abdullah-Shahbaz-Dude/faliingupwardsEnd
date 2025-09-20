const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Workbook = require('../src/models/Workbook');

async function checkWorkbookStatus() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check all workbooks
    const allWorkbooks = await Workbook.find({});
    console.log(`📊 Total workbooks in database: ${allWorkbooks.length}`);

    // Check templates
    const templates = await Workbook.find({ isTemplate: true });
    console.log(`📚 Templates with isTemplate: true: ${templates.length}`);

    // Check workbooks without isTemplate field
    const noTemplateField = await Workbook.find({ isTemplate: { $exists: false } });
    console.log(`❓ Workbooks without isTemplate field: ${noTemplateField.length}`);

    // Check user assigned workbooks
    const userWorkbooks = await Workbook.find({ assignedTo: { $exists: true, $ne: null } });
    console.log(`👥 User assigned workbooks: ${userWorkbooks.length}`);

    // Show sample workbooks
    console.log('\n📋 Sample workbooks:');
    const sampleWorkbooks = await Workbook.find({}).limit(5);
    sampleWorkbooks.forEach((wb, index) => {
      console.log(`  ${index + 1}. ${wb.title}`);
      console.log(`     isTemplate: ${wb.isTemplate}`);
      console.log(`     assignedTo: ${wb.assignedTo}`);
      console.log(`     templateId: ${wb.templateId}`);
      console.log('');
    });

    // Check if we need to import templates
    if (templates.length === 0) {
      console.log('⚠️  No master templates found! Need to import from JSON file.');
    } else if (templates.length !== 28) {
      console.log(`⚠️  Expected 28 templates, found ${templates.length}`);
    } else {
      console.log('✅ Template count is correct (28)');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkWorkbookStatus();
