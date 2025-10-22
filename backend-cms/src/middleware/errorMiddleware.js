// Centralized error-handling middleware
export default function errorMiddleware(err, req, res, next) {
  // Log the full error for debugging (can be improved to use a logger)
  console.error(err);

  const status = err && err.status ? err.status : 500;
  const message = err && err.message ? err.message : 'Server error';

  res.status(status).json({ message });
}
