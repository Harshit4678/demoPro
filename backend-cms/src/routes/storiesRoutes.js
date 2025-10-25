// src/routes/storiesRoutes.js
import express from "express";
import {
  listStories,
  getStoryBySlug,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
  uploadFilesForStories
} from "../controllers/storyController.js";
import { upload } from "../config/multer.js";
// import { authRequired, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// ---------- Public ----------
router.get("/", listStories);
router.get("/slug/:slug", getStoryBySlug);
router.get("/:id", getStoryById);

// ---------- Uploads ----------
router.post("/upload", uploadFilesForStories(upload));

// ---------- Admin (can protect later) ----------
router.post("/", upload.fields([
  { name: "cardImage", maxCount: 1 },
  { name: "heroImage", maxCount: 1 },
  { name: "files", maxCount: 12 }
]), createStory);

router.put("/:id", upload.fields([
  { name: "cardImage", maxCount: 1 },
  { name: "heroImage", maxCount: 1 },
  { name: "files", maxCount: 12 }
]), updateStory);

router.delete("/:id", deleteStory);

export default router;
