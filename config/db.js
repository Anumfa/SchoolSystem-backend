import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bfhs', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️  MongoDB not available (${error.message})`);
    console.warn('🔄 Running in DEMO MODE using the in-memory fallback database.');
    console.warn('   Logins, forms and dashboards all work with seeded demo data.');
    return false;
  }
};

export default connectDB;
