import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from "path";
import { connectDB } from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import aboutRoutes from "./routes/who-we-are/aboutRoutes.js";


const app = express();
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173", // Admin panel (vite)
  process.env.MAIN_SITE_URL || "http://localhost:3000", // Main Next.js frontend
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies if needed
  })
);
app.use(express.json({ limit: "2mb" }));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.get("/", (req,res) => res.json({ ok:true, msg: "CareIndia Backend CMS" }));

app.use("/api/auth", authRoutes);
app.use("/api/about", aboutRoutes);

app.use(errorMiddleware);



// ✅ Health check route
app.get('/api/health', (_req, res) => res.json({ ok: true }));


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
