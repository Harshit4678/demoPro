// src/routes/aboutRoutes.js
import express from "express";
import { upload } from "../../config/multer.js";
import {
  getTimeline,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem
} from "../../controllers/who-we-are/aboutController.js";

const router = express.Router();

router.get("/timeline", getTimeline);
router.post("/timeline", upload.single("image"), createTimelineItem); // expects form-data key "image"
router.put("/timeline/:id", upload.single("image"), updateTimelineItem);
router.delete("/timeline/:id", deleteTimelineItem);

export default router;
