
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

async function connectMongo(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(uri, opts);
    cached.conn = await cached.promise;
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectMongo;
