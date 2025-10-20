// backend-cms/src/scripts/createAdmin.js
import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || 'mongodb://ci_root:SuperSecretRoot123!@mongo:27017/careindia_db?authSource=admin';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

const run = async () => {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to Mongo — creating admin if not exists');

    const email = process.env.ADMIN_EMAIL || 'admin@careindia.org';
    const password = process.env.ADMIN_PASS || 'Admin@2045'; // change after creation

    const existing = await User.findOne({ email }).exec();
    if (existing) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }

    // NOTE: plain-text password here for simplicity — change to hashed in real app
    const admin = new User({
      name: 'Super Admin',
      email,
      password,
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user created:', email);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

run();
