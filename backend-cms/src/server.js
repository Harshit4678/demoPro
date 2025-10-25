// src/server.js
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import aboutRoutes from "./routes/who-we-are/aboutRoutes.js";
import leadsRoutes from "./routes/leads.js";
import casesRoutes from "./routes/casesRoutes.js";
import storiesRoutes from "./routes/storiesRoutes.js"
import galleryRoutes from "./routes/galleryRoutes.js";


const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"; // Vite admin
const MAIN_SITE_URL = process.env.MAIN_SITE_URL || "http://localhost:3000"; // Next frontend
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// ---------- security middlewares ----------
// Helmet basic + custom CSP to allow images from frontend + backend and data:
app.use(helmet()); // default secure headers

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "base-uri": ["'self'"],
      "font-src": ["'self'", "https:", "data:"],
      "form-action": ["'self'"],
      "frame-ancestors": ["'self'"],
      // Allow images from self, data:, frontend & backend (BASE_URL)
      "img-src": ["'self'", "data:", FRONTEND_URL, BASE_URL, MAIN_SITE_URL],
      "object-src": ["'none'"],
      "script-src": ["'self'"],
      "script-src-attr": ["'none'"],
      // allow inline style for some libraries, keep restricted otherwise
      "style-src": ["'self'", "https:", "'unsafe-inline'"],
      "upgrade-insecure-requests": []
    }
  })
);

// Allow cross-origin resource usage for static assets (images) when needed
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin" // allows other origins to use images served by this server
  })
);

// Lightweight rate limiter (tweak limits as needed)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later."
});
app.use(limiter);

// ---------- CORS ----------
const allowedOrigins = [
  FRONTEND_URL,
  MAIN_SITE_URL
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
    credentials: true // allow cookies
  })
);

// ---------- body parsers / cookies ----------
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---------- static uploads ----------
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// quick root
app.get("/", (req, res) => res.json({ ok: true, msg: "CareIndia Backend CMS" }));

// ---------- routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/cases", casesRoutes);
app.use("/api/stories", storiesRoutes);
app.use("/api", galleryRoutes);

// health check (keep above error handler)
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// global error handler (after routes)
app.use(errorMiddleware);

// ---------- start server ----------
const startServer = async () => {
  try {
    await connectDB(); // connect to MongoDB
    app.listen(PORT, () =>
      console.log(`🚀 Server running on ${BASE_URL}`)
    );
  } catch (err) {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  }
};

startServer();