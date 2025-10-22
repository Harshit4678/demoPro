import jwt from "jsonwebtoken";
import AdminUser from "../models/adminModel.js";

export default async function (req, res, next) {
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({ message: "Unauthorized" });
  const parts = auth.split(" ");
  if(parts.length !== 2) return res.status(401).json({ message: "Invalid auth header" });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    req.userRole = payload.role;
    req.user = await AdminUser.findById(payload.id).select("-password");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
