import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AdminUser from "../models/adminModel.js";

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const normEmail = email && String(email).toLowerCase().trim();

    if (!normEmail || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await AdminUser.findOne({ email: normEmail });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password || "");
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};