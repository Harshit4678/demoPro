// src/routes/galleryRoutes.js
import express from "express";
import { upload } from "../config/multer.js";
import {
  uploadGallery,
  listGallery,
  updateMeta,
  reorderGallery,
  replaceImage,
  deleteImage,
  updateSection
} from "../controllers/galleryController.js";

import { authOptional, authRequired, isAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * Public list (authOptional so req.user available for ?all)
 */
router.get("/pages/:slug/gallery", authOptional, listGallery);

/**
 * Protected uploads & admin actions
 * - upload images
 */
router.post("/pages/:slug/gallery", authRequired, isAdmin, upload.array("images", 50), uploadGallery);

/**
 * Admin list (same route with ?all=true, handled in controller)
 * - GET /pages/:slug/gallery?all=true (must be admin)
 */

/**
 * Update metadata
 */
router.put("/gallery/:id", authRequired, isAdmin, updateMeta);

/**
 * Bulk reorder
 */
router.patch("/pages/:slug/gallery/reorder", authRequired, isAdmin, reorderGallery);

/**
 * Replace image
 */
router.put("/gallery/:id/replace", authRequired, isAdmin, upload.single("image"), replaceImage);

/**
 * Delete image
 */
router.delete("/gallery/:id", authRequired, isAdmin, deleteImage);

/**
 * Update section (limit/layout)
 */
router.put("/gallery-section/:slug", authRequired, isAdmin, updateSection);

export default router;
