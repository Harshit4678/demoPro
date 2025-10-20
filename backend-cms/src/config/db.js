// backend-cms/src/config/db.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri =
      process.env.MONGODB_URI ||
      'mongodb://ci_root:SuperSecretRoot123!@mongo:27017/careindia_db?authSource=admin';

    // minimal options (avoid deprecated warnings)
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    throw error;
  }
};
