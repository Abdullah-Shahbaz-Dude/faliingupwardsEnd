const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function createIndexes() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    console.log('\n🚀 Creating Workbook indexes...');
    
    // Create all the critical Workbook indexes
    const workbookIndexes = [
      { assignedTo: 1 },
      { isTemplate: 1 },
      { status: 1 },
      { templateId: 1, assignedTo: 1 },
      { assignedTo: 1, status: 1 },
      { isTemplate: 1, status: 1 },
      { updatedAt: 1 },
      { createdAt: 1 }
    ];

    for (const index of workbookIndexes) {
      try {
        await db.collection('workbooks').createIndex(index);
        console.log(`✅ Created index: ${JSON.stringify(index)}`);
      } catch (error) {
        if (error.code === 85) {
          console.log(`⚠️  Index already exists: ${JSON.stringify(index)}`);
        } else {
          console.log(`❌ Failed to create index ${JSON.stringify(index)}: ${error.message}`);
        }
      }
    }

    console.log('\n🎉 Index creation complete!');
    
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  } finally {
    console.log('🔌 Disconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createIndexes();
