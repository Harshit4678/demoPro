import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../src/models/User.js';

const main = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not set');

  await mongoose.connect(uri);
  const email = process.env.SUPERADMIN_EMAIL;
  const pwd = process.env.SUPERADMIN_INITIAL_PASSWORD || 'ChangeMe@123';

  const exists = await User.findOne({ email });
  if (exists) {
    console.log('Superadmin already exists');
  } else {
    await User.create({
      name: 'Super Admin',
      email,
      password: pwd,
      role: 'superadmin',
      forceChangePassword: true
    });
    console.log('✅ Superadmin seeded ->', email);
  }
  await mongoose.disconnect();
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
