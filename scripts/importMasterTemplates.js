const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import models
const Workbook = require('../src/models/Workbook');

async function importMasterTemplates() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Read the template JSON file
    const templatePath = path.join(__dirname, 'workbooks-template.json');
    const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
    
    console.log(`📚 Found ${templateData.workbooks.length} templates in JSON file`);

    // Check current templates in database
    const existingTemplates = await Workbook.find({ isTemplate: true });
    console.log(`📊 Current templates in database: ${existingTemplates.length}`);

    // Clear existing templates if any (to avoid duplicates)
    if (existingTemplates.length > 0) {
      console.log('🗑️ Removing existing templates to avoid duplicates...');
      await Workbook.deleteMany({ isTemplate: true });
    }

    // Import templates from JSON
    console.log('📥 Importing master templates...');
    let importedCount = 0;

    for (const template of templateData.workbooks) {
      try {
        const newTemplate = new Workbook({
          title: template.title,
          description: template.description,
          content: template.content || '',
          questions: template.questions || [],
          isTemplate: true, // Mark as master template
          status: 'assigned',
          shareableLink: '',
          assignedTo: null,
          templateId: null,
          userResponse: '',
          adminFeedback: ''
        });

        await newTemplate.save();
        importedCount++;
        console.log(`  ✅ Imported: ${template.title}`);
      } catch (error) {
        console.error(`  ❌ Failed to import: ${template.title}`, error.message);
      }
    }

    console.log(`\n🎉 Successfully imported ${importedCount} master templates`);

    // Verify the import
    const finalTemplateCount = await Workbook.countDocuments({ isTemplate: true });
    const totalWorkbooks = await Workbook.countDocuments({});
    const userWorkbooks = await Workbook.countDocuments({ 
      assignedTo: { $exists: true, $ne: null },
      isTemplate: { $ne: true }
    });

    console.log('\n📊 Final Database Status:');
    console.log(`  Master Templates: ${finalTemplateCount}`);
    console.log(`  User Workbook Copies: ${userWorkbooks}`);
    console.log(`  Total Workbooks: ${totalWorkbooks}`);

    if (finalTemplateCount === 28) {
      console.log('✅ Perfect! 28 master templates are now in the database');
    } else {
      console.log(`⚠️  Expected 28 templates, got ${finalTemplateCount}`);
    }

  } catch (error) {
    console.error('❌ Error importing templates:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

importMasterTemplates();
