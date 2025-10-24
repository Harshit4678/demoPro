// src/routes/casesRoutes.js
import express from "express";
import { upload } from "../config/multer.js";
import {
  createCase,
  listCases,
  getCaseBySlug,
  updateCase,
  deleteCase,
  uploadMediaOnly
} from "../controllers/casesController.js";
import auth from "../middleware/auth.js";
import setFormType from "../middleware/setFormType.js";

const router = express.Router();

// Public
router.get("/", listCases);
router.get("/:slug", getCaseBySlug);

// Protected: ensure setFormType BEFORE multer runs
const adminFields = upload.fields([
  { name: "cardImage", maxCount: 1 },
  { name: "heroImage", maxCount: 1 },
  { name: "contentFiles", maxCount: 20 }
]);

router.post("/", auth.authRequired, auth.isAdmin, setFormType("cases"), adminFields, createCase);
router.put("/:id", auth.authRequired, auth.isAdmin, setFormType("cases"), adminFields, updateCase);
router.delete("/:id", auth.authRequired, auth.isAdmin, deleteCase);

// upload-only endpoint (for editor)
const mediaOnly = upload.fields([{ name: "files", maxCount: 20 }]);
router.post("/upload", auth.authRequired, auth.isAdmin, setFormType("cases"), mediaOnly, uploadMediaOnly);

export default router;
