
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config/db.js";
import AdminUser from "../models/adminModel.js";
import bcrypt from "bcryptjs";

async function run() {
  await connectDB();

  const email = (process.env.ROOT_ADMIN_EMAIL || "admin@careindia.org").toLowerCase().trim();
  const plain = process.env.ROOT_ADMIN_PASSWORD || "Admin@careIndia2011";

  let user = await AdminUser.findOne({ email });
  if (!user) {
    const hash = await bcrypt.hash(plain, 12);
    user = await AdminUser.create({ name: "Root Admin", email, password: hash, role: "root" });
    console.log("CREATED ROOT ADMIN:", user.email);
    process.exit(0);
  }

  console.log("ROOT ADMIN EXISTS:", user.email);
  const match = await bcrypt.compare(plain, user.password);
  console.log("PASSWORD MATCHES .env?:", match);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
