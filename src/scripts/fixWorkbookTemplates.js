// Run this script to fix your existing workbooks and ensure they show up in dashboard
// node src/scripts/fixWorkbookTemplates.js

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const workbookSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  questions: Array,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: String,
  userResponse: String,
  adminFeedback: String,
  shareableLink: String,
  isTemplate: Boolean,
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workbook' },
}, { timestamps: true });

const Workbook = mongoose.model('Workbook', workbookSchema);

async function fixWorkbookTemplates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all workbooks that should be templates (not assigned to anyone and no templateId)
    const templatesToFix = await Workbook.find({
      $and: [
        { assignedTo: null },
        { templateId: { $exists: false } },
        { $or: [{ isTemplate: { $exists: false } }, { isTemplate: false }] }
      ]
    });

    console.log(`Found ${templatesToFix.length} workbooks to mark as templates`);

    if (templatesToFix.length > 0) {
      // Update them to be templates
      const result = await Workbook.updateMany(
        {
          $and: [
            { assignedTo: null },
            { templateId: { $exists: false } },
            { $or: [{ isTemplate: { $exists: false } }, { isTemplate: false }] }
          ]
        },
        { $set: { isTemplate: true } }
      );

      console.log(`✅ Updated ${result.modifiedCount} workbooks to be templates`);
    }

    // Count total templates
    const templateCount = await Workbook.countDocuments({
      $or: [
        { isTemplate: true },
        { isTemplate: { $exists: false }, assignedTo: null, templateId: { $exists: false } }
      ]
    });

    console.log(`📊 Total template workbooks: ${templateCount}`);

    await mongoose.disconnect();
    console.log('✅ Script completed successfully');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixWorkbookTemplates();
