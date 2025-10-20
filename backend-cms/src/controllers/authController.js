import asyncHandler from 'express-async-handler';
import { User } from '../models/User.js';
import { signToken, setAuthCookie, clearAuthCookie } from '../utils/jwt.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  if (user.isBanned) return res.status(403).json({ message: 'Account banned' });
  if (user.role !== 'superadmin' && user.role !== 'administrator' && user.role !== 'reviewer') {
    return res.status(403).json({ message: 'Role not allowed' });
  }
  const token = signToken({ id: user._id, role: user.role });
  setAuthCookie(res, token);
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      forceChangePassword: user.forceChangePassword
    }
  });
});

export const me = asyncHandler(async (req, res) => {
  const u = req.user;
  res.json({ user: { id: u._id || u.id, name: u.name, email: u.email, role: u.role, forceChangePassword: u.forceChangePassword } });
});

export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  res.json({ message: 'Logged out' });
});

// For first-login forced change (after admin-set password)
export const changeOwnPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id || req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const ok = await user.matchPassword(currentPassword);
  if (!ok) return res.status(400).json({ message: 'Current password incorrect' });

  user.password = newPassword;
  user.forceChangePassword = false;
  await user.save();
  res.json({ message: 'Password changed' });
});
