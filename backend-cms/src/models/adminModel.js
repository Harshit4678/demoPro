import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["root","manager","editor"], default: "editor" },
  resetToken: String,
  resetTokenExpiry: Date
}, { timestamps: true });

export default mongoose.models.AdminUser || mongoose.model("AdminUser", AdminSchema);
