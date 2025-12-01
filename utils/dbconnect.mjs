// utils/dbConnect.js or similar
import mongoose from 'mongoose';

console.log("2. Inside dbConnect.mjs. DATABASE_URL is:", process.env.DATABASE_URL ? "SET" : "NOT SET");

const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// ... (rest of your code remains the same)

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // 💡 Add .catch() to log the actual connection error
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log('✅ MongoDB connection successful (deployed)');
      return mongoose;
    }).catch((error) => {
      // THIS IS THE CRITICAL LINE FOR DEBUGGING
      console.error('❌ MONGODB CONNECTION FAILED:', error.message);
      // Re-throw the error so Vercel logs the 500 error properly
      throw error; 
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;