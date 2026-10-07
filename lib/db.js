import mongoose from 'mongoose';

const cache = globalThis.__bpMongo ||= { connection: null, promise: null };
export async function connectDB() {
  if (cache.connection) return cache.connection;
  if (!cache.promise) cache.promise = mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/birinchi_pul',
    { serverSelectionTimeoutMS: 5000 }
  );
  try { cache.connection = await cache.promise; return cache.connection; }
  catch (error) { cache.promise = null; throw error; }
}
