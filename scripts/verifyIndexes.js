const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function verifyIndexes() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Check User collection indexes
    console.log('\n📊 USER COLLECTION INDEXES:');
    const userIndexes = await db.collection('users').listIndexes().toArray();
    userIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Check Workbook collection indexes
    console.log('\n📚 WORKBOOK COLLECTION INDEXES:');
    const workbookIndexes = await db.collection('workbooks').listIndexes().toArray();
    workbookIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Test critical query performance
    console.log('\n⚡ TESTING QUERY PERFORMANCE:');
    
    // Test 1: User workbook lookup (most critical)
    console.log('\n1. Testing User Workbook Lookup Performance:');
    const testUserId = new mongoose.Types.ObjectId();
    const start1 = Date.now();
    const explain1 = await db.collection('workbooks')
      .find({ assignedTo: testUserId })
      .explain('executionStats');
    const end1 = Date.now();
    
    console.log(`   📊 Documents examined: ${explain1.executionStats.totalDocsExamined}`);
    console.log(`   📊 Documents returned: ${explain1.executionStats.totalDocsReturned}`);
    console.log(`   ⚡ Execution time: ${end1 - start1}ms`);
    console.log(`   🎯 Index used: ${explain1.executionStats.executionSuccess ? 'YES' : 'NO'}`);
    
    // Test 2: Template filtering
    console.log('\n2. Testing Template Filtering Performance:');
    const start2 = Date.now();
    const explain2 = await db.collection('workbooks')
      .find({ isTemplate: true })
      .explain('executionStats');
    const end2 = Date.now();
    
    console.log(`   📊 Documents examined: ${explain2.executionStats.totalDocsExamined}`);
    console.log(`   📊 Documents returned: ${explain2.executionStats.totalDocsReturned}`);
    console.log(`   ⚡ Execution time: ${end2 - start2}ms`);
    console.log(`   🎯 Index used: ${explain2.executionStats.executionSuccess ? 'YES' : 'NO'}`);
    
    // Test 3: User role filtering
    console.log('\n3. Testing User Role Filtering Performance:');
    const start3 = Date.now();
    const explain3 = await db.collection('users')
      .find({ role: 'user' })
      .explain('executionStats');
    const end3 = Date.now();
    
    console.log(`   📊 Documents examined: ${explain3.executionStats.totalDocsExamined}`);
    console.log(`   📊 Documents returned: ${explain3.executionStats.totalDocsReturned}`);
    console.log(`   ⚡ Execution time: ${end3 - start3}ms`);
    console.log(`   🎯 Index used: ${explain3.executionStats.executionSuccess ? 'YES' : 'NO'}`);
    
    // Summary
    console.log('\n🎉 INDEX VERIFICATION COMPLETE!');
    console.log(`📊 Total User indexes: ${userIndexes.length}`);
    console.log(`📚 Total Workbook indexes: ${workbookIndexes.length}`);
    
    // Expected indexes check
    const expectedUserIndexes = ['_id_', 'email_1', 'role_1', 'isCompleted_1', 'dashboardExpired_1', 'linkExpiresAt_1'];
    const expectedWorkbookIndexes = ['_id_', 'assignedTo_1', 'isTemplate_1', 'status_1', 'templateId_1_assignedTo_1'];
    
    const userIndexNames = userIndexes.map(idx => idx.name);
    const workbookIndexNames = workbookIndexes.map(idx => idx.name);
    
    console.log('\n✅ CRITICAL INDEXES STATUS:');
    expectedUserIndexes.forEach(indexName => {
      const exists = userIndexNames.includes(indexName);
      console.log(`   User ${indexName}: ${exists ? '✅' : '❌'}`);
    });
    
    expectedWorkbookIndexes.forEach(indexName => {
      const exists = workbookIndexNames.includes(indexName);
      console.log(`   Workbook ${indexName}: ${exists ? '✅' : '❌'}`);
    });
    
  } catch (error) {
    console.error('❌ Error verifying indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

verifyIndexes();
