import express from "express";
import { upload } from "../config/multer.js";
import * as leadCtrl from "../controllers/leadController.js";
import { authRequired, isAdmin, authOptional } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authOptional, upload.array("files", 5), leadCtrl.createLead);

router.get("/", authRequired, isAdmin, leadCtrl.getLeads);
router.get("/export", authRequired, isAdmin, leadCtrl.exportLeadsCSV);
router.get("/:id", authRequired, isAdmin, leadCtrl.getLead);
router.put("/:id", authRequired, isAdmin, leadCtrl.updateLead);
router.delete("/:id", authRequired, isAdmin, leadCtrl.deleteLead);
router.post("/bulk", authRequired, isAdmin, leadCtrl.bulkAction);

export default router;
