import asyncHandler from 'express-async-handler';
import { User } from '../models/User.js';
import { Reset } from '../models/Reset.js';
import { notifySuperAdmin, sendMail } from '../services/mail.js';
import { generateRandomPassword } from '../utils/password.js';

export const requestReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // Always return generic message for privacy
  if (user) {
    await Reset.create({ userId: user._id, email: user.email, status: 'pending' });
    await notifySuperAdmin({
      subject: `Password reset requested: ${user.email}`,
      text: `A password reset was requested for ${user.email}. Handle in Admin Panel.`,
      html: `<p>Password reset requested for <b>${user.email}</b>.</p><p>Open Admin Panel → Reset Requests.</p>`
    });
  }
  res.json({ message: 'If this email is registered, superadmin has been notified.' });
});

export const listResets = asyncHandler(async (_req, res) => {
  const items = await Reset.find().sort({ createdAt: -1 }).limit(200).lean();
  res.json({ items });
});

export const setNewPassword = asyncHandler(async (req, res) => {
  const { resetId, newPassword, generate } = req.body;
  const reset = await Reset.findById(resetId);
  if (!reset || reset.status !== 'pending') return res.status(400).json({ message: 'Invalid reset request' });

  const user = await User.findById(reset.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const pwd = generate ? generateRandomPassword() : String(newPassword || '').trim();
  if (!pwd) return res.status(400).json({ message: 'New password required or use generate=true' });

  user.password = pwd;
  user.forceChangePassword = true;
  await user.save();

  reset.status = 'done';
  reset.handledAt = new Date();
  reset.handledBy = req.user.email;
  await reset.save();

  await sendMail({
    to: user.email,
    subject: 'Your new password',
    text: `Hello,\n\nYour password has been reset by the superadmin.\nNew Password: ${pwd}\nPlease login and change it immediately.`,
    html: `<p>Your password has been reset by the superadmin.</p><p><b>New Password:</b> ${pwd}</p><p>Please login and change it immediately.</p>`
  });

  res.json({ message: 'Password reset and emailed' });
});

export const rejectReset = asyncHandler(async (req, res) => {
  const { resetId, reason } = req.body;
  const reset = await Reset.findById(resetId);
  if (!reset || reset.status !== 'pending') return res.status(400).json({ message: 'Invalid reset request' });

  reset.status = 'rejected';
  reset.handledAt = new Date();
  reset.handledBy = req.user.email;
  await reset.save();

  // Optional: notify requester
  await sendMail({
    to: reset.email,
    subject: 'Password reset request update',
    text: `Your password reset request was rejected.${reason ? ' Reason: ' + reason : ''}`,
    html: `<p>Your password reset request was rejected.</p>${reason ? `<p><b>Reason:</b> ${reason}</p>` : ''}`
  });

  res.json({ message: 'Reset request rejected' });
});
