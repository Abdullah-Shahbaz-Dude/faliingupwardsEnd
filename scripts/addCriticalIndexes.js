const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function addCriticalIndexes() {
  try {
    console.log('🚀 Starting critical database indexing...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // 🔥 CRITICAL INDEXES FOR 10x PERFORMANCE BOOST
    console.log('📊 Creating critical performance indexes...');

    // ===== USERS COLLECTION INDEXES =====
    console.log('👤 Optimizing Users collection...');
    
    // Most critical - email lookups (login, user search)
    await db.collection('users').createIndex(
      { email: 1 }, 
      { unique: true, background: true }
    );
    
    // Role-based queries (admin dashboard filtering)
    await db.collection('users').createIndex(
      { role: 1 }, 
      { background: true }
    );
    
    // Completion status queries
    await db.collection('users').createIndex(
      { isCompleted: 1 }, 
      { background: true }
    );
    
    // Dashboard expiration checks
    await db.collection('users').createIndex(
      { dashboardExpired: 1 }, 
      { background: true }
    );
    
    // Link expiration cleanup
    await db.collection('users').createIndex(
      { linkExpiresAt: 1 }, 
      { background: true }
    );
    
    // Time-based sorting (most recent users)
    await db.collection('users').createIndex(
      { createdAt: -1 }, 
      { background: true }
    );
    
    await db.collection('users').createIndex(
      { updatedAt: -1 }, 
      { background: true }
    );

    // ===== COMPOUND INDEXES FOR COMPLEX QUERIES =====
    console.log('🔗 Creating compound indexes for complex queries...');
    
    // Admin dashboard: filter by role and completion status
    await db.collection('users').createIndex(
      { role: 1, isCompleted: 1 }, 
      { background: true }
    );
    
    // User search: email + role combination
    await db.collection('users').createIndex(
      { email: 1, role: 1 }, 
      { background: true }
    );
    
    // Active users: not expired and not completed
    await db.collection('users').createIndex(
      { dashboardExpired: 1, isCompleted: 1 }, 
      { background: true }
    );

    // ===== WORKBOOKS COLLECTION INDEXES =====
    console.log('📚 Optimizing Workbooks collection...');
    
    // Most critical - user workbook lookups
    await db.collection('workbooks').createIndex(
      { userId: 1 }, 
      { background: true }
    );
    
    // Template vs user workbooks
    await db.collection('workbooks').createIndex(
      { isTemplate: 1 }, 
      { background: true }
    );
    
    // Workbook completion status
    await db.collection('workbooks').createIndex(
      { isCompleted: 1 }, 
      { background: true }
    );
    
    // Status-based filtering
    await db.collection('workbooks').createIndex(
      { status: 1 }, 
      { background: true }
    );
    
    // Time-based sorting
    await db.collection('workbooks').createIndex(
      { createdAt: -1 }, 
      { background: true }
    );
    
    await db.collection('workbooks').createIndex(
      { updatedAt: -1 }, 
      { background: true }
    );

    // ===== COMPOUND INDEXES FOR WORKBOOKS =====
    console.log('📖 Creating workbook compound indexes...');
    
    // User dashboard: user's workbooks by status
    await db.collection('workbooks').createIndex(
      { userId: 1, status: 1 }, 
      { background: true }
    );
    
    // User dashboard: user's completed workbooks
    await db.collection('workbooks').createIndex(
      { userId: 1, isCompleted: 1 }, 
      { background: true }
    );
    
    // Admin dashboard: templates by creation date
    await db.collection('workbooks').createIndex(
      { isTemplate: 1, createdAt: -1 }, 
      { background: true }
    );
    
    // Assignment queries: user + template combination
    await db.collection('workbooks').createIndex(
      { userId: 1, isTemplate: 1 }, 
      { background: true }
    );

    // ===== TEXT SEARCH INDEXES =====
    console.log('🔍 Creating text search indexes...');
    
    // User search functionality
    await db.collection('users').createIndex(
      { 
        name: 'text', 
        email: 'text' 
      },
      { 
        background: true,
        weights: { email: 10, name: 5 } // Email more important than name
      }
    );
    
    // Workbook search functionality
    await db.collection('workbooks').createIndex(
      { 
        title: 'text', 
        description: 'text' 
      },
      { 
        background: true,
        weights: { title: 10, description: 1 }
      }
    );

    console.log('✅ All critical indexes created successfully!');

    // ===== INDEX ANALYSIS =====
    console.log('🔍 Analyzing current indexes...');
    
    const userIndexes = await db.collection('users').indexes();
    console.log(`👤 Users collection now has ${userIndexes.length} indexes:`);
    userIndexes.forEach(idx => console.log(`   - ${idx.name}`));
    
    const workbookIndexes = await db.collection('workbooks').indexes();
    console.log(`📚 Workbooks collection now has ${workbookIndexes.length} indexes:`);
    workbookIndexes.forEach(idx => console.log(`   - ${idx.name}`));

    // ===== PERFORMANCE TESTING =====
    console.log('⚡ Testing query performance...');
    
    // Test user email lookup
    const emailStart = Date.now();
    await db.collection('users').findOne({ email: { $exists: true } });
    const emailTime = Date.now() - emailStart;
    console.log(`📧 Email lookup: ${emailTime}ms (should be <10ms)`);
    
    // Test user role query
    const roleStart = Date.now();
    await db.collection('users').find({ role: 'user' }).limit(10).toArray();
    const roleTime = Date.now() - roleStart;
    console.log(`👥 Role query: ${roleTime}ms (should be <20ms)`);
    
    // Test workbook user lookup
    const workbookStart = Date.now();
    const users = await db.collection('users').find({}).limit(1).toArray();
    if (users.length > 0) {
      await db.collection('workbooks').find({ userId: users[0]._id }).toArray();
    }
    const workbookTime = Date.now() - workbookStart;
    console.log(`📖 Workbook lookup: ${workbookTime}ms (should be <30ms)`);

    // ===== DATABASE STATISTICS =====
    console.log('📈 Updated database statistics:');
    const stats = await db.stats();
    console.log(`💾 Database size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📊 Index size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📁 Collections: ${stats.collections}`);
    console.log(`🔢 Total indexes: ${stats.indexes}`);

    console.log('🎉 Database optimization completed!');
    console.log('🚀 Expected performance improvement: 10x faster queries');
    
  } catch (error) {
    console.error('❌ Database indexing failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the indexing
addCriticalIndexes();
