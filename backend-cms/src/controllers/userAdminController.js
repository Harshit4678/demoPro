import asyncHandler from 'express-async-handler';
import { User } from '../models/User.js';
import { sendMail } from '../services/mail.js';
import { generateRandomPassword } from '../utils/password.js';

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;
  if (!['administrator', 'reviewer'].includes(role)) {
    return res.status(400).json({ message: 'Only administrator/reviewer can be created' });
  }
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already in use' });

  const password = generateRandomPassword();
  const user = await User.create({
    name,
    email,
    role,
    password,
    forceChangePassword: true
  });

  await sendMail({
    to: email,
    subject: 'Your CARE Admin Account',
    text: `Hello ${name || ''},\n\nYour account has been created.\nEmail: ${email}\nPassword: ${password}\n\nPlease login and change your password.`,
    html: `<p>Hello ${name || ''},</p><p>Your account has been created.</p><p><b>Email:</b> ${email}<br/><b>Password:</b> ${password}</p><p>Please login and change your password.</p>`
  });

  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'superadmin') return res.status(400).json({ message: 'Cannot delete superadmin' });

  await user.deleteOne();
  res.json({ message: 'User deleted' });
});

export const banUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { ban = true } = req.body;
  const user = await User.findByIdAndUpdate(id, { isBanned: !!ban }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'superadmin') return res.status(400).json({ message: 'Cannot ban superadmin' });
  res.json({ message: 'Updated', user: { id: user._id, isBanned: user.isBanned } });
});
