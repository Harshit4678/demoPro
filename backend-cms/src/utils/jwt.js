import jwt from 'jsonwebtoken';

export const signToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN || '7d') =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

export const setAuthCookie = (res, token) => {
  const isSecure = String(process.env.COOKIE_SECURE) === 'true';
  const domain = process.env.COOKIE_DOMAIN || undefined;
  res.cookie('token', token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    domain
  });
};

export const clearAuthCookie = (res) => {
  const isSecure = String(process.env.COOKIE_SECURE) === 'true';
  const domain = process.env.COOKIE_DOMAIN || undefined;
  res.clearCookie('token', {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax',
    domain
  });
};
