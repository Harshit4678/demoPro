
import express from "express";
import { upload } from "../../config/multer.js";
import {
  getTimeline,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem
} from "../../controllers/who-we-are/aboutController.js";
import { authRequired, isAdmin } from "../../middleware/auth.js";  // ✅ import auth middleware

const router = express.Router();

// ✅ Public route — anyone (frontend site) can fetch timeline data
router.get("/timeline", getTimeline);

// ✅ Protected routes — only admin via dashboard can modify
router.post("/timeline", authRequired, isAdmin, upload.single("image"), createTimelineItem);
router.put("/timeline/:id", authRequired, isAdmin, upload.single("image"), updateTimelineItem);
router.delete("/timeline/:id", authRequired, isAdmin, deleteTimelineItem);

export default router;
