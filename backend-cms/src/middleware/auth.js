// src/middleware/auth.js
import jwt from "jsonwebtoken";
import AdminUser from "../models/adminModel.js";

/* token extractor */
function getTokenFromReq(req) {
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return parts[1];
    if (parts.length === 1) return parts[0];
  }
  if (req.cookies && req.cookies.token) return req.cookies.token;
  return null;
}

/* authOptional */
export async function authOptional(req, res, next) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return next();
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload?.id) return next();
    const user = await AdminUser.findById(payload.id).select("-password").lean();
    if (user) {
      req.user = user;
      req.userId = user._id;
      req.userRole = (user.role || user.roleName || "admin").toString();
    }
    return next();
  } catch (err) {
    return next();
  }
}

/* authRequired */
export async function authRequired(req, res, next) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ message: "Unauthorized: token missing" });

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: invalid or expired token" });
    }
    if (!payload?.id) return res.status(401).json({ message: "Unauthorized: invalid token payload" });

    const user = await AdminUser.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "Unauthorized: user not found" });

    req.user = user;
    req.userId = user._id;
    req.userRole = (user.role || user.roleName || "admin").toString();

    // debug log (temporary) - comment out after debugging
    console.log("DEBUG authRequired - req.user:", { id: String(req.user._id), role: req.userRole });

    return next();
  } catch (err) {
    console.error("authRequired error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/* ADMIN roles list - includes root by default */
const ADMIN_ROLES = (process.env.ADMIN_ROLES || "admin,superadmin,owner,manager,root")
  .split(",")
  .map(r => r.trim().toLowerCase());

export function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const role = (req.user.role || req.userRole || "").toString().toLowerCase();
  if (!ADMIN_ROLES.includes(role)) {
    console.warn("isAdmin check failed for user:", { id: String(req.user._id), role });
    return res.status(403).json({ message: "Forbidden: admin access required" });
  }
  return next();
}

/* requireRole factory */
export function requireRole(roleName) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const role = (req.user.role || req.userRole || "").toString().toLowerCase();
    if (role !== roleName.toString().toLowerCase()) {
      return res.status(403).json({ message: `Forbidden: ${roleName} role required` });
    }
    return next();
  };
}

export default {
  authOptional,
  authRequired,
  isAdmin,
  requireRole
};
