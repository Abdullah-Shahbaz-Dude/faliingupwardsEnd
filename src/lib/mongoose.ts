
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI as string;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

// 🚀 PRODUCTION-GRADE MONGODB CONNECTION WITH MAXIMUM PERFORMANCE
async function connectMongo(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      // 🔄 BUFFER COMMANDS - Disable for better error handling
      bufferCommands: false,
      
      // 🏊‍♂️ CONNECTION POOLING - Optimize for concurrent requests
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2,  // Minimum number of connections in the pool
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      
      // ⏱️ TIMEOUT SETTINGS - Optimized for MongoDB Atlas
      serverSelectionTimeoutMS: 15000, // Increased for Atlas (was 5000)
      socketTimeoutMS: 45000, // How long to wait for a response
      connectTimeoutMS: 30000, // Increased for Atlas (was 10000)
      
      // 🔧 PERFORMANCE OPTIMIZATIONS
      heartbeatFrequencyMS: 10000, // How often to check server status
      retryWrites: true, // Automatically retry failed writes
      retryReads: true,  // Automatically retry failed reads
      
      // 📊 MONITORING - Disabled for performance (was causing slowdowns)
      monitorCommands: false,
      
      // 🗜️ COMPRESSION - Reduce network overhead by 30%
      compressors: ['zlib'] as ('zlib' | 'none' | 'snappy' | 'zstd')[],
      zlibCompressionLevel: 6 as const,
      
      // 🔐 SECURITY & RELIABILITY
      readPreference: 'primary' as const,
      writeConcern: { w: 'majority' as const, j: true },
    };

    console.log('🔗 Connecting to MongoDB with optimized settings...');
    
    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully with connection pooling');
      
      // 📊 CONNECTION EVENT LISTENERS FOR MONITORING
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
      });
      
      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });

      // 📈 CONNECTION POOL STATUS LOGGING DISABLED FOR PERFORMANCE
      // Removed frequent logging that was causing performance issues in development

      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error);
      cached.promise = null; // Reset promise on failure
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null; // Reset promise on failure
    throw error;
  }
}

export default connectMongo;
