// src/middleware/auth.js
import jwt from "jsonwebtoken";
import AdminUser from "../models/adminModel.js";

/**
 * Helper: extract token from header or cookie
 */
function getTokenFromReq(req) {
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return parts[1];
    // fallback: if header has only token
    if (parts.length === 1) return parts[0];
  }
  // Also allow cookie named 'token' (if you send JWT in cookie)
  if (req.cookies && req.cookies.token) return req.cookies.token;
  return null;
}

/**
 * authOptional
 * - If token present and valid, attaches req.user (AdminUser doc without password)
 * - If no token or invalid token, just continues without failing
 */
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
      req.userRole = user.role || user.roleName || "admin";
    }
    return next();
  } catch (err) {
    // don't block the request on token errors for authOptional
    return next();
  }
}

/**
 * authRequired
 * - If token missing/invalid => 401
 * - Else attaches req.user and proceeds
 */
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
    req.userRole = user.role || user.roleName || "admin";

    return next();
  } catch (err) {
    console.error("authRequired error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * isAdmin
 * - Require authRequired first (ensures req.user exists)
 * - Then check role (flexible: accepts 'admin' or 'superadmin' or 'manager' etc.)
 * - You can adapt roles list as per your adminModel
 */
const ADMIN_ROLES = (process.env.ADMIN_ROLES || "admin,superadmin,owner,manager").split(",").map(r=>r.trim().toLowerCase());

export function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const role = (req.user.role || req.userRole || "").toString().toLowerCase();
  if (!ADMIN_ROLES.includes(role)) {
    return res.status(403).json({ message: "Forbidden: admin access required" });
  }
  return next();
}



/**
 * requireRole(roleString)
 * - factory to check for a specific role
 * e.g. router.get("/secret", authRequired, requireRole("superadmin"), handler)
 */
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
