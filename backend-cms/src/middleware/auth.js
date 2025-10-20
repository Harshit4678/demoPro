import asyncHandler from 'express-async-handler';
import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  const hdr = req.headers.authorization?.split(' ')[1];
  const token = req.cookies.token || hdr;
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).lean();
    if (!user) return res.status(401).json({ message: 'Not authorized' });
    if (user.isBanned) return res.status(403).json({ message: 'Account banned' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalid' });
  }
});

export const permit = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};
