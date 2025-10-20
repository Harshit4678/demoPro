import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';
import resetRoutes from './routes/resetRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') || ['http://localhost:5173'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/resets', resetRoutes);

// ✅ Health check route
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// ✅ 404 + Error handling
app.use(notFound);
app.use(errorHandler);

// ✅ Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // yahan se config/db.js call ho raha hai
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  }
};

startServer();
